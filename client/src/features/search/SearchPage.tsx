import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Coffee } from 'lucide-react';
import UserAvatar from '../../components/UserAvatar';
import { useAuth } from '../../hooks/useAuth';

interface SearchUser {
  _id: string;
  username: string;
  email: string;
  name?: string;
  profileImage?: string;
  bio?: string;
}

// Hardcoded user data
const HARDCODED_USERS: SearchUser[] = [
  {
    _id: '1',
    username: 'coffeelover',
    email: 'coffee@example.com',
    name: 'Alex Johnson',
    profileImage: 'https://i.pravatar.cc/150?img=1',
    bio: 'Specialty coffee enthusiast. Love pour-overs and cold brew! Morning coffee is my meditation.'
  },
  {
    _id: '2',
    username: 'latteart',
    email: 'latte@example.com',
    name: 'Maria Garcia',
    profileImage: 'https://i.pravatar.cc/150?img=5',
    bio: 'Latte art pro and barista trainer. Always experimenting with new beans and milk textures.'
  },
  {
    _id: '3',
    username: 'espressofan',
    email: 'espresso@example.com',
    name: 'David Chen',
    profileImage: 'https://i.pravatar.cc/150?img=8',
    bio: 'Home espresso setup geek. Roast my own beans on weekends. Currently using a Rocket Appartamento.'
  },
  {
    _id: '4',
    username: 'brewmaster',
    email: 'brew@example.com',
    name: 'Sarah Williams',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    bio: 'Love trying coffee from different regions. French press is my favorite method. Ethiopian Yirgacheffe is my go-to.'
  },
  {
    _id: '5',
    username: 'beanhunter',
    email: 'beans@example.com',
    name: 'Michael Brown',
    profileImage: 'https://i.pravatar.cc/150?img=15',
    bio: 'Traveling the world to find unique coffee beans and brewing methods. Just back from Colombia!'
  },
  {
    _id: '6',
    username: 'mochamagic',
    email: 'mocha@example.com',
    name: 'Jessica Lee',
    profileImage: 'https://i.pravatar.cc/150?img=20',
    bio: 'Creating delicious mocha recipes. Chocolate and coffee is the best combo! Dark chocolate preferred.'
  },
  {
    _id: '7',
    username: 'caffeinequeen',
    email: 'queen@example.com',
    name: 'Olivia Taylor',
    profileImage: 'https://i.pravatar.cc/150?img=25',
    bio: 'Morning person thanks to coffee! Love exploring local coffee shops. Always looking for the best flat white.'
  },
  {
    _id: '8',
    username: 'filterfanatic',
    email: 'filter@example.com',
    name: 'Robert Kim',
    profileImage: 'https://i.pravatar.cc/150?img=30',
    bio: 'Pour-over perfectionist. Using V60 and Chemex daily. Water temperature and grind size matter!'
  },
  {
    _id: '9',
    username: 'cappuccinoking',
    email: 'cappu@example.com',
    name: 'Thomas Wilson',
    profileImage: 'https://i.pravatar.cc/150?img=35',
    bio: 'Perfecting the frothy milk texture. Cappuccino is my morning ritual. Microfoam is everything.'
  },
  {
    _id: '10',
    username: 'arabicaaddict',
    email: 'arabica@example.com',
    name: 'Sophie Martinez',
    profileImage: 'https://i.pravatar.cc/150?img=40',
    bio: '100% Arabica beans only. Exploring single-origin coffees. Currently loving Kenyan AA beans.'
  },
  {
    _id: '11',
    username: 'coldbrewcrew',
    email: 'coldbrew@example.com',
    name: 'James Anderson',
    profileImage: 'https://i.pravatar.cc/150?img=45',
    bio: 'Cold brew all year round. My homemade setup produces the smoothest coffee. Less acidic, more flavor!'
  },
  {
    _id: '12',
    username: 'baristabuddy',
    email: 'barista@example.com',
    name: 'Emma Clark',
    profileImage: 'https://i.pravatar.cc/150?img=50',
    bio: 'Professional barista for 5 years. Teaching coffee workshops on weekends. Espresso extraction is science!'
  }
];

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save search to recent
  const saveToRecent = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Hardcoded search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      // Filter hardcoded users based on search query
      const searchLower = query.toLowerCase();
      const filteredUsers = HARDCODED_USERS.filter(user => 
        user.username.toLowerCase().includes(searchLower) ||
        user.name?.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.bio?.toLowerCase().includes(searchLower)
      );
      
      setUsers(filteredUsers);
      saveToRecent(query);
    } catch (err) {
      setError('Search simulation failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle search input with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  // Show all users when component mounts or search is empty
  useEffect(() => {
    if (!searchQuery.trim()) {
      setUsers(HARDCODED_USERS);
    }
  }, [searchQuery]);

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Get suggested users (excluding current user if logged in)
  const getSuggestedUsers = useCallback(() => {
    if (!currentUser) return HARDCODED_USERS.slice(0, 6);
    return HARDCODED_USERS.filter(user => user._id !== currentUser._id).slice(0, 6);
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Find Coffee Mates
          </h1>
          <p className="text-gray-600">
            Search for fellow coffee enthusiasts by username, name, or email
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for users..."
              className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          
          {/* Search Tips */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Try searching for:</span>
            {['coffee', 'latte', 'espresso', 'barista', 'brew'].map((tip) => (
              <button
                key={tip}
                onClick={() => setSearchQuery(tip)}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition"
              >
                {tip}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && !searchQuery && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Recent Searches</h2>
              <button
                onClick={clearRecentSearches}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearch(query)}
                  className="flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-300 px-4 py-2 rounded-full transition shadow-sm"
                >
                  <Search size={14} className="text-gray-400" />
                  <span className="text-gray-700">{query}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Results Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {searchQuery ? 'Search Results' : 'Suggested Coffee Mates'}
              </h2>
              <span className="text-gray-500">
                {loading ? 'Searching...' : `${users.length} user${users.length !== 1 ? 's' : ''} found`}
              </span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Searching for users...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-2">⚠️</div>
              <p className="text-gray-700">{error}</p>
              <button
                onClick={() => performSearch(searchQuery)}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && users.length === 0 && searchQuery && (
            <div className="p-8 text-center">
              <Coffee className="mx-auto text-gray-400 mb-3" size={48} />
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                No users found
              </h3>
              <p className="text-gray-500">
                No users match "{searchQuery}". Try a different search term.
              </p>
            </div>
          )}

          {/* Suggested Users (when no search) */}
          {!loading && !error && users.length === 0 && !searchQuery && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getSuggestedUsers().map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleUserClick(user._id)}
                    className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200"
                  >
                    <div className="flex flex-col items-center text-center">
                      <UserAvatar
                        username={user.username}
                        profileImage={user.profileImage}
                        size="xl"
                        className="mb-4"
                      />
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {user.username}
                      </h3>
                      {user.name && (
                        <p className="text-gray-600 text-sm mb-2">{user.name}</p>
                      )}
                      {user.bio && (
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                          {user.bio}
                        </p>
                      )}
                      <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                        <User size={14} />
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <p className="text-gray-500 text-sm">
                  Showing {getSuggestedUsers().length} of {HARDCODED_USERS.length} coffee enthusiasts
                </p>
              </div>
            </div>
          )}

          {/* Users List (search results) */}
          {!loading && !error && users.length > 0 && (
            <div className="divide-y divide-gray-100">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition group"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <UserAvatar
                      username={user.username}
                      profileImage={user.profileImage}
                      size="lg"
                      className="group-hover:scale-105 transition-transform"
                    />

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                          {user.username}
                        </h3>
                        {currentUser?._id === user._id && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      
                      {user.name && (
                        <p className="text-gray-600 mb-1">{user.name}</p>
                      )}
                      
                      <p className="text-gray-500 text-sm">{user.email}</p>
                      
                      {user.bio && (
                        <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                          {user.bio}
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="opacity-0 group-hover:opacity-100 transition">
                      <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                        <User size={16} />
                        <span className="font-medium">View Profile</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {users.length > 0 && searchQuery && (
            <div className="border-t border-gray-200 p-4 text-center">
              <p className="text-gray-500 text-sm">
                Showing {users.length} user{users.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            </div>
          )}
        </div>

        {/* Search Tips Footer */}
        <div className="mt-8 p-6 bg-blue-50 rounded-2xl">
          <h3 className="font-semibold text-blue-800 mb-2">Search Tips</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Search by username, real name, or email address</li>
            <li>• Use partial matches (e.g., "joh" finds "John", "Johanna")</li>
            <li>• Search is case-insensitive</li>
            <li>• Click on any user to visit their profile</li>
            <li>• Try searching for: coffee, latte, espresso, barista, brew</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;