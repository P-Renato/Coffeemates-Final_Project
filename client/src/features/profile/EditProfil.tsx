import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import CoffeeProfile from "../../components/CoffeeProfile";
import DeleteAccountModal from "../../components/DeleteAccountModal";
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

const EditProfil: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

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
        setAvatarUrl(userData.user?.photoURL || '/images/default-avatar.png');
        setCoverImageUrl('/images/default-cover.png');
        setPlace(userData.user?.place || "Unknown location"); // You might want to add this to your user model

        // Set coffee profile data
        setAvailableQuestions(profileData.categories || {});
        setCategoryAnswers(profileData.answers || {});

        // Convert category answers to the 5-question format for UI
        // This is a simplified version - you might need to adjust based on your UI needs
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
    
    return responseData; 
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
      navigate("/profile");

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
      <div className="profile-cover">
        <img
          src={coverImageUrl}
          alt="Cover"
          className="profile-cover-image"
        />
        <div className="profile-avatar-wrapper">
          <img
            src={avatarUrl}
            alt={name}
            className="profile-avatar"
          />
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

export default EditProfil;