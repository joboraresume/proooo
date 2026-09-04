import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LandSidebar from "../components/LandSidebar";
import "./LandDetails.css";

function LandDetails() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [landDetails, setLandDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("agrisenseUser");
    if (userStr) {
      setUser(JSON.parse(userStr));
      fetchLandDetails();
    } else {
      navigate("/login");
    }
  }, []);

  const fetchLandDetails = async () => {
    try {
      const userStr = localStorage.getItem("agrisenseUser");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const response = await fetch(`http://localhost:5000/api/landowner/${user.id}`);

      if (response.ok) {
        const data = await response.json();
        setLandDetails(data);
      }
    } catch (err) {
      console.error("Error fetching land details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (item) => {
    if (item === "overview") {
      navigate("/land-dashboard");
    } else if (item === "land-details") {
      // Already on this page
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

  if (loading) {
    return (
      <div className="registered-dashboard">
        <LandSidebar
          activeItem="land-details"
          onNavigate={handleNavigation}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
        />
        <main className="dashboard-main">
          <div className="loading-container">
            <h1>Loading land details...</h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="registered-dashboard">

      {/* LEFT SIDEBAR */}
      <LandSidebar
        activeItem="land-details"
        onNavigate={handleNavigation}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />

      {/* RIGHT CONTENT */}
      <main className="dashboard-main">

        {/* TOP BAR */}
        <header className="dashboard-topbar">

          <div>
            <h1>Land Details</h1>

            <p>
              View and manage your land information
            </p>
          </div>

          <div className="topbar-right">

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


        {/* LAND DETAILS CONTENT */}
        <section className="land-details-section">

          {landDetails ? (
            <div className="land-details-card">

              <div className="land-details-header">
                <h2>Your Land Information</h2>
                <button className="edit-btn">Edit Details</button>
              </div>

              <div className="land-info-grid">

                <div className="info-item">
                  <label>Land Owner Name</label>
                  <p>{landDetails.name || user?.name || "Not provided"}</p>
                </div>

                <div className="info-item">
                  <label>Phone Number</label>
                  <p>{landDetails.phone || user?.phone || "Not provided"}</p>
                </div>

                <div className="info-item">
                  <label>Total Land Area</label>
                  <p>{landDetails.land_area || "Not provided"} acres</p>
                </div>

                <div className="info-item">
                  <label>Location</label>
                  <p>{landDetails.location || "Not provided"}</p>
                </div>

                <div className="info-item">
                  <label>Soil Type</label>
                  <p>{landDetails.soil_type || "Not provided"}</p>
                </div>

                <div className="info-item">
                  <label>Land Type</label>
                  <p>{landDetails.land_type || "Not provided"}</p>
                </div>

                <div className="info-item full-width">
                  <label>Description</label>
                  <p>{landDetails.description || "No description provided"}</p>
                </div>

              </div>

            </div>
          ) : (
            <div className="no-land-details">
              <div className="no-data-icon">📋</div>
              <h2>No Land Details Found</h2>
              <p>You haven't registered any land details yet.</p>
              <button
                className="register-land-btn"
                onClick={() => navigate("/landowner-registration")}
              >
                Register Land Details
              </button>
            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default LandDetails;
