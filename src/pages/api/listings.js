import { google } from "googleapis";

export default async function handler(req, res) {
	try {
		const spreadsheetId = process.env.GOOGLE_SHEET_ID;
		if (!spreadsheetId) {
			return res.status(500).json({ error: "Spreadsheet ID not configured" });
		}

		const client_email = process.env.GOOGLE_CLIENT_EMAIL;
		const private_key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

		if (!client_email || !private_key) {
			return res
				.status(500)
				.json({ error: "Google credentials not configured" });
		}

		const auth = new google.auth.JWT(client_email, null, private_key, [
			"https://www.googleapis.com/auth/spreadsheets.readonly",
		]);

		const sheets = google.sheets({ version: "v4", auth });

		const response = await sheets.spreadsheets.values.get({
			spreadsheetId,
			range: "Sheet1!A1:G100",
		});

		const rows = response.data.values;
		if (!rows || rows.length === 0) {
			return res.status(404).json({ error: "No data found" });
		}

		const headers = rows[0];
		const listings = rows.slice(1).map((row) => {
			return headers.reduce((obj, header, index) => {
				obj[header.trim()] = row[index] || "";
				return obj;
			}, {});
		});

		return res.status(200).json(listings);
	} catch (error) {
		console.error("Google Sheets API Error:", error);
		return res.status(500).json({ error: error.message });
	}
}
