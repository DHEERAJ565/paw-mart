// ========================================
// ENVIRONMENT CONFIGURATION
// ========================================

const dotenv = require("dotenv");
dotenv.config();

// ========================================
// IMPORTS
// ========================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const breedRoutes = require("./routes/breedRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const bookingRoutes = require("./bookingRoutes");
const petHealthRoutes = require("./petHealthRoutes");
const petListingRoutes = require("./routes/petListingRoutes");
const adoptionRoutes = require("./adoptionRoutes");

const DogBreed = require("./models/DogBreed");
const User = require("./models/User");

// ========================================
// APP INITIALIZATION
// ========================================

const app = express();

// ========================================
// MIDDLEWARE
// Register middleware before API routes.
// ========================================

app.use(
  cors({
    origin:
      process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(cookieParser());

// ========================================
// EMAIL CONFIGURATION
// ========================================

const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD?.replace(/\s/g, ""),
  },
});

// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================

async function authenticateUser(req, res, next) {
  try {
    const token = req.cookies.pawMartToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please log in to access your account.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");

      return res.status(500).json({
        success: false,
        message: "Server authentication is not configured.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Your session is invalid or expired. Please log in again.",
    });
  }
}

// ========================================
// ROLE AUTHORIZATION MIDDLEWARE
// ========================================

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action.",
      });
    }

    return next();
  };
}

// ========================================
// HELPER: CLEAR RESET OTP
// ========================================

function clearResetOtp(user) {
  user.resetOtpHash = undefined;
  user.resetOtpExpires = undefined;
  user.resetOtpAttempts = 0;
  user.resetOtpLastSent = undefined;
}

// ========================================
// HELPER: HASH OTP
// ========================================

function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

// ========================================
// DOG BREEDS TEST ROUTE
// ========================================

app.get("/api/dogbreeds-test", async (req, res) => {
  try {
    const breeds = await DogBreed.find()
      .sort({ breed: 1 })
      .limit(5)
      .lean();

    const total = await DogBreed.countDocuments();

    return res.json({
      success: true,
      total,
      breeds,
    });
  } catch (error) {
    console.error("Dog breeds test error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch dog breeds.",
    });
  }
});

// ========================================
// EXISTING API ROUTES
// ========================================

app.use("/api/breeds", breedRoutes);

app.use("/api/favorites", favoriteRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/pets", petListingRoutes);

// ========================================
// BOOKING ROUTES
// Authentication required
// ========================================

app.use(
  "/api/bookings",
  authenticateUser,
  bookingRoutes
);

// ========================================
// ADOPTION ROUTES
// Public enquiries unless the router
// itself applies authentication.
// ========================================

app.use("/api/adoption", adoptionRoutes);

// ========================================
// PAWCARE HEALTH ROUTES
// Authentication required
// ========================================

app.use(
  "/api/pet-health",
  authenticateUser,
  petHealthRoutes
);

// ========================================
// ROOT TEST ROUTE
// ========================================

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "PawMart backend is running!",
  });
});

// ========================================
// SIGNUP / REGISTER
// ========================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    if (name.trim().length > 80) {
      return res.status(400).json({
        success: false,
        message: "Name cannot exceed 80 characters.",
      });
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must contain 8 to 72 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check whether the email is already registered.
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Hash the password before saving it.
    const hashedPassword = await bcrypt.hash(password, 12);

    // Do not accept a role from the public signup request.
    // The User model should default new users to "customer".
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    console.error("Signup error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create account.",
    });
  }
});

// ========================================
// LOGIN
// ========================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");

      return res.status(500).json({
        success: false,
        message: "Server authentication is not configured.",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("pawMartToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to log in.",
    });
  }
});

