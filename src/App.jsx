import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import FarmDashboard from "./pages/FarmDashboard";

import FarmerRegistration from "./pages/FarmerRegistration";
import LandownerRegistration from "./pages/LandownerRegistration";
import ForeignerRegistration from "./pages/ForeignerRegistration";
import WorkerRegistration from "./pages/WorkerRegistration";
import AgricultureOfficerRegistration from "./pages/AgricultureOfficerRegistration";
import TerraceRegistration from "./pages/TerraceRegistration";

import LandDashboard from "./pages/LandDashboard";
import LandDetails from "./pages/LandDetails";

import ForeignDashboard from "./pages/ForeignDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import AgricultureOfficerDashboard from "./pages/AgriculureofficerDashboard";

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


        {/* ================= REGISTRATION PAGES ================= */}

        <Route
          path="/farmer-registration"
          element={<FarmerRegistration />}
        />

        {/* IMPORTANT:
            RoleSelection uses /land-registration
        */}
        <Route
          path="/land-registration"
          element={<LandownerRegistration />}
        />

        {/* Keep old route also working so existing links
            from your teammates do not break */}
        <Route
          path="/landowner-registration"
          element={<LandownerRegistration />}
        />

        <Route
          path="/foreigner-registration"
          element={<ForeignerRegistration />}
        />

        <Route
          path="/worker-registration"
          element={<WorkerRegistration />}
        />

        <Route
          path="/agriculture-officer-registration"
          element={<AgricultureOfficerRegistration />}
        />

        <Route
          path="/terrace-farming"
          element={<TerraceRegistration />}
        />


        {/* ================= MAIN DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* ================= FARMER DASHBOARD ================= */}

        <Route
          path="/farmer-dashboard"
          element={<FarmDashboard roleType="farmer" />}
        />


        {/* ================= LANDOWNER DASHBOARD ================= */}

        <Route
          path="/land-dashboard"
          element={<LandDashboard />}
        />

        <Route
          path="/land-details"
          element={<LandDetails />}
        />


        {/* ================= ROLE-SPECIFIC DASHBOARDS ================= */}

        <Route
          path="/foreign-dashboard"
          element={<ForeignDashboard />}
        />

        <Route
          path="/worker-dashboard"
          element={<WorkerDashboard />}
        />

        <Route
          path="/agriculture-officer-dashboard"
          element={<AgricultureOfficerDashboard />}
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