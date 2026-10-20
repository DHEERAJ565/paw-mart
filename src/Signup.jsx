import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { registerUser } from "./api/authApi";
import {
  PawPrint,
  UserRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Heart,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import "./Auth.css";

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

 const [loading, setLoading] = useState(false);

const handleSubmit = async (event) => {
  event.preventDefault();
  setError("");

  if (
    !formData.name.trim() ||
    !formData.email.trim() ||
    !formData.password ||
    !formData.confirmPassword
  ) {
    setError("Please complete all the required fields.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (formData.password.length < 8) {
    setError("Your password must contain at least 8 characters.");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError("Your passwords don't match. Please try again.");
    return;
  }

  if (!formData.agree) {
    setError("Please accept the terms to continue.");
    return;
  }

  try {
    setLoading(true);

    await registerUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    });

    navigate("/login", {
      state: { message: "Account created successfully! Please log in." },
    });
  } catch (error) {
    setError(error.message || "Unable to create your account.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-page">
      {/* Left visual panel */}
      <motion.aside
        className="auth-visual signup-visual"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="auth-visual-image" />

        <div className="auth-visual-overlay" />

        <Link to="/" className="auth-brand">
          <span className="auth-brand-icon">
            <PawPrint size={25} />
          </span>

          <span>
            paw<span>mart</span>
            <small>YOUR BEST FRIEND STARTS HERE</small>
          </span>
        </Link>

        <div className="auth-visual-content">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="auth-kicker">
              <Heart size={15} fill="currentColor" />
              YOUR STORY STARTS HERE
            </span>

            <h1>
              A new friend.
              <br />
              A whole lot of <span>love.</span>
            </h1>

            <p>
              Join a community that believes the world is a better place
              when every dog has someone to call family.
            </p>

            <div className="signup-feature-list">
              <div>
                <CheckCircle2 size={19} />
                <span>Discover your perfect companion</span>
              </div>

              <div>
                <CheckCircle2 size={19} />
                <span>Explore responsible adoption options</span>
              </div>

              <div>
                <CheckCircle2 size={19} />
                <span>Make memories that last a lifetime</span>
              </div>
            </div>

            <div className="auth-review-card signup-review-card">
              <div className="signup-review-icon">
                <Heart size={23} fill="currentColor" />
              </div>

              <div>
                <strong>More than a membership.</strong>
                <p>It's the beginning of a beautiful friendship.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="auth-visual-footer">
          <span>GOOD PEOPLE. HAPPY PAWS.</span>
          <PawPrint size={16} />
        </div>

        <div className="auth-floating-paw auth-floating-paw-one">
          <PawPrint size={35} />
        </div>

        <div className="auth-floating-paw auth-floating-paw-two">
          <Heart size={23} />
        </div>
      </motion.aside>

      {/* Right signup panel */}
      <main className="auth-form-side signup-form-side">
        <div className="auth-mobile-brand">
          <Link to="/" className="auth-brand auth-brand-mobile">
            <span className="auth-brand-icon">
              <PawPrint size={23} />
            </span>

            <span>
              paw<span>mart</span>
              <small>YOUR BEST FRIEND STARTS HERE</small>
            </span>
          </Link>
        </div>

        <div className="auth-top-link">
          <span>Already part of PawMart?</span>
          <Link to="/login">Log in</Link>
        </div>

        <motion.section
          className="auth-form-container signup-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-welcome-icon">
            <PawPrint size={26} />
          </div>

          <span className="auth-form-eyebrow">JOIN THE PAWMART FAMILY</span>

          <h2>Let's make it official.</h2>

          <p className="auth-form-description">
            Create your account and find your new best friend.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="signup-name">Your full name</label>

              <div className="auth-input-wrapper">
                <UserRound size={19} />

                <input
                  id="signup-name"
                  type="text"
                  name="name"
                  placeholder="What should we call you?"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="signup-email">Email address</label>

              <div className="auth-input-wrapper">
                <Mail size={19} />

                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="signup-password">Create password</label>

              <div className="auth-input-wrapper">
                <Lock size={19} />

                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="signup-confirm-password">
                Confirm password
              </label>

              <div className="auth-input-wrapper">
                <Lock size={19} />

                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Enter your password again"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <label className="auth-checkbox auth-terms">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
              />

              <span className="auth-custom-checkbox" />

              <span>
                I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
                <Link to="/privacy">Privacy Policy</Link>.
              </span>
            </label>

            {error && (
              <div className="auth-message" role="status">
                {error}
              </div>
            )}

            <button
  type="submit"
  className="auth-submit-button"
  disabled={loading}
>
  {loading ? "Creating account..." : "Create My Account"}
  {!loading && <ArrowRight size={18} />}
</button>
          </form>

          <div className="auth-security-note signup-security-note">
            <ShieldCheck size={19} />

            <p>
              <strong>A safe place for pet lovers.</strong>
              <span>Your journey toward a new friendship starts here.</span>
            </p>
          </div>

          <p className="auth-switch-text">
            Already have an account? <Link to="/login">Log in here</Link>
          </p>
        </motion.section>

        <footer className="auth-bottom-footer">
          <span>© {new Date().getFullYear()} PawMart</span>
          <span>Made with <Heart size={12} fill="currentColor" /> for pets</span>
        </footer>
      </main>
    </div>
  );
}