// ========================================
// FORGOT PASSWORD: SEND OTP
// ========================================

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    // Correct email validation regex.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_APP_PASSWORD
    ) {
      console.error("Email configuration is missing.");

      return res.status(500).json({
        success: false,
        message: "Email service is not configured.",
      });
    }

    const user = await User.findOne({ email });

    // Do not reveal whether an account exists.
    if (!user) {
      return res.json({
        success: true,
        message: "If an account exists, an OTP will be sent.",
      });
    }

    const now = Date.now();

    // Limit OTP requests to one per 60 seconds.
    if (
      user.resetOtpLastSent &&
      now - user.resetOtpLastSent.getTime() < 60_000
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait 60 seconds before requesting another OTP.",
      });
    }

    // Generate a cryptographically secure six-digit OTP.
    const otp = crypto.randomInt(100000, 1000000).toString();

    user.resetOtpHash = hashOtp(otp);
    user.resetOtpExpires = new Date(now + 5 * 60 * 1000);
    user.resetOtpAttempts = 0;
    user.resetOtpLastSent = new Date(now);

    await user.save();

    try {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Your PawMart Password Reset OTP",
        text:
          `Your PawMart password reset OTP is ${otp}. ` +
          "It expires in 5 minutes. If you did not request this, ignore this email.",
        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 480px;
            margin: auto;
            padding: 24px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
          ">
            <h2 style="color: #7c3aed;">PawMart</h2>

            <h3>Password Reset</h3>

            <p>Use the following OTP to reset your password:</p>

            <div style="
              padding: 18px;
              text-align: center;
              background: #f5f3ff;
              border-radius: 8px;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
            ">${otp}</div>

            <p>This OTP expires in <strong>5 minutes</strong>.</p>

            <p>If you did not request this, ignore this email.</p>
          </div>
        `,
      });

      return res.json({
        success: true,
        message: "If an account exists, an OTP will be sent.",
      });
    } catch (emailError) {
      clearResetOtp(user);
      await user.save();

      console.error("OTP email delivery failed:", emailError.message);

      return res.status(500).json({
        success: false,
        message:
          "Unable to send OTP. Please check your email configuration.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to process your request.",
    });
  }
});

// ========================================
// VERIFY OTP
// ========================================

app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const otp = String(req.body.otp || "").trim();

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email and six-digit OTP.",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !user.resetOtpHash || !user.resetOtpExpires) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP. Please request a new one.",
      });
    }

    if (user.resetOtpExpires.getTime() <= Date.now()) {
      clearResetOtp(user);
      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    }

    if (user.resetOtpAttempts >= 5) {
      clearResetOtp(user);
      await user.save();

      return res.status(429).json({
        success: false,
        message: "Too many attempts. Please request a new OTP.",
      });
    }

    if (hashOtp(otp) !== user.resetOtpHash) {
      user.resetOtpAttempts += 1;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "Incorrect OTP. Please try again.",
      });
    }

    return res.json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("OTP verification error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP.",
    });
  }
});

// ========================================
// RESET PASSWORD
// ========================================

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const otp = String(req.body.otp || "").trim();
    const newPassword = req.body.newPassword;

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email and six-digit OTP.",
      });
    }

    if (
      typeof newPassword !== "string" ||
      newPassword.length < 8 ||
      newPassword.length > 72
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must contain 8 to 72 characters.",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !user.resetOtpHash || !user.resetOtpExpires) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP. Please request a new one.",
      });
    }

    if (user.resetOtpExpires.getTime() <= Date.now()) {
      clearResetOtp(user);
      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    }

    if (user.resetOtpAttempts >= 5) {
      clearResetOtp(user);
      await user.save();

      return res.status(429).json({
        success: false,
        message: "Too many attempts. Please request a new OTP.",
      });
    }

    if (hashOtp(otp) !== user.resetOtpHash) {
      user.resetOtpAttempts += 1;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "Incorrect OTP. Please try again.",
      });
    }

    // Hash and save the new password.
    user.password = await bcrypt.hash(newPassword, 12);

    // Make the OTP unusable after a successful password reset.
    clearResetOtp(user);

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Password reset error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to reset your password.",
    });
  }
});

// ========================================
// GET LOGGED-IN USER PROFILE
// ========================================

app.get("/api/auth/me", authenticateUser, (req, res) => {
  const user = req.user;

  return res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      location: user.location || "",
      bio: user.bio || "",
      role: user.role || "customer",
    },
  });
});

// ========================================
// UPDATE USER PROFILE
// ========================================

app.put("/api/auth/profile", authenticateUser, async (req, res) => {
  try {
    const { name, phone, location, bio } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (name.trim().length > 80) {
      return res.status(400).json({
        success: false,
        message: "Name cannot exceed 80 characters.",
      });
    }

    if (phone !== undefined && typeof phone !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number.",
      });
    }

    if (location !== undefined && typeof location !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid location.",
      });
    }

    if (bio !== undefined && typeof bio !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid bio.",
      });
    }

    if (phone && phone.length > 25) {
      return res.status(400).json({
        success: false,
        message: "Phone number cannot exceed 25 characters.",
      });
    }

    if (location && location.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Location cannot exceed 100 characters.",
      });
    }

    if (bio && bio.length > 300) {
      return res.status(400).json({
        success: false,
        message: "Bio cannot exceed 300 characters.",
      });
    }

    const user = req.user;

    user.name = name.trim();

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (location !== undefined) {
      user.location = location.trim();
    }

    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        role: user.role || "customer",
      },
    });
  } catch (error) {
    console.error("Profile update error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update profile.",
    });
  }
});

// ========================================
// LOGOUT
// ========================================

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("pawMartToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.json({
    success: true,
    message: "Logged out successfully.",
  });
});

// ========================================
// ERROR HANDLER
// Must be after all routes.
// ========================================

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
});

// ========================================
// DATABASE + SERVER STARTUP
// ========================================

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not configured.");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`PawMart backend running on port ${PORT}`);

      console.log(
        "Email account configured:",
        Boolean(process.env.EMAIL_USER)
      );

      console.log(
        "Email App Password configured:",
        Boolean(process.env.EMAIL_APP_PASSWORD)
      );
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();

// ========================================
// EXPORTS
// ========================================

module.exports = {
  app,
  authenticateUser,
  requireRole,
};