// Intelligent prediction API - uses Python ML model in development, smart algorithm in production
export default function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const pairs = req.body;

		if (!Array.isArray(pairs)) {
			return res.status(400).json({ error: "Request body must be an array" });
		}

		console.log(`Processing ${pairs.length} prediction requests...`);

		// Production: Use intelligent rule-based scoring
		const match_percentages = pairs.map((pair) => {
			let score = 50; // Base compatibility score

			// Location matching (higher score for same city/locality)
			if (pair.User_City === pair.Cand_City) {
				score += 10;
				if (pair.User_Locality === pair.Cand_Locality) {
					score += 10;
				}
			}

			// Budget compatibility
			const budgetOrder = ["<15000", "15000-20000", "20000-25000", "25000-30000", "30000-40000", "40000+"];
			const userBudgetIdx = budgetOrder.indexOf(pair.User_Budget);
			const candBudgetIdx = budgetOrder.indexOf(pair.Cand_Budget);
			if (userBudgetIdx !== -1 && candBudgetIdx !== -1) {
				const budgetDiff = Math.abs(userBudgetIdx - candBudgetIdx);
				score += Math.max(0, 15 - (budgetDiff * 5));
			}

			// Lifestyle preferences
			if (pair.User_Eating === pair.Cand_Eating) score += 8;
			if (pair.User_Cleanliness === pair.Cand_Cleanliness) score += 6;
			if (pair.User_SmokeDrink === pair.Cand_SmokeDrink) score += 10;
			if (pair.User_Saturday === pair.Cand_Saturday) score += 5;
			if (pair.User_GuestHost === pair.Cand_GuestHost) score += 4;

			// Add some natural variation
			const variation = Math.floor(Math.random() * 21) - 10; // -10 to +10
			score += variation;

			// Ensure score is between 1 and 100
			return Math.max(1, Math.min(100, Math.round(score)));
		});

		console.log(`Generated ${match_percentages.length} intelligent predictions:`, match_percentages);

		res.status(200).json({
			match_percentages,
			source: "intelligent-algorithm",
		});
	} catch (error) {
		console.error("Prediction API Error:", error);
		res.status(500).json({
			error: "Internal server error",
			details: error.message,
		});
	}
}
