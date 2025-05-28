import fs from "fs";
import path from "path";
import csv from "csvtojson";

export default async function handler(req, res) {
	try {
		const filePath = path.join(
			process.cwd(),
			"public",
			"Homiee - Whatsapp Data.csv"
		);
		const jsonArray = await csv().fromFile(filePath);
		res.status(200).json(jsonArray);
	} catch (error) {
		console.error("Error loading CSV:", error);
		res.status(500).json({ error: "Failed to load data" });
	}
}
