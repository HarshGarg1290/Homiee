/**
 * Flatmate Match Card Component
 * Displays individual flatmate match with all details
 */
import { Card } from '../common';

const FlatmateMatchCard = ({ candidate, match_percentage, index }) => {
  const getMatchColor = (percentage) => {
    if (percentage >= 90) return "text-green-600 bg-green-100";
    if (percentage >= 80) return "text-blue-600 bg-blue-100";  
    if (percentage >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <Card variant="glass" className="hover:shadow-xl transition-all duration-300 border border-blue-100">
      {/* Header with profile photo, name, and match percentage */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-white shadow-lg flex-shrink-0">
            <img
              src={candidate.ProfilePhoto}
              alt={`${candidate.Name}'s profile`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${candidate.Name}&background=49548a&color=fff&size=80`;
              }}
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg sm:text-xl">
              {candidate.Name}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {candidate.Age} years old
            </p>
            <p className="text-gray-500 text-sm">
              {candidate.Gender}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchColor(match_percentage)}`}>
          {Math.round(match_percentage)}% Match
        </div>
      </div>

      {/* Location and Budget */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/70 rounded-lg p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Location</div>
          <div className="font-semibold text-gray-800">{candidate.City}</div>
          <div className="text-sm text-gray-600">{candidate.Location}</div>
        </div>
        <div className="bg-white/70 rounded-lg p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Budget Range</div>
          <div className="font-semibold text-gray-800">₹{candidate.Budget}</div>
        </div>
      </div>

      {/* Lifestyle Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-2xl mb-1">🍽️</div>
          <div className="text-xs text-gray-500">Diet</div>
          <div className="font-medium text-gray-800">{candidate.DietaryPrefs}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🧹</div>
          <div className="text-xs text-gray-500">Cleanliness</div>
          <div className="font-medium text-gray-800">{candidate.Cleanliness}/5</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🚭</div>
          <div className="text-xs text-gray-500">Smoking</div>
          <div className="font-medium text-gray-800">{candidate.Smoker ? 'Yes' : 'No'}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🍷</div>
          <div className="text-xs text-gray-500">Drinking</div>
          <div className="font-medium text-gray-800">{candidate.AlcoholUsage}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🎵</div>
          <div className="text-xs text-gray-500">Music</div>
          <div className="font-medium text-gray-800">{candidate.MusicPrefs}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🌙</div>
          <div className="text-xs text-gray-500">Sleep Time</div>
          <div className="font-medium text-gray-800">{candidate.SleepTime}</div>
        </div>
      </div>

      {/* Contact Button */}
      <button className="w-full bg-gradient-to-r from-[#49548a] to-[#6366f1] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#3d4274] hover:to-[#5856eb] transform hover:scale-105 transition-all duration-200 shadow-lg">
        💬 Connect with {candidate.Name}
      </button>
    </Card>
  );
};

export default FlatmateMatchCard;
