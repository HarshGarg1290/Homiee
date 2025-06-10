// ML prediction API - calls external ML service
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5000";

async function callMLService(pairs) {
	try {
		console.log(`Calling ML service at ${ML_SERVICE_URL}...`);

		if (pairs.length === 0) return [];
		// Process each pair individually for unique predictions
		const predictions = [];

		for (let i = 0; i < pairs.length; i++) {
			const pair = pairs[i];
			const userData = {};
			const flatmateData = {};

			Object.keys(pair).forEach((key) => {
				if (key.startsWith("User_")) {
					// Remove User_ prefix and keep original casing for field names
					const userKey = key.replace("User_", "");
					userData[userKey] = pair[key];
				} else if (key.startsWith("Cand_")) {
					// Remove Cand_ prefix and keep original casing for field names
					const flatmateKey = key.replace("Cand_", "");
					flatmateData[flatmateKey] = pair[key];
				}
			}); // Call ML service for individual prediction
			const response = await fetch(`${ML_SERVICE_URL}/predict`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ user: userData, flatmate: flatmateData }),
				timeout: 10000,
			});

			if (!response.ok) {
				throw new Error(`ML service responded with status: ${response.status}`);
			}

			const result = await response.json();
			predictions.push(result.compatibility_score || 50);
		}
		console.log(`✅ ML Service: Generated ${predictions.length} predictions`);
		return predictions;
	} catch (error) {
		console.error("ML Service Error:", error.message);
		throw error;
	}
}

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}
	try {
		const pairs = req.body;
		if (!Array.isArray(pairs)) {
			return res.status(400).json({ error: "Request body must be an array" });
		}
		console.log(`Processing ${pairs.length} prediction requests...`);

		const match_percentages = await callMLService(pairs);
		return res.status(200).json({
			match_percentages,
			source: "ml-service",
		});
	} catch (error) {
		console.error("Prediction API Error:", error);
		res.status(500).json({
			error: "Internal server error",
			details: error.message,
		});
	}
}
