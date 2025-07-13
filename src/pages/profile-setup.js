import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { 
  User, MapPin, Home, Heart, Music, 
  ChevronLeft, ChevronRight, Calendar,
  Clock, Utensils, Wine, Cigarette,
  Dog, PartyPopper, Sparkles, Languages
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];
const professionOptions = ["Student", "Software Engineer", "Doctor", "Teacher", "Business", "Designer", "Marketing", "Finance", "Other"];

const cities = ["Delhi", "Gurgaon", "Noida", "Bangalore", "Mumbai", "Pune", "Chennai", "Hyderabad", "Kolkata"];
const cityToLocalities = {
  Delhi: ["North Delhi", "Central Delhi", "East Delhi", "South Delhi", "West Delhi", "New Delhi"],
  Mumbai: ["Lower Parel/Worli", "Marine/Colaba", "Bandra", "Andheri E", "Andheri W", "Borivali/Kandivali", "Vile Parle"],
  Gurgaon: ["DLF 4", "DLF 2", "DLF 5", "Sector 18", "Sector 50", "Sector 48", "Udyog Vihar"],
  Noida: ["Sector 62", "Sector 137", "Sector 76/77/78", "Sector 18", "Sector 15/16"],
  Bangalore: ["Koramangala", "HSR Layout", "Marathalli", "Whitefield", "Electronic City", "Indiranagar"],
  Pune: ["Koregaon Park", "Viman Nagar", "Baner", "Wakad", "Hadapsar", "Kharadi"],
  Chennai: ["Anna Nagar", "T Nagar", "Velachery", "OMR", "Adyar", "Nungambakkam"]
};

const dietaryPrefs = ["Vegetarian", "Non-Vegetarian", "Vegan", "Pescetarian", "Veg + Eggs", "Jain"];

// Optimized: Consolidated substance use options
const smokingHabits = ["Never", "Occasionally", "Regularly"];
const drinkingHabits = ["Never", "Occasionally", "Socially", "Regularly", "Prefer not to say"];

const personalityTypes = ["Introvert", "Extrovert", "Ambivert", "Social Butterfly", "Homebody"];

// New: Social and lifestyle options
const socialStyles = ["Party Person", "Homebody", "Social", "Balanced"];
const hostingStyles = ["I like hosting", "I like being guest", "Either is fine"];
const weekendStyles = ["Clubbing/Going Out", "House Party Scenes", "Chill stay at home", "Based on my vibe"];

// Pet options (consolidated)
const petOwnership = ["Own pets", "No pets", "Open to pets"];
const petPreferences = ["Love pets", "Okay with pets", "No pets please"];

// Budget ranges from the dataset
const budgetRanges = [
  "<15000",
  "15000-20000", 
  "20000-25000",
  "25000-30000", 
  "30000-40000",
  "40000+"
];

// Sleep pattern preferences
const sleepPatterns = ["Early Bird", "Night Owl", "Flexible"];

const hobbiesOptions = [
  "Reading", "Gaming", "Cooking", "Photography", "Traveling", "Art", "Music", "Dancing",
  "Writing", "Blogging", "Yoga", "Meditation", "Gardening", "Crafting"
];

const interestsOptions = [
  "Technology", "Sports", "Movies", "Food", "Fashion", "Politics", "Environment",
  "Science", "History", "Philosophy", "Psychology", "Business", "Startups"
];

const musicGenres = [
  "Pop", "Rock", "Classical", "Hip-Hop", "Electronic", "Jazz", "Country",
  "Bollywood", "Indie", "R&B", "Reggae", "Folk"
];

const sportsActivities = [
  "Cricket", "Football", "Basketball", "Tennis", "Gym", "Running", "Swimming",
  "Badminton", "Cycling", "Yoga", "Dance", "Martial Arts"
];

const languages = ["English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi"];

