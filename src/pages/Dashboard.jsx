import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState({
    farmer: false,
    landowner: false,
    foreigner: false,
    worker: false,
    agriculture_officer: false,
    terrace: false,
  });

  const [loading, setLoading] = useState(true);
  const [showFieldSubOptions, setShowFieldSubOptions] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [user, setUser] = useState(null);

  // ================= FETCH USER ROLE PROFILES =================

  const fetchProfiles = async () => {
    try {
      const userStr = localStorage.getItem("agrisenseUser");

      if (!userStr) {
        navigate("/login");
        return;
      }

      const user = JSON.parse(userStr);

      const response = await fetch(
        `http://localhost:5000/api/profiles/${user.id}`
      );

      if (response.ok) {
        const data = await response.json();

        setProfiles({
          farmer: data.farmer || false,
          landowner: data.landowner || false,
          foreigner: data.foreigner || false,
          worker: data.worker || false,
          agriculture_officer: data.agriculture_officer || false,
          terrace: data.terrace || false,
        });
      }
    } catch (err) {
      console.error("Error fetching profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD PROFILES =================

  useEffect(() => {
    fetchProfiles();
    const userStr = localStorage.getItem("agrisenseUser");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    // Check if we should show dashboard after registration
    const showDashboardFlag = localStorage.getItem("showDashboardAfterRegistration");
    if (showDashboardFlag === "true") {
      setShowDashboard(true);
      localStorage.removeItem("showDashboardAfterRegistration");
    }
  }, []);

  // ================= ROLE SELECTION =================

  const selectRole = (role) => {
    localStorage.setItem("agrisenseRole", role);

    switch (role) {
      // ================= FARMER =================

      case "farmer":
        if (profiles.farmer) {
          // Change this route later if Farmer dashboard is created
          navigate("/dashboard");
        } else {
          navigate("/farmer-registration");
        }
        break;

      // ================= LANDOWNER =================

      case "landowner":
        if (profiles.landowner) {
          navigate("/land-dashboard");
        } else {
          navigate("/landowner-registration");
        }
        break;

      // ================= FOREIGNER =================

      case "foreigner":
        if (profiles.foreigner) {
          // Change when Foreigner dashboard is available
          navigate("/dashboard");
        } else {
          navigate("/foreigner-registration");
        }
        break;

      // ================= WORKER =================

      case "worker":
        if (profiles.worker) {
          // Change when Worker dashboard is available
          navigate("/dashboard");
        } else {
          navigate("/worker-registration");
        }
        break;

      // ================= AGRICULTURE OFFICER =================

      case "agriculture-officer":
        if (profiles.agriculture_officer) {
          // Change when Agriculture Officer dashboard is available
          navigate("/dashboard");
        } else {
          navigate("/agriculture-officer-registration");
        }
        break;

      // ================= TERRACE FARMING =================

      case "terrace-farming":
        if (profiles.terrace) {
          // Change when Terrace dashboard is available
          navigate("/dashboard");
        } else {
          navigate("/terrace-farming");
        }
        break;

      default:
        break;
    }
  };

  // ================= DELETE ROLE =================

  const deleteRoleProfile = async (e, apiRole) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your registered role profile?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const userStr = localStorage.getItem("agrisenseUser");

      if (!userStr) {
        return;
      }

      const user = JSON.parse(userStr);

      const response = await fetch(
        `http://localhost:5000/api/profiles/${apiRole}/${user.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Role profile deleted successfully!");

        fetchProfiles();
      } else {
        const data = await response.json();

        alert(data.detail || "Failed to delete role profile.");
      }
    } catch (err) {
      console.error("Error deleting role:", err);

      alert("Unable to connect to server to delete role.");
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }


  // ================= PAGE =================

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <header className="dashboard-header">

        <div className="brand">

          <div className="brand-logo">
            🌱
          </div>

          <div>
            <h2>AgriSense</h2>

            <span>
              Smart Agriculture
            </span>
          </div>

        </div>


        <div className="header-right">

          <button
            className="show-dashboard-btn"
            onClick={() => setShowDashboard(!showDashboard)}
          >
            {showDashboard ? "Role Selection" : "Show Dashboard"}
          </button>

          <span className="notification">
            🔔
          </span>

          <div className="user-profile">
            👤
          </div>

        </div>

      </header>


      {/* WELCOME - ROLE SELECTION */}

      {!showDashboard && (
        <section className="welcome">

          <h1>
            Welcome to AgriSense!
          </h1>

          <p>
            Choose the option that best describes you.
          </p>

        </section>
      )}


      {/* DASHBOARD VIEW */}
      {showDashboard && (
        <section className="dashboard-view-section">
          <div className="dashboard-user-profile">
            <div className="profile-avatar-large">
              👤
            </div>
            <div className="profile-info">
              <h2>{user?.name || user?.phone || "User"}</h2>
              <p>Your registered roles: {Object.keys(profiles).filter(key => profiles[key]).join(", ")}</p>
            </div>
          </div>

          <div className="dashboard-summary-cards">
            <div className="summary-card">
              <div className="summary-icon">🌾</div>
              <div>
                <h3>{profiles.farmer || profiles.landowner ? "Active" : "Not Registered"}</h3>
                <p>Field Status</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📊</div>
              <div>
                <h3>{Object.keys(profiles).filter(key => profiles[key]).length}</h3>
                <p>Registered Roles</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">🏡</div>
              <div>
                <h3>{profiles.landowner ? "Yes" : "No"}</h3>
                <p>Landowner</p>
              </div>
            </div>
          </div>

          <div className="dashboard-roles-list">
            <h3>Your Registered Roles</h3>
            <div className="roles-grid">
              {profiles.farmer && (
                <div className="role-badge">
                  <span className="role-icon">👨‍🌾</span>
                  <span>Farmer</span>
                </div>
              )}
              {profiles.landowner && (
                <div className="role-badge">
                  <span className="role-icon">🏡</span>
                  <span>Landowner</span>
                </div>
              )}
              {profiles.foreigner && (
                <div className="role-badge">
                  <span className="role-icon">🌐</span>
                  <span>Foreigner</span>
                </div>
              )}
              {profiles.worker && (
                <div className="role-badge">
                  <span className="role-icon">👷</span>
                  <span>Worker</span>
                </div>
              )}
              {profiles.agriculture_officer && (
                <div className="role-badge">
                  <span className="role-icon">👨‍💼</span>
                  <span>Agriculture Officer</span>
                </div>
              )}
              {profiles.terrace && (
                <div className="role-badge">
                  <span className="role-icon">🪴</span>
                  <span>Terrace Farming</span>
                </div>
              )}
            </div>
          </div>

          {profiles.landowner && (
            <button
              className="go-to-land-dashboard-btn"
              onClick={() => navigate("/land-dashboard")}
            >
              Go to Land Dashboard
            </button>
          )}
        </section>
      )}


      {/* OPTIONS - ROLE SELECTION */}

      {!showDashboard && (
        <section className="dashboard-options">

        {/* FIELD */}

        <button
          className="dashboard-card"
          onClick={() => setShowFieldSubOptions(!showFieldSubOptions)}
        >

          <div className="card-icon">
            �
          </div>

          <h3>
            Field
          </h3>

          <p>
            Manage agricultural fields
          </p>

          <span className="card-arrow">
            {showFieldSubOptions ? "↓" : "→"}
          </span>

        </button>

        {/* FIELD SUB-OPTIONS */}

        {showFieldSubOptions && (
          <div className="field-sub-options">
            <button
              className="sub-option-card"
              onClick={() => navigate("/farmer-registration")}
            >
              <div className="card-icon">
                👨‍🌾
              </div>
              <h3>Farmer</h3>
              <p>Register as a farmer</p>
              <span className="card-arrow">→</span>
            </button>

            <button
              className="sub-option-card"
              onClick={() => navigate("/landowner-registration")}
            >
              <div className="card-icon">
                🏡
              </div>
              <h3>Landowner</h3>
              <p>Register as a landowner</p>
              <span className="card-arrow">→</span>
            </button>
          </div>
        )}


        {/* FOREIGNERS */}

        <button
          className="dashboard-card"
          onClick={() => navigate("/foreigner-registration")}
        >

          <div className="card-icon">
            🌍
          </div>

          <h3>
            Foreigners
          </h3>

          <p>
            Agriculture information and services
          </p>

          <span className="card-arrow">
            →
          </span>

        </button>


        {/* WORKER */}

        <button
          className="dashboard-card"
          onClick={() => navigate("/worker-registration")}
        >

          <div className="card-icon">
            👨‍🌾
          </div>

          <h3>
            Worker
          </h3>

          <p>
            Agricultural work and opportunities
          </p>

          <span className="card-arrow">
            →
          </span>

        </button>


        {/* AGRICULTURE OFFICER */}

        <button
          className="dashboard-card"
          onClick={() => navigate("/agriculture-officer-registration")}
        >

          <div className="card-icon">
            �
          </div>

          <h3>
            Agriculture Officer
          </h3>

          <p>
            Agricultural support and monitoring
          </p>

          <span className="card-arrow">
            →
          </span>

        </button>


        {/* TERRACE FARMING */}

        <button
          className="dashboard-card"
          onClick={() => navigate("/terrace-farming")}
        >

          <div className="card-icon">
            🪴
          </div>

          <h3>
            Terrace Farming
          </h3>

          <p>
            Manage terrace and home farming
          </p>

          <span className="card-arrow">
            →
          </span>

        </button>

      </section>
      )}


      {/* INFORMATION */}

      <section className="dashboard-info">

        <h2>
          Smart Farming with AgriSense
        </h2>

        <p>
          Select Field to manage agricultural land or
          choose Terrace Farming for home and terrace cultivation.
        </p>

      </section>

    </div>
  );
}

export default Dashboard;