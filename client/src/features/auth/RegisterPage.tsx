// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../../assets/cafe_login-signup-page.png";
import styles from "./AuthLayout.module.css";
import "../../styles/_global.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaUserCircle } from "react-icons/fa";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

interface Status {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialFormData: RegisterFormData = {
  username: "",
  email: "",
  password: "",
};

// change to actual backend URL when deployed or running locally
const API_BASE_URL = "http://localhost:4343/api/auth/register";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState<RegisterFormData>(initialFormData);
  const [status, setStatus] = useState<Status>({
    loading: false,
    error: null,
    success: false,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status.loading) return;

    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorMessage =
          "Registration failed due to server error.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // ignore JSON parse errors and keep default message
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Registration Successful: ", result);

      setStatus({ loading: false, error: null, success: true });
      setFormData(initialFormData);

      // show success message briefly, then redirect
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "A network error occurred.";
      console.error("Registration Error:", errorMessage);
      setStatus({ loading: false, error: errorMessage, success: false });
    }
  };

  return (
    <div className={styles.authLayout}>
      {/* Left sidebar */}
      <aside className={styles.authSidebar}>
        <div className={styles.authSidebarLogo}>Coffeemates</div>

        <div className={styles.authSidebarAvatar}>
          <FaUserCircle className={styles.avatarIcon} />
        </div>

        <div className={styles.authSidebarWelcome}>Welcome!</div>
      </aside>

      {/* Right side main area */}
      <main className={styles.authMain}>
        {/* Background image */}
        <div
          className={styles.authMainBg}
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        {/* Foreground content */}
        <div className={styles.authMainContent}>
          <section className={styles.authCard}>
            <h1 className={styles.authCardTitle}>Coffeemates</h1>
            <p className={styles.authCardSubtitle}>
              Create your account and share your favorite brews.
            </p>

            {/* Social signup buttons */}
            <div className={styles.authSocialRow}>
              <button
                type="button"
                className={styles.authBtnSocial}
                onClick={() =>
                  (window.location.href =
                    "http://localhost:4343/api/auth/google")
                }
              >
                <span>Sign up with Google</span>
                <FcGoogle size={22} />
              </button>

              <button
                type="button"
                className={`${styles.authBtnSocial} ${styles.authBtnSocialPrimary}`}
                onClick={() =>
                  (window.location.href =
                    "http://localhost:4343/api/auth/facebook")
                }
              >
                <span>Sign up with Facebook</span>
                <FaFacebook size={20} />
              </button>
            </div>

            {/* OR separator */}
            <div className={styles.authOr}>
              <span className={styles.authOrLine} />
              <span>or create an account with email</span>
              <span className={styles.authOrLine} />
            </div>

            {/* Form section */}
            <div className={styles.authFormSection}>
              <h2 className={styles.authFormSectionTitle}>
                Create Account
              </h2>

              {status.error && (
                <p className={styles.authError}>
                  Error: {status.error}
                </p>
              )}
              {status.success && (
                <p className={styles.authSuccess}>
                  Success! Redirecting to login...
                </p>
              )}
              {status.loading && (
                <p className={styles.authLoading}>Creating account...</p>
              )}

              <form
                className={styles.authForm}
                onSubmit={handleSubmit}
              >
                {/* username */}
                <div className={styles.authFieldGroup}>
                  <label
                    className={styles.authLabel}
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className={styles.authInput}
                    required
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>

                {/* email */}
                <div className={styles.authFieldGroup}>
                  <label
                    className={styles.authLabel}
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={styles.authInput}
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* password */}
                <div className={styles.authFieldGroup}>
                  <label
                    className={styles.authLabel}
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={styles.authInput}
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className={styles.authBtnPrimary}
                  disabled={status.loading}
                >
                  {status.loading
                    ? "Creating account..."
                    : "Create Account"}
                </button>
              </form>

              <p className={styles.authBottomText}>
                Already have an account?{" "}
                <Link to="/login">Log in</Link>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
