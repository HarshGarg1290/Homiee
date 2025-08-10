import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import {
	saveFlat,
	unsaveFlat,
	generateFlatId,
	checkFlatSaved,
} from "../lib/savedFlats";
import {
	MapPin,
	IndianRupee,
	Home,
	Search,
	Users,
	Phone,
	X,
	ChevronRight,
	Loader2,
	Heart,
	HeartCrack,
} from "lucide-react";
import Image from "next/image";
// Loading skeleton component for better UX
const FormFieldSkeleton = () => (
	<div className="space-y-2">
		<div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
		<div className="h-11 bg-gray-200 rounded-lg animate-pulse"></div>
	</div>
);
export default function FlatFinder() {
	const router = useRouter();
	const { user, isAuthenticated } = useAuth();

	const [selectedCity, setSelectedCity] = useState("");
	const [selectedSubregion, setSelectedSubregion] = useState("");
	const [selectedGender, setSelectedGender] = useState("");
	const [selectedBudget, setSelectedBudget] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [expandedListing, setExpandedListing] = useState(null);

	const [listings, setListings] = useState([]);
	const [filteredListings, setFilteredListings] = useState([]);
	const [cities, setCities] = useState({});
	const [genderOptions, setGenderOptions] = useState([]);
	const [budgetRanges, setBudgetRanges] = useState([]);

	const [isLoadingData, setIsLoadingData] = useState(true);
	const [dataLoadError, setDataLoadError] = useState(null);

	const [dataCache, setDataCache] = useState(null);

	// Saved flats state
	const [savedFlatsMap, setSavedFlatsMap] = useState(new Map());
	const [savingFlat, setSavingFlat] = useState(null);
	useEffect(() => {
		const cachedData = localStorage.getItem("flats-form-data");
		const cacheTimestamp = localStorage.getItem("flats-form-data-timestamp");
		const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
		if (
			cachedData &&
			cacheTimestamp &&
			Date.now() - parseInt(cacheTimestamp) < fiveMinutes
		) {
			// Use cached data
			const parsed = JSON.parse(cachedData);
			setCities(parsed.cities);
			setGenderOptions(parsed.genderOptions);
			setBudgetRanges(parsed.budgetRanges);
			setListings(parsed.listings);
			setIsLoadingData(false);
			return;
		}
		// Fetch fresh data
		fetchFormData();
	}, []);
	const fetchFormData = async () => {
		try {
			setIsLoadingData(true);
			setDataLoadError(null);
			const response = await fetch("/api/listings");
			if (!response.ok) {
				throw new Error(`API error: ${response.status}`);
			}
			const data = await response.json();
			if (!Array.isArray(data)) {
				throw new Error("Invalid data format received");
			}
			const filteredData = data.filter(
				(listing) => listing.City && listing.Message
			);
			// Optimized data processing using Maps for better performance
			const cityMap = new Map();
			const genderSet = new Set();
			const budgetSet = new Set();
			filteredData.forEach((listing) => {
				// Process cities and subregions more efficiently
				if (listing.City?.trim()) {
					const city = listing.City.trim();
					const subregion = listing["Sub region"]?.trim() || "";
					if (!cityMap.has(city)) {
						cityMap.set(city, new Set());
					}
					if (subregion) {
						cityMap.get(city).add(subregion);
					}
				}
				// Process gender options
				if (listing.Gender?.trim()) {
					genderSet.add(listing.Gender.trim());
				}
				// Process budget options
				if (listing.Budget?.trim()) {
					budgetSet.add(listing.Budget.trim());
				}
			});
			const formattedCities = {};
			cityMap.forEach((subregions, city) => {
				formattedCities[city] = Array.from(subregions).sort();
			});
			const ranges = [
				{
					value: "0-15000",
					label: "Under ₹15,000",
					color: "bg-green-100 text-green-800",
				},
				{
					value: "15000-25000",
					label: "₹15,000 - ₹25,000",
					color: "bg-blue-100 text-blue-800",
				},
				{
					value: "25000-40000",
					label: "₹25,000 - ₹40,000",
					color: "bg-blue-100 text-blue-800",
				},
				{
					value: "40000+",
					label: "Above ₹40,000",
					color: "bg-blue-100 text-blue-800",
				},
			];
			// Set all data at once to minimize re-renders
			const processedData = {
				cities: formattedCities,
				genderOptions: Array.from(genderSet).sort(),
				budgetRanges: ranges,
				listings: filteredData,
			};
			setCities(processedData.cities);
			setGenderOptions(processedData.genderOptions);
			setBudgetRanges(processedData.budgetRanges);
			setListings(processedData.listings);
			// Cache the processed data
			localStorage.setItem("flats-form-data", JSON.stringify(processedData));
			localStorage.setItem("flats-form-data-timestamp", Date.now().toString());
		} catch (error) {
			setDataLoadError(error.message);
		} finally {
			setIsLoadingData(false);
		}
	};
	const clearAllFilters = () => {
		setSelectedCity("");
		setSelectedSubregion("");
		setSelectedGender("");
		setSelectedBudget("");
		setShowResults(false);
	};
	const handleSearch = async () => {
		setIsSearching(true);
		let results = [...listings];
		if (selectedCity) {
			results = results.filter(
				(listing) =>
					listing.City &&
					listing.City.trim().toLowerCase() === selectedCity.toLowerCase()
			);
		}
		if (selectedSubregion) {
			results = results.filter(
				(listing) =>
					listing["Sub region"] &&
					listing["Sub region"].trim().toLowerCase() ===
						selectedSubregion.toLowerCase()
			);
		}
		if (selectedGender) {
			results = results.filter(
				(listing) =>
					listing.Gender &&
					(listing.Gender.trim().toLowerCase() ===
						selectedGender.toLowerCase() ||
						listing.Gender.trim().toLowerCase() === "both")
			);
		}
		if (selectedBudget) {
			const [min, max] = selectedBudget.split("-");
			if (max) {
				results = results.filter((listing) => {
					const budget = parseInt(listing.Budget);
					return (
						!isNaN(budget) && budget >= parseInt(min) && budget <= parseInt(max)
					);
				});
			} else {
				const minValue = parseInt(min);
				results = results.filter((listing) => {
					const budget = parseInt(listing.Budget);
					return !isNaN(budget) && budget >= minValue;
				});
			}
		}
		await new Promise((resolve) => setTimeout(resolve, 300));
		setFilteredListings(results);
		setIsSearching(false);
		setShowResults(true);
	};
	const toggleListingDetails = (id) => {
		setExpandedListing(expandedListing === id ? null : id);
	};
	const extractContact = (message) => {
		const phoneRegex = /(\d{10})|(\+\d{12})/g;
		const matches = message.match(phoneRegex);
		return matches ? matches[0] : null;
	};
	const hasActiveFilters =
		selectedCity || selectedSubregion || selectedGender || selectedBudget;

	const checkSavedStatus = useCallback(async () => {
		if (!user || filteredListings.length === 0) return;

		const savedStatusMap = new Map();
		// Check saved status for all visible listings
		for (const listing of filteredListings) {
			const flatId = generateFlatId(listing);
			try {
				const isSaved = await checkFlatSaved(user.id, flatId);
				savedStatusMap.set(flatId, isSaved);
			} catch (error) {
				savedStatusMap.set(flatId, false);
			}
		}

		setSavedFlatsMap(savedStatusMap);
	}, [user, filteredListings]);

	// Check saved status for listings when user is authenticated
	useEffect(() => {
		if (isAuthenticated && user && showResults && filteredListings.length > 0) {
			checkSavedStatus();
		}
	}, [isAuthenticated, user, showResults, filteredListings, checkSavedStatus]);

	// Also check saved status when component mounts and user is already authenticated

	useEffect(() => {
		if (isAuthenticated && user && filteredListings.length > 0) {
			checkSavedStatus();
		}
	}, [isAuthenticated, user, filteredListings, checkSavedStatus]);

	const handleSaveFlat = async (listing) => {
		if (!isAuthenticated || !user) {
			router.push("/login");
			return;
		}

		const flatId = generateFlatId(listing);

		// Prevent multiple simultaneous operations on the same flat
		if (savingFlat === flatId) {
			return;
		}

		setSavingFlat(flatId);

		try {
			const isSaved = savedFlatsMap.get(flatId);

			if (isSaved) {
				// Unsave the flat
				await unsaveFlat(user.id, flatId);
				setSavedFlatsMap((prev) => new Map(prev.set(flatId, false)));
			} else {
				// Save the flat
				try {
					await saveFlat(user.id, listing);
					setSavedFlatsMap((prev) => new Map(prev.set(flatId, true)));
				} catch (error) {
					// If flat is already saved (race condition), just update the UI
					if (
						error.status === 409 ||
						(error.message && error.message.includes("already saved"))
					) {
						setSavedFlatsMap((prev) => new Map(prev.set(flatId, true)));
					} else {
						throw error; // Re-throw other errors
					}
				}
			}
		} catch (error) {
			// Refresh the saved status to get the current state
			try {
				const currentStatus = await checkFlatSaved(user.id, flatId);
				setSavedFlatsMap((prev) => new Map(prev.set(flatId, currentStatus)));
			} catch (checkError) {
				// Silent error handling
			}
		} finally {
			setSavingFlat(null);
		}
	};
	return (
		<div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
			<Head>
				<title>Homiee - Find your perfect home</title>
			</Head>{" "}
			<header className="bg-white border-b border-gray-100 sticky top-0 z-50">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
					<div className="flex items-center justify-between">
						<button
							onClick={() => router.push("/")}
							className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
						>
							<div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center">
								<Image
									src="/logo.jpg"
									alt="Homiee Logo"
									width={32}
									height={32}
									className="rounded-sm"
								/>
							</div>
							<h1 className="text-xl sm:text-2xl font-bold text-gray-900">
								Homiee
							</h1>
						</button>
						<a
							href="https://forms.gle/zgSSwGhtosZLEM5M6"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block px-3 py-2 sm:px-4 sm:py-3 bg-[#49548a] text-white font-semibold rounded-lg shadow hover:bg-blue-900 transition-colors text-sm sm:text-base"
						>
							<span className="hidden sm:inline">+ Add a Flat</span>
							<span className="sm:hidden">+ Add</span>
						</a>
					</div>
				</div>
			</header>{" "}
			<main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
				{/* Hero Section */}
				<div className="text-center mb-8 sm:mb-12">
					<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
						Find your perfect home
					</h2>
					<p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-2">
						Discover comfortable living spaces that match your preferences and
						budget
					</p>
				</div>{" "}
				{/* Search Form */}
				<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-8 mb-8 sm:mb-12">
					{/* Loading indicator for data */}
					{isLoadingData && (
						<div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<div className="flex items-center text-blue-800">
								<Loader2 className="w-4 h-4 animate-spin mr-2" />
								<span className="text-sm">Loading form options...</span>
							</div>
						</div>
					)}
					{/* Error indicator */}
					{dataLoadError && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
							<div className="flex items-center justify-between">
								<span className="text-red-800 text-sm">
									Error loading data: {dataLoadError}
								</span>
								<button
									onClick={fetchFormData}
									className="text-red-600 hover:text-red-800 text-sm underline"
								>
									Retry
								</button>
							</div>
						</div>
					)}{" "}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
						{/* City Selection */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700 block">
								City
							</label>
							<select
								value={selectedCity}
								onChange={(e) => {
									setSelectedCity(e.target.value);
									setSelectedSubregion("");
								}}
								disabled={isLoadingData}
								className="w-full h-11 px-3 text-black border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
							>
								<option value="">
									{isLoadingData ? "Loading cities..." : "Select city"}
								</option>
								{Object.keys(cities).map((city) => (
									<option key={city} value={city}>
										{city}
									</option>
								))}
							</select>
						</div>
						{/* Area Selection */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700 block">
								Area
							</label>
							<select
								value={selectedSubregion}
								onChange={(e) => setSelectedSubregion(e.target.value)}
								disabled={
									!selectedCity ||
									!cities[selectedCity]?.length ||
									isLoadingData
								}
								className="w-full h-11 px-3 text-black border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
							>
								<option value="">
									{isLoadingData
										? "Loading areas..."
										: !selectedCity
										? "Select city first"
										: cities[selectedCity]?.length === 0
										? "No areas available"
										: "Select area"}
								</option>
								{selectedCity &&
									cities[selectedCity]?.map((subregion) => (
										<option key={subregion} value={subregion}>
											{subregion}
										</option>
									))}
							</select>
						</div>
						{/* Budget Selection */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700 block">
								Budget
							</label>
							<select
								value={selectedBudget}
								onChange={(e) => setSelectedBudget(e.target.value)}
								disabled={isLoadingData}
								className="w-full h-11 px-3 text-black border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
							>
								<option value="">
									{isLoadingData ? "Loading budgets..." : "Select budget"}
								</option>
								{budgetRanges.map((budget) => (
									<option key={budget.value} value={budget.value}>
										{budget.label}
									</option>
								))}
							</select>
						</div>
						{/* Gender Selection */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700 block">
								Gender Preference
							</label>
							<select
								value={selectedGender}
								onChange={(e) => setSelectedGender(e.target.value)}
								disabled={isLoadingData}
								className="w-full h-11 px-3 border text-black border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
							>
								<option value="">
									{isLoadingData ? "Loading options..." : "Any"}
								</option>
								{genderOptions.map((gender) => (
									<option key={gender} value={gender}>
										{gender}
									</option>
								))}
							</select>
						</div>
					</div>{" "}
					{/* Search Button */}
					<div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-7">
						<button
							onClick={handleSearch}
							disabled={!selectedCity || isSearching || isLoadingData}
							className="w-full sm:flex-1 bg-[#49548a] hover:bg-[#30375b] disabled:bg-gray-300 text-white h-11 sm:h-12 rounded-xl font-medium transition-colors flex items-center justify-center"
						>
							{isSearching ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
									<span className="text-sm sm:text-base">Searching...</span>
								</>
							) : (
								<>
									<Search className="w-4 h-4 mr-2 sm:mr-3" />
									<span className="text-sm sm:text-base">Search Flats</span>
								</>
							)}
						</button>
						{hasActiveFilters && (
							<button
								onClick={clearAllFilters}
								className="flex items-center justify-center sm:justify-start text-sm text-gray-700 hover:text-black transition-colors py-2 sm:py-0"
							>
								<X className="w-4 h-4 mr-1" />
								Clear Filters
							</button>
						)}
					</div>
				</div>
				{/* Results Section */}
				{showResults && (
					<div className="space-y-4 sm:space-y-6">
						{/* Results Header */}
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
							<h3 className="text-lg sm:text-xl font-semibold text-gray-900">
								{filteredListings.length} flat
								{filteredListings.length !== 1 ? "s" : ""} found
							</h3>
							{selectedCity && (
								<div className="text-sm text-gray-500">
									{selectedCity}
									{selectedSubregion ? ` • ${selectedSubregion}` : ""}
								</div>
							)}
						</div>
						{/* Results List */}
						{filteredListings.length === 0 ? (
							<div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
								<div className="text-gray-500 mb-4">
									No flats found matching your criteria
								</div>
								<button
									onClick={clearAllFilters}
									className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
								>
									Clear filters
								</button>
							</div>
						) : (
							<div className="space-y-3 sm:space-y-4">
								{filteredListings.map((listing, index) => {
									const flatId = generateFlatId(listing);
									const isSaved = savedFlatsMap.get(flatId) || false;
									const isSaving = savingFlat === flatId;

									return (
										<div
											key={index}
											className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden"
										>
											<div className="p-4 sm:p-6">
												<div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 sm:mb-4 gap-3 sm:gap-0">
													<div className="flex-1">
														<div className="flex items-center justify-between mb-2">
															<h4 className="font-semibold text-gray-900 text-base sm:text-lg">
																{listing.BHK} BHK in {listing["Sub region"]}
															</h4>
															{/* Save/Unsave Button */}
															{isAuthenticated && (
																<button
																	onClick={() => handleSaveFlat(listing)}
																	disabled={isSaving}
																	className={`p-2 rounded-full transition-all duration-200 ${
																		isSaved
																			? "text-red-500 hover:bg-red-50"
																			: "text-gray-400 hover:text-red-500 hover:bg-red-50"
																	} ${
																		isSaving
																			? "opacity-50 cursor-not-allowed"
																			: ""
																	}`}
																	title={
																		isSaved ? "Remove from saved" : "Save flat"
																	}
																>
																	{isSaving ? (
																		<Loader2 className="w-5 h-5 animate-spin" />
																	) : isSaved ? (
																		<Heart className="w-5 h-5 fill-current" />
																	) : (
																		<Heart className="w-5 h-5" />
																	)}
																</button>
															)}
														</div>
														<div className="flex items-center text-gray-500 text-sm mb-2 sm:mb-3">
															<MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
															<span className="truncate">
																{listing["Sub region"]}, {listing.City}
															</span>
														</div>
														<div className="flex items-center text-lg sm:text-xl font-bold text-gray-900">
															<IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
															{listing.Budget}
															<span className="text-xs sm:text-sm font-normal text-gray-500 ml-1">
																/month
															</span>
														</div>
													</div>
													<div className="flex flex-row sm:flex-col items-start sm:items-end space-x-2 sm:space-x-0 sm:space-y-2">
														<span className="px-2 sm:px-3 py-1 bg-blue-100 text-[#49548a] text-xs rounded-full whitespace-nowrap">
															{listing.Gender} preferred
														</span>
														{listing["Flatmate Req"] && (
															<span className="px-2 sm:px-3 py-1 bg-blue-100 text-[#49548a] text-xs rounded-full whitespace-nowrap">
																{listing["Flatmate Req"]} flatmate
																{parseInt(listing["Flatmate Req"]) > 1
																	? "s"
																	: ""}{" "}
																needed
															</span>
														)}
													</div>
												</div>{" "}
												<button
													onClick={() => toggleListingDetails(index)}
													className="w-full flex items-center justify-between p-2 sm:p-3 border border-gray-200 hover:bg-blue-50 rounded-lg transition-colors"
												>
													<span className="font-medium text-[#49548a] text-sm sm:text-base">
														{expandedListing === index
															? "Hide details"
															: "View details"}
													</span>
													<ChevronRight
														className={`w-4 h-4 text-[#49548a] transition-transform ${
															expandedListing === index ? "rotate-90" : ""
														}`}
													/>
												</button>
												{expandedListing === index && (
													<div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
														<p className="text-gray-700 text-sm leading-relaxed mb-3 sm:mb-4">
															{listing.Message}
														</p>
														{extractContact(listing.Message) && (
															<div className="flex items-center text-[#49548a] text-sm">
																<Phone className="w-4 h-4 mr-2 flex-shrink-0" />
																<span className="font-mono break-all">
																	{extractContact(listing.Message)}
																</span>
															</div>
														)}
													</div>
												)}
											</div>
										</div>
									);
								})}
								)
							</div>
						)}
					</div>
				)}
			</main>
		</div>
	);
}

export async function getServerSideProps() {
	return {
		props: {},
	};
}
