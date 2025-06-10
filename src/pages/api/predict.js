// Real ML predictions using Python model via child process
import { spawn } from "child_process";
import path from "path";

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

		// Call Python script to get real ML predictions
		const pythonScript = path.join(process.cwd(), "ml_predict.py");
		const python = spawn("python", [pythonScript]);

		let pythonOutput = "";
		let pythonError = "";

		// Send data to Python script
		python.stdin.write(JSON.stringify(pairs));
		python.stdin.end();

		// Collect output
		python.stdout.on("data", (data) => {
			pythonOutput += data.toString();
		});

		python.stderr.on("data", (data) => {
			pythonError += data.toString();
		});

		// Handle completion
		python.on("close", (code) => {
			if (code !== 0) {
				console.error("Python script error:", pythonError);
				// Fallback to random predictions if Python fails
				const match_percentages = pairs.map(() => {
					return Math.floor(Math.random() * 70) + 30;
				});

				return res.status(200).json({
					match_percentages,
					source: "fallback-random",
					warning: "ML model unavailable, using fallback predictions",
				});
			}

			try {
				const result = JSON.parse(pythonOutput);
				console.log(
					`Successfully generated ${result.match_percentages.length} ML predictions`
				);

				res.status(200).json({
					match_percentages: result.match_percentages,
					source: "ml-model",
				});
			} catch (parseError) {
				console.error("Error parsing Python output:", parseError);
				// Fallback to random predictions
				const match_percentages = pairs.map(() => {
					return Math.floor(Math.random() * 70) + 30;
				});

				res.status(200).json({
					match_percentages,
					source: "fallback-random",
					warning: "ML parsing error, using fallback predictions",
				});
			}
		});
	} catch (error) {
		console.error("Prediction API Error:", error);
		res.status(500).json({
			error: "Internal server error",
			details: error.message,
		});
	}
}
