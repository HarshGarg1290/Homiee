import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import { User, MapPin, Heart, Settings, Users, Home, Bookmark } from "lucide-react";
import Navbar from "../components/Navbar";
export default function Dashboard() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  useEffect(() => {

    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#f38406] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  if (!user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Navbar */}
      <Navbar showHowItWorks={false} showDashboardInDropdown={false} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ paddingTop: '6rem' }}>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-r from-[#f38406] to-[#e07405] rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to Homiee, {user.firstName || user.name}! 🎉
              </h2>
              <p className="text-gray-600">
                Your profile is set up and ready. You can now explore flatmates and flats in your area.
              </p>
            </div>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-[#f38406]" />
              <h3 className="text-lg font-semibold text-gray-800">Location</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">City:</span> {user.city || "Not set"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Area:</span> {user.location || user.locality || "Not set"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Budget:</span> ₹{user.budget || "Not set"}
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-[#f38406]" />
              <h3 className="text-lg font-semibold text-gray-800">Interests</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Hobbies:</span> {user.hobbies?.length || 0} selected
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Personality:</span> {user.personalityType || user.personality || "Not set"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Languages:</span> {user.languagesSpoken?.length || 0} selected
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-[#f38406]" />
              <h3 className="text-lg font-semibold text-gray-800">Preferences</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Diet:</span> {user.dietaryPrefs || user.eatingPreference || "Not set"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Alcohol:</span> {user.drinkingHabits || "Not set"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Pet:</span> {user.petPreference || "Not set"}
              </p>
            </div>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => router.push('/flatmates')}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 cursor-pointer hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#f38406] to-[#e07405] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Find Flatmates</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Discover like-minded people to share your living space with. Our ML algorithm matches you with compatible flatmates.
            </p>
            <div className="text-[#f38406] font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              Start Matching →
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => router.push('/flats')}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 cursor-pointer hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#f38406] to-[#e07405] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Find Flats</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Browse available flats and rooms in your preferred location. Filter by budget, amenities, and more.
            </p>
            <div className="text-[#f38406] font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              Browse Flats →
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => router.push('/saved-flats')}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 cursor-pointer hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#f38406] to-[#e07405] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bookmark className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Saved Flats</h3>
            </div>
            <p className="text-gray-600 mb-4">
              View all the flats you've saved while browsing. Keep track of your favorite options in one place.
            </p>
            <div className="text-[#f38406] font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              View Saved →
            </div>
          </motion.div>
        </div>
        {/* Profile Completion */}
        {(!user.bio || !user.city || !user.hobbies?.length) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-orange-50 border border-orange-200 rounded-xl p-6 mt-8"
          >
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Complete Your Profile</h3>
            <p className="text-orange-700 mb-4">
              Complete your profile to get better matches and improve your experience on Homiee.
            </p>
            <button
              onClick={() => router.push('/profile-setup')}
              className="bg-[#f38406] text-white px-6 py-2 rounded-lg hover:bg-[#e07405] transition-colors"
            >
              Complete Profile
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}