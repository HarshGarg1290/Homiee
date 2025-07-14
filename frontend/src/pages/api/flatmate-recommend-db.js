/**
 * Flatmate Recommendation API - Database Powered
 * Proxies requests to the backend database service
 */
export default async function handler(req, res) {
	const startTime = Date.now();
	if (req.method !== "POST") return res.status(405).end();
	try {
		const userProfile = req.body;
		console.log("📝 Proxying flatmate search to backend for:", userProfile.email);
		// Forward request to backend database service
		const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
		const response = await fetch(`${backendUrl}/api/flatmates/matches`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userProfile)
		});
		if (!response.ok) {
			throw new Error(`Backend API failed with status: ${response.status}`);
		}
		const data = await response.json();
		const responseTime = Date.now() - startTime;
		console.log(`✅ Found ${data.matches?.length || 0} matches in ${responseTime}ms`);
		return res.status(200).json({
			...data,
			responseTime: responseTime,
			source: 'database'
		});
	} catch (error) {
		console.error("❌ Flatmate API Error:", error);
		return res.status(500).json({
			error: "Failed to find flatmate matches",
			details: error.message,
			matches: []
		});
	}
}