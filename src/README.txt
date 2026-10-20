PawMart Midnight Luxury Forgot Password / OTP UI

Files:
- ForgotPassword.jsx
- ForgotPassword.css

Install:
1. Copy both files into your project's src/ folder.
2. Import ForgotPassword.jsx from your router or App.jsx and render it on your forgot-password route.
3. The form expects these backend endpoints:
   POST http://localhost:5000/api/auth/forgot-password { "email": "..." }
   POST http://localhost:5000/api/auth/verify-otp { "email": "...", "otp": "123456" }
   POST http://localhost:5000/api/auth/reset-password { "email": "...", "otp": "123456", "newPassword": "..." }

The UI alone is not a secure OTP system. These backend endpoints must be implemented with short-lived hashed OTP storage, expiration, attempt limits, and one-time use before password updates work.
If your API base differs, edit API_BASE near the top of ForgotPassword.jsx.
