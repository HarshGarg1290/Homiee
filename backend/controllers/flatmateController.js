import prisma from '../lib/prisma.js';
import fetch from 'node-fetch';

// ML Service Configuration
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Budget compatibility function
const budgetOrder = [
  "<15000",
  "15000-20000",
  "20000-25000",
  "25000-30000",
  "30000-40000",
  "40000+"
];

function isBudgetCompatible(userBudget, candidateBudget) {
  const userIdx = budgetOrder.indexOf(userBudget);
  const candIdx = budgetOrder.indexOf(candidateBudget);
  return Math.abs(userIdx - candIdx) <= 1; // Within 1 range
}

// Enhanced compatibility scoring using ML Service
async function getMLCompatibilityScores(userProfile, candidates) {
  console.log("🤖 Using ML service for compatibility prediction...");
  
  // Prepare data for ML service (expects array of user-candidate pairs)
  const mlRequestData = candidates.map(candidate => ({
    user: {
      age: userProfile.age,
      city: userProfile.city,
      locality: userProfile.locality,
      gender: userProfile.gender,
      budget: userProfile.budget,
      sleepPattern: userProfile.sleepPattern,
      dietaryPrefs: userProfile.dietaryPrefs,
      smokingHabits: userProfile.smokingHabits,
      drinkingHabits: userProfile.drinkingHabits,
      personalityType: userProfile.personalityType,
      socialStyle: userProfile.socialStyle,
      hostingStyle: userProfile.hostingStyle,
      weekendStyle: userProfile.weekendStyle,
      cleanliness: userProfile.cleanliness,
      petOwnership: userProfile.petOwnership,
      petPreference: userProfile.petPreference,
      hobbies: userProfile.hobbies || [],
      interests: userProfile.interests || [],
      musicGenres: userProfile.musicGenres || [],
      sportsActivities: userProfile.sportsActivities || [],
      languagesSpoken: userProfile.languagesSpoken || []
    },
    candidate: {
      age: candidate.age,
      city: candidate.city,
      locality: candidate.locality,
      gender: candidate.gender,
      budget: candidate.budget,
      sleepPattern: candidate.sleepPattern,
      dietaryPrefs: candidate.dietaryPrefs,
      smokingHabits: candidate.smokingHabits,
      drinkingHabits: candidate.drinkingHabits,
      personalityType: candidate.personalityType,
      socialStyle: candidate.socialStyle,
      hostingStyle: candidate.hostingStyle,
      weekendStyle: candidate.weekendStyle,
      cleanliness: candidate.cleanliness,
      petOwnership: candidate.petOwnership,
      petPreference: candidate.petPreference,
      hobbies: candidate.hobbies || [],
      interests: candidate.interests || [],
      musicGenres: candidate.musicGenres || [],
      sportsActivities: candidate.sportsActivities || [],
      languagesSpoken: candidate.languagesSpoken || []
    }
  }));

  // Call ML service
  const response = await fetch(`${ML_SERVICE_URL}/predict-enhanced`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mlRequestData),
    timeout: 30000 // 30 second timeout
  });

  if (!response.ok) {
    throw new Error(`ML service responded with status: ${response.status}`);
  }

  const result = await response.json();
  console.log(`✅ ML service returned ${result.match_percentages?.length || 0} predictions`);
  
  return result.match_percentages || [];
}

