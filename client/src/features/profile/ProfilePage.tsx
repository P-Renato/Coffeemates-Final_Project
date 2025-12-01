// src/pages/ProfilePage.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
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

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  // ◆ for now: dummy data (replace with real data later)
  const profile: ProfileData = {
    id: "mariecoffeelove",
    name: "Marie",
    place: "Berlin, Germany",
    avatarUrl: "/images/marie-avatar.png",    // 画像パスは好きに変更
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

  // true → 自分のページ / false → 他人のページ
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
              <>
              <button className="btn btn-secondary" onClick={handleEdit}>
                Edit Profile
              </button>
              <p className="btn btn-secondary">
                <NavLink to={"/admin"}>Admin Page</NavLink>
              </p>
              </>
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
            {profile.coffeeProfile.map((item, index) => (
              <div className="coffee-profile-row" key={index}>
                <div className="coffee-profile-question">
                  {item.question}
                </div>
                <div className="coffee-profile-answer">{item.answer}</div>
              </div>
            ))}
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
