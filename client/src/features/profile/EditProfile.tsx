import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import CoffeeProfile from "../../components/CoffeeProfile";
import DeleteAccountModal from "../../components/DeleteAccountModal";
import { FaUserCircle, FaImage, FaCamera } from "react-icons/fa";
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

const COFFEE_LABELS = [
  "Favorite type of coffee",
  "Favorite café in your area", 
  "Your coffee vibe",
  "Favorite coffee bean origin",
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
  console.log("CoverImageURL: ", coverImageUrl);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Store coffee profile from API
  const [categoryAnswers, setCategoryAnswers] = useState<CategoryAnswers>({});
  const [availableQuestions, setAvailableQuestions] = useState<Record<string, CategoryData>>({});

  console.log("Category Answers: ", categoryAnswers)
  // UI state for the 5 selected questions
  const [questions, setQuestions] = useState<(string | null)[]>(
    COFFEE_LABELS.map(() => null)
  );
  const [answers, setAnswers] = useState<string[]>(
    COFFEE_LABELS.map(() => "")
  );

  const [showPicker, setShowPicker] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);

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
        const userResponse = await fetch(`http://localhost:4343/api/auth/${user.id}`, {
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
          ...(data.user.place && { username: data.user.place }); 
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

  // const handleRemoveProfileImage = () => {
  //   setProfileImage(null);
  //   setAvatarUrl('');
  // };

  

  const openPicker = (index: number) => {
    setActiveIndex(index);
    setShowPicker(true);
  };

  const selectQuestion = (q: string) => {
    if (activeIndex === null) return;
    setQuestions((prev) => {
      const copy = [...prev];
      copy[activeIndex] = q;
      return copy;
    });
    setShowPicker(false);
    setActiveIndex(null);
  };

  const closePicker = () => {
    setShowPicker(false);
    setActiveIndex(null);
  };

  const setAnswer = (index: number, value: string) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const isEnabled = () => true;

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

     if (responseData.user && responseData.user.place) {
      setPlace(responseData.user.place); // Update the local state
    }

    console.log('✅ Profile updated successfully');
    
    return responseData.user || responseData;
  } catch (err) {
    console.error('Update user error:', err);
    throw err;
  }
};

const validateForm = (): string | null => {
  // Check if at least one coffee profile question is answered
  const hasCoffeeAnswers = answers.some(answer => answer.trim() !== '');
  if (!hasCoffeeAnswers) {
    return "Please answer at least one coffee profile question";
  }

  // Check name
  if (!name.trim()) {
    return "Name is required";
  }

  // Check username/ID format
  if (!id.trim() || id.length < 3) {
    return "ID must be at least 3 characters";
  }

  // Check for duplicate questions
  const selectedQuestions = questions.filter(q => q !== null);
  const uniqueQuestions = new Set(selectedQuestions);
  if (selectedQuestions.length !== uniqueQuestions.size) {
    return "Please select different questions for each slot";
  }

  return null; // No errors
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
      console.log("Updates: ", updates)
      
      questions.forEach((question, index) => {
        if (question && answers[index]) {
          // Find which category and field this question belongs to
          let found = false;
          Object.entries(questionMap).forEach(([category, fields]) => {
            Object.entries(fields).forEach(([field, qText]) => {
              if (qText === question) {
                if (!updates[category]) updates[category] = {};
                updates[category][field] = answers[index];
                found = true;
              }
            });
          });
          
          // If not found in questionMap, use a default
          if (!found && question && answers[index]) {
            if (!updates.basics) updates.basics = {};
            updates.basics[`custom${index}`] = answers[index];
          }
        }
      });

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

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    console.log("Delete account clicked");
    // You'll need to implement actual delete account functionality
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
    <div className="edit-profile-page">
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
          className={`profile-cover-area ${!coverImageUrl ? 'cover-placeholder' : ''}`}
          onClick={handleCoverImageClick}
          style={coverImageUrl ? { backgroundImage: `url(${coverImageUrl})` } : {}}
        >
          {!coverImageUrl && (
            <div className="cover-placeholder-content">
              <FaImage className="cover-icon" />
              <span>Click to add cover image</span>
            </div>
          )}
          {coverImageUrl && (
            <div className="cover-overlay">
              <FaCamera className="cover-camera-icon" />
              <span>Click to change cover</span>
            </div>
          )}
        </div>
        
        {/* Profile avatar - click to change */}
        <div className="profile-avatar-wrapper">
          <div 
            className={`profile-avatar-container ${!avatarUrl ? 'avatar-placeholder' : ''}`}
            onClick={handleProfileImageClick}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="profile-avatar"
              />
            ) : (
              <FaUserCircle className="profile-avatar-icon" />
            )}
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
          labels={COFFEE_LABELS}
          questions={questions}
          answers={answers}
          showPicker={showPicker}
          activeIndex={activeIndex}
          isEnabled={isEnabled}
          openPicker={openPicker}
          selectQuestion={selectQuestion}
          closePicker={closePicker}
          setAnswer={setAnswer}
          questionOptions={questionOptions}
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