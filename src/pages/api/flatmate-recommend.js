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
	console.log("API called with method:", req.method);

	if (req.method !== "POST") return res.status(405).end();

	try {
		const user = req.body;
		console.log("User data received:", user);


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
		}));

	
		const protocol = req.headers["x-forwarded-proto"] || "https";
		const host = req.headers.host;
		const baseUrl = `${protocol}://${host}`;

		const resp = await fetch(`${baseUrl}/api/predict`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(pairs),
		});

		if (!resp.ok) {
			throw new Error(`HTTP error! status: ${resp.status}`);
		}

		const { match_percentages } = await resp.json();

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
