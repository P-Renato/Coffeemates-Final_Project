import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Adjust path as needed
import "./ProfilePage.css";
import { getPostsByUserId } from '../../api/postApi';
import PostCard from '../../components/PostCard';
import type { PostType } from '../../utils/types';
import { useAppContext } from "../../context/LocationPostContext";
import PopUpPost from "../posts/PopUpPost";

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
    goToPastry: "What's your go-to pastry or snack with coffee?",
  },
  personality: {
    usualOrder: "What's your usual coffee order?",
    musicCombo: "What's your perfect coffee & music combo?",
    coffeeVibe: "How would you describe your coffee vibe?",
    friendCafe: "What café would you take a friend to?",
    dateCafe: "What café would you go to on a date?",
    coffeeStylePerson: "If your coffee style were a person, who would it be?",
  },
  taste: {
    beanOrigin: "What's your favorite coffee bean origin?",
    roastPreference: "What's your roast preference?",
    brewingMethod: "What's your favorite brewing method?",
    milkChoice: "What's your milk of choice?",
    sugarSyrup: "Do you add sugar or syrup?",
  },
  vibe: {
    coffeeMeaning: "What does coffee mean to you?",
    bestMemory: "What's your best coffee memory?",
    idealMate: "Who is your ideal coffee mate?",
    dreamCafe: "If you owned a café, what would it be like?",
    cafeToVisit: "What café do you dream of visiting one day?",
  },
};

const DEFAULT_PROFILE_IMAGE = 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const { postPopup, setPostPopup, editingPost, setEditingPost } = useAppContext();

  const location = useLocation();

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setPostsLoading(true);
        setError(null);

        if (!token) {
          throw new Error("No authentication token available");
        }
        
        if (!user || !user.id) {
          throw new Error('User not authenticated');
        }
        // Fetch user profile data
        const userResponse = await fetch(`http://localhost:4343/api/users/${user.id}?t=${Date.now()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();

        // Fetch coffee profile
        const profileResponse = await fetch('http://localhost:4343/api/auth/profile/questions', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch profile questions");
        }

        const profileData = await profileResponse.json();

        // Transform the API responses
        const transformedProfile: ProfileData = {
          id: userData.user?.username || userData.user?.id || 'unknown',
          name: userData.user?.username || 'Unknown User',
          place: userData.user?.place || "Unknown location",
          avatarUrl: userData.user?.photoURL 
            ? `http://localhost:4343${userData.user.photoURL}`
            : "/images/default-avatar.png",
          coverImageUrl: userData.user?.coverImageURL 
            ? `http://localhost:4343${userData.user.coverImageURL}`
            : "/images/default-cover.png",
          coffeematesCount: 0,
          postCount: 0, // Will update after fetching posts
          coffeeProfile: profileData.answers || {},
        };

        setProfile(transformedProfile);

        console.log("📱 Fetching posts for user:", user.id);
        try {
          const posts = await getPostsByUserId(user.id);
          // console.log("✅ Fetched posts:", posts.length);
          setUserPosts(posts);

          transformedProfile.postCount = posts.length;
          setProfile(transformedProfile);
        } catch (postError) {
          console.error("Error fetching posts:", postError);
        }

        // console.log("First post data structure:", userPosts[0]);
        // console.log("User object in post:", userPosts[0]?.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
        setPostsLoading(false);
      }
    };

    if (user && token) {
      fetchProfile();
    } else {
      setLoading(false);
      setPostsLoading(false);
    }
  }, [user, token, navigate, location.state?.refresh]);

  const getCoffeeProfileDisplay = (coffeeProfile: CoffeeProfileData) => {
    const displayItems: { question: string; answer: string }[] = [];

    // Iterate through each category and field
    Object.entries(coffeeProfile).forEach(([category, fields]) => {
      if (fields && typeof fields === "object") {
        Object.entries(fields).forEach(([field, answer]) => {
          if (answer && answer.trim() !== "") {
            const question =
              questionMap[category]?.[field] || `${category} - ${field}`;
            displayItems.push({
              question,
              answer: answer as string,
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

  const handlePostCreated = (newPost: PostType) => {
    // Add the new post to local state
    setUserPosts(prev => [newPost, ...prev]);
    
    // Update post count
    if (profile) {
      setProfile(prev => prev ? {
        ...prev,
        postCount: prev.postCount + 1
      } : null);
    }
  };

  const handlePostUpdated = (updatedPost: PostType) => {
    // Update the post in local state
    setUserPosts(prev => prev.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handleEditPost = (post: PostType) => {
    setEditingPost(post);
    setPostPopup(true);
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
    <div className="profile-page bg-[#F5F4F2]">

      {/* Show PopUpPost when postPopup is true */}
      {postPopup && (
        <PopUpPost 
          postToEdit={editingPost}
          onSuccess={(post, isEdit) => {
            if (isEdit) {
              handlePostUpdated(post);
            } else {
              handlePostCreated(post);
            }
            setPostPopup(false);
            setEditingPost(null);
          }}
        />
      )}

    {/* Cover */}
    <div className="profile-cover">
      <div 
        className="profile-cover-image"
        style={{ 
          backgroundImage: `url(${profile.coverImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '300px', // or whatever height you use
          width: '100%'
        }}
      />
    
      <div className="profile-avatar-wrapper">
        <img
          src={profile.avatarUrl || DEFAULT_PROFILE_IMAGE}
          alt={profile.name}
          className="profile-avatar"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
          }}
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
                <span className="profile-stat-value">{profile.postCount}</span>
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
                  <div className="coffee-profile-question">{item.question}</div>
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
            
        {/* Posts Section - REPLACE THIS */}
        <section className="profile-section">
        <h2 className="section-title">Posts ({userPosts.length})</h2>
         {/* Add Post Button for existing posts */}
        {isOwnProfile && userPosts.length > 0 && (
          <div className="add-post-container">
            <button
              onClick={() => setPostPopup(true)}
              className="btn btn-primary add-post-btn"
            >
              + Add New Post
            </button>
          </div>
        )}
        <br />
        {postsLoading ? (
          <div className="loading-posts">Loading posts...</div>
        ) : userPosts.length === 0 ? (
          <div className="no-posts-message">
            <div className="no-posts-icon">☕</div>
            <p>No posts yet. Share your coffee experiences!</p>
            {isOwnProfile && (
              <button
                onClick={() => setPostPopup(true)} // Now this will show PopUpPost
                className="btn btn-primary"
              >
                Create Your First Post
              </button>
            )}
          </div>
        ) : (
          <div className="posts-grid">
            {userPosts.map((post) => (
              <div key={post._id || post.pid} className="mb-4">
                {/* Add edit button if it's user's own post
                {isOwnProfile && (
                  <button
                    onClick={() => handleEditPost(post)}
                    className="edit-post-btn"
                  >
                    Edit
                  </button>
                )}
                   */}
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
        
       
      </section>
      </div>
    </div>
  );
};
    
export default ProfilePage;