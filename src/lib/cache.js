/**
 * In-memory caching system for flatmate recommendations
 * Provides fast responses for repeated API calls
 */

class APICache {
	constructor(ttl = 5 * 60 * 1000) {
		// 5 minutes default TTL
		this.cache = new Map();
		this.ttl = ttl;
	}

	/**
	 * Generate a cache key from user data
	 */
	generateKey(userData) {
		const keyData = {
			city: userData.City,
			locality: userData.Locality,
			budget: userData.Budget,
			eating: userData["Eating Preference"],
			cleanliness: userData["Cleanliness Spook"],
			smokeDrink: userData["Smoke/Drink"],
			saturday: userData["Saturday Twin"],
			guestHost: userData["Guest/Host"],
			gender: userData.Gender,
		};

		return JSON.stringify(keyData);
	}

	/**
	 * Get cached result if available and not expired
	 */
	get(key) {
		const cached = this.cache.get(key);
		if (!cached) {
			return null;
		}

		if (Date.now() > cached.expires) {
			this.cache.delete(key);
			return null;
		}

		return cached.data;
	}

	/**
	 * Store result in cache with TTL
	 */
	set(key, data) {
		this.cache.set(key, {
			data,
			expires: Date.now() + this.ttl,
			created: Date.now(),
		});
	}

	/**
	 * Clear all cached data
	 */
	clear() {
		this.cache.clear();
	}

	/**
	 * Get cache statistics
	 */
	getStats() {
		return {
			size: this.cache.size,
			keys: Array.from(this.cache.keys()).map((key) => ({
				key: key.substring(0, 100) + (key.length > 100 ? "..." : ""),
				expires: this.cache.get(key).expires,
				created: this.cache.get(key).created,
			})),
		};
	}
}

// Create a singleton cache instance
const apiCache = new APICache();

export default apiCache;
