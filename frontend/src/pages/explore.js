import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Search, MapPin, Calendar, Activity, Star, Clock,
  Users, ArrowLeft, Filter, Loader2, Heart,
  Navigation, Phone, Globe, ChevronRight,
  X
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { 
  getPersonalizedRecommendations, 
  searchNeighborhood, 
  getPlacesByCategory,
  getFilteredContent,
  getAllContent 
} from "../lib/neighborhood";

export default function ExplorePage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && token && user) {
      loadRecommendations();
    }
  }, [isAuthenticated, token, user]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPersonalizedRecommendations(token);
      setRecommendations(data.data);
    } catch (error) {
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
      setSearchLoading(true);
      setError("");
      
      if (!searchQuery.trim() && activeTab !== "all") {
        const data = await getFilteredContent(token, activeTab);
        setSearchResults({
          query: `All ${activeTab}`,
          results: data.data.results,
          total: data.data.total
        });
      }
      else if (!searchQuery.trim() && activeTab === "all") {
        const data = await getAllContent(token);
        setSearchResults({
          query: `All content in ${user?.city || 'your city'}`,
          results: data.data.results,
          total: data.data.total
        });
      }
      else if (searchQuery.trim()) {
        const searchParams = {
          q: searchQuery,
          ...(activeTab !== "all" && { type: activeTab })
        };
        
        const data = await searchNeighborhood(token, searchParams);
        setSearchResults(data.data);
      }
      else {
        setSearchResults(null);
      }
    } catch (error) {
      if (error.message.includes('Authentication')) {
        setError('Please log in to access this feature.');
        router.push('/login');
      } else {
        setError(error.message || 'Search failed. Please try again.');
      }
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
  };

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
      <Head>
        <title>Explore Your Neighbourhood | Homiee</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <div className="text-left">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  Explore Your Neighbourhood
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  Discover places, events & activities in {user?.city || 'your city'}
                </p>
              </div>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{user?.city || 'Set your city'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search places, events, or activities..."
                      className="w-full text-gray-800 pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f38406] focus:border-transparent"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </form>
                
                <button
                  type="submit"
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="px-6 py-3 bg-[#f38406] text-white rounded-lg font-medium hover:bg-[#e5750a] transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {searchLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span className="hidden sm:inline">Search</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex space-x-2 overflow-x-auto pb-2">
                {[
                  { id: "all", label: "All", icon: Filter },
                  { id: "places", label: "Places", icon: MapPin },
                  { id: "events", label: "Events", icon: Calendar },
                  { id: "activities", label: "Activities", icon: Activity }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? "bg-[#f38406] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {searchResults ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Search Results for "{searchResults.query}"
                </h2>
                <span className="text-sm text-gray-500">
                  {searchResults.total} result{searchResults.total !== 1 ? 's' : ''}
                </span>
              </div>
              
              {searchResults.results && searchResults.results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.results.map((item) => (
                    <ContentCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Recommended for You
                </h2>
                <button
                  onClick={loadRecommendations}
                  disabled={loading}
                  className="text-[#f38406] hover:text-[#e5750a] font-medium flex items-center space-x-1"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Refresh</span>
                  )}
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                      <div className="h-48 bg-gray-200 animate-pulse"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recommendations && recommendations.length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(
                    recommendations.reduce((acc, item) => {
                      const type = item.type || (item.category ? 'places' : item.eventType ? 'events' : 'activities');
                      if (!acc[type]) acc[type] = [];
                      acc[type].push(item);
                      return acc;
                    }, {})
                  ).map(([type, items]) => (
                    <div key={type} className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize flex items-center space-x-2">
                        {type === 'places' && <MapPin className="w-5 h-5" />}
                        {type === 'events' && <Calendar className="w-5 h-5" />}
                        {type === 'activities' && <Activity className="w-5 h-5" />}
                        <span>{type}</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                          <ContentCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations available</h3>
                  <p className="text-gray-500">Complete your profile to get personalized recommendations</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const ContentCard = ({ item }) => {
  const [liked, setLiked] = useState(false);
  
  const getItemType = (item) => {
    if (item.category) return 'place';
    if (item.eventType) return 'event';
    return 'activity';
  };

  const getIcon = (type) => {
    switch (type) {
      case 'place': return MapPin;
      case 'event': return Calendar;
      case 'activity': return Activity;
      default: return MapPin;
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return null;
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const type = getItemType(item);
  const Icon = getIcon(type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-12 h-12 text-gray-400" />
        </div>
        
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
            type === 'place' ? 'bg-blue-500' :
            type === 'event' ? 'bg-green-500' : 'bg-purple-500'
          }`}>
            {type === 'place' ? item.category :
             type === 'event' ? item.eventType : item.activityType}
          </span>
        </div>
        
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-gray-500">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          
          {item.rating && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{item.rating}</span>
            </div>
          )}
        </div>
        
        {type === 'event' && item.dateTime && (
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{formatDateTime(item.dateTime)}</span>
          </div>
        )}
        
        {(item.priceRange || item.price) && (
          <div className="text-sm font-medium text-[#f38406]">
            {item.priceRange || `₹${item.price}`}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            {item.phone && (
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span className="text-xs">{item.phone}</span>
              </div>
            )}
            {item.website && (
              <a
                href={item.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:text-[#f38406]"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs">Website</span>
              </a>
            )}
          </div>
          
          <button className="flex items-center space-x-1 text-[#f38406] hover:text-[#e5750a] font-medium">
            <span className="text-sm">View</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
