// src/pages/LoginPage.tsx
import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import bgImage from "../../assets/cafe_login-signup-page.png";
import styles from "./AuthLayout.module.css";
import "../../styles/_global.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaUserCircle } from "react-icons/fa";

interface LoginFormData {
  login: string; // email or username
  password: string;
}

interface Status {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialFormData: LoginFormData = {
  login: "",
  password: "",
};

const API_BASE_URL = "http://localhost:4343/api/auth/login";

const LoginPage: React.FC = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [status, setStatus] = useState<Status>({
    loading: false,
    error: null,
    success: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
        let errorMessage = "Login failed.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // ignore
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Login Successful! ", data);

      const token = data.token || data.user?.token;
      const user = data.user || data.userData;

      if (token && user) {
        authLogin(token, user);
        setStatus({ loading: false, error: null, success: true });

        if (user.email === "example@admin.com") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        throw new Error(
          "Invalid response from server: missing token or user data"
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "A network error occurred during login.";
      console.error("Login Error:", errorMessage);
      setStatus({ loading: false, error: errorMessage, success: false });
    } finally {
      setStatus((s) => ({ ...s, loading: false }));
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

        <div className={styles.authSidebarWelcome}>Welcome back!</div>
      </aside>

      {/* Right side */}
      <main className={styles.authMain}>
        <div
          className={styles.authMainBg}
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        <div className={styles.authMainContent}>
          <section className={styles.authCard}>
            <h1 className={styles.authCardTitle}>Coffeemates</h1>
            <p className={styles.authCardSubtitle}>
              Log in and see what your coffeemates are sipping.
            </p>

            {/* Social logins */}
            <div className={styles.authSocialRow}>
              <button
                type="button"
                className={styles.authBtnSocial}
                onClick={() =>
                  (window.location.href =
                    "http://localhost:4343/api/auth/google")
                }
              >
                <span>Login with Google</span>
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
                <span>Login with Facebook</span>
                <FaFacebook size={20} />
              </button>
            </div>

            <div className={styles.authOr}>
              <span className={styles.authOrLine} />
              <span>or sign in with your email</span>
              <span className={styles.authOrLine} />
            </div>

            {/* Email/password form */}
            <div className={styles.authFormSection}>
              <h2 className={styles.authFormSectionTitle}>Login</h2>

              {status.error && (
                <p className={styles.authError}>Error: {status.error}</p>
              )}
              {status.loading && (
                <p className={styles.authLoading}>Logging in...</p>
              )}

              <form className={styles.authForm} onSubmit={handleSubmit}>
                <div className={styles.authFieldGroup}>
                  <label className={styles.authLabel} htmlFor="login">
                    Email or Username
                  </label>
                  <input
                    id="login"
                    name="login"
                    type="text"
                    className={styles.authInput}
                    value={formData.login}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                  />
                </div>

                <div className={styles.authFieldGroup}>
                  <label className={styles.authLabel} htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={styles.authInput}
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={styles.authBtnPrimary}
                  disabled={status.loading}
                >
                  {status.loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <p className={styles.authBottomText}>
                Don&apos;t have an account? <Link to="/signup">Create one</Link>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
