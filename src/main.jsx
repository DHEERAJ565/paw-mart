import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Main pages
import App from "./App.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import DogBreeds from "./DogBreeds.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import Profile from "./Profile.jsx";
import Payment from "./Payment.jsx";
import OrderTracking from "./OrderTracking.jsx";

// PawMart services
import PawCare from "./PawCare.jsx";
import PawSure from "./PawSure.jsx";
import PetCostPredictor from "./PetCostPredictor.jsx";
import Adoption from "./Adoption.jsx";

// Admin dashboard
import AdminRoute from "./AdminRoute.jsx";
import AdminAdoptionDashboard from "./AdminAdoptionDashboard.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<App />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* Pet discovery */}
        <Route path="/dogs" element={<DogBreeds />} />

        {/* Customer profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Payments */}
        <Route path="/payment" element={<Payment />} />

        {/* Order tracking */}
        <Route
          path="/my-orders"
          element={<OrderTracking />}
        />

        {/* PawMart services */}
        <Route path="/pawcare" element={<PawCare />} />
        <Route path="/pawsure" element={<PawSure />} />

        {/* Pet Cost Predictor */}
        <Route
          path="/pet-cost-predictor"
          element={<PetCostPredictor />}
        />

        {/* Pet adoption */}
        <Route
          path="/adoption"
          element={<Adoption />}
        />

        {/* Admin Dashboard - Protected Route */}
        <Route
          path="/admin/adoption-enquiries"
          element={
            <AdminRoute>
              <AdminAdoptionDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);