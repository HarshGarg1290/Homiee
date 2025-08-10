import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  User, MapPin, Home, Heart, Music, Edit3, Save, X,
  Calendar, Clock, Utensils, Wine, Cigarette, Dog,
  PartyPopper, Sparkles, Languages, Phone, Mail,
  Briefcase, MessageCircle, ArrowLeft, Loader2
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { 
  genderOptions, professionOptions, cities, cityToLocalities,
  dietaryPrefs, smokingHabits, drinkingHabits, personalityTypes,
  socialStyles, hostingStyles, weekendStyles, petOwnership,
  petPreferences, budgetRanges, sleepPatterns, hobbiesOptions,
  interestsOptions, musicGenres, sportsActivities, languages
} from "../lib/data";

const formatDateForInput = (dateValue) => {
  if (!dateValue) return "";
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
  } catch (error) {
    return "";
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, isLoading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    profession: "",
    bio: "",
    phone: "",
    city: "",
    locality: "",
    budget: "",
    moveInDate: "",
    sleepPattern: "",
    dietaryPrefs: "",
    smokingHabits: "",
    drinkingHabits: "",
    personalityType: "",
    socialStyle: "",
    hostingStyle: "",
    weekendStyle: "",
    petOwnership: "",
    petPreference: "",
    cleanliness: 3,
    hobbies: [],
    interests: [],
    musicGenres: [],
    sportsActivities: [],
    languagesSpoken: []
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        gender: user.gender || "",
        profession: user.profession || "",
        bio: user.bio || "",
        phone: user.phone || "",
        city: user.city || "",
        locality: user.locality || "",
        budget: user.budget || "",
        moveInDate: formatDateForInput(user.moveInDate),
        sleepPattern: user.sleepPattern || "",
        dietaryPrefs: user.dietaryPrefs || "",
        smokingHabits: user.smokingHabits || "",
        drinkingHabits: user.drinkingHabits || "",
        personalityType: user.personalityType || "",
        socialStyle: user.socialStyle || "",
        hostingStyle: user.hostingStyle || "",
        weekendStyle: user.weekendStyle || "",
        petOwnership: user.petOwnership || "",
        petPreference: user.petPreference || "",
        cleanliness: user.cleanliness || 3,
        hobbies: user.hobbies || [],
        interests: user.interests || [],
        musicGenres: user.musicGenres || [],
        sportsActivities: user.sportsActivities || [],
        languagesSpoken: user.languagesSpoken || []
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value, isChecked) => {
    setFormData(prev => ({
      ...prev,
      [field]: isChecked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Prepare data for API
      const updateData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        // Handle moveInDate properly - only send if it's a valid date string
        moveInDate: formData.moveInDate && formData.moveInDate.trim() !== "" 
          ? formData.moveInDate 
          : null,
        name: `${formData.firstName} ${formData.lastName}`.trim()
      };

      const result = await updateProfile(updateData);
      
      if (result.success) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.message || "Failed to update profile");
      }
      
    } catch (error) {
      setError(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        gender: user.gender || "",
        profession: user.profession || "",
        bio: user.bio || "",
        phone: user.phone || "",
        city: user.city || "",
        locality: user.locality || "",
        budget: user.budget || "",
        moveInDate: formatDateForInput(user.moveInDate),
        sleepPattern: user.sleepPattern || "",
        dietaryPrefs: user.dietaryPrefs || "",
        smokingHabits: user.smokingHabits || "",
        drinkingHabits: user.drinkingHabits || "",
        personalityType: user.personalityType || "",
        socialStyle: user.socialStyle || "",
        hostingStyle: user.hostingStyle || "",
        weekendStyle: user.weekendStyle || "",
        petOwnership: user.petOwnership || "",
        petPreference: user.petPreference || "",
        cleanliness: user.cleanliness || 3,
        hobbies: user.hobbies || [],
        interests: user.interests || [],
        musicGenres: user.musicGenres || [],
        sportsActivities: user.sportsActivities || [],
        languagesSpoken: user.languagesSpoken || []
      });
    }
    setIsEditing(false);
    setError("");
  };

  // Show loading during authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#f38406]" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
      <Head>
        <title>My Profile | Homiee</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="Homiee Logo"
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Homiee
              </h1>
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-3 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#f38406] to-[#e07405] px-6 py-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-[#f38406]" />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">
                    {formData.firstName || formData.lastName 
                      ? `${formData.firstName} ${formData.lastName}`.trim()
                      : user.name || "Your Profile"
                    }
                  </h1>
                  <p className="text-orange-100">
                    {formData.profession || "Add your profession"}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-orange-100">{user.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white text-[#f38406] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
            >
              <p className="text-green-700">{success}</p>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Sections */}
        <div className="space-y-8 text-black">
          {/* Basic Information */}
          <ProfileSection
            title="Basic Information"
            icon={<User className="w-5 h-5" />}
            isEditing={isEditing}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="First Name"
                value={formData.firstName}
                onChange={(value) => handleInputChange('firstName', value)}
                isEditing={isEditing}
              />
              <InputField
                label="Last Name"
                value={formData.lastName}
                onChange={(value) => handleInputChange('lastName', value)}
                isEditing={isEditing}
              />
              <InputField
                label="Age"
                type="number"
                value={formData.age}
                onChange={(value) => handleInputChange('age', value)}
                isEditing={isEditing}
              />
              <SelectField
                label="Gender"
                value={formData.gender}
                options={genderOptions}
                onChange={(value) => handleInputChange('gender', value)}
                isEditing={isEditing}
              />
              <SelectField
                label="Profession"
                value={formData.profession}
                options={professionOptions}
                onChange={(value) => handleInputChange('profession', value)}
                isEditing={isEditing}
                className="md:col-span-2"
              />
              <InputField
                label="Phone Number"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                isEditing={isEditing}
              />
            </div>
            <TextAreaField
              label="Bio"
              value={formData.bio}
              onChange={(value) => handleInputChange('bio', value)}
              isEditing={isEditing}
              placeholder="Tell others about yourself..."
            />
          </ProfileSection>

          {/* Location & Budget */}
          <ProfileSection
            title="Location & Budget"
            icon={<MapPin className="w-5 h-5" />}
            isEditing={isEditing}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="City"
                value={formData.city}
                options={cities}
                onChange={(value) => handleInputChange('city', value)}
                isEditing={isEditing}
              />
              <SelectField
                label="Locality"
                value={formData.locality}
                options={formData.city ? cityToLocalities[formData.city] || [] : []}
                onChange={(value) => handleInputChange('locality', value)}
                isEditing={isEditing}
                disabled={!formData.city}
              />
              <SelectField
                label="Budget Range"
                value={formData.budget}
                options={budgetRanges}
                onChange={(value) => handleInputChange('budget', value)}
                isEditing={isEditing}
              />
              <InputField
                label="Preferred Move-in Date"
                type="date"
                value={formData.moveInDate}
                onChange={(value) => handleInputChange('moveInDate', value)}
                isEditing={isEditing}
              />
            </div>
          </ProfileSection>

          {/* Lifestyle Preferences */}
          <ProfileSection
            title="Lifestyle Preferences"
            icon={<Home className="w-5 h-5" />}
            isEditing={isEditing}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Sleep Pattern"
                value={formData.sleepPattern}
                options={sleepPatterns}
                onChange={(value) => handleInputChange('sleepPattern', value)}
                isEditing={isEditing}
              />
              <SelectField
                label="Dietary Preference"
                value={formData.dietaryPrefs}
                options={dietaryPrefs}
                onChange={(value) => handleInputChange('dietaryPrefs', value)}
                isEditing={isEditing}
              />
              <SelectField
                label="Smoking Habits"
                value={formData.smokingHabits}
                options={smokingHabits}
                onChange={(value) => handleInputChange('smokingHabits', value)}
                isEditing={isEditing}
              />
              <SelectField
                label="Drinking Habits"
                value={formData.drinkingHabits}
                options={drinkingHabits}
                onChange={(value) => handleInputChange('drinkingHabits', value)}
                isEditing={isEditing}
              />
              <SelectField
                label="Personality Type"
                value={formData.personalityType}
                options={personalityTypes}
                onChange={(value) => handleInputChange('personalityType', value)}
                isEditing={isEditing}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cleanliness Level (1-5)
                </label>
                {isEditing ? (
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.cleanliness}
                    onChange={(e) => handleInputChange('cleanliness', parseInt(e.target.value))}
                    className="w-full"
                  />
                ) : (
                  <div className="text-gray-900">{formData.cleanliness}/5</div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Current: {formData.cleanliness}/5
                </div>
              </div>
            </div>
          </ProfileSection>

          {/* Social Preferences */}
          <ProfileSection
            title="Social & Living Style"
            icon={<Heart className="w-5 h-5" />}
            isEditing={isEditing}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Social Style"
                value={formData.socialStyle}
                options={socialStyles}
                onChange={(value) => handleInputChange('socialStyle', value)}
                isEditing={isEditing}
              />
              <SelectField
                label="Hosting Style"
                value={formData.hostingStyle}
                options={hostingStyles}
                onChange={(value) => handleInputChange('hostingStyle', value)}
                isEditing={isEditing}
              />
              <SelectField
                label="Weekend Style"
                value={formData.weekendStyle}
                options={weekendStyles}
                onChange={(value) => handleInputChange('weekendStyle', value)}
                isEditing={isEditing}
                className="md:col-span-2"
              />
            </div>
          </ProfileSection>

          {/* Pet Preferences */}
          <ProfileSection
            title="Pet Preferences"
            icon={<Dog className="w-5 h-5" />}
            isEditing={isEditing}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Pet Ownership"
                value={formData.petOwnership}
                options={petOwnership}
                onChange={(value) => handleInputChange('petOwnership', value)}
                isEditing={isEditing}
              />
              <SelectField
                label="Pet Preference"
                value={formData.petPreference}
                options={petPreferences}
                onChange={(value) => handleInputChange('petPreference', value)}
                isEditing={isEditing}
              />
            </div>
          </ProfileSection>

          {/* Hobbies & Interests */}
          <ProfileSection
            title="Hobbies & Interests"
            icon={<Sparkles className="w-5 h-5" />}
            isEditing={isEditing}
          >
            <div className="space-y-6">
              <CheckboxGroup
                label="Hobbies"
                options={hobbiesOptions}
                selected={formData.hobbies}
                onChange={(value, isChecked) => handleArrayChange('hobbies', value, isChecked)}
                isEditing={isEditing}
              />
              <CheckboxGroup
                label="Interests"
                options={interestsOptions}
                selected={formData.interests}
                onChange={(value, isChecked) => handleArrayChange('interests', value, isChecked)}
                isEditing={isEditing}
              />
            </div>
          </ProfileSection>

          {/* Entertainment & Languages */}
          <ProfileSection
            title="Entertainment & Languages"
            icon={<Music className="w-5 h-5" />}
            isEditing={isEditing}
          >
            <div className="space-y-6">
              <CheckboxGroup
                label="Music Genres"
                options={musicGenres}
                selected={formData.musicGenres}
                onChange={(value, isChecked) => handleArrayChange('musicGenres', value, isChecked)}
                isEditing={isEditing}
              />
              <CheckboxGroup
                label="Sports Activities"
                options={sportsActivities}
                selected={formData.sportsActivities}
                onChange={(value, isChecked) => handleArrayChange('sportsActivities', value, isChecked)}
                isEditing={isEditing}
              />
              <CheckboxGroup
                label="Languages Spoken"
                options={languages}
                selected={formData.languagesSpoken}
                onChange={(value, isChecked) => handleArrayChange('languagesSpoken', value, isChecked)}
                isEditing={isEditing}
              />
            </div>
          </ProfileSection>
        </div>
      </main>
    </div>
  );
}

