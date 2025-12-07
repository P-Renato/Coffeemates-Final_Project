import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import CoffeeProfile from "../../components/CoffeeProfile";
import DeleteAccountModal from "../../components/DeleteAccountModal";
import { FaCamera } from "react-icons/fa";
import "./ProfilePage.css";

type CoffeeProfileItem = {
  question: string;
  answer: string;
};

type CategoryData = {
  title: string;
  questions: string[];
};

type CategoryAnswers = {
  basics?: Record<string, string>;
  personality?: Record<string, string>;
  taste?: Record<string, string>;
  vibe?: Record<string, string>;
};

type CoffeeProfileUpdates = {
  basics?: Record<string, string>;
  personality?: Record<string, string>;
  taste?: Record<string, string>;
  vibe?: Record<string, string>;
  [key: string]: Record<string, string> | undefined;
};

const DEFAULT_PROFILE_IMAGE = 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg';

const COFFEE_LABELS = [
  "What's your favorite type of coffee?",
  "What's your favorite café in your area?", 
  "How would you describe your coffee vibe?",
  "What's your favorite coffee bean origin?",
  "If you owned a café, what would it be like?",
];

// Map your schema fields to display questions
const questionMap: Record<string, Record<string, string>> = {
  basics: {
    favoriteType: "What's your favorite type of coffee?",
    favoriteCafe: "What's your favorite café in your area?",
    coffeeTime: "Are you a morning or evening coffee person?",
    neighborhood: "What neighborhood do you live in?",
    goToPastry: "What's your go-to pastry or snack with coffee?"
  },
  personality: {
    usualOrder: "What's your usual coffee order?",
    coffeeVibe: "How would you describe your coffee vibe?",
    musicCombo: "What's your perfect coffee & music combo?",
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

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Store coffee profile from API
  const [categoryAnswers, setCategoryAnswers] = useState<CategoryAnswers>({});
  const [availableQuestions, setAvailableQuestions] = useState<Record<string, CategoryData>>({});
  
  // UI state for the 5 selected questions
  const [questions, setQuestions] = useState<(string | null)[]>(
    COFFEE_LABELS.map(() => null)
  );
  const [answers, setAnswers] = useState<string[]>(
    COFFEE_LABELS.map(() => "")
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileRows, setProfileRows] = useState<Array<{question: string | null, answer: string}>>([]);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!token || !user?.id) {
          throw new Error("Not authenticated");
        }

        // 1. Fetch user data
        const userResponse = await fetch(`http://localhost:4343/api/users/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();
        
        // 2. Fetch coffee profile questions and answers
        const profileResponse = await fetch('http://localhost:4343/api/auth/profile/questions', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile questions');
        }

        const profileData = await profileResponse.json();
        
        // Set user data
        setId(userData.user?.username || userData.user?.id || '');
        setName(userData.user?.username || '');
        setAvatarUrl(userData.user?.photoURL ? `http://localhost:4343${userData.user.photoURL}` : '');
        setCoverImageUrl(userData.user?.coverImageURL ? `http://localhost:4343${userData.user.coverImageURL}` : '');
        setPlace(userData.user?.place || ""); 

        // Set coffee profile data
        setAvailableQuestions(profileData.categories || {});
        setCategoryAnswers(profileData.answers || {});

        // Convert category answers to the 5-question format for UI
        const flatAnswers: CoffeeProfileItem[] = [];
        Object.entries(profileData.answers || {}).forEach(([category, fields]) => {
          if (fields && typeof fields === 'object') {
            Object.entries(fields as Record<string, string>).forEach(([field, answer]) => {
              if (answer && answer.trim() !== '') {
                const question = questionMap[category]?.[field] || `${category} - ${field}`;
                flatAnswers.push({ question, answer });
              }
            });
          }
        });

        // Fill the 5 slots with existing answers
        const newQuestions = [...questions];
        const newAnswers = [...answers];
        
        flatAnswers.slice(0, 5).forEach((item, index) => {
          if (index < COFFEE_LABELS.length) {
            newQuestions[index] = item.question;
            newAnswers[index] = item.answer;
          }
        });

        setQuestions(newQuestions);
        setAnswers(newAnswers);

        const rowsForCoffeeProfile: Array<{question: string | null, answer: string}> = [];

        // The default question should always be first
        const defaultQuestion = "What's your favorite type of coffee?";
        let hasDefaultQuestion = false;

        flatAnswers.forEach(item => {
          if (item.question === defaultQuestion) {
            // Put default question first
            rowsForCoffeeProfile.unshift({
              question: item.question,
              answer: item.answer
            });
            hasDefaultQuestion = true;
          } else {
            rowsForCoffeeProfile.push({
              question: item.question,
              answer: item.answer
            });
          }
        });

        // If no default question exists in DB, add it empty
        if (!hasDefaultQuestion) {
          rowsForCoffeeProfile.unshift({
            question: defaultQuestion,
            answer: ""
          });
        }

        setProfileRows(rowsForCoffeeProfile);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.id, token]);

  const handleProfileImageClick = () => {
    profileInputRef.current?.click();
  };

  const handleCoverImageClick = () => {
    coverInputRef.current?.click();
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setCoverImageUrl(previewUrl);
    }
  };

  const uploadImages = async () => {
    if (!profileImage && !coverImage) return;

    const formData = new FormData();
    
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }
    
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }
    
    try {
      const response = await fetch('http://localhost:4343/api/auth/upload/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload images');
      }
      
      // Update with permanent URLs from backend
      if (data.user?.photoURL) {
        const fullUrl = `http://localhost:4343${data.user.photoURL}`;
        console.log('🖼️ Setting avatar URL to:', fullUrl);
        setAvatarUrl(fullUrl);

        updateUser({ 
          photoURL: fullUrl,
          ...(data.user.username && { username: data.user.username }),
          ...(data.user.place && { username: data.user.place }) 
        }); 
      }
      if (data.user?.coverImageURL) {
        const fullUrl = `http://localhost:4343${data.user.coverImageURL}`;
        console.log('🖼️ Setting cover URL to:', fullUrl);
        setCoverImageUrl(fullUrl);
      }
      
      // Clear file states
      setProfileImage(null);
      setCoverImage(null);
      
      return data;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  };  


  const handleUpdateUserProfile = async () => {
  try {
    if (!token || !user?.id) {
      throw new Error("Not authenticated");
    }

    const updateData = {
      username: name,
      place: place
    };

    const response = await fetch(`http://localhost:4343/api/auth/profile/update`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update profile');
    }
    if (responseData.user) {
      updateUser({
        username: responseData.user.username,
        place: responseData.user.place,
        // Also include photoURL if it's returned
        ...(responseData.user.photoURL && { 
          photoURL: `http://localhost:4343${responseData.user.photoURL}` 
        })
      });
    }

     if (responseData.user && responseData.user.place) {
      setPlace(responseData.user.place); // Update the local state
    }

    console.log('✅ Profile updated successfully');
    
    return responseData.user || responseData;
  } catch (err) {
    console.error('Update user error:', err);
    console.log(categoryAnswers)
    throw err;
  }
};

