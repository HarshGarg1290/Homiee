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

// Profile Setup Form Data
export const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];

export const professionOptions = [
  "Student", "Software Engineer", "Doctor", "Teacher", "Business", 
  "Designer", "Marketing", "Finance", "Other"
];

export const cities = [
  "Delhi", "Gurgaon", "Noida", "Bangalore", "Mumbai", 
  "Pune", "Chennai", "Hyderabad", "Kolkata"
];

export const cityToLocalities = {
  Delhi: ["North Delhi", "Central Delhi", "East Delhi", "South Delhi", "West Delhi", "New Delhi"],
  Mumbai: ["Lower Parel/Worli", "Marine/Colaba", "Bandra", "Andheri E", "Andheri W", "Borivali/Kandivali", "Vile Parle"],
  Gurgaon: ["DLF 4", "DLF 2", "DLF 5", "Sector 18", "Sector 50", "Sector 48", "Udyog Vihar"],
  Noida: ["Sector 62", "Sector 137", "Sector 76/77/78", "Sector 18", "Sector 15/16"],
  Bangalore: ["Koramangala", "HSR Layout", "Marathalli", "Whitefield", "Electronic City", "Indiranagar"],
  Pune: ["Koregaon Park", "Viman Nagar", "Baner", "Wakad", "Hadapsar", "Kharadi"],
  Chennai: ["Anna Nagar", "T Nagar", "Velachery", "OMR", "Adyar", "Nungambakkam"]
};

export const dietaryPrefs = ["Vegetarian", "Non-Vegetarian", "Vegan", "Pescetarian", "Veg + Eggs", "Jain"];

export const smokingHabits = ["Never", "Occasionally", "Regularly"];

export const drinkingHabits = ["Never", "Occasionally", "Socially", "Regularly", "Prefer not to say"];

export const personalityTypes = ["Introvert", "Extrovert", "Ambivert", "Social Butterfly", "Homebody"];

export const socialStyles = ["Party Person", "Homebody", "Social", "Balanced"];

export const hostingStyles = ["I like hosting", "I like being guest", "Either is fine"];

export const weekendStyles = ["Clubbing/Going Out", "House Party Scenes", "Chill stay at home", "Based on my vibe"];

export const petOwnership = ["Own pets", "No pets", "Open to pets"];

export const petPreferences = ["Love pets", "Okay with pets", "No pets please"];

export const budgetRanges = [
  "<15000",
  "15000-20000", 
  "20000-25000",
  "25000-30000",
  "30000-40000",
  "40000+"
];

export const sleepPatterns = ["Early Bird", "Night Owl", "Flexible"];

export const hobbiesOptions = [
  "Reading", "Gaming", "Cooking", "Photography", "Traveling", "Art", "Music", "Dancing",
  "Writing", "Blogging", "Yoga", "Meditation", "Gardening", "Crafting"
];

export const interestsOptions = [
  "Technology", "Sports", "Movies", "Food", "Fashion", "Politics", "Environment",
  "Science", "History", "Philosophy", "Psychology", "Business", "Startups"
];

export const musicGenres = [
  "Pop", "Rock", "Classical", "Hip-Hop", "Electronic", "Jazz", "Country",
  "Bollywood", "Indie", "R&B", "Reggae", "Folk"
];

export const sportsActivities = [
  "Cricket", "Football", "Basketball", "Tennis", "Gym", "Running", "Swimming",
  "Badminton", "Cycling", "Yoga", "Dance", "Martial Arts"
];

export const languages = [
  "English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", 
  "Gujarati", "Kannada", "Malayalam", "Punjabi"
];