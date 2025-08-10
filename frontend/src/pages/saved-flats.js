import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import { getSavedFlats, unsaveFlat, generateFlatId } from "../lib/savedFlats";
import {
	MapPin,
	IndianRupee,
	Home,
	Users,
	Phone,
	ChevronRight,
	Loader2,
	Heart,
	Trash2,
	BookmarkX,
	ArrowLeft,
} from "lucide-react";
import Image from "next/image";

export default function SavedFlats() {
	const router = useRouter();
	const { user, isAuthenticated, isLoading } = useAuth();

	const [savedFlats, setSavedFlats] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [expandedListing, setExpandedListing] = useState(null);
	const [removingFlat, setRemovingFlat] = useState(null);

	// Redirect if not authenticated
	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [isAuthenticated, isLoading, router]);

	const fetchSavedFlats = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getSavedFlats(user.id);
			setSavedFlats(data.savedFlats || []);
		} catch (error) {
			console.error("Error fetching saved flats:", error);
			setError("Failed to load saved flats. Please try again.");
		} finally {
			setLoading(false);
		}
	}, [user]);

	// Fetch saved flats when user is available
	useEffect(() => {
		if (user && isAuthenticated) {
			fetchSavedFlats();
		}
	}, [user, isAuthenticated, fetchSavedFlats]);

	const handleRemoveFlat = async (savedFlat) => {
		if (!user) return;

		setRemovingFlat(savedFlat.id);

		try {
			await unsaveFlat(user.id, savedFlat.flatId);
			// Remove from local state
			setSavedFlats((prev) => prev.filter((flat) => flat.id !== savedFlat.id));
		} catch (error) {
			// You could add a toast notification here
		} finally {
			setRemovingFlat(null);
		}
	};

	const toggleListingDetails = (id) => {
		setExpandedListing(expandedListing === id ? null : id);
	};

	const extractContact = (message) => {
		if (!message) return null;
		const phoneRegex = /(\d{10})|(\+\d{12})/g;
		const matches = message.match(phoneRegex);
		return matches ? matches[0] : null;
	};

	// Show loading during authentication
	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#f38406]" />
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	// Don't render if not authenticated
	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
			<Head>
				<title>Saved Flats | Homiee</title>
			</Head>

			<header className="bg-white border-b border-gray-100 sticky top-0 z-50">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
					<div className="flex items-center justify-between">
						<button
							onClick={() => router.push("/dashboard")}
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
						<button
							onClick={() => router.push("/dashboard")}
							className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-3 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
						>
							<ArrowLeft className="w-4 h-4" />
							<span>Back to Dashboard</span>
						</button>
					</div>
				</div>
			</header>

			<main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
				<div className="text-center mb-8 sm:mb-12">
					<div className="flex items-center justify-center mb-4">
						<div className="w-16 h-16 bg-gradient-to-r from-[#f38406] to-[#e07405] rounded-lg flex items-center justify-center">
							<Heart className="w-8 h-8 text-white fill-current" />
						</div>
					</div>
					<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
						Your Saved Flats
					</h2>
					<p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-2">
						{savedFlats.length > 0
							? `You have ${savedFlats.length} saved flat${
									savedFlats.length !== 1 ? "s" : ""
							  }`
							: "Start saving flats to keep track of your favorites"}
					</p>
				</div>

				{loading && (
					<div className="text-center py-16">
						<Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#f38406]" />
						<p className="text-gray-600">Loading your saved flats...</p>
					</div>
				)}

				{error && (
					<div className="text-center py-16">
						<div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
							<p className="text-red-600 mb-4">{error}</p>
							<button
								onClick={fetchSavedFlats}
								className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
							>
								Try Again
							</button>
						</div>
					</div>
				)}

				{!loading && !error && savedFlats.length === 0 && (
					<div className="text-center py-16">
						<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<BookmarkX className="w-12 h-12 text-gray-400" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							No saved flats yet
						</h3>
						<p className="text-gray-600 mb-6 max-w-md mx-auto">
							Start browsing flats and save the ones you like to keep track of
							them here.
						</p>
						<button
							onClick={() => router.push("/flats")}
							className="px-6 py-3 bg-[#f38406] text-white rounded-lg hover:bg-[#e07405] transition-colors font-medium"
						>
							Browse Flats
						</button>
					</div>
				)}

				{!loading && !error && savedFlats.length > 0 && (
					<div className="space-y-4 sm:space-y-6">
						{savedFlats.map((savedFlat) => (
							<div
								key={savedFlat.id}
								className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden"
							>
								<div className="p-4 sm:p-6">
									<div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 sm:mb-4 gap-3 sm:gap-0">
										<div className="flex-1">
											<div className="flex items-center justify-between mb-2">
												<h4 className="font-semibold text-gray-900 text-base sm:text-lg">
													{savedFlat.bhk} BHK in {savedFlat.subregion}
												</h4>
												<button
													onClick={() => handleRemoveFlat(savedFlat)}
													disabled={removingFlat === savedFlat.id}
													className={`p-2 rounded-full text-red-500 hover:bg-red-50 transition-all duration-200 ${
														removingFlat === savedFlat.id
															? "opacity-50 cursor-not-allowed"
															: ""
													}`}
													title="Remove from saved"
												>
													{removingFlat === savedFlat.id ? (
														<Loader2 className="w-5 h-5 animate-spin" />
													) : (
														<Trash2 className="w-5 h-5" />
													)}
												</button>
											</div>
											<div className="flex items-center text-gray-500 text-sm mb-2 sm:mb-3">
												<MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
												<span className="truncate">
													{savedFlat.subregion}, {savedFlat.city}
												</span>
											</div>
											<div className="flex items-center text-lg sm:text-xl font-bold text-gray-900">
												<IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
												{savedFlat.budget}
												<span className="text-xs sm:text-sm font-normal text-gray-500 ml-1">
													/month
												</span>
											</div>
										</div>
										<div className="flex flex-row sm:flex-col items-start sm:items-end space-x-2 sm:space-x-0 sm:space-y-2">
											<span className="px-2 sm:px-3 py-1 bg-blue-100 text-[#49548a] text-xs rounded-full whitespace-nowrap">
												{savedFlat.gender} preferred
											</span>
											{savedFlat.flatmateReq && (
												<span className="px-2 sm:px-3 py-1 bg-blue-100 text-[#49548a] text-xs rounded-full whitespace-nowrap">
													{savedFlat.flatmateReq} flatmate
													{parseInt(savedFlat.flatmateReq) > 1 ? "s" : ""}{" "}
													needed
												</span>
											)}
										</div>
									</div>

									<button
										onClick={() => toggleListingDetails(savedFlat.id)}
										className="w-full flex items-center justify-between p-2 sm:p-3 border border-gray-200 hover:bg-blue-50 rounded-lg transition-colors"
									>
										<span className="font-medium text-[#49548a] text-sm sm:text-base">
											{expandedListing === savedFlat.id
												? "Hide details"
												: "View details"}
										</span>
										<ChevronRight
											className={`w-4 h-4 text-[#49548a] transition-transform ${
												expandedListing === savedFlat.id ? "rotate-90" : ""
											}`}
										/>
									</button>

									{expandedListing === savedFlat.id && savedFlat.message && (
										<div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
											<p className="text-gray-700 text-sm leading-relaxed mb-3 sm:mb-4">
												{savedFlat.message}
											</p>
											{extractContact(savedFlat.message) && (
												<div className="flex items-center text-[#49548a] text-sm">
													<Phone className="w-4 h-4 mr-2 flex-shrink-0" />
													<span className="font-mono break-all">
														{extractContact(savedFlat.message)}
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
			</main>
		</div>
	);
}

export async function getServerSideProps() {
	return {
		props: {},
	};
}
