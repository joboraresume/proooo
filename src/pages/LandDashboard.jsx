import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LandSidebar from "../components/LandSidebar";
import "./LandDashboard.css";

function LandDashboard() {
  const navigate = useNavigate();

  const [showDashboard, setShowDashboard] = useState(true);
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState({
    farmer: false,
    landowner: false,
    foreigner: false,
    worker: false,
    agriculture_officer: false,
    terrace: false,
  });

  useEffect(() => {
    const userStr = localStorage.getItem("agrisenseUser");
    if (userStr) {
      setUser(JSON.parse(userStr));
      fetchProfiles();
    }
  }, []);

  const fetchProfiles = async () => {
    try {
      const userStr = localStorage.getItem("agrisenseUser");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const response = await fetch(`http://localhost:5000/api/profiles/${user.id}`);

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
    }
  };

  const deleteRoleProfile = async (e, apiRole) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your registered role profile?"
    );

    if (!confirmDelete) return;

    try {
      const userStr = localStorage.getItem("agrisenseUser");
      if (!userStr) return;

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

  const handleNavigation = (item) => {
    if (item === "land-details") {
      navigate("/land-details");
    } else if (item === "overview") {
      // Already on overview
    } else {
      console.log("Selected:", item);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("agrisenseUser");
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (confirmDelete) {
      alert("Account deletion requested");
    }
  };

  return (
    <div className="registered-dashboard">

      {/* LEFT SIDEBAR */}
      <LandSidebar
        activeItem="overview"
        onNavigate={handleNavigation}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />

      {/* RIGHT CONTENT */}
      <main className="dashboard-main">

        {/* TOP BAR */}
        <header className="dashboard-topbar">

          <div>
            <h1>Dashboard</h1>

            <p>
              Welcome back, {user?.name || user?.phone || "User"}!
            </p>
          </div>

          <div className="topbar-right">

            <button
              className="show-dashboard-btn"
              onClick={() => setShowDashboard(!showDashboard)}
            >
              {showDashboard ? "Manage Roles" : "Show Dashboard"}
            </button>

            <button className="notification-button">
              🔔
            </button>

            <div className="profile-area">
              <div className="profile-avatar">
                👨‍🌾
              </div>

              <div>
                <strong>{user?.name || "User"}</strong>
                <span>Landowner</span>
              </div>
            </div>

          </div>

        </header>

        {/* ROLE MANAGEMENT SECTION */}
        {!showDashboard && (
          <section className="role-management-section">
            <h2>Your Registered Roles</h2>
            <div className="role-cards-grid">

              {profiles.farmer && (
                <div className="role-card-item">
                  <div className="role-card-icon">👨‍🌾</div>
                  <div className="role-card-info">
                    <h3>Farmer</h3>
                    <p>Registered</p>
                  </div>
                  <button
                    className="delete-role-btn"
                    onClick={(e) => deleteRoleProfile(e, "farmer")}
                  >
                    Delete
                  </button>
                </div>
              )}

              {profiles.landowner && (
                <div className="role-card-item">
                  <div className="role-card-icon">🏡</div>
                  <div className="role-card-info">
                    <h3>Landowner</h3>
                    <p>Registered</p>
                  </div>
                  <button
                    className="delete-role-btn"
                    onClick={(e) => deleteRoleProfile(e, "landowner")}
                  >
                    Delete
                  </button>
                </div>
              )}

              {profiles.foreigner && (
                <div className="role-card-item">
                  <div className="role-card-icon">🌐</div>
                  <div className="role-card-info">
                    <h3>Foreigner</h3>
                    <p>Registered</p>
                  </div>
                  <button
                    className="delete-role-btn"
                    onClick={(e) => deleteRoleProfile(e, "foreigner")}
                  >
                    Delete
                  </button>
                </div>
              )}

              {profiles.worker && (
                <div className="role-card-item">
                  <div className="role-card-icon">👷</div>
                  <div className="role-card-info">
                    <h3>Worker</h3>
                    <p>Registered</p>
                  </div>
                  <button
                    className="delete-role-btn"
                    onClick={(e) => deleteRoleProfile(e, "worker")}
                  >
                    Delete
                  </button>
                </div>
              )}

              {profiles.agriculture_officer && (
                <div className="role-card-item">
                  <div className="role-card-icon">👨‍💼</div>
                  <div className="role-card-info">
                    <h3>Agriculture Officer</h3>
                    <p>Registered</p>
                  </div>
                  <button
                    className="delete-role-btn"
                    onClick={(e) => deleteRoleProfile(e, "agriculture-officer")}
                  >
                    Delete
                  </button>
                </div>
              )}

              {profiles.terrace && (
                <div className="role-card-item">
                  <div className="role-card-icon">🪴</div>
                  <div className="role-card-info">
                    <h3>Terrace Farming</h3>
                    <p>Registered</p>
                  </div>
                  <button
                    className="delete-role-btn"
                    onClick={(e) => deleteRoleProfile(e, "terrace")}
                  >
                    Delete
                  </button>
                </div>
              )}

            </div>
          </section>
        )}

        {/* MAIN DASHBOARD CONTENT */}
        {showDashboard && (
          <div className="dashboard-content-wrapper">
        {/* SUMMARY CARDS */}
        <section className="summary-grid">

          {/* Total Fields */}
          <div className="summary-card">

            <div className="summary-icon">
              🌾
            </div>

            <div>
              <h3>12</h3>
              <p>Total Fields</p>
            </div>

          </div>


          {/* Active Sensors */}
          <div className="summary-card">

            <div className="summary-icon">
              📡
            </div>

            <div>
              <h3>3</h3>
              <p>Active Sensors</p>
            </div>

          </div>


          {/* Weather */}
          <div className="summary-card">

            <div className="summary-icon">
              ☁️
            </div>

            <div>
              <h3>28°C</h3>
              <p>Current Weather</p>
            </div>

          </div>


          {/* Soil Moisture */}
          <div className="summary-card">

            <div className="summary-icon">
              💧
            </div>

            <div>
              <h3>75%</h3>
              <p>Soil Moisture</p>
            </div>

          </div>

        </section>


        {/* MAIN GRID */}
        <section className="dashboard-grid">

          {/* FIELD OVERVIEW */}
          <div className="dashboard-card field-card">

            <div className="card-heading">

              <h2>Field Overview</h2>

              <select>
                <option>All Fields</option>
                <option>Field 1</option>
                <option>Field 2</option>
                <option>Field 3</option>
                <option>Field 4</option>
              </select>

            </div>

            <div className="field-map">

              <div className="map-placeholder">
                <span>🗺️</span>
                <p>Farm Map</p>
              </div>

              <div className="field-label field-one">
                Field 1
              </div>

              <div className="field-label field-two">
                Field 2
              </div>

              <div className="field-label field-three">
                Field 3
              </div>

              <div className="field-label field-four">
                Field 4
              </div>

            </div>

          </div>


          {/* RECENT ALERTS */}
          <div className="dashboard-card alerts-card">

            <div className="card-heading">

              <h2>Recent Alerts</h2>

              <button className="view-all">
                View all
              </button>

            </div>


            <div className="alert-list">

              <div className="alert-item">

                <div className="alert-icon danger">
                  ⚠️
                </div>

                <div>
                  <strong>Low Soil Moisture</strong>
                  <span>Field 1</span>
                </div>

                <small>10 min ago</small>

              </div>


              <div className="alert-item">

                <div className="alert-icon warning">
                  ⚠️
                </div>

                <div>
                  <strong>High Temperature</strong>
                  <span>Field 2</span>
                </div>

                <small>30 min ago</small>

              </div>


              <div className="alert-item">

                <div className="alert-icon normal">
                  ☁️
                </div>

                <div>
                  <strong>Rain Expected</strong>
                  <span>Tomorrow</span>
                </div>

                <small>2 hr ago</small>

              </div>

            </div>

          </div>


          {/* CROP HEALTH */}
          <div className="dashboard-card crop-health-card">

            <div className="card-heading">

              <h2>Crop Health Summary</h2>

            </div>

            <div className="health-content">

              <div className="health-circle">

                <strong>82%</strong>

                <span>Good</span>

              </div>

              <div className="health-chart">

                <div className="chart-line">
                  ╱╲___╱╲____╱╲
                </div>

                <div className="chart-labels">
                  <span>19 May</span>
                  <span>20 May</span>
                  <span>21 May</span>
                  <span>22 May</span>
                  <span>23 May</span>
                  <span>24 May</span>
                </div>

              </div>

            </div>

          </div>


          {/* UPCOMING TASKS */}
          <div className="dashboard-card tasks-card">

            <div className="card-heading">

              <h2>Upcoming Tasks</h2>

              <button className="view-all">
                View all
              </button>

            </div>


            <div className="task-list">

              <div className="task-item">

                <div className="task-icon">
                  💧
                </div>

                <div>
                  <strong>Irrigation</strong>
                  <span>Field 3</span>
                </div>

                <small>Today</small>

              </div>


              <div className="task-item">

                <div className="task-icon">
                  🌱
                </div>

                <div>
                  <strong>Fertilizer</strong>
                  <span>Field 1</span>
                </div>

                <small>Tomorrow</small>

              </div>

            </div>

          </div>


          {/* REGISTERED FARM DASHBOARD */}
          <div className="registered-farm-card">

            <div className="registered-heading">

              <h2>
                Registered Farm Dashboard
              </h2>

              <p>
                Overview of your farm
              </p>

            </div>


            <div className="farm-feature-grid">


              {/* SENSOR MONITORING */}

              <div
                className="farm-feature"
                onClick={() =>
                  alert("Sensor Monitoring")
                }
              >

                <div className="farm-feature-icon">
                  🌱
                </div>

                <h3>
                  Sensor Monitoring
                </h3>

                <p>
                  Real-time monitoring of soil and environment.
                </p>

                <button>
                  View Details
                </button>

              </div>


              {/* DISEASE DETECTION */}

              <div
                className="farm-feature"
                onClick={() =>
                  alert("Disease Detection")
                }
              >

                <div className="farm-feature-icon">
                  🩺
                </div>

                <h3>
                  Disease Detection
                </h3>

                <p>
                  Detect plant diseases using AI technology.
                </p>

                <button>
                  Check Now
                </button>

              </div>


              {/* WEATHER */}

              <div
                className="farm-feature"
                onClick={() =>
                  alert("Weather")
                }
              >

                <div className="farm-feature-icon">
                  ☁️
                </div>

                <h3>
                  Weather
                </h3>

                <p>
                  Current weather and forecast information.
                </p>

                <button>
                  View Summary
                </button>

              </div>


              {/* MARKET PRICE */}

              <div
                className="farm-feature"
                onClick={() =>
                  alert("Market Prices")
                }
              >

                <div className="farm-feature-icon">
                  📊
                </div>

                <h3>
                  Market Price
                </h3>

                <p>
                  Latest market prices and opportunities.
                </p>

                <button>
                  View Prices
                </button>

              </div>

            </div>


            {/* LAND SUMMARY */}

            <div className="land-summary">

              <h3>
                Your Land Summary
              </h3>

              <div className="summary-stat-grid">

                <div>
                  <strong>3</strong>
                  <span>Total Lands</span>
                </div>

                <div>
                  <strong>12.50</strong>
                  <span>Total Area (Acres)</span>
                </div>

                <div>
                  <strong>2</strong>
                  <span>Active Crops</span>
                </div>

                <div>
                  <strong>Today</strong>
                  <span>Last Updated</span>
                </div>

              </div>

            </div>

          </div>

        </section>
          </div>
        )}

      </main>

    </div>
  );
}

export default LandDashboard;