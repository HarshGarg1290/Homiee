import fs from "fs";
import path from "path";
import Papa from "papaparse";

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
	console.log("=== Flatmate Recommend API Called ===");
	console.log("Method:", req.method);
	console.log("Headers:", req.headers);
	console.log("Environment:", process.env.NODE_ENV);

	if (req.method !== "POST") return res.status(405).end();

	try {
		const user = req.body;
		console.log("User data received:", JSON.stringify(user, null, 2));

		const csvPath = path.join(
			process.cwd(),
			"public",
			"fake_flatmate_dataset_600_with_gender.csv"
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
				c.Gender === user.Gender &&
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
			User_Budget: user.Budget,
			User_Eating: user["Eating Preference"],
			User_Cleanliness: user["Cleanliness Spook"],
			User_SmokeDrink: user["Smoke/Drink"],
			User_Saturday: user["Saturday Twin"],
			User_GuestHost: user["Guest/Host"],
			User_Gender: user.Gender,
			Cand_City: candidate.City,
			Cand_Locality: candidate.Locality,
			Cand_Budget: candidate.Budget,
			Cand_Eating: candidate["Eating Preference"],
			Cand_Cleanliness: candidate["Cleanliness Spook"],
			Cand_SmokeDrink: candidate["Smoke/Drink"],
			Cand_Saturday: candidate["Saturday Twin"],
			Cand_GuestHost: candidate["Guest/Host"],
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

		res.status(200).json({ matches });
	} catch (error) {
		console.error("API Error:", error);
		res.status(500).json({
			error: error.message,
			stack: error.stack,
		});
	}
}
