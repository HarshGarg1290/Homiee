export const CORE_PROFILE_FIELDS = [
  'city',
  'locality',
  'budget',
  'gender'
];
export const ESSENTIAL_PROFILE_FIELDS = [
  ...CORE_PROFILE_FIELDS,
  'sleepPattern',
  'dietaryPrefs',
  'smokingHabits',
  'drinkingHabits',
  'personalityType',
  'socialStyle'
];
export const ENHANCED_PROFILE_FIELDS = [
  ...ESSENTIAL_PROFILE_FIELDS,
  'hostingStyle',
  'weekendStyle',
  'petOwnership',
  'petPreference',
  'cleanliness'
];
export const OPTIONAL_PROFILE_FIELDS = [
  'hobbies',
  'interests',
  'musicGenres',
  'sportsActivities',
  'languagesSpoken',
  'bio',
  'profession',
  'age'
];
export function validateCoreProfile(userProfile) {
  if (!userProfile) {
    return {
      isValid: false,
      missingFields: CORE_PROFILE_FIELDS,
      completionPercentage: 0
    };
  }
  const missingFields = CORE_PROFILE_FIELDS.filter(field =>
    !userProfile[field] || userProfile[field] === ''
  );
  return {
    isValid: missingFields.length === 0,
    missingFields,
    completionPercentage: Math.round(((CORE_PROFILE_FIELDS.length - missingFields.length) / CORE_PROFILE_FIELDS.length) * 100)
  };
}
/**
 * Validate if user has completed enhanced profile for ML matching
 * @param {Object} userProfile - User profile object
 * @returns {Object} - Validation result with isValid and missingFields
 */
function isFieldEmpty(value, fieldName) {
  if (value === null || value === undefined || value === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'string' && (value === '[]' || value.trim() === '')) return true;
  if (fieldName === 'cleanliness' && (value === 0 || value < 1)) return true;
  if (typeof value === 'number' && isNaN(value)) return true;
  return false;
}
export function validateEnhancedProfile(userProfile) {
  if (!userProfile) {
    return {
      isValid: false,
      missingFields: ENHANCED_PROFILE_FIELDS,
      completionPercentage: 0
    };
  }
  const missingFields = ENHANCED_PROFILE_FIELDS.filter(field => {
    const value = userProfile[field];
    return isFieldEmpty(value, field);
  });
  return {
    isValid: missingFields.length === 0,
    missingFields,
    completionPercentage: Math.round(((ENHANCED_PROFILE_FIELDS.length - missingFields.length) / ENHANCED_PROFILE_FIELDS.length) * 100)
  };
}
export function validateEssentialProfile(userProfile) {
  if (!userProfile) {
    return {
      isValid: false,
      missingFields: ESSENTIAL_PROFILE_FIELDS,
      completionPercentage: 0
    };
  }
  const missingFields = ESSENTIAL_PROFILE_FIELDS.filter(field => {
    const value = userProfile[field];
    return isFieldEmpty(value, field);
  });
  return {
    isValid: missingFields.length === 0,
    missingFields,
    completionPercentage: Math.round(((ESSENTIAL_PROFILE_FIELDS.length - missingFields.length) / ESSENTIAL_PROFILE_FIELDS.length) * 100)
  };
}