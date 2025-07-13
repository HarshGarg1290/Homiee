import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import { convertProfileToMLFormat, validateProfileForML } from "../lib/profileToMLMapper";

const initialState = {
	City: "",
	Locality: "",
	Budget: "",
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
		"Kormangla",
		"HSR Layout",
		"Haralur",
		"Marathalli",
		"Whitefield",
		"Electronic city",
	],
};

const budgets = [
	"<15000",
	"15000-20000",
	"20000-25000",
	"25000-30000",
	"30000-40000",
	"40000+",
];
const eatingPrefs = [
	"Vegetarian",
	"Non Vegetarian",
	"Vegan",
	"Pescetarian",
	"Veg + Eggs",
];
const cleanliness = [
	"OCD",
	"Organised",
	"Messy but not unhygienic",
	"Let the dust rot",
	"Chaotic",
];
const smokeDrink = ["Neither", "Smoke", "Drink", "Both"];
const saturdayTwin = [
	"House Party Scenes",
	"Clubbing/Going Out",
	"Chill stay at home",
	"Based on my vibe",
];
const guestHost = ["I like hosting", "I like being the guest"];
const genders = ["Male", "Female", "Both"];

export default function FlatmateForm() {
	const router = useRouter();
	const { user, isAuthenticated } = useAuth();
	const [matches, setMatches] = useState([]);
	const [loading, setLoading] = useState(false);
	const [profileError, setProfileError] = useState(null);
	const [hasSearched, setHasSearched] = useState(false);

	// Check authentication on mount
	useEffect(() => {
		if (!isAuthenticated) {
			router.push('/login');
			return;
		}
	}, [isAuthenticated, router]);

	// Auto-search for matches when component loads if user has complete profile
	useEffect(() => {
		if (user && isAuthenticated && !hasSearched) {
			const validation = validateProfileForML(user);
			if (validation.isValid) {
				handleAutoSearch();
			} else {
				setProfileError(`Please complete your profile. Missing: ${validation.missingFields.join(', ')}`);
			}
		}
	}, [user, isAuthenticated, hasSearched]);

	async function handleAutoSearch() {
		setLoading(true);
		setProfileError(null);

		try {
			// Convert user profile to ML format
			const mlFormattedData = convertProfileToMLFormat(user);
			console.log('Converted user profile to ML format:', mlFormattedData);

			const res = await fetch("/api/flatmate-recommend", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(mlFormattedData),
			});

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}

			const data = await res.json();
			setMatches(data.matches || []);
			setHasSearched(true);
		} catch (error) {
			console.error("Error:", error);
			setMatches([]);
			setProfileError("Failed to find matches. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	// Manual refresh function
	async function handleRefresh() {
		setHasSearched(false);
		await handleAutoSearch();
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 font-['Montserrat',sans-serif]">
			<Head>
				<title>Find Flatmates | Homiee</title>
				<link
					href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
					rel="stylesheet"
				/>
			</Head>{" "}
			<header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
				{" "}
				<div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
					<div className="flex items-center justify-between">
						<button
							onClick={() => router.push("/")}
							className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
						>
							<div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
								<img
									src="/logo.jpg"
									alt="Homiee Logo"
									className="w-6 h-6 sm:w-8 sm:h-8 rounded"
								/>
							</div>
							<h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-black">
								Homiee
							</h1>
						</button>
					</div>
				</div>
			</header>{" "}
			<div className="flex flex-col items-center justify-center px-4 -mt-4 min-h-[calc(100vh-80px)]">
				<div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 w-full max-w-4xl">
					{loading && (
						<div className="flex flex-col items-center justify-center py-12 sm:py-16">
							<div className="relative">
								<div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200"></div>
								<div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
							</div>
							<div className="text-blue-700 font-semibold mt-4 sm:mt-6 text-base sm:text-lg">
								Finding your perfect matches...
							</div>
						</div>
					)}

					{!hasSearched && !loading && (
						<div>
							<div className="text-center mb-6 sm:mb-8">
								<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#49548a] mb-2 sm:mb-3">
									Find Your Perfect Flatmate
								</h1>
								<p className="text-gray-600 text-base sm:text-lg px-2">
									We'll use your profile preferences to find your ideal living companion!
								</p>
							</div>

							{profileError ? (
								<div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
									<div className="text-red-600 font-semibold mb-3">Profile Incomplete</div>
									<p className="text-red-700 mb-4">{profileError}</p>
									<button
										onClick={() => router.push('/profile-setup')}
										className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
									>
										Complete Profile
									</button>
								</div>
							) : user ? (
								<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
									<h3 className="text-lg font-semibold text-gray-800 mb-4">Your Preferences</h3>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
										<div><span className="font-medium">📍 Location:</span> {user.city}, {user.location}</div>
										<div><span className="font-medium">💰 Budget:</span> ₹{user.budget}</div>
										<div><span className="font-medium">🍽️ Diet:</span> {user.dietaryPrefs}</div>
										<div><span className="font-medium">🧹 Cleanliness:</span> Level {user.cleanliness}/5</div>
										<div><span className="font-medium">🚭 Smoking:</span> {user.smoker ? 'Yes' : 'No'}</div>
										<div><span className="font-medium">🍷 Drinking:</span> {user.alcoholUsage}</div>
									</div>
									<button
										onClick={handleAutoSearch}
										className="w-full mt-6 bg-gradient-to-r from-[#49548a] to-[#6366f1] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#3d4274] hover:to-[#5856eb] transform hover:scale-105 transition-all duration-200 shadow-lg"
									>
										🔍 Find My Matches
									</button>
								</div>
							) : (
								<div className="text-center py-8">
									<div className="text-gray-500">Loading your profile...</div>
								</div>
							)}
						</div>
					)}
					{hasSearched && !loading && matches.length > 0 && (
						<div className="space-y-4 sm:space-y-6">
							<div className="flex justify-between items-center">
								<h2 className="text-xl sm:text-2xl font-bold text-[#49548a]">
									🎯 Your Perfect Matches
								</h2>
								<button
									onClick={handleRefresh}
									className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors text-sm"
								>
									🔄 Refresh
								</button>
							</div>
							<div className="space-y-3 sm:space-y-4">
								{" "}
								{matches.map(({ candidate, match_percentage }, idx) => (
									<div
										key={idx}
										className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-4 sm:p-6 border border-blue-100 hover:shadow-xl transition-all duration-300"
									>
										{/* Header with profile photo, name, and match percentage */}
										<div className="flex items-center justify-between mb-4">
											<div className="flex items-center space-x-3 sm:space-x-4">
												<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-white shadow-lg flex-shrink-0">
													<img
														src={candidate.ProfilePhoto}
														alt={`${candidate.Name}'s profile`}
														className="w-full h-full object-cover"
														onError={(e) => {
															e.target.src = `https://ui-avatars.com/api/?name=${candidate.Name}&background=49548a&color=fff&size=80`;
														}}
													/>
												</div>
												<div>
													<h3 className="font-bold text-gray-900 text-lg sm:text-xl">
														{candidate.Name}
													</h3>
													<p className="text-gray-600 text-sm sm:text-base">
														{candidate.Age} years old
													</p>
													<p className="text-gray-500 text-sm">
														📍 {candidate.City}, {candidate.Locality}
													</p>
												</div>
											</div>
											<div className="text-center">
												<div className="bg-gradient-to-r from-[#49548a] to-blue-600 text-white font-bold text-lg sm:text-xl px-4 py-2 rounded-xl shadow-lg">
													{match_percentage}% Match
												</div>
											</div>
										</div>
										{/* Profile details grid */}
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-gray-700 text-sm sm:text-base">
											<div className="flex items-center space-x-2 bg-white/60 rounded-lg p-2 sm:p-3">
												<span>{candidate.Gender === "Male" ? "👨‍💼" : "👩‍💼"}</span>
												<span className="font-medium">{candidate.Gender}</span>
												<span className="text-gray-400">•</span>
												<span className="font-semibold text-green-600">
													₹{candidate.Budget}
												</span>
											</div>

											<div className="flex items-center space-x-2 bg-white/60 rounded-lg p-2 sm:p-3">
												<span>
													{candidate["Eating Preference"] === "Vegetarian"
														? "🥬"
														: candidate["Eating Preference"] ===
														  "Non Vegetarian"
														? "🍗"
														: candidate["Eating Preference"] === "Vegan"
														? "🥗"
														: candidate["Eating Preference"] === "Pescetarian"
														? "🐟"
														: "🍳"}
												</span>
												<span className="font-medium">
													{candidate["Eating Preference"]}
												</span>
											</div>

											<div className="flex items-center space-x-2 bg-white/60 rounded-lg p-2 sm:p-3">
												<span>🧹</span>
												<span className="font-medium">
													{candidate["Cleanliness Spook"]}
												</span>
											</div>

											<div className="flex items-center space-x-2 bg-white/60 rounded-lg p-2 sm:p-3">
												<span>
													{candidate["Smoke/Drink"] === "Both"
														? "🚬🍻"
														: candidate["Smoke/Drink"] === "Smoke"
														? "🚬"
														: candidate["Smoke/Drink"] === "Drink"
														? "🍻"
														: "🚫"}
												</span>
												<span className="font-medium">
													{candidate["Smoke/Drink"] === "Neither"
														? "Clean lifestyle"
														: candidate["Smoke/Drink"]}
												</span>
											</div>

											<div className="flex items-center space-x-2 bg-white/60 rounded-lg p-2 sm:p-3">
												<span>
													{candidate["Saturday Twin"] === "House Party Scenes"
														? "🎉"
														: candidate["Saturday Twin"] ===
														  "Clubbing/Going Out"
														? "🕺"
														: candidate["Saturday Twin"] ===
														  "Chill stay at home"
														? "🏡"
														: "🎲"}
												</span>
												<span className="font-medium">
													{candidate["Saturday Twin"]}
												</span>
											</div>

											<div className="flex items-center space-x-2 bg-white/60 rounded-lg p-2 sm:p-3">
												<span>
													{candidate["Guest/Host"] === "I like hosting"
														? "🏠"
														: "🛋️"}
												</span>
												<span className="font-medium">
													{candidate["Guest/Host"]}
												</span>
											</div>
										</div>{" "}
										{/* Contact button */}
										<div className="mt-4 pt-4 border-t border-gray-200">
											<button className="w-full bg-gradient-to-r from-[#49548a] to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2">
												<span>💬</span>
												<span>Connect with {candidate.Name}</span>
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{hasSearched && !loading && matches.length === 0 && (
						<div className="text-center py-16">
							<div className="text-6xl mb-4">😔</div>
							<div className="text-xl font-semibold text-gray-700 mb-2">
								No matches found
							</div>
							<div className="text-gray-500 mb-6">
								No compatible flatmates found with your current preferences. Try updating your profile or check back later for new listings.
							</div>
							<div className="flex gap-4 justify-center">
								<button
									onClick={() => router.push('/profile-setup')}
									className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
								>
									Update Profile
								</button>
								<button
									onClick={handleRefresh}
									className="bg-gradient-to-r from-[#49548a] to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
								>
									Try Again
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
