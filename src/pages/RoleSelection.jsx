import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import "./RoleSelection.css";

function RoleSelection() {
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
          navigate("/land-registration");
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
      <div className="role-page">
        <div className="role-card">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  // ================= PAGE =================

  return (
    <div className="role-page">
      <div className="role-card">
        <h1>Welcome to AgriSense!</h1>

        <p className="role-subtitle">
          Choose the option that best describes you.
        </p>

        <div className="role-grid">

          {/* ================= FARMER ================= */}

          <div
            className={`role-option ${
              profiles.farmer ? "registered" : ""
            }`}
            onClick={() => selectRole("farmer")}
          >
            <div className="role-icon">
              👨‍🌾
            </div>

            <div
              className="role-info-container"
              style={{ flexGrow: 1 }}
            >
              <div
                className="role-header-line"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2>Farmer</h2>

                {profiles.farmer && (
                  <span className="registered-badge">
                    ✓ Registered
                  </span>
                )}
              </div>

              <p>
                Manage farming and cultivation
              </p>

              {profiles.farmer && (
                <button
                  type="button"
                  className="role-delete-btn"
                  onClick={(e) =>
                    deleteRoleProfile(e, "farmer")
                  }
                >
                  Delete Role
                </button>
              )}
            </div>
          </div>

          {/* ================= LANDOWNER ================= */}

          <div
            className={`role-option ${
              profiles.landowner ? "registered" : ""
            }`}
            onClick={() => selectRole("landowner")}
          >
            <div className="role-icon">
              🏡
            </div>

            <div
              className="role-info-container"
              style={{ flexGrow: 1 }}
            >
              <div
                className="role-header-line"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2>Landowner</h2>

                {profiles.landowner && (
                  <span className="registered-badge">
                    ✓ Registered
                  </span>
                )}
              </div>

              <p>
                Register and manage your land
              </p>

              {profiles.landowner && (
                <button
                  type="button"
                  className="role-delete-btn"
                  onClick={(e) =>
                    deleteRoleProfile(e, "landowner")
                  }
                >
                  Delete Role
                </button>
              )}
            </div>
          </div>

          {/* ================= FOREIGNER ================= */}

          <div
            className={`role-option ${
              profiles.foreigner ? "registered" : ""
            }`}
            onClick={() => selectRole("foreigner")}
          >
            <div className="role-icon">
              🌐
            </div>

            <div
              className="role-info-container"
              style={{ flexGrow: 1 }}
            >
              <div
                className="role-header-line"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2>Foreigner</h2>

                {profiles.foreigner && (
                  <span className="registered-badge">
                    ✓ Registered
                  </span>
                )}
              </div>

              <p>
                Information and features for foreigners
              </p>

              {profiles.foreigner && (
                <button
                  type="button"
                  className="role-delete-btn"
                  onClick={(e) =>
                    deleteRoleProfile(e, "foreigner")
                  }
                >
                  Delete Role
                </button>
              )}
            </div>
          </div>

          {/* ================= WORKER ================= */}

          <div
            className={`role-option ${
              profiles.worker ? "registered" : ""
            }`}
            onClick={() => selectRole("worker")}
          >
            <div className="role-icon">
              👷
            </div>

            <div
              className="role-info-container"
              style={{ flexGrow: 1 }}
            >
              <div
                className="role-header-line"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2>Worker</h2>

                {profiles.worker && (
                  <span className="registered-badge">
                    ✓ Registered
                  </span>
                )}
              </div>

              <p>
                Find and manage agricultural work
              </p>

              {profiles.worker && (
                <button
                  type="button"
                  className="role-delete-btn"
                  onClick={(e) =>
                    deleteRoleProfile(e, "worker")
                  }
                >
                  Delete Role
                </button>
              )}
            </div>
          </div>

          {/* ================= AGRICULTURE OFFICER ================= */}

          <div
            className={`role-option ${
              profiles.agriculture_officer
                ? "registered"
                : ""
            }`}
            onClick={() =>
              selectRole("agriculture-officer")
            }
          >
            <div className="role-icon">
              👨‍💼
            </div>

            <div
              className="role-info-container"
              style={{ flexGrow: 1 }}
            >
              <div
                className="role-header-line"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2>Agriculture Officer</h2>

                {profiles.agriculture_officer && (
                  <span className="registered-badge">
                    ✓ Registered
                  </span>
                )}
              </div>

              <p>
                Manage agricultural services
              </p>

              {profiles.agriculture_officer && (
                <button
                  type="button"
                  className="role-delete-btn"
                  onClick={(e) =>
                    deleteRoleProfile(
                      e,
                      "agriculture-officer"
                    )
                  }
                >
                  Delete Role
                </button>
              )}
            </div>
          </div>

          {/* ================= TERRACE FARMING ================= */}

          <div
            className={`role-option ${
              profiles.terrace ? "registered" : ""
            }`}
            onClick={() =>
              selectRole("terrace-farming")
            }
          >
            <div className="role-icon">
              🪴
            </div>

            <div
              className="role-info-container"
              style={{ flexGrow: 1 }}
            >
              <div
                className="role-header-line"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2>Terrace Farming</h2>

                {profiles.terrace && (
                  <span className="registered-badge">
                    ✓ Registered
                  </span>
                )}
              </div>

              <p>
                Grow crops in terrace spaces
              </p>

              {profiles.terrace && (
                <button
                  type="button"
                  className="role-delete-btn"
                  onClick={(e) =>
                    deleteRoleProfile(e, "terrace")
                  }
                >
                  Delete Role
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RoleSelection;