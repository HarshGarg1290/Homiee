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
	return Math.abs(userIdx - candIdx) <= 1;
}

export default async function handler(req, res) {
	const startTime = Date.now();
	console.log("=== Flatmate Recommend API Called ===");
	console.log("Method:", req.method);
	console.log("Headers:", req.headers);
	console.log("Environment:", process.env.NODE_ENV);

	if (req.method !== "POST") return res.status(405).end();

	try {
		const user = req.body;
		console.log("User data received:", JSON.stringify(user, null, 2));

		// Check cache first
		const cacheKey = apiCache.generateKey(user);
		const cachedResult = apiCache.get(cacheKey);

		if (cachedResult) {
			const responseTime = Date.now() - startTime;
			console.log(`🚀 Cache HIT! Response time: ${responseTime}ms`);
			return res.status(200).json({
				...cachedResult,
				cache: {
					hit: true,
					responseTime: responseTime,
				},
			});
		}

		console.log("🔍 Cache MISS - Processing new request...");
		const csvPath = path.join(
			process.cwd(),
			"public",
			"enhanced_flatmate_dataset.csv"
		);
		console.log("Looking for CSV at:", csvPath);

		if (!fs.existsSync(csvPath)) {
			throw new Error(`CSV file not found at: ${csvPath}`);
		}

		const raw = fs.readFileSync(csvPath, "utf8");
		const { data: candidates } = Papa.parse(raw, {
			header: true,
			skipEmptyLines: true,
		});
		console.log("Found candidates:", candidates.length);
		const filteredCandidates = candidates.filter(
			(c) =>
				c.City === user.City &&
				c.Locality === user.Locality &&
				(user.Gender === "Both" || c.Gender === user.Gender) &&
				isBudgetClose(user.Budget, c.Budget)
		);
		console.log("Filtered candidates:", filteredCandidates.length);

		if (filteredCandidates.length === 0) {
			console.log("No candidates found, returning empty matches");
			return res.status(200).json({ matches: [] });
		}
		const pairs = filteredCandidates.map((candidate) => ({
			User_City: user.City,
			User_Locality: user.Locality,
			User_Budget: user.Budget || user["Budget Preference"], // Handle both field names
			"User_Eating Preference": user["Eating Preference"],
			"User_Cleanliness Spook": user["Cleanliness Spook"],
			"User_Smoke/Drink": user["Smoke/Drink"],
			"User_Saturday Twin": user["Saturday Twin"],
			"User_Guest/Host": user["Guest/Host"],
			User_Gender: user.Gender,
			Cand_City: candidate.City,
			Cand_Locality: candidate.Locality,
			Cand_Budget: candidate.Budget || candidate["Budget Preference"],
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
				const host = req.headers.host || "localhost:3000";
				const baseUrl = `${protocol}://${host}`;

				console.log("Calling prediction API at:", `${baseUrl}/api/predict`);

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

		// Cache the result for future requests
		const result = { matches };
		apiCache.set(cacheKey, result);

		const responseTime = Date.now() - startTime;
		console.log(`⚡ Cache STORED! Response time: ${responseTime}ms`);

		res.status(200).json({
			...result,
			cache: {
				hit: false,
				responseTime: responseTime,
				stored: true,
			},
		});
	} catch (error) {
		console.error("API Error:", error);
		res.status(500).json({
			error: error.message,
			stack: error.stack,
		});
	}
}