const validateForm = (): string | null => {
  // Check name
  if (!name.trim()) {
    return "Name is required";
  }

  // Check username/ID format
  if (!id.trim() || id.length < 3) {
    return "ID must be at least 3 characters";
  }

  // Check for duplicate questions
  const selectedQuestions = profileRows
    .filter(row => row.question !== null)
    .map(row => row.question);
  const uniqueQuestions = new Set(selectedQuestions);
  if (selectedQuestions.length !== uniqueQuestions.size) {
    return "Please select different questions for each slot";
  }

  return null; 
};


  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!token) {
        throw new Error("Not authenticated");
      }

      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

       if (profileImage || coverImage) {
        await uploadImages();
      }

      await handleUpdateUserProfile();
      // Convert UI questions/answers back to your schema format
      const updates: CoffeeProfileUpdates = {};
      
       profileRows.forEach((row, index) => {
      if (row.question && row.answer.trim()) {
        // Find which category and field this question belongs to
        let found = false;
        Object.entries(questionMap).forEach(([category, fields]) => {
          Object.entries(fields).forEach(([field, qText]) => {
            if (qText === row.question) {
              console.log(`✅ MATCH: category="${category}", field="${field}"`);
              if (!updates[category]) updates[category] = {};
              updates[category][field] = row.answer;
              found = true;
            }
          });
        });
          
          // If not found in questionMap, use a default
          if (!found && row.question && row.answer.trim()) {
            if (!updates.basics) updates.basics = {};
            updates.basics[`custom${index}`] = row.answer;
          }
        }
      });

      // Check if we have updates
    const totalFields = Object.values(updates).reduce((sum, category) => {
      return sum + (category ? Object.keys(category).length : 0);
      }, 0);
      
      console.log(`Total fields to update: ${totalFields}`);
      
      if (totalFields === 0) {
        // Still navigate since user profile might have been updated
        navigate("/profile", { state: { refresh: true } });
        return;
      }

      // Send updates to backend
      const updatePromises = Object.entries(updates).flatMap(([category, fields]) => 
        Object.entries(fields as Record<string, string>).map(([field, answer]) => ({
          category,
          field,
          answer
        }))
      );

      // Update each answer individually or batch them
      for (const update of updatePromises) {
        const response = await fetch('http://localhost:4343/api/auth/profile/answers', {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(update),
        });

        if (!response.ok) {
          throw new Error(`Failed to save: ${update.field}`);
        }
      }

      console.log("Profile saved successfully");
      navigate("/profile", {
        state: { refresh: true }
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
  try {
    setShowDeleteModal(false);
    
    if (!token || !user?.id) {
      throw new Error("Not authenticated");
    }

    // Show confirmation
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    
    if (!confirmed) {
      return;
    }

    console.log("Deleting account with ID:", user.id);
    
    // Call the DELETE endpoint
    const response = await fetch(`http://localhost:4343/api/users/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete account');
    }

    const data = await response.json();
    console.log("✅ Delete successful:", data);
    
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    // Redirect to home page
    navigate('/login');
    
  } catch (err) {
    console.error('Delete account error:', err);
    setError(err instanceof Error ? err.message : 'Failed to delete account');
  }
};

  const handleCancel = () => {
    navigate("/profile");
  };

  if (loading) {
    return <div className="edit-profile-page">Loading...</div>;
  }

  if (error) {
    return (
      <div className="edit-profile-page">
        <div className="error">Error: {error}</div>
        <button onClick={() => navigate("/profile")}>Back to Profile</button>
      </div>
    );
  }

  // Prepare question options from available categories
  const questionOptions: string[] = [];
  Object.values(availableQuestions).forEach((category: CategoryData) => {
    if (category.questions && Array.isArray(category.questions)) {
      questionOptions.push(...category.questions);
    }
  });

  return (
    <div className="edit-profile-page ">
      {/* Hidden file inputs */}
      <input
        type="file"
        accept="image/*"
        onChange={handleProfileImageChange}
        ref={profileInputRef}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleCoverImageChange}
        ref={coverInputRef}
        style={{ display: 'none' }}
      />

      <div className="profile-cover">
        {/* Cover image - click to change */}
        <div 
          className="profile-cover-area"
        onClick={handleCoverImageClick}
        style={{ 
          backgroundImage: `url(${coverImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        >
          
          {coverImageUrl && (
            <div className="cover-overlay">
              <FaCamera className="cover-camera-icon" />
            </div>
          )}
        </div>
        
        {/* Profile avatar - click to change */}
        <div className="profile-avatar-wrapper">
        <div 
          className="profile-avatar-container"
          onClick={handleProfileImageClick}
        >
          <img
            src={avatarUrl || DEFAULT_PROFILE_IMAGE}
            alt={name}
            className="profile-avatar"
          />
          <div className="avatar-overlay">
            <FaCamera className="avatar-camera-icon" />
          </div>
        </div>
      </div>
      </div>

      <div className="edit-profile-content">
        <div className="edit-profile-header">
          <h1 className="edit-profile-title">Edit profile</h1>
          <button 
            className="btn btn-primary" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="edit-profile-form">
          {/* Simple form fields - no extra image upload sections */}
          <div className="form-group">
            <label className="form-label">ID</label>
            <input
              className="form-input"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            {!id.trim() && <span className="error-text">ID is required</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Place</label>
            <input
              className="form-input"
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
          </div>
        </div>

        <CoffeeProfile
          questionOptions={questionOptions}
          initialRows={profileRows}
          onRowsChange={(rows) => {
            const rowsChanged = JSON.stringify(rows) !== JSON.stringify(profileRows);
            if(rowsChanged){
              // Update profileRows when CoffeeProfile changes
              setProfileRows(rows);
              
              // Also update the old questions/answers arrays for backward compatibility
              const newQuestions = rows.map(row => row.question);
              const newAnswers = rows.map(row => row.answer);
              setQuestions(newQuestions);
              setAnswers(newAnswers);

            }
          }}
        />

        <div className="edit-profile-footer">
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>

          <button
            className="btn btn-danger delete-account-button"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete your account
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal
          onCancel={() => setShowDeleteModal(false)}
          onDelete={handleDeleteAccount}
        />
      )}
    </div>
  );
};

export default EditProfile;