// Helper Components
function ProfileSection({ title, icon, children, isEditing }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="text-[#f38406]">{icon}</div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {isEditing && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Editing
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, isEditing, type = "text", placeholder, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f38406] focus:border-transparent"
        />
      ) : (
        <div className="text-gray-900 py-2">
          {value || <span className="text-gray-400">Not specified</span>}
        </div>
      )}
    </div>
  );
}

function TextAreaField({ label, value, onChange, isEditing, placeholder, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {isEditing ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f38406] focus:border-transparent"
        />
      ) : (
        <div className="text-gray-900 py-2">
          {value || <span className="text-gray-400">Not specified</span>}
        </div>
      )}
    </div>
  );
}

function SelectField({ label, value, options, onChange, isEditing, disabled = false, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {isEditing ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f38406] focus:border-transparent disabled:opacity-50"
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <div className="text-gray-900 py-2">
          {value || <span className="text-gray-400">Not specified</span>}
        </div>
      )}
    </div>
  );
}

function CheckboxGroup({ label, options, selected, onChange, isEditing }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      {isEditing ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {options.map((option) => (
            <label key={option} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={(e) => onChange(option, e.target.checked)}
                className="rounded border-gray-300 text-[#f38406] focus:ring-[#f38406]"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {selected.length > 0 ? (
            selected.map((item) => (
              <span
                key={item}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {item}
              </span>
            ))
          ) : (
            <span className="text-gray-400">None selected</span>
          )}
        </div>
      )}
    </div>
  );
}
