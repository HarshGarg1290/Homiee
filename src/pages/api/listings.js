import { google } from "googleapis";

// Fix the private key issue (common problem with environment variables)
const credentials = require("../../../google-cred.json");

// Add better error handling
export default async function handler(req, res) {
	try {
		// Check if the environment variable exists
		const spreadsheetId = process.env.GOOGLE_SHEET_ID;
		if (!spreadsheetId) {
			console.error("GOOGLE_SHEET_ID environment variable is not set");
			return res.status(500).json({ error: "Spreadsheet ID not configured" });
		}

		// Configure auth client
		const auth = new google.auth.JWT(
			credentials.client_email,
			null,
			credentials.private_key,
			["https://www.googleapis.com/auth/spreadsheets.readonly"]
		);

		// Create sheets client
		const sheets = google.sheets({ version: "v4", auth });

		// Add more debugging
		console.log(`Attempting to fetch data from spreadsheet: ${spreadsheetId}`);

		const response = await sheets.spreadsheets.values.get({
			spreadsheetId,
			range: "Sheet1!A1:G100",
		});

		// Get headers and rows
		const rows = response.data.values;
		if (!rows || rows.length === 0) {
			return res.status(404).json({ error: "No data found" });
		}

		// First row contains headers
		const headers = rows[0];

		// Convert rows to objects with header keys
		const listings = rows.slice(1).map((row) => {
			return headers.reduce((obj, header, index) => {
				obj[header.trim()] = row[index] || "";
				return obj;
			}, {});
		});

		return res.status(200).json(listings);
	} catch (error) {
		// More detailed error logging
		console.error("Google Sheets API Error:", error);
		console.error("Error details:", JSON.stringify(error, null, 2));
		return res.status(500).json({ error: error.message });
	}
}
