import Head from "next/head";
import { useState } from "react";

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
const genders = ["Male", "Female"];

export default function FlatmateForm() {
	const [form, setForm] = useState(initialState);
	const [submitted, setSubmitted] = useState(false);
	const [matches, setMatches] = useState([]);
	const [loading, setLoading] = useState(false);

	function handleChange(e) {
		const { name, value } = e.target;
		if (name === "City") {
			setForm((prev) => ({
				...prev,
				City: value,
				Locality: "",
			}));
		} else {
			setForm((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setSubmitted(true);
		setLoading(true);

		try {
			const res = await fetch("/api/flatmate-recommend", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}

			const data = await res.json();
			setMatches(data.matches || []); // Fallback to empty array
			setLoading(false);
		} catch (error) {
			console.error("Error:", error);
			setMatches([]); // Set empty array on error
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 font-['Montserrat',sans-serif]">
			<Head>
				<title>Find Flatmates | Homiee</title>
				<link
					href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
					rel="stylesheet"
				/>
			</Head>

			<header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
				<div className="max-w-6xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-black  rounded-lg flex items-center justify-center shadow-lg">
								<img
									src="/logo.jpg"
									alt="Homiee Logo"
									className="w-8 h-8 rounded"
								/>
							</div>
							<h1 className="text-2xl font-bold  bg-clip-text text-black">
								Homiee
							</h1>
						</div>
					</div>
				</div>
			</header>

			<div className="flex flex-col items-center justify-center px-4 -mt-4 min-h-[calc(100vh-80px)]">
				<div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-4xl">
					{loading && (
						<div className="flex flex-col items-center justify-center py-16">
							<div className="relative">
								<div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
								<div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
							</div>
							<div className="text-blue-700 font-semibold mt-6 text-lg">
								Finding your perfect matches...
							</div>
						</div>
					)}

					{!submitted && !loading && (
						<div>
							<div className="text-center mb-8">
								<h1 className="text-4xl font-bold text-[#49548a] mb-3 ">
									Find Your Perfect Flatmate
								</h1>
								<p className="text-gray-600 text-lg">
									Tell us your preferences and we'll find your ideal living
									companion!
								</p>
							</div>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<label className="block text-sm font-semibold text-gray-800 mb-2">
											🏙️ City
										</label>
										<select
											name="City"
											value={form.City}
											onChange={handleChange}
											required
											className="w-full border-2 text-gray-700 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#49548a] focus:border-[#49548a] transition-all duration-200"
										>
											<option value="">Select your city</option>
											{cities.map((city) => (
												<option key={city} value={city}>
													{city}
												</option>
											))}
										</select>
									</div>

									<div className="space-y-2">
										<label className="block text-sm font-semibold text-gray-800 mb-2">
											📍 Locality
										</label>
										<select
											name="Locality"
											value={form.Locality}
											onChange={handleChange}
											required
											className="w-full border-2 text-gray-700 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#49548a] focus:border-[#49548a] transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
											disabled={!form.City}
										>
											<option value="">Select locality</option>
											{form.City &&
												cityToLocalities[form.City].map((loc) => (
													<option key={loc} value={loc}>
														{loc}
													</option>
												))}
										</select>
									</div>

									<div className="space-y-2">
										<label className="block text-sm font-semibold text-gray-800 mb-2">
											💰 Budget Range
										</label>
										<select
											name="Budget"
											value={form.Budget}
											onChange={handleChange}
											required
											className="w-full border-2 text-gray-700 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#49548a] focus:border-[#49548a] transition-all duration-200"
										>
											<option value="">Select budget</option>
											{budgets.map((b) => (
												<option key={b} value={b}>
													₹{b}
												</option>
											))}
										</select>
									</div>

									<div className="space-y-2">
										<label className="block text-sm font-semibold text-gray-800 mb-2">
											👤 Gender
										</label>
										<select
											name="Gender"
											value={form.Gender}
											onChange={handleChange}
											required
											className="w-full border-2 text-gray-700 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#49548a] focus:border-[#49548a] transition-all duration-200"
										>
											<option value="">Select gender</option>
											{genders.map((g) => (
												<option key={g} value={g}>
													{g}
												</option>
											))}
										</select>
									</div>

									<div className="space-y-2">
										<label className="block text-sm font-semibold text-gray-800 mb-2">
											🍽️ Eating Preference
										</label>
										<select
											name="Eating Preference"
											value={form["Eating Preference"]}
											onChange={handleChange}
											required
											className="w-full border-2 text-gray-700 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#49548a] focus:border-[#49548a] transition-all duration-200"
										>
											<option value="">Select preference</option>
											{eatingPrefs.map((e) => (
												<option key={e} value={e}>
													{e}
												</option>
											))}
										</select>
									</div>

									<div className="space-y-2">
										<label className="block text-sm font-semibold text-gray-800 mb-2">
											🧹 Cleanliness Level
										</label>
										<select
											name="Cleanliness Spook"
											value={form["Cleanliness Spook"]}
											onChange={handleChange}
											required
											className="w-full border-2 text-gray-700 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#49548a] focus:border-[#49548a] transition-all duration-200"
										>
											<option value="">Select level</option>
											{cleanliness.map((c) => (
												<option key={c} value={c}>
													{c}
												</option>
											))}
										</select>
									</div>

									<div className="space-y-2">
										<label className="block text-sm font-semibold text-gray-800 mb-2">
											🚬🍻 Smoke/Drink
										</label>
										<select
											name="Smoke/Drink"
											value={form["Smoke/Drink"]}
											onChange={handleChange}
											required
											className="w-full border-2 text-gray-700 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#49548a] focus:border-[#49548a]0 transition-all duration-200"
										>
											<option value="">Select preference</option>
											{smokeDrink.map((s) => (
												<option key={s} value={s}>
													{s}
												</option>
											))}
										</select>
									</div>

									<div className="space-y-2">
										<label className="block text-sm font-semibold text-gray-800 mb-2">
											🎉 Saturday Vibe
										</label>
										<select
											name="Saturday Twin"
											value={form["Saturday Twin"]}
											onChange={handleChange}
											required
											className="w-full border-2 text-gray-700 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#49548a] focus:border-[#49548a] transition-all duration-200"
										>
											<option value="">Select vibe</option>
											{saturdayTwin.map((s) => (
												<option key={s} value={s}>
													{s}
												</option>
											))}
										</select>
									</div>

									<div className="space-y-2 md:col-span-2">
										<label className="block text-sm font-semibold text-gray-800 mb-2">
											🏠 Guest/Host Preference
										</label>
										<select
											name="Guest/Host"
											value={form["Guest/Host"]}
											onChange={handleChange}
											required
											className="w-full border-2 text-gray-700 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#49548a] focus:border-[#49548a] transition-all duration-200"
										>
											<option value="">Select preference</option>
											{guestHost.map((g) => (
												<option key={g} value={g}>
													{g}
												</option>
											))}
										</select>
									</div>
								</div>

								<button
									type="submit"
									className="w-full bg-[#49548a] hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl shadow-xl transition-all duration-300 text-lg mt-8 transform hover:scale-105"
								>
									Find My Perfect Flatmate
								</button>
							</form>
						</div>
					)}

					{submitted && !loading && matches.length > 0 && (
						<div className=" space-y-6">
							<h2 className="text-2xl font-bold text-center text-[#49548a] mb-6 ">
								🎯 Your Perfect Matches
							</h2>
							<div className="space-y-4">
								{matches.map(({ candidate, match_percentage }, idx) => (
									<div
										key={idx}
										className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-4 border border-blue-100 hover:shadow-xl transition-all duration-300"
									>
										<div className="flex justify-between items-start">
											<div className="flex-1  space-y-3">
												<div className="font-bold text-gray-900 text-lg sm:text-xl mb-2">
													📍 {candidate.City} <br />{" "}
													<span className="text-sm sm:text-md">
														{candidate.Locality}
													</span>
												</div>
											</div>

											<div className="ml-6 text-center">
												<div className="bg-gradient-to-r from-[#49548a] to-blue-600 text-white font-bold sm:text-2xl px-2 py-1 sm:px-4 sm:py-2 rounded-xl shadow-lg">
													{match_percentage}% Match
												</div>
												<div className="text-sm text-gray-500 mt-1"></div>
											</div>
										</div>
										<div className="grid grid-cols-1  md:grid-cols-2 gap-3 text-gray-600">
											<div className="sm:flex items-center space-x-2">
												<span>{candidate.Gender === "Male" ? "👨" : "👩"}</span>
												<span>{candidate.Gender}</span>
												<span className="text-gray-400">•</span>
												<span>💸 ₹{candidate.Budget}</span>
											</div>

											<div className="flex items-center space-x-2">
												<span>
													{candidate["Eating Preference"] === "Vegetarian"
														? "🥦"
														: candidate["Eating Preference"] ===
														  "Non Vegetarian"
														? "🍗"
														: candidate["Eating Preference"] === "Vegan"
														? "🥗"
														: candidate["Eating Preference"] === "Pescetarian"
														? "🐟"
														: "🍳"}
												</span>
												<span>{candidate["Eating Preference"]}</span>
											</div>

											<div className="flex items-center space-x-2">
												<span>🧹</span>
												<span>{candidate["Cleanliness Spook"]}</span>
											</div>

											<div className="flex items-center space-x-2">
												<span>
													{candidate["Smoke/Drink"] === "Both"
														? "🚬🍻"
														: candidate["Smoke/Drink"] === "Smoke"
														? "🚬"
														: candidate["Smoke/Drink"] === "Drink"
														? "🍻"
														: "🚫"}
												</span>
												<span>
													{candidate["Smoke/Drink"] === "Neither"
														? "Clean lifestyle"
														: candidate["Smoke/Drink"]}
												</span>
											</div>

											<div className="flex items-center space-x-2">
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
												<span>{candidate["Saturday Twin"]}</span>
											</div>

											<div className="flex items-center space-x-2">
												<span>
													{candidate["Guest/Host"] === "I like hosting"
														? "🏠"
														: "🛋️"}
												</span>
												<span>{candidate["Guest/Host"]}</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{submitted && !loading && matches.length === 0 && (
						<div className="text-center py-16">
							<div className="text-6xl mb-4">😔</div>
							<div className="text-xl font-semibold text-gray-700 mb-2">
								No matches found
							</div>
							<div className="text-gray-500 mb-6">
								Try adjusting your preferences to find more compatible flatmates
							</div>
							<button
								onClick={() => {
									setSubmitted(false);
									setForm(initialState);
								}}
								className="bg-gradient-to-r from-[#49548a] to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
							>
								Try Again
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
