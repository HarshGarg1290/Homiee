/**
 * Maps user profile data to ML model format for flatmate matching
 */

// Mapping functions for profile data to ML format
export const mapDietaryPreference = (dietaryPrefs) => {
  const mapping = {
    'Vegetarian': 'Vegetarian',
    'Non-Vegetarian': 'Non Vegetarian', 
    'Vegan': 'Vegan',
    'Pescetarian': 'Pescetarian',
    'Veg + Eggs': 'Veg + Eggs',
    'Jain': 'Vegetarian' // Map Jain to Vegetarian for ML model
  };
  return mapping[dietaryPrefs] || 'Vegetarian';
};

export const mapCleanlinessLevel = (cleanliness) => {
  // Convert numeric cleanliness (1-5) to ML model categories
  const mapping = {
    1: 'Let the dust rot',        // Very Messy
    2: 'Chaotic',                 // Messy  
    3: 'Messy but not unhygienic', // Average
    4: 'Organised',               // Clean
    5: 'Organised'                // Very Clean
  };
  return mapping[cleanliness] || 'Messy but not unhygienic';
};

export const mapSmokeAndDrink = (smokingHabits, drinkingHabits) => {
  // Combine smoking and drinking habits from new consolidated fields
  const isSmoker = ['Occasionally', 'Regularly'].includes(smokingHabits);
  const isRegularDrinker = ['Regularly', 'Socially'].includes(drinkingHabits);
  
  if (isSmoker && isRegularDrinker) return 'Both';
  if (isSmoker) return 'Smoke';
  if (isRegularDrinker) return 'Drink';
  return 'Neither';
};

export const mapSaturdayActivity = (socialStyle, weekendStyle, personalityType, hobbies, interests) => {
  // Use new optimized fields for weekend activity preference
  if (weekendStyle) {
    // Direct mapping from new weekendStyle field
    return weekendStyle;
  }
  
  // Fallback to derived logic if weekendStyle not set
  const isOutgoing = personalityType === 'Extrovert' || socialStyle === 'Party Person';
  const likesMusic = hobbies.includes('Music') || hobbies.includes('Dancing');
  const isPartyPerson = socialStyle === 'Party Person';
  
  if (isPartyPerson || (isOutgoing && likesMusic)) {
    return 'Clubbing';
  } else if (personalityType === 'Homebody' || socialStyle === 'Homebody') {
    return 'Chill at home';
  } else if (isOutgoing) {
    return 'House parties';
  } else {
    return 'Based on vibe';
  }
};

export const mapGuestHostPreference = (hostingStyle, socialStyle) => {
  // Use new optimized hosting preference field
  if (hostingStyle) {
    return hostingStyle;
  }
  
  // Fallback logic
  const isExtrovert = socialStyle === 'Social';
  
  if (isExtrovert || socialStyle === 'Party Person') {
    return 'I like hosting';
  } else {
    return 'I like being guest';
  }
};

/**
 * Main function to convert user profile to ML model format
 */
export const convertProfileToMLFormat = (userProfile) => {
  return {
    City: userProfile.city,
    Locality: userProfile.locality, // Updated: location -> locality
    Budget: userProfile.budget,
    "Eating Preference": mapDietaryPreference(userProfile.dietaryPrefs),
    "Cleanliness Spook": mapCleanlinessLevel(userProfile.cleanliness),
    "Smoke/Drink": mapSmokeAndDrink(userProfile.smokingHabits, userProfile.drinkingHabits), // Updated fields
    "Saturday Twin": mapSaturdayActivity(
      userProfile.socialStyle,    // New field
      userProfile.weekendStyle,   // New field
      userProfile.personalityType,
      userProfile.hobbies || [],
      userProfile.interests || []
    ),
    "Guest/Host": mapGuestHostPreference(userProfile.hostingStyle, userProfile.socialStyle), // Updated fields
    Gender: userProfile.gender === 'Prefer not to say' ? 'Both' : userProfile.gender
  };
};

/**
 * Validate that user profile has required fields for ML matching
 */
export const validateProfileForML = (userProfile) => {
  const requiredFields = ['city', 'locality', 'budget', 'dietaryPrefs', 'gender']; // Updated: location -> locality
  const missingFields = requiredFields.filter(field => !userProfile[field]);
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};
