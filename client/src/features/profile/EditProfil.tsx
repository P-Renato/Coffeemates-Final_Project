// src/pages/EditProfil.tsx
// client/src/features/profile/EditProfil.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CoffeeProfile from "../../components/CoffeeProfile";
import DeleteAccountModal from "../../components/DeleteAccountModal";
import "./ProfilePage.css"; 

type CoffeeProfileItem = {
  question: string;
  answer: string;
};

type ProfileData = {
  id: string;
  name: string;
  place: string;
  avatarUrl: string;
  coverImageUrl: string;
  coffeematesCount: number;
  postCount: number;
  coffeeProfile: CoffeeProfileItem[];
};

const COFFEE_LABELS = [
  "Favorite type of coffee",
  "Favorite café in your area",
  "Your coffee vibe",
  "Favorite coffee bean origin",
  "If you owned a café, what would it be like?",
];

const EditProfil: React.FC = () => {
  const navigate = useNavigate();

  // same dummy as ProfilePage (later you can share via context / API)
  const initialProfile: ProfileData = {
    id: "mariecoffeelove",
    name: "Marie",
    place: "Berlin, Germany",
    avatarUrl: "/images/marie-avatar.png",
    coverImageUrl: "/images/coffee-cover.png",
    coffeematesCount: 30,
    postCount: 15,
    coffeeProfile: [
      { question: "Favorite type of coffee", answer: "Flat White" },
      { question: "Favorite café in your area", answer: "Never ending love story" },
      { question: "Your coffee vibe", answer: "Cozy" },
      { question: "Favorite coffee bean origin", answer: "Mexico" },
      { question: "If you owned a café, what would it be like?", answer: "Americano" },
    ],
  };

  const [id, setId] = useState(initialProfile.id);
  const [name, setName] = useState(initialProfile.name);
  const [place, setPlace] = useState(initialProfile.place);

  const [questions, setQuestions] = useState<(string | null)[]>(
    COFFEE_LABELS.map((_, index) =>
      initialProfile.coffeeProfile[index]
        ? initialProfile.coffeeProfile[index].question
        : null
    )
  );

  const [answers, setAnswers] = useState<string[]>(
    COFFEE_LABELS.map((_, index) =>
      initialProfile.coffeeProfile[index]
        ? initialProfile.coffeeProfile[index].answer
        : ""
    )
  );

  const [showPicker, setShowPicker] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const isEnabled = (_index: number) => true; // now all rows are enabled

  const handleSave = () => {
    const coffeeProfile: CoffeeProfileItem[] = COFFEE_LABELS.map(
      (_label, index) => ({
        question: questions[index] || COFFEE_LABELS[index],
        answer: answers[index] || "",
      })
    );

    const updated: ProfileData = {
      ...initialProfile,
      id,
      name,
      place,
      coffeeProfile,
    };

    console.log("Saved profile:", updated);

    // for now just go back to profile page
    navigate("/profile");
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    console.log("Delete account clicked");
    // you can redirect or show a message here
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="edit-profile-page">
      <div className="profile-cover">
        <img
          src={initialProfile.coverImageUrl}
          alt="Cover"
          className="profile-cover-image"
        />
        <div className="profile-avatar-wrapper">
          <img
            src={initialProfile.avatarUrl}
            alt={initialProfile.name}
            className="profile-avatar"
          />
        </div>
      </div>

      <div className="edit-profile-content">
        <div className="edit-profile-header">
          <h1 className="edit-profile-title">Edit profile</h1>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>

        <div className="edit-profile-form">
          <div className="form-group">
            <label className="form-label">ID</label>
            <input
              className="form-input"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
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
