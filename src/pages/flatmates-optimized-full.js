import Head from "next/head";
import { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import toast, { Toaster } from 'react-hot-toast';
import { LoadingSpinner, MatchingSkeleton, ErrorMessage, SuccessMessage } from "../components/ui/feedback";
import { useFormValidation } from "../lib/validation";

const initialState = {
	City: "",
	Locality: "",
	"Budget Preference": "",
	"Eating Preference": "",
	"Cleanliness Spook": "",
	"Smoke/Drink": "",
	"Saturday Twin": "",
	"Guest/Host": "",
	Gender: "",
};

const cities = ["Delhi", "Gurgaon", "Noida", "Bangalore", "Mumbai"];

const cityToLocalities = {
	Delhi: ["North Delhi", "Central Delhi", "East Delhi", "South Delhi"],
	Mumbai: [
		"Lower Parel/Worli/Parel",
		"Marine/Colaba",
		"Bandra",
		"Andheri E",
		"Andheri W",
		"Borivali/Kandivali/Malad",
		"Vile Parle",
		"Goregon",
	],
	Gurgaon: [
		"DLF4",
		"DLF 2",
		"DLF 5",
		"DLF 3",
		"Sector 18",
		"Sector 50",
		"Sector 48",
		"Sector 43",
		"Sector 55/56",
		"Sushant Lok",
		"Udyog Vihar",
		"Golf Course Extension",
	],
	Noida: [
		"Sector 62",
		"Sector 137",
		"Sector 76/77/78",
		"Sector 18",
		"Sector 15/16/27",
		"Sector 50",
	],
	Bangalore: [
		"HSR",
		"Koramangala",
		"Indiranagar",
		"Marathalli",
		"Whitefield",
		"Electronic City",
		"BTM",
		"Jayanagar",
	],
};

// Form field configurations
const formFields = [
	{
		name: "Gender",
		label: "Gender",
		type: "select",
		options: ["Male", "Female"],
		required: true,
		icon: "👤"
	},
	{
		name: "City",
		label: "City",
		type: "select",
		options: cities,
		required: true,
		icon: "🏙️"
	},
	{
		name: "Locality",
		label: "Locality",
		type: "select",
		options: [],
		required: true,
		icon: "📍",
		dependent: "City"
	},
	{
		name: "Budget Preference",
		label: "Budget Range",
		type: "select",
		options: ["<15000", "15000-20000", "20000-25000", "25000-30000", "30000-40000", "40000+"],
		required: true,
		icon: "💰"
	},
	{
		name: "Eating Preference",
		label: "Eating Preference",
		type: "select",
		options: ["Vegetarian", "Non Vegetarian", "Veg + Eggs", "Pescetarian", "Vegan"],
		required: true,
		icon: "🍽️"
	},
	{
		name: "Cleanliness Spook",
		label: "Cleanliness Level",
		type: "select",
		options: ["Organised", "Messy but not unhygienic", "Chaotic", "OCD"],
		required: true,
		icon: "🧹"
	},
	{
		name: "Smoke/Drink",
		label: "Smoke/Drink",
		type: "select",
		options: ["Neither", "Drink", "Both", "Smoke"],
		required: true,
		icon: "🚭"
	},
	{
		name: "Saturday Twin",
		label: "Saturday Plans",
		type: "select",
		options: ["Clubbing/Going Out", "House Party Scenes", "Chill stay at home", "Based on my vibe"],
		required: true,
		icon: "🎉"
	},
	{
		name: "Guest/Host",
		label: "Guest/Host Preference",
		type: "select",
		options: ["I like hosting", "I like being the guest"],
		required: true,
		icon: "🏠"
	}
];

export default function Flatmates() {
	const {
		formData,
		errors,
		touched,
		updateField,
		touchField,
		validateAll,
		isValid
	} = useFormValidation(initialState);

	const [matches, setMatches] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const [searchInfo, setSearchInfo] = useState(null);

	// Debounced search function
	const debouncedSearch = useCallback(
		debounce(async (searchData) => {
			if (!validateAll()) {
				toast.error("Please fill in all required fields correctly");
				return;
			}

			setIsLoading(true);
			
			try {
				console.log("🔍 Searching for flatmates...", searchData);
				
				const response = await fetch("/api/flatmate-recommend", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(searchData),
				});

				if (!response.ok) {
					throw new Error(`Server error: ${response.status}`);
				}

				const data = await response.json();
				console.log("📊 Search results:", data);

				setMatches(data.matches || []);
				setSearchInfo({
					cached: data.cached,
					generated_at: data.generated_at,
					total_filtered: data.total_filtered,
					cache_duration: data.cache_duration
				});
				setHasSearched(true);

				// Show success message
				if (data.matches?.length > 0) {
					const message = data.cached 
						? `Found ${data.matches.length} matches (from cache)`
						: `Found ${data.matches.length} new matches`;
					toast.success(message);
				} else {
					toast.error("No matches found with your criteria. Try adjusting your preferences.");
				}

			} catch (error) {
				console.error("Search error:", error);
				toast.error("Failed to search for matches. Please try again.");
				setMatches([]);
			} finally {
				setIsLoading(false);
			}
		}, 500),
		[validateAll]
	);

	const handleSearch = () => {
		debouncedSearch(formData);
	};

	const handleFieldChange = (fieldName, value) => {
		updateField(fieldName, value);
		
		// Reset locality if city changes
		if (fieldName === "City") {
			updateField("Locality", "");
		}
	};

	const getLocalityOptions = () => {
		return formData.City ? cityToLocalities[formData.City] || [] : [];
	};

	const FieldInput = ({ field }) => {
		const hasError = touched[field.name] && errors[field.name];
		const isDisabled = field.dependent && !formData[field.dependent];
		
		let options = field.options;
		if (field.name === "Locality") {
			options = getLocalityOptions();
		}

		return (
			<div className="space-y-2">
				<label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
					<span>{field.icon}</span>
					<span>{field.label}</span>
					{field.required && <span className="text-red-500">*</span>}
				</label>
				
				<select
					value={formData[field.name]}
					onChange={(e) => handleFieldChange(field.name, e.target.value)}
					onBlur={() => touchField(field.name)}
					disabled={isDisabled}
					className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
						${hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'}
						${isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
					`}
				>
					<option value="">
						{isDisabled ? `Select ${field.dependent} first` : `Choose ${field.label}`}
					</option>
					{options.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
				
				{hasError && (
					<div className="text-red-500 text-xs mt-1">
						{errors[field.name][0]}
					</div>
				)}
			</div>
		);
	};

	const MatchCard = ({ match, index }) => {
		const { candidate, match_percentage } = match;
		
		const getMatchColor = (percentage) => {
			if (percentage >= 80) return "text-green-600 bg-green-100";
			if (percentage >= 60) return "text-blue-600 bg-blue-100";
			if (percentage >= 40) return "text-yellow-600 bg-yellow-100";
			return "text-red-600 bg-red-100";
		};

		return (
			<div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center space-x-3">
						<div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
							{candidate.Gender === 'Male' ? '👨' : '👩'}
						</div>
						<div>
							<h3 className="font-semibold text-gray-900">Match #{index + 1}</h3>
							<p className="text-sm text-gray-600">{candidate.City}, {candidate.Locality}</p>
						</div>
					</div>
					<div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(match_percentage)}`}>
						{match_percentage}% Match
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<span className="text-gray-600">Budget:</span>
						<span className="ml-2 font-medium">{candidate["Budget Preference"] || candidate.Budget}</span>
					</div>
					<div>
						<span className="text-gray-600">Food:</span>
						<span className="ml-2 font-medium">{candidate["Eating Preference"]}</span>
					</div>
					<div>
						<span className="text-gray-600">Cleanliness:</span>
						<span className="ml-2 font-medium">{candidate["Cleanliness Spook"]}</span>
					</div>
					<div>
						<span className="text-gray-600">Social:</span>
						<span className="ml-2 font-medium">{candidate["Saturday Twin"]}</span>
					</div>
				</div>

				<div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
					<div className="text-xs text-gray-500">
						{candidate["Smoke/Drink"]} • {candidate["Guest/Host"]}
					</div>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
						Contact
					</button>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Head>
				<title>Find Flatmates - Homiee</title>
				<meta name="description" content="Find your perfect flatmate match" />
			</Head>

			<Toaster position="top-right" />

			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-gray-900 mb-2">
							Find Your Perfect Flatmate
						</h1>
						<p className="text-gray-600">
							Get AI-powered matches based on your preferences and lifestyle
						</p>
					</div>

					{/* Form */}
					<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
						<h2 className="text-xl font-semibold mb-6 text-gray-900">Your Preferences</h2>
						
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{formFields.map((field) => (
								<FieldInput key={field.name} field={field} />
							))}
						</div>

						<div className="mt-8 flex justify-center">
							<button
								onClick={handleSearch}
								disabled={isLoading || !isValid}
								className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 
									${isLoading || !isValid
										? 'bg-gray-300 cursor-not-allowed text-gray-500'
										: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
									}
								`}
							>
								{isLoading ? (
									<div className="flex items-center space-x-2">
										<LoadingSpinner size="sm" />
										<span>Searching...</span>
									</div>
								) : (
									"🔍 Find Matches"
								)}
							</button>
						</div>
					</div>

					{/* Results */}
					{(isLoading || hasSearched) && (
						<div className="bg-white rounded-lg shadow-lg p-6">
							{isLoading ? (
								<div>
									<h2 className="text-xl font-semibold mb-6">Finding Your Matches...</h2>
									<MatchingSkeleton />
								</div>
							) : (
								<div>
									<div className="flex items-center justify-between mb-6">
										<h2 className="text-xl font-semibold">
											{matches.length > 0 ? `Found ${matches.length} Matches` : 'No Matches Found'}
										</h2>
										{searchInfo && (
											<div className="text-sm text-gray-500">
												{searchInfo.cached ? '⚡ From cache' : '🔄 Fresh results'}
											</div>
										)}
									</div>

									{searchInfo && searchInfo.cached && (
										<SuccessMessage 
											message={`Results generated at ${new Date(searchInfo.generated_at).toLocaleTimeString()}`}
											cached={true}
										/>
									)}

									{matches.length > 0 ? (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{matches.map((match, index) => (
												<MatchCard key={index} match={match} index={index} />
											))}
										</div>
									) : (
										<div className="text-center py-12">
											<div className="text-6xl mb-4">😔</div>
											<h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
											<p className="text-gray-600 mb-4">
												Try adjusting your location or preferences to find more matches.
											</p>
											<button
												onClick={handleSearch}
												className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
											>
												Search Again
											</button>
										</div>
									)}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
