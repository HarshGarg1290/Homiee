// Navigation menu items configuration
export const menuItems = [
	{
		href: "#community",
		text: "Find Your Tribe",
		section: "community",
	},
	{
		href: "#flatmates",
		text: "Find Flatmates",
		route: "/flatmates",
	},
	{
		href: "#flats",
		text: "Find Flats",
		route: "/flats",
	},
	{
		href: "#events",
		text: "Community",
		section: "events",
	},
];

// Services data for How It Works section
export const servicesData = [
	{
		image: "/findflatmate.png",
		title: "Connect with Like-Minded People",
		description:
			"Our intelligent matching system connects you with potential flatmates who share your interests, values, and lifestyle preferences.",
		route: "/flatmates",
	},
	{
		image: "/findflat.png",
		title: "Find Your Ideal Home",
		description:
			"Discover flats that match your budget, location preferences, and lifestyle, ensuring a perfect fit for your new chapter.",
		route: "/flats",
	},
	{
		image: "/tribe.png",
		title: "Build Your Community",
		description:
			"Get personalized recommendations for local events, communities, and hidden gems, making your city feel like home.",
		route: null,
	},
];

// Features data
export const featuresData = [
	{
		iconName: "User",
		title: "Tribe-Based Matching",
		description:
			"Find your tribe first, then find a home together. Our algorithm matches you with people who share your lifestyle, interests, and values.",
	},
	{
		iconName: "Search",
		title: "Smart Flat Discovery",
		description:
			"Once you've found your tribe, discover flats together that meet everyone's criteria, budget, and location preferences.",
	},
	{
		iconName: "Heart",
		title: "Local Community Integration",
		description:
			"Discover local events, communities, and activities that match your interests. Turn your new city into your second home.",
	},
];

// Events data
export const eventsData = [
	{ image: "/gym.png", title: "Fitness & Wellness" },
	{ image: "/concert.png", title: "Music & Arts" },
	{ image: "/club.png", title: "Nightlife & Social" },
	{ image: "/hero.png", title: "Local Activities" },
];

// Footer links
export const footerLinks = ["About", "Contact", "Terms of Service", "Privacy Policy"];
