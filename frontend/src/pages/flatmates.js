import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import { validateEnhancedProfile } from "../lib/validation";
import {
  DashboardLayout,
  PageLoading,
  ErrorState,
  EmptyState,
  Button,
  Card
} from "../components/common";
import FlatmateMatchCard from "../components/flatmates/FlatmateMatchCard";
import ProfilePreview from "../components/flatmates/ProfilePreview";
export default function FlatmateForm() {
	const router = useRouter();
	const { user, isAuthenticated, isLoading } = useAuth();
	const [matches, setMatches] = useState([]);
	const [loading, setLoading] = useState(false);
	const [profileError, setProfileError] = useState(null);
	const [hasSearched, setHasSearched] = useState(false);
	// Check authentication on mount
	useEffect(() => {
		// Only redirect if we're not loading and not authenticated
		if (!isLoading && !isAuthenticated) {
			router.push('/login');
			return;
		}
	}, [isAuthenticated, isLoading, router]);
	// Validate profile when component loads but don't auto-search
	useEffect(() => {
		if (user && isAuthenticated && !hasSearched) {
			const validation = validateEnhancedProfile(user);
			if (!validation.isValid) {
				setProfileError(`Please complete your profile. Missing: ${validation.missingFields.join(', ')}`);
			}
		}
	}, [user, isAuthenticated, hasSearched]);
	// Show loading during authentication initialization
	if (isLoading) {
		return <PageLoading message="Loading..." />;
	}
	async function handleAutoSearch() {
		setLoading(true);
		setProfileError(null);
		try {
			const res = await fetch("/api/flatmate-recommend-db", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(user),
			});
			if (!res.ok) {
				throw new Error(`Flatmate API failed with status: ${res.status}`);
			}
			const data = await res.json();
			setMatches(data.matches || []);
			setHasSearched(true);
		} catch (error) {
			console.error("Flatmate matching error:", error);
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
		<>
			<Head>
				<title>Find Flatmates | Homiee</title>
			</Head>
			<DashboardLayout
				title="Find Your Perfect Flatmate"
				subtitle="We'll use your profile preferences to find your ideal living companion!"
			>
				{loading && (
					<PageLoading message="Finding your perfect matches..." />
				)}
				{!hasSearched && !loading && (
					<div className="max-w-2xl mx-auto">
						{profileError ? (
							<ErrorState
								title="Profile Incomplete"
								message={profileError}
								onRetry={() => router.push('/profile-setup')}
								className="mb-8"
							/>
						) : user ? (
							<ProfilePreview user={user} onSearchClick={handleAutoSearch} />
						) : (
							<PageLoading message="Loading your profile..." />
						)}
					</div>
				)}
				{hasSearched && !loading && matches.length === 0 && (
					<EmptyState
						title="No matches found"
						message="We couldn't find any flatmates matching your preferences. Try adjusting your criteria or search again."
						action={
							<div className="flex flex-col sm:flex-row gap-3">
								<Button onClick={() => setHasSearched(false)} variant="outline">
									⬅️ Back to Preferences
								</Button>
								<Button onClick={handleRefresh} variant="primary">
									🔄 Try Again
								</Button>
							</div>
						}
					/>
				)}
				{hasSearched && !loading && matches.length > 0 && (
					<div className="space-y-6">
						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
							<h2 className="text-xl sm:text-2xl font-bold text-[#49548a]">
								🎯 Your Perfect Matches ({matches.length})
							</h2>
							<div className="flex gap-2">
								<Button
									onClick={() => setHasSearched(false)}
									variant="outline"
									size="sm"
								>
									⬅️ Back to Preferences
								</Button>
								<Button
									onClick={handleRefresh}
									variant="outline"
									size="sm"
								>
									🔄 Refresh
								</Button>
							</div>
						</div>
						<div className="grid gap-6">
							{matches.map(({ candidate, match_percentage }, idx) => (
								<FlatmateMatchCard
									key={idx}
									candidate={candidate}
									match_percentage={match_percentage}
									index={idx}
								/>
							))}
						</div>
					</div>
				)}
			</DashboardLayout>
		</>
	);
}