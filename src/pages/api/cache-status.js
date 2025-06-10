import apiCache from "../../lib/cache.js";

export default function handler(req, res) {
	if (req.method === "GET") {
		// Get cache statistics
		const stats = apiCache.getStats();
		res.status(200).json({
			cache: {
				...stats,
				ttl: "5 minutes",
				status: "active",
			},
		});
	} else if (req.method === "DELETE") {
		// Clear cache
		apiCache.clear();
		res.status(200).json({
			message: "Cache cleared successfully",
			cache: {
				size: 0,
				status: "cleared",
			},
		});
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
