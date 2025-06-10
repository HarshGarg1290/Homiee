import { useState, useEffect } from "react";
import Head from "next/head";
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
} from "lucide-react";

export default function FlatFinder() {
	// State for filters
	const [selectedCity, setSelectedCity] = useState("");
	const [selectedSubregion, setSelectedSubregion] = useState("");
	const [selectedGender, setSelectedGender] = useState("");
	const [selectedBudget, setSelectedBudget] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [expandedListing, setExpandedListing] = useState(null);

	// State for data
	const [listings, setListings] = useState([]);
	const [filteredListings, setFilteredListings] = useState([]);
	const [cities, setCities] = useState({});
	const [genderOptions, setGenderOptions] = useState([]);
	const [budgetRanges, setBudgetRanges] = useState([]);

	// Loading states for better UX
	const [isLoadingData, setIsLoadingData] = useState(true);
	const [dataLoadError, setDataLoadError] = useState(null);

	// Cache to avoid repeated API calls
	const [dataCache, setDataCache] = useState(null);

	useEffect(() => {
		// Check if we have cached data first
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

			// Check if data is an array
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

			// Convert Maps to objects for state
			const formattedCities = {};
			cityMap.forEach((subregions, city) => {
				formattedCities[city] = Array.from(subregions).sort();
			});

			// Create optimized budget ranges
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
			console.error("Error fetching listings:", error);
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

		// Simulate search delay (remove this in production)
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

	return (
		<div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
			<Head>
				<title>Homiee - Find your perfect home</title>
				<link
					href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
					rel="stylesheet"
				/>
				<style jsx global>{`
					html,
					body {
						font-family: "Montserrat", sans-serif;
					}
				`}</style>
			</Head>

			{/* Minimal Header */}
			<header className="bg-white border-b border-gray-100 sticky top-0 z-50">
				<div className="max-w-5xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
								<img src="/logo.jpg" alt="Homiee Logo" className="w-8 h-8" />
							</div>
							<h1 className="text-2xl font-bold text-gray-900">Homiee</h1>
						</div>

						<a
							href="https://forms.gle/zgSSwGhtosZLEM5M6"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block px-4 py-3 bg-[#49548a] text-white font-semibold rounded-lg shadow hover:bg-blue-900 transition-colors"
						>
							+ Add a Flat
						</a>
					</div>
				</div>
			</header>

			<main className="max-w-5xl mx-auto px-6 py-12">
				{/* Hero Section */}
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold text-gray-900 mb-3">
						Find your perfect home
					</h2>
					<p className="text-gray-600 text-lg max-w-2xl mx-auto">
						Discover comfortable living spaces that match your preferences and
						budget
					</p>
				</div>

				{/* Search Form */}
				<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-12">
					{/* Loading indicator for data */}
					{isLoadingData && (
						<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{/* City Selection */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700 block">
								City
							</label>
							<select
								value={selectedCity}
								onChange={(e) => setSelectedCity(e.target.value)}
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
									{isLoadingData ? "Loading areas..." : "Select area"}
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
					</div>

					{/* Search Button */}
					<div className="mt-8 flex items-center justify-between gap-7">
						<button
							onClick={handleSearch}
							disabled={!selectedCity || isSearching || isLoadingData}
							className="w-full bg-[#49548a] hover:bg-[#30375b] disabled:bg-gray-300 text-white h-12 rounded-xl font-medium transition-colors flex items-center justify-center"
						>
							{isSearching ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
									Searching...
								</>
							) : (
								<>
									<Search className="w-4 h-4 mr-3" />
									Search Flats
								</>
							)}
						</button>
						{hasActiveFilters && (
							<button
								onClick={clearAllFilters}
								className="flex items-center text-sm text-gray-700 hover:text-black transition-colors"
							>
								<X className="w-4 h-4 mr-1" />
								Clear
							</button>
						)}
					</div>
				</div>

				{/* Results Section */}
				{showResults && (
					<div className="space-y-6">
						{/* Results Header */}
						<div className="flex items-center justify-between">
							<h3 className="text-xl font-semibold text-gray-900">
								{filteredListings.length} flats found
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
							<div className="space-y-4">
								{filteredListings.map((listing, index) => (
									<div
										key={index}
										className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden"
									>
										<div className="p-6">
											<div className="flex items-start justify-between mb-4">
												<div className="flex-1">
													<h4 className="font-semibold text-gray-900 text-lg mb-2">
														{listing.BHK} BHK in {listing["Sub region"]}
													</h4>
													<div className="flex items-center text-gray-500 text-sm mb-3">
														<MapPin className="w-4 h-4 mr-1" />
														{listing["Sub region"]}, {listing.City}
													</div>
													<div className="flex items-center text-xl font-bold text-gray-900">
														<IndianRupee className="w-5 h-5 mr-1" />
														{listing.Budget}
														<span className="text-sm font-normal text-gray-500 ml-1">
															/month
														</span>
													</div>
												</div>
												<div className="flex flex-col items-end space-y-2">
													<span className="px-3 py-1 bg-blue-100 text-[#49548a] text-xs rounded-full">
														{listing.Gender} preferred
													</span>
													{listing["Flatmate Req"] && (
														<span className="px-3 py-1 bg-blue-100 text-[#49548a] text-xs rounded-full">
															{listing["Flatmate Req"]} flatmate
															{parseInt(listing["Flatmate Req"]) > 1
																? "s"
																: ""}{" "}
															needed
														</span>
													)}
												</div>
											</div>

											<button
												onClick={() => toggleListingDetails(index)}
												className="w-full flex items-center justify-between p-3 border border-gray-200 hover:bg-blue-50 rounded-lg transition-colors"
											>
												<span className="font-medium text-[#49548a]">
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
												<div className="mt-4 p-4 bg-blue-50 rounded-lg">
													<p className="text-gray-700 text-sm leading-relaxed mb-4">
														{listing.Message}
													</p>
													{extractContact(listing.Message) && (
														<div className="flex items-center text-[#49548a] text-sm">
															<Phone className="w-4 h-4 mr-2" />
															<span className="font-mono">
																{extractContact(listing.Message)}
															</span>
														</div>
													)}
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</main>
		</div>
	);
}
