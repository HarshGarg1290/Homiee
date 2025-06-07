const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");


const sourcePath = path.join(__dirname,  "public", "fake_flatmate_dataset_with_gender.csv");
const outputPath = path.join(__dirname,  "public", "flatmate_matches.csv");

const raw = fs.readFileSync(sourcePath, "utf8");
const { data } = Papa.parse(raw, { header: true, skipEmptyLines: true });


const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];


const weights = {
  City: 5,
  Locality: 5,
  Gender: 5,
  Budget: 4,
  "Eating Preference": 2,
  "Cleanliness Spook": 1,
  "Smoke/Drink": 1,
  "Saturday Twin": 1,
  "Guest/Host": 1,
};
const allFields = Object.keys(weights);


const N = 300; 
const rows = [];
const header = [
  "User_City","User_Locality","User_Budget","User_Eating","User_Cleanliness","User_SmokeDrink","User_Saturday","User_GuestHost","User_Gender",
  "Cand_City","Cand_Locality","Cand_Budget","Cand_Eating","Cand_Cleanliness","Cand_SmokeDrink","Cand_Saturday","Cand_GuestHost","Cand_Gender",
  "Match_Percentage"
];
rows.push(header.join(","));

for (let i = 0; i < N; i++) {
  // 50% of the time, force a must-match
  let user = pickRandom(data);
  let candidate;
  if (Math.random() < 0.5) {
    // Find a candidate with same City, Locality, Gender (other than user)
    const candidates = data.filter(
      d =>
        d !== user &&
        d.City === user.City &&
        d.Locality === user.Locality &&
        d.Gender === user.Gender
    );
    candidate = candidates.length ? pickRandom(candidates) : pickRandom(data);
  } else {
    candidate = pickRandom(data);
    while (candidate === user) candidate = pickRandom(data);
  }


  const mustMatchFields = ["City", "Locality", "Gender"];
  const allMustMatch = mustMatchFields.every(
    field => (user[field] || "").trim().toLowerCase() === (candidate[field] || "").trim().toLowerCase()
  );

  let matchPercent = 0;
  if (allMustMatch) {

    let score = 0, maxScore = 0;
    for (const field of allFields) {
      maxScore += weights[field];
      if ((user[field] || "").trim().toLowerCase() === (candidate[field] || "").trim().toLowerCase()) {
        score += weights[field];
      }
    }
    matchPercent = Math.round((score / maxScore) * 100);
  }

  const row = [
    user["City"], user["Locality"], user["Budget"], user["Eating Preference"], user["Cleanliness Spook"], user["Smoke/Drink"], user["Saturday Twin"], user["Guest/Host"], user["Gender"],
    candidate["City"], candidate["Locality"], candidate["Budget"], candidate["Eating Preference"], candidate["Cleanliness Spook"], candidate["Smoke/Drink"], candidate["Saturday Twin"], candidate["Guest/Host"], candidate["Gender"],
    matchPercent
  ];
  rows.push(row.map(x => `"${String(x || "").replace(/"/g, '""')}"`).join(","));
}

fs.writeFileSync(outputPath, rows.join("\n"), "utf8");
console.log(`Generated ${N} pairs with match percentage in ${outputPath}`);