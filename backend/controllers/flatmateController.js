import prisma from '../lib/prisma.js';
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
// Enhanced compatibility scoring
function calculateCompatibilityScore(user, candidate) {
  let score = 0;
  let maxScore = 0;
  // Age compatibility (20 points)
  maxScore += 20;
  if (user.age && candidate.age) {
    const ageDiff = Math.abs(user.age - candidate.age);
    if (ageDiff <= 2) score += 20;
    else if (ageDiff <= 5) score += 15;
    else if (ageDiff <= 10) score += 10;
    else score += 5;
  }
  // Lifestyle preferences (60 points total)
  const lifestyleFactors = [
    { user: user.sleepPattern, candidate: candidate.sleepPattern, weight: 10 },
    { user: user.dietaryPrefs, candidate: candidate.dietaryPrefs, weight: 10 },
    { user: user.smokingHabits, candidate: candidate.smokingHabits, weight: 15 },
    { user: user.drinkingHabits, candidate: candidate.drinkingHabits, weight: 15 },
    { user: user.socialStyle, candidate: candidate.socialStyle, weight: 10 }
  ];
  lifestyleFactors.forEach(factor => {
    maxScore += factor.weight;
    if (factor.user === factor.candidate) {
      score += factor.weight;
    } else if (factor.user && factor.candidate) {
      score += factor.weight * 0.3; // Partial match
    }
  });
  // Cleanliness compatibility (10 points)
  maxScore += 10;
  if (user.cleanliness && candidate.cleanliness) {
    const cleanDiff = Math.abs(user.cleanliness - candidate.cleanliness);
    if (cleanDiff === 0) score += 10;
    else if (cleanDiff === 1) score += 8;
    else if (cleanDiff === 2) score += 5;
    else score += 2;
  }
  // Interest overlap (10 points)
  maxScore += 10;
  const userInterests = [...(user.hobbies || []), ...(user.interests || [])];
  const candidateInterests = [...(candidate.hobbies || []), ...(candidate.interests || [])];
  const commonInterests = userInterests.filter(interest =>
    candidateInterests.includes(interest)
  );
  if (commonInterests.length > 0) {
    score += Math.min(10, commonInterests.length * 2);
  }
  return Math.round((score / maxScore) * 100);
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
        city: userProfile.city,       // Same city
        // We'll do budget and gender filtering in JavaScript for more flexibility
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
    // Advanced filtering
    const filteredCandidates = candidates.filter(candidate => {
      // Location match (city + locality preference)
      const locationMatch = candidate.city === userProfile.city;
      // Budget compatibility
      const budgetMatch = isBudgetCompatible(userProfile.budget, candidate.budget);
      // Gender preference
      const genderMatch = userProfile.gender === "Both" ||
                         candidate.gender === userProfile.gender ||
                         candidate.gender === "Both";
      return locationMatch && budgetMatch && genderMatch;
    });
    console.log(`✅ ${filteredCandidates.length} candidates after filtering`);
    // If no matches after filtering, provide specific feedback
    if (filteredCandidates.length === 0) {
      return res.json({
        matches: [],
        total: 0,
        message: `Found ${candidates.length} users in ${userProfile.city}, but none match your preferences for budget (${userProfile.budget}) and other criteria.`,
        suggestion: `Try adjusting your budget range or other preferences for more matches.`
      });
    }
    if (filteredCandidates.length === 0) {
      return res.json({ matches: [], message: "No compatible flatmates found" });
    }
    // Calculate compatibility scores
    const matches = filteredCandidates.map(candidate => {
      const compatibilityScore = calculateCompatibilityScore(userProfile, candidate);
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
        match_percentage: compatibilityScore
      };
    });
    // Sort by compatibility score (highest first)
    matches.sort((a, b) => b.match_percentage - a.match_percentage);
    // Return top 10 matches
    const topMatches = matches.slice(0, 10);
    console.log(`🎯 Returning ${topMatches.length} matches with scores: ${topMatches.map(m => m.match_percentage).join(', ')}`);
    res.json({
      matches: topMatches,
      total: filteredCandidates.length,
      message: `Found ${topMatches.length} compatible flatmates`
    });
  } catch (error) {
    console.error("❌ Flatmate matching error:", error);
    res.status(500).json({
      error: "Failed to find flatmate matches",
      details: error.message
    });
  }
}