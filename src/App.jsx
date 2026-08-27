import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";

import RoleSelection from "./pages/RoleSelection";

import FarmerRegistration from "./pages/FarmerRegistration";
import LandownerRegistration from "./pages/LandownerRegistration";
import ForeignerRegistration from "./pages/ForeignerRegistration";
import WorkerRegistration from "./pages/WorkerRegistration";
import AgricultureOfficerRegistration from "./pages/AgricultureOfficerRegistration";

import TerraceFarming from "./pages/TerraceFarming";
import TerraceRegistration from "./pages/TerraceRegistration";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* =========================
            LANDING
        ========================= */}

        <Route
          path="/"
          element={<LandingPage />}
        />


        {/* =========================
            AUTHENTICATION
        ========================= */}

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


        {/* =========================
            ROLE SELECTION
        ========================= */}

        <Route
          path="/role-selection"
          element={<RoleSelection />}
        />


        {/* =========================
            FARMER
        ========================= */}

        <Route
          path="/farmer-registration"
          element={<FarmerRegistration />}
        />


        {/* =========================
            LANDOWNER
        ========================= */}

        <Route
          path="/landowner-registration"
          element={<LandownerRegistration />}
        />

        {/* Keep this route because
            your existing Dashboard
            currently uses /land-registration */}
        <Route
          path="/land-registration"
          element={<LandownerRegistration />}
        />


        {/* =========================
            FOREIGNER
        ========================= */}

        <Route
          path="/foreigner-registration"
          element={<ForeignerRegistration />}
        />

        {/* Optional old route */}
        <Route
          path="/foreigner"
          element={<ForeignerRegistration />}
        />


        {/* =========================
            WORKER
        ========================= */}

        <Route
          path="/worker-registration"
          element={<WorkerRegistration />}
        />

        {/* Optional old route */}
        <Route
          path="/worker"
          element={<WorkerRegistration />}
        />


        {/* =========================
            AGRICULTURE OFFICER
        ========================= */}

        <Route
          path="/agriculture-officer-registration"
          element={<AgricultureOfficerRegistration />}
        />

        {/* Optional old route */}
        <Route
          path="/agriculture-officer"
          element={<AgricultureOfficerRegistration />}
        />


        {/* =========================
            TERRACE FARMING
        ========================= */}

        <Route
          path="/terrace-farming"
          element={<TerraceFarming />}
        />

        <Route
          path="/terrace-registration"
          element={<TerraceRegistration />}
        />


        {/* =========================
            DASHBOARD
            Already implemented by
            another team member
        ========================= */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

      </Routes>

    </BrowserRouter>

  );
}


export default App;