export async function findFlatmateMatches(req, res) {
  try {
    const userProfile = req.body;
    console.log("🔍 Finding flatmate matches for:", userProfile.email);
    // Validate required fields
    const requiredFields = ['city', 'locality', 'budget', 'gender', 'id'];
    const missingFields = requiredFields.filter(field => !userProfile[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }    const candidates = await prisma.user.findMany({
      where: {
        id: { not: userProfile.id }, // Exclude self
        city: userProfile.city,       // Same city (only hardcoded filter)
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        age: true,
        gender: true,
        profession: true,
        bio: true,
        city: true,
        locality: true,
        budget: true,
        sleepPattern: true,
        dietaryPrefs: true,
        cleanliness: true,
        smokingHabits: true,
        drinkingHabits: true,
        personalityType: true,
        socialStyle: true,
        hostingStyle: true,
        weekendStyle: true,
        hobbies: true,
        interests: true,
        musicGenres: true,
        sportsActivities: true,
        languagesSpoken: true,
        petOwnership: true,
        petPreference: true,
        createdAt: true
      }
    });
    console.log(`📊 Found ${candidates.length} candidates in ${userProfile.city}`);
    
    // If no candidates found in the city, provide helpful message
    if (candidates.length === 0) {
      return res.json({
        matches: [],
        total: 0,
        message: `No other users found in ${userProfile.city}. Try expanding your search to nearby cities or be the first to connect with flatmates when they join in your area!`,
        suggestion: `Consider broadening your location preferences or inviting friends to join Homiee in ${userProfile.city}.`
      });
    }

    // Essential pre-filtering (only practical necessities)
    const filteredCandidates = candidates.filter(candidate => {
      // 1. Budget compatibility (financial feasibility)
      const budgetMatch = isBudgetCompatible(userProfile.budget, candidate.budget);
      
      // 2. Gender preference (user safety/preference)
      const genderMatch = userProfile.gender === "Both" ||
                         candidate.gender === userProfile.gender ||
                         candidate.gender === "Both";
      
      return budgetMatch && genderMatch;
    });
    
    console.log(`✅ ${filteredCandidates.length} candidates after essential pre-filtering (budget + gender)`);
    
    // If no candidates after essential filtering
    if (filteredCandidates.length === 0) {
      return res.json({
        matches: [],
        total: 0,
        message: `Found ${candidates.length} users in ${userProfile.city}, but none match your essential criteria (budget: ${userProfile.budget}, gender preference).`,
        suggestion: `Try adjusting your budget range or gender preferences for more matches.`
      });
    }

    // Use ML service for compatibility scoring - pure ML approach
    console.log("🤖 Getting ML predictions for all candidates...");
    
    let compatibilityScores;
    try {
      compatibilityScores = await getMLCompatibilityScores(userProfile, filteredCandidates);
    } catch (error) {
      console.error("❌ ML service failed:", error.message);
      return res.status(503).json({
        error: "ML service temporarily unavailable",
        message: "Please try again in a few moments",
        details: "Our recommendation engine is currently being updated"
      });
    }
    
    // Create matches with ML-predicted scores only
    const matches = filteredCandidates.map((candidate, index) => {
      const mlScore = compatibilityScores[index];
      
      return {
        candidate: {
          Name: candidate.name || `${candidate.firstName} ${candidate.lastName}`.trim(),
          Age: candidate.age,
          Gender: candidate.gender,
          Profession: candidate.profession,
          Bio: candidate.bio,
          City: candidate.city,
          Locality: candidate.locality,
          Location: candidate.locality, // For compatibility
          Budget: candidate.budget,
          SleepPattern: candidate.sleepPattern,
          DietaryPrefs: candidate.dietaryPrefs,
          Cleanliness: candidate.cleanliness,
          SmokingHabits: candidate.smokingHabits,
          DrinkingHabits: candidate.drinkingHabits,
          AlcoholUsage: candidate.drinkingHabits, // For compatibility
          PersonalityType: candidate.personalityType,
          SocialStyle: candidate.socialStyle,
          HostingStyle: candidate.hostingStyle,
          WeekendStyle: candidate.weekendStyle,
          MusicPrefs: candidate.musicGenres?.join(', ') || '',
          SleepTime: candidate.sleepPattern,
          Hobbies: candidate.hobbies?.join(', ') || '',
          Interests: candidate.interests?.join(', ') || '',
          Sports: candidate.sportsActivities?.join(', ') || '',
          Languages: candidate.languagesSpoken?.join(', ') || '',
          PetOwnership: candidate.petOwnership,
          PetPreference: candidate.petPreference,
          ProfilePhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name || 'User')}&background=49548a&color=fff&size=200`
        },
        match_percentage: mlScore
      };
    });
    // Sort by compatibility score (highest first)
    matches.sort((a, b) => b.match_percentage - a.match_percentage);
    // Return top 10 matches
    const topMatches = matches.slice(0, 10);
    res.json({
      matches: topMatches,
      total: filteredCandidates.length,
      message: `Found ${topMatches.length} ML-powered compatible flatmates`
    });
  } catch (error) {
    console.error("❌ Flatmate matching error:", error);
    res.status(500).json({
      error: "Failed to find flatmate matches",
      details: error.message
    });
  }
}