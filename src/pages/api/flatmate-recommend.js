import fs from "fs";
import path from "path";
import Papa from "papaparse";
import apiCache from "../../lib/cache.js";

const budgetOrder = [
	"<15000",
	"15000-20000",
	"20000-25000",
	"25000-30000",
	"30000-40000",
	"40000+",
];

function isBudgetClose(userBudget, candidateBudget) {
	const userIdx = budgetOrder.indexOf(userBudget);
	const candIdx = budgetOrder.indexOf(candidateBudget);

	// Only allow exact match or 1 tier difference
	// e.g., 15k-20k can match with <15k, 15k-20k, or 20k-25k
	// but NOT with 40k+
	const difference = Math.abs(userIdx - candIdx);
	return difference <= 1;
}

export default async function handler(req, res) {
	if (req.method !== "POST") return res.status(405).end();

	try {
		const user = req.body;
		
		// Check cache first
		const cacheKey = apiCache.generateKey(user);
		const cachedResult = apiCache.get(cacheKey);
		
		if (cachedResult) {
			console.log("🚀 Cache hit! Returning cached results");
			return res.status(200).json({
				...cachedResult,
				cached: true,
				timestamp: new Date().toISOString()
			});
		}

		console.log("💾 Cache miss, generating new results");
		
		const csvPath = path.join(
			process.cwd(),
			"public",
			"fake_flatmate_dataset_600_with_gender.csv"
		);

		if (!fs.existsSync(csvPath)) {
			throw new Error(`CSV file not found at: ${csvPath}`);
		}

		const raw = fs.readFileSync(csvPath, "utf8");
		const { data: candidates } = Papa.parse(raw, {
			header: true,
			skipEmptyLines: true,
		});

		// STRICT filtering: exact city, locality, gender, and close budget
		const filteredCandidates = candidates.filter((c) => {
			// Must have exact matches for these critical fields
			const exactMatch =
				c.City === user.City &&
				c.Locality === user.Locality &&
				c.Gender === user.Gender;

			// Budget must be close (within 1 tier)
			const budgetMatch = isBudgetClose(user.Budget, c.Budget);

			return exactMatch && budgetMatch;
		});
		if (filteredCandidates.length === 0) {
			console.log(
				`No candidates found for ${user.City}, ${user.Locality}, ${user.Gender}, budget: ${user.Budget}`
			);
			return res.status(200).json({ matches: [] });
		}

		console.log(
			`Found ${filteredCandidates.length} candidates after strict filtering`
		);

		// Create pairs with correct field mapping for the enhanced ML model
		const pairs = filteredCandidates.map((candidate) => ({
			User_City: user.City,
			User_Locality: user.Locality,
			User_Budget: user.Budget,
			"User_Eating Preference": user["Eating Preference"],
			"User_Cleanliness Spook": user["Cleanliness Spook"],
			"User_Smoke/Drink": user["Smoke/Drink"],
			"User_Saturday Twin": user["Saturday Twin"],
			"User_Guest/Host": user["Guest/Host"],
			User_Gender: user.Gender,
			Cand_City: candidate.City,
			Cand_Locality: candidate.Locality,
			Cand_Budget: candidate.Budget,
			"Cand_Eating Preference": candidate["Eating Preference"],
			"Cand_Cleanliness Spook": candidate["Cleanliness Spook"],
			"Cand_Smoke/Drink": candidate["Smoke/Drink"],
			"Cand_Saturday Twin": candidate["Saturday Twin"],
			"Cand_Guest/Host": candidate["Guest/Host"],
			Cand_Gender: candidate.Gender,
		})); // Get predictions from the appropriate endpoint
		let match_percentages;
		// Skip ML predictions during build time
		if (process.env.NODE_ENV === "production" && !req.headers.host) {
			console.log("Build time detected, using fallback predictions");
			match_percentages = pairs.map(() => Math.floor(Math.random() * 70) + 30);
		} else {
			try {
				// Determine the base URL for API calls
				const protocol = req.headers["x-forwarded-proto"] || "http";
				const host = req.headers.host;
				const baseUrl = `${protocol}://${host}`;

				console.log("Calling prediction API at:", `${baseUrl}/api/predict`);
				console.log("Request host header:", host);

				const resp = await fetch(`${baseUrl}/api/predict`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(pairs),
				});

				if (!resp.ok) {
					throw new Error(`HTTP error! status: ${resp.status}`);
				}

				const result = await resp.json();
				match_percentages = result.match_percentages;
				console.log("Successfully got predictions:", match_percentages.length);
			} catch (fetchError) {
				console.warn(
					"Prediction API failed, using fallback:",
					fetchError.message
				);
				// Fallback to random predictions if API fails
				match_percentages = pairs.map(
					() => Math.floor(Math.random() * 70) + 30
				);
			}
		}

		const matches = filteredCandidates
			.map((candidate, i) => ({
				candidate,
				match_percentage: match_percentages[i],
			}))
			.filter((m) => m.match_percentage > 1)
			.sort((a, b) => b.match_percentage - a.match_percentage);
		// Update cache with new results
		const result = { 
			matches,
			generated_at: new Date().toISOString(),
			total_filtered: filteredCandidates.length,
			cache_duration: "5 minutes"
		};
		
		apiCache.set(cacheKey, result);
		console.log(`💾 Cached ${matches.length} matches for user`);

		res.status(200).json(result);
	} catch (error) {
		console.error("API Error:", error);
		res.status(500).json({
			error: error.message,
			stack: error.stack,
		});
	}
}
