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

	useEffect(() => {
		fetch("/api/listings")
			.then((response) => {
				if (!response.ok) {
					throw new Error(`API error: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				// Check if data is an array before filtering
				if (!Array.isArray(data)) {
					console.error("Data is not an array:", data);
					setListings([]); // Set to empty array as fallback
					return;
				}

				const filteredData = data.filter(
					(listing) => listing.City && listing.Message
				);
				setListings(filteredData);

				// Extract unique cities and their subregions
				const cityData = {};
				const genderSet = new Set();
				const budgetSet = new Set();

				filteredData.forEach((listing) => {
					// Extract cities and subregions
					if (listing.City && listing.City.trim()) {
						const city = listing.City.trim();
						const subregion = listing["Sub region"]
							? listing["Sub region"].trim()
							: "";

						if (!cityData[city]) {
							cityData[city] = new Set();
						}
						if (subregion) {
							cityData[city].add(subregion);
						}
					}

					// Extract gender options
					if (listing.Gender && listing.Gender.trim()) {
						genderSet.add(listing.Gender.trim());
					}

					// Extract budget options
					if (listing.Budget && listing.Budget.trim()) {
						budgetSet.add(listing.Budget.trim());
					}
				});

				// Convert Sets to arrays for city data
				const formattedCities = {};
				Object.keys(cityData).forEach((city) => {
					formattedCities[city] = Array.from(cityData[city]);
				});
				setCities(formattedCities);

				// Set gender options
				setGenderOptions(Array.from(genderSet));

				// Create budget ranges
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
						color: "bg-blue-100 text-blue-800", // Changed to blue theme
					},
					{
						value: "40000+",
						label: "Above ₹40,000",
						color: "bg-blue-100 text-blue-800", // Changed to blue theme
					},
				];
				setBudgetRanges(ranges);
			})
			.catch((error) => console.error("Error fetching listings:", error));
	}, []);

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

		await new Promise((resolve) => setTimeout(resolve, 800));

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
							<h1 className="text-xl font-semibold text-gray-900">Homiee</h1>
						</div>

						<a
							href="https://forms.gle/zgSSwGhtosZLEM5M6"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block  px-4 py-3 bg-[#49548a] text-white font-semibold rounded-lg shadow hover:bg-blue-900 transition-colors"
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
					{/* Add Flat Button */}
				</div>

				{/* Search Form */}
				<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-12">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{/* City Selection */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700 block">
								City
							</label>
							<select
								value={selectedCity}
								onChange={(e) => setSelectedCity(e.target.value)}
								className="w-full h-11 px-3 text-black border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none bg-white"
							>
								<option value="">Select city</option>
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
								disabled={!selectedCity || !cities[selectedCity]?.length}
								className="w-full h-11 px-3 text-black border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
							>
								<option value="">Select area</option>
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
								className="w-full h-11 px-3 text-black border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none bg-white"
							>
								<option value="">Select budget</option>
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
								className="w-full h-11 px-3 border text-black border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none bg-white"
							>
								<option value="">Any</option>
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
							disabled={!selectedCity || isSearching}
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
