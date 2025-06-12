const fs = require("fs");
const path = require("path");

// Fake name generators
const maleNames = [
	"Arjun",
	"Aarav",
	"Vihaan",
	"Aditya",
	"Vivaan",
	"Krishna",
	"Ishaan",
	"Shaurya",
	"Atharv",
	"Advait",
	"Sai",
	"Aryan",
	"Reyansh",
	"Ayaan",
	"Hrithik",
	"Yash",
	"Vansh",
	"Rudra",
	"Karan",
	"Kabir",
	"Rohan",
	"Ansh",
	"Divyansh",
	"Dev",
	"Shivansh",
	"Harsh",
	"Rishabh",
	"Aarush",
	"Pranav",
	"Tejas",
	"Dhruv",
	"Arnav",
	"Vedant",
	"Parth",
	"Mohit",
	"Rahul",
	"Amit",
	"Nikhil",
	"Varun",
	"Shreyas",
];

const femaleNames = [
	"Aadhya",
	"Ananya",
	"Anika",
	"Saanvi",
	"Pihu",
	"Diya",
	"Prisha",
	"Anvi",
	"Kavya",
	"Ira",
	"Myra",
	"Sara",
	"Aanya",
	"Pari",
	"Fatima",
	"Riya",
	"Kiara",
	"Aisha",
	"Arya",
	"Navya",
	"Tara",
	"Ahana",
	"Zara",
	"Ishita",
	"Tanvi",
	"Vanya",
	"Khushi",
	"Avni",
	"Aditi",
	"Siya",
	"Shreya",
	"Manvi",
	"Hansika",
	"Dia",
	"Kimaya",
	"Hiral",
	"Keya",
	"Mahika",
	"Reet",
	"Nyra",
];

// Profile photo URLs (using a free API service that generates diverse avatars)
function generateProfilePhoto(name, gender) {
	// Using DiceBear API for consistent, professional-looking avatars
	const style = "avataaars"; // Professional avatar style
	const seed = name.toLowerCase().replace(/\s+/g, "");
	return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4&radius=50`;
}

// Age generator (realistic for flatmate hunting demographic)
function generateAge() {
	// Most flatmate hunters are between 22-32
	const ageRanges = [
		{ min: 22, max: 25, weight: 30 }, // Fresh graduates
		{ min: 26, max: 28, weight: 35 }, // Young professionals
		{ min: 29, max: 32, weight: 25 }, // Experienced professionals
		{ min: 33, max: 35, weight: 10 }, // Senior professionals
	];

	const random = Math.random() * 100;
	let cumulative = 0;

	for (const range of ageRanges) {
		cumulative += range.weight;
		if (random <= cumulative) {
			return (
				Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
			);
		}
	}

	return 25; // Fallback
}

function enhanceDataset() {
	try {
		// Read the existing CSV
		const csvPath = path.join(
			__dirname,
			"..",
			"public",
			"fake_flatmate_dataset_600_with_gender.csv"
		);
		const csvContent = fs.readFileSync(csvPath, "utf8");

		const lines = csvContent.trim().split("\n");
		const headers = lines[0].split(",");

		// Add new headers
		const newHeaders = ["Name", "Age", "ProfilePhoto", ...headers];

		const enhancedLines = [newHeaders.join(",")];

		// Track used names to avoid duplicates
		const usedMaleNames = new Set();
		const usedFemaleNames = new Set();

		// Process each data row
		for (let i = 1; i < lines.length; i++) {
			const row = lines[i].split(",");
			const gender = row[headers.indexOf("Gender")];

			// Generate unique name
			let name;
			if (gender === "Male") {
				const availableNames = maleNames.filter((n) => !usedMaleNames.has(n));
				if (availableNames.length === 0) {
					// Reset if we've used all names
					usedMaleNames.clear();
					name = maleNames[Math.floor(Math.random() * maleNames.length)];
				} else {
					name =
						availableNames[Math.floor(Math.random() * availableNames.length)];
				}
				usedMaleNames.add(name);
			} else {
				const availableNames = femaleNames.filter(
					(n) => !usedFemaleNames.has(n)
				);
				if (availableNames.length === 0) {
					// Reset if we've used all names
					usedFemaleNames.clear();
					name = femaleNames[Math.floor(Math.random() * femaleNames.length)];
				} else {
					name =
						availableNames[Math.floor(Math.random() * availableNames.length)];
				}
				usedFemaleNames.add(name);
			}

			const age = generateAge();
			const profilePhoto = generateProfilePhoto(name, gender);

			// Create enhanced row
			const enhancedRow = [name, age, profilePhoto, ...row];
			enhancedLines.push(enhancedRow.join(","));
		}

		// Write enhanced dataset
		const enhancedPath = path.join(
			__dirname,
			"..",
			"public",
			"enhanced_flatmate_dataset.csv"
		);
		fs.writeFileSync(enhancedPath, enhancedLines.join("\n"));

		console.log(
			`✅ Enhanced dataset created with ${enhancedLines.length - 1} records`
		);
		console.log(`📁 Saved to: ${enhancedPath}`);
		console.log(
			`📸 Profile photos: DiceBear API (${
				enhancedLines.length - 1
			} unique avatars)`
		);
		console.log(
			`👥 Age range: 22-35 years (realistic for flatmate demographic)`
		);
		console.log(
			`🏷️  Names: ${[...usedMaleNames].length} unique male, ${
				[...usedFemaleNames].length
			} unique female names`
		);

		return enhancedPath;
	} catch (error) {
		console.error("❌ Error enhancing dataset:", error);
		throw error;
	}
}

// Run the enhancement
if (require.main === module) {
	enhanceDataset();
}

module.exports = { enhanceDataset };