export default function ProfileSetup() {
  const router = useRouter();
  const { user, updateProfile, isLoading } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    age: "",
    gender: "",
    profession: "",
    bio: "",
    
    // Step 2: Location & Budget
    city: "",
    locality: "", // Optimized: removed 'location' duplicate
    budget: "",
    moveInDate: "",
    
    // Step 3: Lifestyle Preferences (optimized)
    sleepPattern: "", // Early Bird, Night Owl, Flexible
    dietaryPrefs: "", // Consolidated: removed eatingPreference duplicate
    smokingHabits: "", // Optimized: consolidated from smoker boolean
    drinkingHabits: "", // Optimized: renamed from alcoholUsage
    cleanliness: 3, // Consolidated: single field for cleanliness level
    personalityType: "",
    
    // Step 4: Social Preferences (new optimized grouping)
    socialStyle: "", // Optimized: consolidated from partyPerson + personality
    hostingStyle: "", // New: hosting preference
    weekendStyle: "", // New: weekend activity preference
    
    // Step 5: Hobbies & Interests
    hobbies: [],
    interests: [],
    
    // Step 6: Entertainment & Final
    musicGenres: [],
    sportsActivities: [],
    languagesSpoken: [], // Optimized: renamed from languageSpoken
    
    // Pet Preferences (consolidated)
    petOwnership: "", // New: whether user owns pets
    petPreference: "", // Existing: preference for flatmate's pets
  });
  
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const steps = [
    {
      title: "Basic Information",
      subtitle: "Tell us about yourself",
      icon: <User className="w-6 h-6" />,
      fields: ['age', 'gender', 'profession', 'bio']
    },
    {
      title: "Location & Budget",
      subtitle: "Where do you want to live?",
      icon: <MapPin className="w-6 h-6" />,
      fields: ['city', 'locality', 'budget', 'moveInDate']
    },
    {
      title: "Lifestyle Preferences",
      subtitle: "Your daily habits and preferences",
      icon: <Home className="w-6 h-6" />,
      fields: ['sleepPattern', 'dietaryPrefs', 'smokingHabits', 'drinkingHabits', 'personalityType']
    },
    {
      title: "Social & Living Style", 
      subtitle: "How do you like to live and socialize?",
      icon: <Heart className="w-6 h-6" />,
      fields: ['socialStyle', 'hostingStyle', 'weekendStyle']
    },
    {
      title: "Hobbies & Interests",
      subtitle: "What do you enjoy doing?",
      icon: <Sparkles className="w-6 h-6" />,
      fields: ['hobbies', 'interests']
    },
    {
      title: "Entertainment & Final Preferences",
      subtitle: "Last few details to complete your profile",
      icon: <Music className="w-6 h-6" />,
      fields: ['musicGenres', 'sportsActivities', 'languagesSpoken', 'petOwnership', 'petPreference']
    }
  ];

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/signup');
    }
  }, [user, router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    clearErrors(name);
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const clearErrors = (fieldName) => {
    if (error) setError("");
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: ""
      }));
    }
  };

  const validateCurrentStep = () => {
    const currentFields = steps[currentStep].fields;
    const newErrors = {};
    
    console.log(`Validating step ${currentStep + 1}:`, {
      requiredFields: currentFields,
      currentData: currentFields.reduce((acc, field) => {
        acc[field] = formData[field];
        return acc;
      }, {})
    });
    
    currentFields.forEach(field => {
      if (Array.isArray(formData[field])) {
        // For array fields, check if at least one is selected
        if (formData[field].length === 0) {
          const fieldDisplayName = {
            hobbies: 'hobby',
            interests: 'interest', 
            musicGenres: 'music genre',
            sportsActivities: 'sport or activity',
            languagesSpoken: 'language' // Updated field name
          }[field] || field;
          newErrors[field] = `Please select at least one ${fieldDisplayName}`;
        }
      } else if (!formData[field] || formData[field].toString().trim() === "") {
        const fieldDisplayName = {
          sleepPattern: 'sleep pattern',
          dietaryPrefs: 'dietary preference',
          smokingHabits: 'smoking habit', // Updated
          drinkingHabits: 'drinking habit', // Updated  
          personalityType: 'personality type',
          socialStyle: 'social style', // New
          hostingStyle: 'hosting style', // New
          weekendStyle: 'weekend style', // New
          petOwnership: 'pet ownership', // New
          petPreference: 'pet preference',
          moveInDate: 'move-in date',
          locality: 'locality' // Added for consistency
        }[field] || field;
        newErrors[field] = `Please select ${fieldDisplayName}`;
      }
    });

    // Special validation for age
    if (currentFields.includes('age') && formData.age) {
      const age = parseInt(formData.age);
      if (age < 18 || age > 60) {
        newErrors.age = "Age must be between 18 and 60";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      console.log('Validation errors found:', newErrors);
      setFieldErrors(newErrors);
      return false;
    }
    console.log('Validation passed for step', currentStep + 1);
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setFieldErrors({}); // Clear any previous errors when moving to next step
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const handlePrevious = () => {
    setFieldErrors({}); // Clear any errors when going back
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setFieldErrors({});
    
    if (!validateCurrentStep()) return;
    
    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  max="60"
                  placeholder="Enter your age"
                  className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                    fieldErrors.age ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {fieldErrors.age && <p className="text-red-500 text-xs mt-1">{fieldErrors.age}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                    fieldErrors.gender ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select gender</option>
                  {genderOptions.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
                {fieldErrors.gender && <p className="text-red-500 text-xs mt-1">{fieldErrors.gender}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
              <select
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
                className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                  fieldErrors.profession ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <option value="">Select profession</option>
                {professionOptions.map(profession => (
                  <option key={profession} value={profession}>{profession}</option>
                ))}
              </select>
              {fieldErrors.profession && <p className="text-red-500 text-xs mt-1">{fieldErrors.profession}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us a bit about yourself, your interests, what you're looking for in a flatmate..."
                className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent resize-none transition-all duration-200 text-gray-800 ${
                  fieldErrors.bio ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {fieldErrors.bio && <p className="text-red-500 text-xs mt-1">{fieldErrors.bio}</p>}
            </div>
          </div>
        );

      case 1: // Location & Budget
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                    fieldErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {fieldErrors.city && <p className="text-red-500 text-xs mt-1">{fieldErrors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Location</label>
                <select
                  name="locality"
                  value={formData.locality}
                  onChange={handleInputChange}
                  disabled={!formData.city}
                  className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 disabled:bg-gray-100 ${
                    fieldErrors.locality ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select location</option>
                  {formData.city && cityToLocalities[formData.city]?.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                {fieldErrors.locality && <p className="text-red-500 text-xs mt-1">{fieldErrors.locality}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range (₹/month)</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                    fieldErrors.budget ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select your budget range</option>
                  {budgetRanges.map((range) => (
                    <option key={range} value={range}>
                      ₹{range}
                    </option>
                  ))}
                </select>
                {fieldErrors.budget && <p className="text-red-500 text-xs mt-1">{fieldErrors.budget}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Move-in Date</label>
                <input
                  type="date"
                  name="moveInDate"
                  value={formData.moveInDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                    fieldErrors.moveInDate ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {fieldErrors.moveInDate && <p className="text-red-500 text-xs mt-1">{fieldErrors.moveInDate}</p>}
              </div>
            </div>
          </div>
        );

      case 2: // Lifestyle Preferences
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Sleep Pattern
                </label>
                <select
                  name="sleepPattern"
                  value={formData.sleepPattern}
                  onChange={handleInputChange}
                  className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                    fieldErrors.sleepPattern ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select your sleep pattern</option>
                  {sleepPatterns.map((pattern) => (
                    <option key={pattern} value={pattern}>
                      {pattern}
                    </option>
                  ))}
                </select>
                {fieldErrors.sleepPattern && <p className="text-red-500 text-xs mt-1">{fieldErrors.sleepPattern}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Utensils className="inline w-4 h-4 mr-1" />
                  Dietary Preference
                </label>
                <select
                  name="dietaryPrefs"
                  value={formData.dietaryPrefs}
                  onChange={handleInputChange}
                  className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                    fieldErrors.dietaryPrefs ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select dietary preference</option>
                  {dietaryPrefs.map(pref => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
                {fieldErrors.dietaryPrefs && <p className="text-red-500 text-xs mt-1">{fieldErrors.dietaryPrefs}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Cigarette className="inline w-4 h-4 mr-1" />
                  Smoking Habits
                </label>
                <select
                  name="smokingHabits"
                  value={formData.smokingHabits}
                  onChange={handleInputChange}
                  className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                    fieldErrors.smokingHabits ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select smoking habits</option>
                  {smokingHabits.map(habit => (
                    <option key={habit} value={habit}>{habit}</option>
                  ))}
                </select>
                {fieldErrors.smokingHabits && <p className="text-red-500 text-xs mt-1">{fieldErrors.smokingHabits}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Wine className="inline w-4 h-4 mr-1" />
                  Drinking Habits
                </label>
                <select
                  name="drinkingHabits"
                  value={formData.drinkingHabits}
                  onChange={handleInputChange}
                  className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                    fieldErrors.drinkingHabits ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select drinking habits</option>
                  {drinkingHabits.map(habit => (
                    <option key={habit} value={habit}>{habit}</option>
                  ))}
                </select>
                {fieldErrors.drinkingHabits && <p className="text-red-500 text-xs mt-1">{fieldErrors.drinkingHabits}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Sparkles className="inline w-4 h-4 mr-1" />
                Personality Type
              </label>
              <select
                name="personalityType"
                value={formData.personalityType}
                onChange={handleInputChange}
                className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                  fieldErrors.personalityType ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <option value="">Select personality type</option>
                {personalityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {fieldErrors.personalityType && <p className="text-red-500 text-xs mt-1">{fieldErrors.personalityType}</p>}
            </div>

            {/* Cleanliness slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cleanliness Level: {['Very Messy', 'Messy', 'Average', 'Clean', 'Very Clean'][formData.cleanliness - 1]}
              </label>
              <input
                type="range"
                name="cleanliness"
                min="1"
                max="5"
                value={formData.cleanliness}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #f38406 0%, #f38406 ${(formData.cleanliness - 1) * 25}%, #e5e7eb ${(formData.cleanliness - 1) * 25}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Very Messy</span>
                <span>Very Clean</span>
              </div>
            </div>
          </div>
        );

      case 3: // Social & Living Style
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Heart className="inline w-4 h-4 mr-1" />
                  Social Style
                </label>
                <select
                  name="socialStyle"
                  value={formData.socialStyle}
                  onChange={handleInputChange}
                  className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                    fieldErrors.socialStyle ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select your social style</option>
                  {socialStyles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
                {fieldErrors.socialStyle && <p className="text-red-500 text-xs mt-1">{fieldErrors.socialStyle}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Home className="inline w-4 h-4 mr-1" />
                  Hosting Style
                </label>
                <select
                  name="hostingStyle"
                  value={formData.hostingStyle}
                  onChange={handleInputChange}
                  className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                    fieldErrors.hostingStyle ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select hosting preference</option>
                  {hostingStyles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
                {fieldErrors.hostingStyle && <p className="text-red-500 text-xs mt-1">{fieldErrors.hostingStyle}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <PartyPopper className="inline w-4 h-4 mr-1" />
                Weekend Style
              </label>
              <select
                name="weekendStyle"
                value={formData.weekendStyle}
                onChange={handleInputChange}
                className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                  fieldErrors.weekendStyle ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <option value="">Select weekend style</option>
                {weekendStyles.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
              {fieldErrors.weekendStyle && <p className="text-red-500 text-xs mt-1">{fieldErrors.weekendStyle}</p>}
            </div>
          </div>
        );

      case 4: // Hobbies & Interests
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Heart className="inline w-4 h-4 mr-1" />
                Hobbies (Select multiple)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {hobbiesOptions.map(hobby => (
                  <button
                    key={hobby}
                    type="button"
                    onClick={() => handleMultiSelect('hobbies', hobby)}
                    className={`p-3 text-sm rounded-xl border transition-all duration-200 ${
                      formData.hobbies.includes(hobby)
                        ? 'bg-[#f38406] text-white border-[#f38406]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#f38406]'
                    }`}
                  >
                    {hobby}
                  </button>
                ))}
              </div>
              {fieldErrors.hobbies && <p className="text-red-500 text-xs mt-1">{fieldErrors.hobbies}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interests (Select multiple)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {interestsOptions.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleMultiSelect('interests', interest)}
                    className={`p-3 text-sm rounded-xl border transition-all duration-200 ${
                      formData.interests.includes(interest)
                        ? 'bg-[#f38406] text-white border-[#f38406]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#f38406]'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              {fieldErrors.interests && <p className="text-red-500 text-xs mt-1">{fieldErrors.interests}</p>}
            </div>
          </div>
        );

      case 5: // Entertainment & Final Preferences
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Music className="inline w-4 h-4 mr-1" />
                Music Genres (Select multiple)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {musicGenres.map(genre => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => handleMultiSelect('musicGenres', genre)}
                    className={`p-3 text-sm rounded-xl border transition-all duration-200 ${
                      formData.musicGenres.includes(genre)
                        ? 'bg-[#f38406] text-white border-[#f38406]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#f38406]'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              {fieldErrors.musicGenres && <p className="text-red-500 text-xs mt-1">{fieldErrors.musicGenres}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sports & Activities (Select multiple)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {sportsActivities.map(sport => (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => handleMultiSelect('sportsActivities', sport)}
                    className={`p-3 text-sm rounded-xl border transition-all duration-200 ${
                      formData.sportsActivities.includes(sport)
                        ? 'bg-[#f38406] text-white border-[#f38406]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#f38406]'
                    }`}
                  >
                    {sport}
                  </button>
                ))}
              </div>
              {fieldErrors.sportsActivities && <p className="text-red-500 text-xs mt-1">{fieldErrors.sportsActivities}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Languages className="inline w-4 h-4 mr-1" />
                Languages Spoken (Select multiple)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {languages.map(language => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => handleMultiSelect('languagesSpoken', language)}
                    className={`p-3 text-sm rounded-xl border transition-all duration-200 ${
                      formData.languagesSpoken.includes(language)
                        ? 'bg-[#f38406] text-white border-[#f38406]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#f38406]'
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
              {fieldErrors.languagesSpoken && <p className="text-red-500 text-xs mt-1">{fieldErrors.languagesSpoken}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Dog className="inline w-4 h-4 mr-1" />
                  Pet Ownership
                </label>
                <select
                  name="petOwnership"
                  value={formData.petOwnership}
                  onChange={handleInputChange}
                  className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                    fieldErrors.petOwnership ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select pet ownership</option>
                  {petOwnership.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {fieldErrors.petOwnership && <p className="text-red-500 text-xs mt-1">{fieldErrors.petOwnership}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Preference for Flatmate
                </label>
                <select
                  name="petPreference"
                  value={formData.petPreference}
                  onChange={handleInputChange}
                  className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-[#f38406] focus:border-transparent transition-all duration-200 text-gray-800 ${
                    fieldErrors.petPreference ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select pet preference</option>
                  {petPreferences.map(pref => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
                {fieldErrors.petPreference && <p className="text-red-500 text-xs mt-1">{fieldErrors.petPreference}</p>}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Help us find you the perfect flatmate match</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-[#f38406]">
              {steps[currentStep].icon}
              <div>
                <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
                <p className="text-sm text-gray-600">{steps[currentStep].subtitle}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {totalSteps}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#f38406] to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentStep
                    ? 'bg-[#f38406]'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {currentStep === totalSteps - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-3 bg-[#f38406] text-white rounded-xl font-medium hover:bg-orange-500 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Complete Profile'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-[#f38406] text-white rounded-xl font-medium hover:bg-orange-500 transition-all duration-200"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
