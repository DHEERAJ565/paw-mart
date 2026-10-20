import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loginUser } from "./api/authApi";
import {
  PawPrint,
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

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: true,
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

  if (!formData.email.trim() || !formData.password) {
    setError("Please enter your email and password.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    setError("Please enter a valid email address.");
    return;
  }

  try {
    setLoading(true);

    const result = await loginUser({
      email: formData.email.trim(),
      password: formData.password,
    });

    // Save basic user information for the current browser session.
    sessionStorage.setItem("pawMartUser", JSON.stringify(result.user));

    navigate("/");
  } catch (error) {
    setError(error.message || "Unable to log in. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-page">
      {/* Left visual panel */}
      <motion.aside
        className="auth-visual"
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
              A LITTLE MORE LOVE EVERY DAY
            </span>

            <h1>
              Home is where
              <br />
              the <span>paws are.</span>
            </h1>

            <p>
              Your next best friend is waiting. Discover a world of wagging
              tails, wet noses, and unconditional love.
            </p>

            <div className="auth-review-card">
              <div className="auth-review-top">
                <div className="auth-mini-avatars">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                    alt=""
                  />
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                    alt=""
                  />
                  <img
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=80&q=80"
                    alt=""
                  />
                </div>

                <div className="auth-review-stars">★★★★★</div>
              </div>

              <p>
                "Finding our little Milo was the best thing that ever
                happened to us!"
              </p>

              <span className="auth-review-author">
                <CheckCircle2 size={14} /> A happy pet parent
              </span>
            </div>
          </motion.div>
        </div>

        <div className="auth-visual-footer">
          <span>MADE FOR PAWS AND PEOPLE</span>
          <PawPrint size={16} />
        </div>

        <div className="auth-floating-paw auth-floating-paw-one">
          <PawPrint size={35} />
        </div>

        <div className="auth-floating-paw auth-floating-paw-two">
          <Heart size={23} />
        </div>
      </motion.aside>

      {/* Right login panel */}
      <main className="auth-form-side">
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
          <span>New to PawMart?</span>
          <Link to="/register">Create an account</Link>
        </div>

        <motion.section
          className="auth-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-welcome-icon">
            <PawPrint size={26} />
          </div>

          <span className="auth-form-eyebrow">WELCOME BACK</span>

          <h2>Good to see you again.</h2>

          <p className="auth-form-description">
            Your best friend is just a few clicks away.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="login-email">Email address</label>

              <div className="auth-input-wrapper">
                <Mail size={19} />

                <input
                  id="login-email"
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
              <div className="auth-label-row">
                <label htmlFor="login-password">Password</label>

                <Link to="/forgot-password" className="auth-forgot-link">
                  Forgot password?
                </Link>
              </div>

              <div className="auth-input-wrapper">
                <Lock size={19} />

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
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

            <label className="auth-checkbox">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              <span className="auth-custom-checkbox" />
              <span>Remember me</span>
            </label>

            {error && (
              <div className="auth-message" role="status">
                {error}
              </div>
            )}

            {/* <button type="submit" className="auth-submit-button">
              Log in to PawMart <ArrowRight size={18} />
            </button> */}
            <button
  type="submit"
  className="auth-submit-button"
  disabled={loading}
>
  {loading ? "Logging in..." : "Log in to PawMart"}
  {!loading && <ArrowRight size={18} />}
</button>
          </form>

          <div className="auth-divider">
            <span>YOUR PAWMART EXPERIENCE</span>
          </div>

          <div className="auth-security-note">
            <ShieldCheck size={19} />

            <p>
              <strong>Your account, your peace of mind.</strong>
              <span>We're here to make your pet journey special.</span>
            </p>
          </div>

          <p className="auth-switch-text">
            Don't have an account? <Link to="/register">Sign up for free</Link>
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