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

const cities = [
  "Delhi", "Gurgaon", "Noida", "Bangalore", "Mumbai"
];
const budgets = [
  "<15000", "15000-20000", "20000-25000", "25000-30000", "30000-40000", "40000+"
];
const eatingPrefs = [
  "Vegetarian", "Non Vegetarian", "Vegan", "Pescetarian", "Veg + Eggs"
];
const cleanliness = [
  "OCD", "Organised", "Messy but not unhygienic", "Let the dust rot", "Chaotic"
];
const smokeDrink = [
  "Neither", "Smoke", "Drink", "Both"
];
const saturdayTwin = [
  "House Party Scenes", "Clubbing/Going Out", "Chill stay at home", "Based on my vibe"
];
const guestHost = [
  "I like hosting", "I like being the guest"
];
const genders = [
  "Male", "Female"
];

export default function FlatmateForm() {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    // You can handle the form data here (e.g., send to API or Google Form)
  }

  return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col items-center justify-center font-['Montserrat',sans-serif]">
			<Head>
				<title>Find Flatmates | Homiee</title>
				<link
					href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
					rel="stylesheet"
				/>
			</Head>
			<div className="bg-white/90 rounded-2xl shadow-2xl p-10 w-full max-w-2xl mt-10 mb-10">
				<h1 className="text-3xl font-bold text-center text-[#49548a] mb-2">
					Find Your Perfect Flatmate
				</h1>
				<p className="text-center text-gray-500 mb-8">
					Fill in your preferences and let us help you find the best match!
				</p>
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* City */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							City
						</label>
						<select
							name="City"
							value={form.City}
							onChange={handleChange}
							required
							className="w-full border text-gray-700 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
						>
							<option value="">Select City</option>
							{cities.map((city) => (
								<option key={city} value={city}>
									{city}
								</option>
							))}
						</select>
					</div>
					{/* Locality */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Locality
						</label>
						<input
							type="text"
							name="Locality"
							value={form.Locality}
							onChange={handleChange}
							placeholder="e.g. HSR Layout"
							required
							className="w-full border text-gray-700 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
					</div>
					{/* Budget */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Budget
						</label>
						<select
							name="Budget"
							value={form.Budget}
							onChange={handleChange}
							required
							className="w-full border text-gray-700 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
						>
							<option value="">Select Budget</option>
							{budgets.map((b) => (
								<option key={b} value={b}>
									{b}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Gender
						</label>
						<select
							name="Gender"
							value={form.Gender}
							onChange={handleChange}
							required
							className="w-full border text-gray-700 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
						>
							<option value="">Select</option>
							{genders.map((g) => (
								<option key={g} value={g}>
									{g}
								</option>
							))}
						</select>
					</div>
					{/* Eating Preference */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Eating Preference
						</label>
						<select
							name="Eating Preference"
							value={form["Eating Preference"]}
							onChange={handleChange}
							required
							className="w-full border text-gray-700 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
						>
							<option value="">Select</option>
							{eatingPrefs.map((e) => (
								<option key={e} value={e}>
									{e}
								</option>
							))}
						</select>
					</div>
					{/* Cleanliness Spook */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Cleanliness Spook
						</label>
						<select
							name="Cleanliness Spook"
							value={form["Cleanliness Spook"]}
							onChange={handleChange}
							required
							className="w-full border text-gray-700 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
						>
							<option value="">Select</option>
							{cleanliness.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
					</div>
					{/* Smoke/Drink */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Smoke/Drink
						</label>
						<select
							name="Smoke/Drink"
							value={form["Smoke/Drink"]}
							onChange={handleChange}
							required
							className="w-full border text-gray-700 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
						>
							<option value="">Select</option>
							{smokeDrink.map((s) => (
								<option key={s} value={s}>
									{s}
								</option>
							))}
						</select>
					</div>
					{/* Saturday Twin */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Saturday Twin
						</label>
						<select
							name="Saturday Twin"
							value={form["Saturday Twin"]}
							onChange={handleChange}
							required
							className="w-full border text-gray-700 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
						>
							<option value="">Select</option>
							{saturdayTwin.map((s) => (
								<option key={s} value={s}>
									{s}
								</option>
							))}
						</select>
					</div>
					{/* Guest/Host */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Guest/Host
						</label>
						<select
							name="Guest/Host"
							value={form["Guest/Host"]}
							onChange={handleChange}
							required
							className="w-full border text-gray-700 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
						>
							<option value="">Select</option>
							{guestHost.map((g) => (
								<option key={g} value={g}>
									{g}
								</option>
							))}
						</select>
					</div>
					{/* Gender */}

					{/* Submit */}
					<button
						type="submit"
						className="w-full bg-[#49548a] hover:bg-blue-900 text-white font-semibold py-3 rounded-lg shadow-lg transition-all text-lg mt-4"
					>
						Find Flatmates
					</button>
				</form>
				{submitted && (
					<div className="mt-8 text-center text-green-600 font-semibold">
						Thank you! Your preferences have been submitted.
					</div>
				)}
			</div>
		</div>
	);
}