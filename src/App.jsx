import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";

import LandownerRegistration from "./pages/LandownerRegistration";

import LandDashboard from "./pages/LandDashboard";

import "./App.css";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ================= HOME ================= */}

        <Route
          path="/"
          element={<LandingPage />}
        />


        {/* ================= AUTHENTICATION ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />


        {/* ================= MAIN DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* ================= LAND REGISTRATION ================= */}

        <Route
          path="/land-registration"
          element={<LandownerRegistration />}
        />


        {/* ================= REGISTERED LAND DASHBOARD ================= */}

        <Route
          path="/land-dashboard"
          element={<LandDashboard />}
        />


        {/* ================= INVALID URL ================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;