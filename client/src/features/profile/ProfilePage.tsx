import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Adjust path as needed
import "./ProfilePage.css";

type CoffeeProfileData = {
  basics?: {
    favoriteType?: string;
    neighborhood?: string;
    favoriteCafe?: string;
    coffeeTime?: string;
    goToPastry?: string;
  };
  personality?: {
    usualOrder?: string;
    musicCombo?: string;
    coffeeVibe?: string;
    friendCafe?: string;
    dateCafe?: string;
    coffeeStylePerson?: string;
  };
  taste?: {
    beanOrigin?: string;
    roastPreference?: string;
    brewingMethod?: string;
    milkChoice?: string;
    sugarSyrup?: string;
  };
  vibe?: {
    coffeeMeaning?: string;
    bestMemory?: string;
    idealMate?: string;
    dreamCafe?: string;
    cafeToVisit?: string;
  };
};

type ProfileData = {
  id: string;
  name: string;
  place: string;
  avatarUrl: string;
  coverImageUrl: string;
  coffeematesCount: number;
  postCount: number;
  coffeeProfile: CoffeeProfileData;
};

// Map your schema fields to display-friendly questions
const questionMap: Record<string, Record<string, string>> = {
  basics: {
    favoriteType: "What's your favorite type of coffee?",
    neighborhood: "What neighborhood do you live in?",
    favoriteCafe: "What's your favorite café in your area?",
    coffeeTime: "Are you a morning or evening coffee person?",
    goToPastry: "What's your go-to pastry or snack with coffee?"
  },
  personality: {
    usualOrder: "What's your usual coffee order?",
    musicCombo: "What's your perfect coffee & music combo?",
    coffeeVibe: "How would you describe your coffee vibe?",
    friendCafe: "What café would you take a friend to?",
    dateCafe: "What café would you go to on a date?",
    coffeeStylePerson: "If your coffee style were a person, who would it be?"
  },
  taste: {
    beanOrigin: "What's your favorite coffee bean origin?",
    roastPreference: "What's your roast preference?",
    brewingMethod: "What's your favorite brewing method?",
    milkChoice: "What's your milk of choice?",
    sugarSyrup: "Do you add sugar or syrup?"
  },
  vibe: {
    coffeeMeaning: "What does coffee mean to you?",
    bestMemory: "What's your best coffee memory?",
    idealMate: "Who is your ideal coffee mate?",
    dreamCafe: "If you owned a café, what would it be like?",
    cafeToVisit: "What café do you dream of visiting one day?"
  }
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);


        if (!token) {
          throw new Error('No authentication token available');
        }
        console.log('🔵 Using token from localStorage:', token.substring(0, 20) + '...');

        // Fetch user profile data
        const userResponse = await fetch(`http://localhost:4343/api/auth/${user?.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();

        // Fetch coffee profile questions and answers
        const profileResponse = await fetch('http://localhost:4343/api/auth/profile/questions', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('🔵 Profile response status:', profileResponse.status);

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile questions');
        }

        const profileData = await profileResponse.json();

        // Transform the API responses to match your ProfileData type
        const transformedProfile: ProfileData = {
          id: userData.user?.username || userData.user?.id || 'unknown',
          name: userData.user?.username || 'Unknown User',
          place: userData.user?.place || "Unknown location", // You might need to add this to your user model
          avatarUrl: userData.user?.photoURL || "/images/default-avatar.png",
          coverImageUrl: "/images/default-cover.png", // Add this to your user model if needed
          coffeematesCount: 0, // You'll need to implement followers/following
          postCount: 0, // You'll need to implement post count
          coffeeProfile: profileData.answers || {},
        };

        setProfile(transformedProfile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  // Helper function to convert coffee profile data to display format
  const getCoffeeProfileDisplay = (coffeeProfile: CoffeeProfileData) => {
    const displayItems: { question: string; answer: string }[] = [];

    // Iterate through each category and field
    Object.entries(coffeeProfile).forEach(([category, fields]) => {
      if (fields && typeof fields === 'object') {
        Object.entries(fields).forEach(([field, answer]) => {
          if (answer && answer.trim() !== '') {
            const question = questionMap[category]?.[field] || `${category} - ${field}`;
            displayItems.push({
              question,
              answer: answer as string
            });
          }
        });
      }
    });

    return displayItems;
  };

  const isOwnProfile = true;

  const handleEdit = () => {
    navigate("/edit-profile");
  };

  const handleFollow = () => {
    console.log("Follow clicked");
  };

  const handleSendMessage = () => {
    console.log("Send message clicked");
  };

  // Loading state
  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="profile-page">
        <div className="error">Error: {error}</div>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="error">Profile not found</div>
      </div>
    );
  }

  const coffeeProfileDisplay = getCoffeeProfileDisplay(profile.coffeeProfile);

  return (
    <div className="profile-page">
      {/* Cover */}
      <div className="profile-cover">
        <img
          src={profile.coverImageUrl}
          alt="Cover"
          className="profile-cover-image"
        />
        <div className="profile-avatar-wrapper">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="profile-avatar"
          />
        </div>
      </div>

      <div className="profile-content">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-main-info">
            <div className="profile-id">@{profile.id}</div>
            <h1 className="profile-name">{profile.name}</h1>
            <div className="profile-place">{profile.place}</div>

            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-label">Coffeemates</span>
                <span className="profile-stat-value">
                  {profile.coffeematesCount}
                </span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-label">Post</span>
                <span className="profile-stat-value">
                  {profile.postCount}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            {isOwnProfile ? (
              <button className="btn btn-secondary" onClick={handleEdit}>
                Edit Profile
              </button>
            ) : (
              <>
                <button className="btn btn-primary" onClick={handleFollow}>
                  Follow
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleSendMessage}
                >
                  Send Message
                </button>
              </>
            )}
          </div>
        </div>

        {/* Coffee profile (read-only) */}
        <section className="profile-section">
          <h2 className="section-title">Coffee profile</h2>
          <div className="section-subtitle">
            Tell us up to five things you love about coffee.
          </div>

          <div className="coffee-profile-table">
            {coffeeProfileDisplay.length > 0 ? (
              coffeeProfileDisplay.map((item, index) => (
                <div className="coffee-profile-row" key={index}>
                  <div className="coffee-profile-question">
                    {item.question}
                  </div>
                  <div className="coffee-profile-answer">{item.answer}</div>
                </div>
              ))
            ) : (
              <div className="no-coffee-profile">
                No coffee profile information available. 
                {isOwnProfile && (
                  <button 
                    onClick={() => navigate("/edit-profile")}
                    className="btn-link"
                  >
                    Add your coffee preferences
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Posts (placeholder) */}
        <section className="profile-section">
          <h2 className="section-title">Post</h2>
          <div className="post-list">
            <div className="post-card placeholder" />
            <div className="post-card placeholder" />
            <div className="post-card placeholder" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;