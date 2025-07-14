import { Card } from '../common';

const ProfilePreview = ({ user, onSearchClick }) => {
  return (
    <Card variant="form">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Find Your Perfect Flatmate? 🏠</h3>
        <p className="text-gray-600 text-sm">Review your preferences below, then click search to find compatible matches!</p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Your Preferences</h4>
        
        {/* Basic Info */}
        <div className="mb-4">
          <h5 className="font-medium text-gray-700 mb-2">📋 Basic Info</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
            <div><span className="font-medium">📍 Location:</span> {user.city}, {user.locality}</div>
            <div><span className="font-medium">💰 Budget:</span> ₹{user.budget}</div>
            <div><span className="font-medium">👤 Gender:</span> {user.gender}</div>
            <div><span className="font-medium">🎂 Age:</span> {user.age}</div>
          </div>
        </div>

        {/* Lifestyle */}
        <div className="mb-4">
          <h5 className="font-medium text-gray-700 mb-2">🏠 Lifestyle</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
            <div><span className="font-medium">🍽️ Diet:</span> {user.dietaryPrefs || 'Not specified'}</div>
            <div><span className="font-medium">🧹 Cleanliness:</span> Level {user.cleanliness || 3}/5</div>
            <div><span className="font-medium">🚭 Smoking:</span> {user.smokingHabits || 'Not specified'}</div>
            <div><span className="font-medium">🍷 Drinking:</span> {user.drinkingHabits || 'Not specified'}</div>
            <div><span className="font-medium">😴 Sleep:</span> {user.sleepPattern || 'Not specified'}</div>
          </div>
        </div>

        {/* Personality & Social */}
        <div className="mb-4">
          <h5 className="font-medium text-gray-700 mb-2">🎭 Personality & Social</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
            <div><span className="font-medium">🧠 Personality:</span> {user.personalityType || 'Not specified'}</div>
            <div><span className="font-medium">🎉 Social Style:</span> {user.socialStyle || 'Not specified'}</div>
            <div><span className="font-medium">� Hosting:</span> {user.hostingStyle || 'Not specified'}</div>
            <div><span className="font-medium">🌅 Weekends:</span> {user.weekendStyle || 'Not specified'}</div>
          </div>
        </div>

        {/* Interests & Hobbies */}
        {(user.hobbies?.length > 0 || user.interests?.length > 0 || user.musicGenres?.length > 0) && (
          <div className="mb-4">
            <h5 className="font-medium text-gray-700 mb-2">🎯 Interests</h5>
            <div className="space-y-2 text-sm text-gray-700">
              {user.hobbies?.length > 0 && (
                <div><span className="font-medium">🎨 Hobbies:</span> {user.hobbies.join(', ')}</div>
              )}
              {user.interests?.length > 0 && (
                <div><span className="font-medium">💡 Interests:</span> {user.interests.join(', ')}</div>
              )}
              {user.musicGenres?.length > 0 && (
                <div><span className="font-medium">🎵 Music:</span> {user.musicGenres.join(', ')}</div>
              )}
              {user.sportsActivities?.length > 0 && (
                <div><span className="font-medium">⚽ Sports:</span> {user.sportsActivities.join(', ')}</div>
              )}
            </div>
          </div>
        )}

        {/* Pet Preferences */}
        {(user.petOwnership || user.petPreference) && (
          <div>
            <h5 className="font-medium text-gray-700 mb-2">🐾 Pet Preferences</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
              {user.petOwnership && <div><span className="font-medium">🐕 Ownership:</span> {user.petOwnership}</div>}
              {user.petPreference && <div><span className="font-medium">🐾 Preference:</span> {user.petPreference}</div>}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSearchClick}
          className="flex-1 bg-gradient-to-r from-[#49548a] to-[#6366f1] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#3d4274] hover:to-[#5856eb] transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          🔍 Find My Matches
        </button>
        <button
          onClick={() => window.location.href = '/profile-setup'}
          className="flex-1 sm:flex-initial bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 border"
        >
          ✏️ Update Preferences
        </button>
      </div>
    </Card>
  );
};

export default ProfilePreview;
