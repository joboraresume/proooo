import React, { useEffect, useState } from "react";
import {
  Home,
  Map,
  Radio,
  FileText,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Globe2,
  Sprout,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  FlaskConical,
  Download,
  AlertTriangle,
  Headphones,
  Plus,
  Activity,
  CloudSun,
  Leaf,
  X,
} from "lucide-react";

import "./ForeignDashboard.css";

const ForeignDashboard = () => {
  const [lands, setLands] = useState([]);
  const [user, setUser] = useState({
    name: "Foreign Landowner",
    role: "Foreign User",
  });

  const [selectedLand, setSelectedLand] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // --------------------------------------------------
  // LOAD USER + LAND DATA
  // --------------------------------------------------
  useEffect(() => {
    loadDashboardData();

    const handleStorageChange = () => {
      loadDashboardData();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const loadDashboardData = () => {
    try {
      const savedLands = JSON.parse(
        localStorage.getItem("agrisenseLand")
      );

      if (Array.isArray(savedLands)) {
        setLands(savedLands);
      } else {
        setLands([]);
      }

      const savedUser = JSON.parse(
        localStorage.getItem("agrisenseUser")
      );

      if (savedUser) {
        setUser((previous) => ({
          ...previous,
          ...savedUser,
        }));
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  // --------------------------------------------------
  // TOTAL AREA
  // --------------------------------------------------
  const totalArea = lands.reduce((total, land) => {
    return (
      total +
      Number(
        land.area ??
          land.acres ??
          land.landArea ??
          0
      )
    );
  }, 0);

  // --------------------------------------------------
  // LOCATION FORMATTER
  // --------------------------------------------------
  const getLocationText = (land) => {
    if (!land) {
      return "Location not available";
    }

    const locationParts = [
      land.city,
      land.district,
      land.state,
      land.province,
      land.country,
    ].filter(
      (item) =>
        item !== undefined &&
        item !== null &&
        String(item).trim() !== ""
    );

    if (locationParts.length > 0) {
      // Remove duplicate values
      return [...new Set(locationParts)].join(", ");
    }

    if (
      land.latitude !== undefined &&
      land.longitude !== undefined
    ) {
      return `${land.latitude}, ${land.longitude}`;
    }

    return "Location not available";
  };

  // --------------------------------------------------
  // COORDINATES
  // --------------------------------------------------
  const getCoordinates = (land) => {
    if (
      land?.latitude !== undefined &&
      land?.longitude !== undefined &&
      land.latitude !== "" &&
      land.longitude !== ""
    ) {
      return `${land.latitude}, ${land.longitude}`;
    }

    return null;
  };

  // --------------------------------------------------
  // OPEN LOCATION
  // --------------------------------------------------
  const openLocation = (land) => {
    if (!land) return;

    let query = "";

    if (
      land.latitude !== undefined &&
      land.longitude !== undefined &&
      land.latitude !== "" &&
      land.longitude !== ""
    ) {
      query = `${land.latitude},${land.longitude}`;
    } else {
      query = getLocationText(land);
    }

    if (!query || query === "Location not available") {
      alert("Location is not available for this land.");
      return;
    }

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        query
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------
  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("agrisenseUser");

    window.location.href = "/login";
  };

  // --------------------------------------------------
  // REPORT
  // --------------------------------------------------
  const downloadReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      user: user,
      totalLands: lands.length,
      totalArea: totalArea,
      lands: lands,
    };

    const blob = new Blob(
      [JSON.stringify(report, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "AgriSense-Foreign-Land-Report.json";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // --------------------------------------------------
  // ADD LAND
  // --------------------------------------------------
  const addNewLand = () => {
    window.location.href = "/foreign-registration";
  };

  return (
    <div className="foreign-dashboard">
      {/* =================================================
          SIDEBAR
      ================================================== */}

      <aside className="foreign-sidebar">
        {/* BRAND */}
        <div className="foreign-brand">
          <div className="foreign-logo">
            <Sprout size={26} />
          </div>

          <div>
            <h2>AgriSense</h2>
            <p>Smart Farming · Better Tomorrow</p>
          </div>
        </div>

        {/* MENU */}
        <nav className="foreign-menu">
          <button className="foreign-menu-item active">
            <Home size={19} />
            <span>Dashboard</span>
          </button>

          <button
            className="foreign-menu-item"
            onClick={() =>
              document
                .getElementById("my-lands")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            <Map size={19} />
            <span>My Lands</span>
          </button>

          <button
            className="foreign-menu-item"
            onClick={() =>
              document
                .getElementById("sensor-data")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            <Radio size={19} />
            <span>Sensor Data</span>
          </button>

          <button
            className="foreign-menu-item"
            onClick={downloadReport}
          >
            <FileText size={19} />
            <span>Reports</span>
          </button>

          <button className="foreign-menu-item">
            <BarChart3 size={19} />
            <span>Market Insights</span>
          </button>

          <button className="foreign-menu-item">
            <MessageSquare size={19} />
            <span>Messages</span>
          </button>

          <button className="foreign-menu-item">
            <Settings size={19} />
            <span>Settings</span>
          </button>
        </nav>

        {/* LOGOUT */}
        <button
          className="foreign-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================== */}

      <main className="foreign-main">
        {/* HEADER */}
        <header className="foreign-header">
          <div>
            <h1>Foreign Dashboard</h1>

            <p>
              Monitor your agricultural land from
              anywhere in the world.
            </p>
          </div>

          <div className="foreign-header-right">
            {/* NOTIFICATION */}
            <button className="foreign-notification">
              <Bell size={20} />
              <span>1</span>
            </button>

            {/* PROFILE */}
            <div className="foreign-profile-wrapper">
              <button
                className="foreign-profile"
                onClick={() =>
                  setShowProfileMenu(
                    !showProfileMenu
                  )
                }
              >
                <div className="foreign-avatar">
                  <Globe2 size={18} />
                </div>

                <div className="foreign-profile-info">
                  <strong>
                    {user.name ||
                      "Foreign Landowner"}
                  </strong>

                  <small>
                    {user.role ||
                      "Foreign User"}
                  </small>
                </div>

                <ChevronDown size={15} />
              </button>

              {showProfileMenu && (
                <div className="foreign-profile-menu">
                  <div>
                    <strong>
                      {user.name ||
                        "Foreign Landowner"}
                    </strong>

                    <span>
                      {user.email || "Foreign User"}
                    </span>
                  </div>

                  <button>
                    <Settings size={16} />
                    Account Settings
                  </button>

                  <button onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <Globe2
              size={21}
              className="header-globe"
            />
          </div>
        </header>

        {/* =================================================
            STAT CARDS
        ================================================== */}

        <section className="foreign-stats">
          {/* MY LANDS */}
          <div className="foreign-stat-card green">
            <div className="foreign-stat-icon">
              <MapPin size={22} />
            </div>

            <div>
              <span>My Lands</span>

              <strong>{lands.length}</strong>

              <small>Registered Lands</small>
            </div>
          </div>

          {/* TOTAL AREA */}
          <div className="foreign-stat-card blue">
            <div className="foreign-stat-icon">
              <Map size={22} />
            </div>

            <div>
              <span>Total Area</span>

              <strong>
                {totalArea.toFixed(1)} Acres
              </strong>

              <small>
                Across {lands.length} Locations
              </small>
            </div>
          </div>

          {/* ACTIVE FIELDS */}
          <div className="foreign-stat-card purple">
            <div className="foreign-stat-icon">
              <Sprout size={22} />
            </div>

            <div>
              <span>Active Fields</span>

              <strong>{lands.length}</strong>

              <small>
                Currently Monitoring
              </small>
            </div>
          </div>

          {/* STATUS */}
          <div className="foreign-stat-card orange">
            <div className="foreign-stat-icon">
              <Activity size={22} />
            </div>

            <div>
              <span>System Status</span>

              <strong>Online</strong>

              <small>
                Sensors Connected
              </small>
            </div>
          </div>
        </section>

        {/* =================================================
            LAND + SENSOR SECTION
        ================================================== */}

        <section className="foreign-main-row">
          {/* =================================================
              LAND OVERVIEW
          ================================================== */}

          <div
            className="foreign-panel land-overview"
            id="my-lands"
          >
            <div className="foreign-panel-header">
              <div>
                <h2>Land Overview</h2>

                <p>
                  Your registered agricultural
                  locations
                </p>
              </div>

              <div className="land-header-actions">
                <span className="land-count">
                  {lands.length}{" "}
                  {lands.length === 1
                    ? "Land"
                    : "Lands"}
                </span>

                <button
                  className="add-land-btn"
                  onClick={addNewLand}
                >
                  <Plus size={16} />
                  Add Land
                </button>
              </div>
            </div>

            {/* LAND LIST */}
            <div className="land-list">
              {lands.length === 0 ? (
                <div className="no-land">
                  <div className="no-land-icon">
                    <Sprout size={38} />
                  </div>

                  <h3>
                    No Land Registered
                  </h3>

                  <p>
                    Register your agricultural
                    land to monitor it from
                    anywhere in the world.
                  </p>

                  <button
                    onClick={addNewLand}
                    className="register-land-button"
                  >
                    <Plus size={17} />
                    Register Land
                  </button>
                </div>
              ) : (
                lands.map((land, index) => {
                  const area = Number(
                    land.area ??
                      land.acres ??
                      land.landArea ??
                      0
                  );

                  const location =
                    getLocationText(land);

                  const coordinates =
                    getCoordinates(land);

                  return (
                    <div
                      className="land-list-item"
                      key={
                        land.id || index
                      }
                    >
                      {/* ICON */}
                      <div className="land-list-icon">
                        <Sprout size={20} />
                      </div>

                      {/* DETAILS */}
                      <div className="land-list-info">
                        <strong>
                          {land.landName ||
                            land.name ||
                            `Agricultural Land ${
                              index + 1
                            }`}
                        </strong>

                        <div className="land-location">
                          <MapPin size={14} />

                          <span>
                            {location}
                          </span>
                        </div>

                        <div className="land-meta">
                          <span>
                            {area.toFixed(1)}{" "}
                            Acres
                          </span>

                          {coordinates && (
                            <span>
                              📍{" "}
                              {coordinates}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="land-list-right">
                        <span className="healthy-badge">
                          <span>●</span>
                          Healthy
                        </span>

                        <button
                          className="land-view-button"
                          onClick={() => {
                            setSelectedLand(
                              land
                            );
                          }}
                          title="View land details"
                        >
                          View
                        </button>

                        <button
                          className="land-map-button"
                          onClick={() =>
                            openLocation(land)
                          }
                          title="Open registered location"
                        >
                          <MapPin size={17} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* =================================================
              SENSOR DATA
          ================================================== */}

          <div
            className="foreign-panel sensor-panel"
            id="sensor-data"
          >
            <div className="foreign-panel-header">
              <div>
                <h2>Live Sensor Data</h2>

                <p>
                  Latest available field
                  readings
                </p>
              </div>

              <span className="sensor-live">
                <span></span>
                Live
              </span>
            </div>

            <div className="sensor-grid">
              {/* TEMPERATURE */}
              <div className="sensor-card">
                <div className="sensor-icon temperature">
                  <Thermometer size={20} />
                </div>

                <span>Temperature</span>

                <strong>28.4 °C</strong>

                <small>
                  Normal range
                </small>
              </div>

              {/* MOISTURE */}
              <div className="sensor-card">
                <div className="sensor-icon moisture">
                  <Droplets size={20} />
                </div>

                <span>Soil Moisture</span>

                <strong>62%</strong>

                <small>
                  Good moisture
                </small>
              </div>

              {/* HUMIDITY */}
              <div className="sensor-card">
                <div className="sensor-icon humidity">
                  <Wind size={20} />
                </div>

                <span>Humidity</span>

                <strong>71%</strong>

                <small>
                  Suitable
                </small>
              </div>

              {/* PH */}
              <div className="sensor-card">
                <div className="sensor-icon ph">
                  <FlaskConical size={20} />
                </div>

                <span>Soil pH</span>

                <strong>6.7</strong>

                <small>
                  Optimal
                </small>
              </div>
            </div>

            {/* SENSOR FOOTER */}
            <div className="sensor-footer">
              <Activity size={16} />

              <span>
                Last updated a few seconds ago
              </span>
            </div>
          </div>

          {/* =================================================
              QUICK ACTIONS
          ================================================== */}

          <div className="foreign-panel quick-panel">
            <div className="foreign-panel-header">
              <div>
                <h2>Quick Actions</h2>

                <p>
                  Manage your farm quickly
                </p>
              </div>
            </div>

            <div className="foreign-actions">
              <button onClick={addNewLand}>
                <div className="action-icon">
                  <Plus size={17} />
                </div>

                <span>Register New Land</span>
              </button>

              <button
                onClick={() => {
                  document
                    .getElementById(
                      "my-lands"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
              >
                <div className="action-icon">
                  <Map size={17} />
                </div>

                <span>View Land Details</span>
              </button>

              <button
                onClick={downloadReport}
              >
                <div className="action-icon">
                  <Download size={17} />
                </div>

                <span>
                  Download Report
                </span>
              </button>

              <button>
                <div className="action-icon">
                  <AlertTriangle
                    size={17}
                  />
                </div>

                <span>Check Alerts</span>
              </button>

              <button>
                <div className="action-icon">
                  <Headphones size={17} />
                </div>

                <span>
                  Contact Support
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* =================================================
            WEATHER / FARM STATUS
        ================================================== */}

        <section className="foreign-bottom-grid">
          {/* WEATHER */}
          <div className="foreign-panel weather-panel">
            <div className="foreign-panel-header">
              <div>
                <h2>Farm Weather</h2>

                <p>
                  Current conditions
                </p>
              </div>

              <CloudSun size={28} />
            </div>

            <div className="weather-content">
              <div className="weather-temperature">
                <strong>28°</strong>

                <span>Clear</span>
              </div>

              <div className="weather-details">
                <div>
                  <Droplets size={17} />
                  <span>Humidity</span>
                  <strong>71%</strong>
                </div>

                <div>
                  <Wind size={17} />
                  <span>Wind</span>
                  <strong>12 km/h</strong>
                </div>

                <div>
                  <Thermometer size={17} />
                  <span>Feels Like</span>
                  <strong>29°</strong>
                </div>
              </div>
            </div>
          </div>

          {/* FARM HEALTH */}
          <div className="foreign-panel farm-health-panel">
            <div className="foreign-panel-header">
              <div>
                <h2>Farm Health</h2>

                <p>
                  Overall field condition
                </p>
              </div>

              <Leaf size={27} />
            </div>

            <div className="health-content">
              <div className="health-score">
                <strong>92%</strong>
                <span>Healthy</span>
              </div>

              <div className="health-progress">
                <div className="health-progress-bar">
                  <span
                    style={{
                      width: "92%",
                    }}
                  ></span>
                </div>

                <p>
                  Your fields are currently
                  showing healthy conditions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            GLOBAL BANNER
        ================================================== */}

        <section className="foreign-banner">
          <div className="banner-content">
            <div className="banner-icon">
              <Globe2 size={30} />
            </div>

            <div>
              <h2>
                Agriculture connects people
                across borders
              </h2>

              <p>
                Smarter decisions. Better
                harvests. A sustainable future.
              </p>
            </div>
          </div>

          <div className="banner-brand">
            <Sprout size={22} />
            <span>AgriSense</span>
          </div>
        </section>
      </main>

      {/* =================================================
          LAND DETAILS MODAL
      ================================================== */}

      {selectedLand && (
        <div
          className="land-modal-overlay"
          onClick={() =>
            setSelectedLand(null)
          }
        >
          <div
            className="land-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="land-modal-header">
              <div>
                <h2>
                  {selectedLand.landName ||
                    selectedLand.name ||
                    "Agricultural Land"}
                </h2>

                <p>
                  Registered land information
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedLand(null)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="land-modal-body">
              <div className="detail-box">
                <MapPin size={19} />

                <div>
                  <span>Location</span>

                  <strong>
                    {getLocationText(
                      selectedLand
                    )}
                  </strong>
                </div>
              </div>

              <div className="detail-box">
                <Map size={19} />

                <div>
                  <span>Area</span>

                  <strong>
                    {Number(
                      selectedLand.area ??
                        selectedLand.acres ??
                        selectedLand.landArea ??
                        0
                    ).toFixed(1)}{" "}
                    Acres
                  </strong>
                </div>
              </div>

              {getCoordinates(
                selectedLand
              ) && (
                <div className="detail-box">
                  <Globe2 size={19} />

                  <div>
                    <span>Coordinates</span>

                    <strong>
                      {getCoordinates(
                        selectedLand
                      )}
                    </strong>
                  </div>
                </div>
              )}

              <div className="detail-box">
                <Activity size={19} />

                <div>
                  <span>Status</span>

                  <strong className="healthy-text">
                    Healthy
                  </strong>
                </div>
              </div>
            </div>

            <div className="land-modal-footer">
              <button
                className="modal-close-btn"
                onClick={() =>
                  setSelectedLand(null)
                }
              >
                Close
              </button>

              <button
                className="modal-map-btn"
                onClick={() =>
                  openLocation(
                    selectedLand
                  )
                }
              >
                <MapPin size={17} />
                View Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForeignDashboard;