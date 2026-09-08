import React, { useEffect, useState } from "react";
import {
  Home,
  MapPin,
  Radio,
  Brain,
  FileText,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Thermometer,
  Droplets,
  Wind,
  FlaskConical,
  Map,
  Sparkles,
  ClipboardList,
  Eye,
  Sprout,
  Globe2,
} from "lucide-react";

import "./LandDashboard.css";

function LandDashboard() {
  const [user, setUser] = useState({
    name: "Landowner",
    role: "Landowner",
  });

  const [land, setLand] = useState({
    landName: "My Agricultural Land",
    country: "",
    state: "",
    province: "",
    city: "",
    district: "",
    surveyNumber: "",
    area: "",
    crop: "",
    latitude: "",
    longitude: "",
  });

  const [showProfile, setShowProfile] = useState(false);

  // =====================================================
  // LOAD DATA FROM LOCAL STORAGE
  // =====================================================

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    try {
      const savedUser = localStorage.getItem("agrisenseUser");
      const savedLand = localStorage.getItem("agrisenseLand");

      // USER
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);

        if (parsedUser && typeof parsedUser === "object") {
          setUser(parsedUser);
        }
      }

      // LAND
      if (savedLand) {
        const parsedLand = JSON.parse(savedLand);

        if (Array.isArray(parsedLand)) {
          if (parsedLand.length > 0) {
            setLand(parsedLand[0]);
          }
        } else if (
          parsedLand &&
          typeof parsedLand === "object"
        ) {
          setLand(parsedLand);
        }
      }
    } catch (error) {
      console.error(
        "Error loading AgriSense data:",
        error
      );
    }
  };

  // =====================================================
  // GET LAND LOCATION
  // =====================================================

  const getLocation = () => {
    const locationParts = [
      land.city,
      land.district,
      land.state,
      land.province,
      land.country,
    ].filter(
      (value) =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    );

    if (locationParts.length > 0) {
      return [...new Set(locationParts)].join(", ");
    }

    if (
      land.latitude !== undefined &&
      land.longitude !== undefined &&
      land.latitude !== "" &&
      land.longitude !== ""
    ) {
      return `${land.latitude}, ${land.longitude}`;
    }

    return "Location not registered";
  };

  // =====================================================
  // VIEW LAND LOCATION
  // =====================================================

  const handleViewLocation = () => {
    let location = "";

    if (
      land.latitude !== undefined &&
      land.longitude !== undefined &&
      land.latitude !== "" &&
      land.longitude !== ""
    ) {
      location = `${land.latitude},${land.longitude}`;
    } else {
      location = getLocation();
    }

    if (
      !location ||
      location === "Location not registered"
    ) {
      alert("Land location is not available.");
      return;
    }

    const mapUrl =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(location);

    window.open(mapUrl, "_blank");
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const goTo = (path) => {
    window.location.href = path;
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    localStorage.removeItem("agrisenseUser");

    window.location.href = "/login";
  };

  // =====================================================
  // GENERATE REPORT
  // =====================================================

  const generateReport = () => {
    const report = {
      user: user,
      land: land,
      sensorData: {
        temperature: "28.4 °C",
        soilMoisture: "62 %",
        humidity: "71 %",
        soilPH: "6.7",
      },
      generatedAt: new Date().toLocaleString(),
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
    link.download = "AgriSense-Land-Report.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // SENSOR DATA
  // =====================================================

  const sensors = [
    {
      title: "Temperature",
      value: "28.4 °C",
      status: "Normal",
      icon: <Thermometer size={27} />,
      className: "temperature",
    },
    {
      title: "Soil Moisture",
      value: "62 %",
      status: "Optimal",
      icon: <Droplets size={27} />,
      className: "moisture",
    },
    {
      title: "Humidity",
      value: "71 %",
      status: "Good",
      icon: <Wind size={27} />,
      className: "humidity",
    },
    {
      title: "Soil pH",
      value: "6.7",
      status: "Optimal",
      icon: <FlaskConical size={27} />,
      className: "ph",
    },
  ];

  return (
    <div className="land-dashboard">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="land-sidebar">

        {/* BRAND */}

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            <Sprout size={27} />
          </div>

          <div>
            <h2>AgriSense</h2>

            <p>
              Smart Farming · Better Tomorrow
            </p>
          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-navigation">

          <button
            className="sidebar-item active"
            onClick={() =>
              goTo("/land-dashboard")
            }
          >
            <Home size={20} />
            <span>Dashboard</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() =>
              goTo("/land-details")
            }
          >
            <MapPin size={20} />
            <span>Land Details</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() =>
              goTo("/sensor-data")
            }
          >
            <Radio size={20} />
            <span>Sensor Data</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() =>
              goTo("/ai-assistant")
            }
          >
            <Brain size={20} />
            <span>AI Assistant</span>
          </button>

          <button
            className="sidebar-item"
            onClick={generateReport}
          >
            <FileText size={20} />
            <span>Reports</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() =>
              goTo("/settings")
            }
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>

        </nav>

        {/* LOGOUT */}

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>

      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="land-main">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="land-topbar">

          <div></div>

          <div className="topbar-right">

            {/* NOTIFICATION */}

            <button className="notification-button">

              <Bell size={20} />

              <span>3</span>

            </button>

            {/* PROFILE */}

            <div className="profile-wrapper">

              <button
                className="profile-button"
                onClick={() =>
                  setShowProfile(
                    !showProfile
                  )
                }
              >

                <div className="profile-avatar">
                  <span>👤</span>
                </div>

                <div className="profile-details">

                  <strong>
                    {user.name ||
                      "Landowner"}
                  </strong>

                  <small>
                    {user.role ||
                      "Landowner"}
                  </small>

                </div>

                <ChevronDown size={16} />

              </button>

              {showProfile && (

                <div className="profile-dropdown">

                  <strong>
                    {user.name ||
                      "Landowner"}
                  </strong>

                  <span>
                    {user.email ||
                      "Landowner Account"}
                  </span>

                  <button
                    onClick={handleLogout}
                  >
                    <LogOut size={15} />
                    Logout
                  </button>

                </div>

              )}

            </div>

          </div>

        </header>

        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <section className="page-title">

          <h1>
            Land Dashboard
          </h1>

          <p>
            Monitor your land, track sensor data
            and manage your farming activities.
          </p>

        </section>

        {/* =================================================
            SENSOR CARDS
        ================================================= */}

        <section className="sensor-top-grid">

          {sensors.map(
            (sensor, index) => (

              <div
                className={
                  "top-sensor-card " +
                  sensor.className
                }
                key={index}
              >

                <div className="sensor-top-icon">
                  {sensor.icon}
                </div>

                <div className="sensor-top-content">

                  <span>
                    {sensor.title}
                  </span>

                  <strong>
                    {sensor.value}
                  </strong>

                  <small>
                    <i></i>
                    {sensor.status}
                  </small>

                </div>

              </div>

            )
          )}

        </section>

        {/* =================================================
            DASHBOARD GRID
        ================================================= */}

        <section className="dashboard-grid">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="dashboard-left">

            {/* SENSOR OVERVIEW */}

            <div className="dashboard-card chart-card">

              <div className="card-header">

                <h2>
                  Sensor Data Overview
                </h2>

                <select defaultValue="7">

                  <option value="7">
                    Last 7 Days
                  </option>

                  <option value="30">
                    Last 30 Days
                  </option>

                </select>

              </div>

              {/* CHART */}

              <div className="simple-chart">

                <div className="chart-y-axis">

                  <span>100</span>
                  <span>80</span>
                  <span>60</span>
                  <span>40</span>
                  <span>20</span>
                  <span>0</span>

                </div>

                <div className="chart-area">

                  <div className="grid-line line-100"></div>
                  <div className="grid-line line-80"></div>
                  <div className="grid-line line-60"></div>
                  <div className="grid-line line-40"></div>
                  <div className="grid-line line-20"></div>
                  <div className="grid-line line-0"></div>

                  <svg
                    viewBox="0 0 700 200"
                    preserveAspectRatio="none"
                  >

                    {/* MOISTURE */}

                    <polyline
                      points="
                        0,82
                        110,80
                        220,85
                        330,75
                        440,85
                        550,60
                        700,60
                      "
                      className="chart-moisture"
                    />

                    {/* TEMPERATURE */}

                    <polyline
                      points="
                        0,145
                        110,138
                        220,140
                        330,145
                        440,143
                        550,136
                        700,140
                      "
                      className="chart-temperature"
                    />

                    {/* HUMIDITY */}

                    <polyline
                      points="
                        0,110
                        110,100
                        220,108
                        330,94
                        440,105
                        550,90
                        700,87
                      "
                      className="chart-humidity"
                    />

                    {/* PH */}

                    <polyline
                      points="
                        0,180
                        110,178
                        220,176
                        330,176
                        440,178
                        550,176
                        700,178
                      "
                      className="chart-ph"
                    />

                  </svg>

                  <div className="chart-days">

                    <span>Sep 1</span>
                    <span>Sep 2</span>
                    <span>Sep 3</span>
                    <span>Sep 4</span>
                    <span>Sep 5</span>
                    <span>Sep 6</span>
                    <span>Sep 7</span>

                  </div>

                </div>

              </div>

              {/* LEGEND */}

              <div className="chart-legend">

                <span>
                  <i className="legend-green"></i>
                  Moisture
                </span>

                <span>
                  <i className="legend-red"></i>
                  Temperature
                </span>

                <span>
                  <i className="legend-blue"></i>
                  Humidity
                </span>

                <span>
                  <i className="legend-purple"></i>
                  pH
                </span>

              </div>

            </div>

            {/* =================================================
                RECENT SENSOR READINGS
            ================================================= */}

            <div className="dashboard-card readings-card">

              <div className="card-header">

                <h2>
                  Recent Sensor Readings
                </h2>

                <span className="live-badge">
                  <i></i>
                  Live
                </span>

              </div>

              <div className="table-container">

                <table>

                  <thead>

                    <tr>

                      <th>
                        Date & Time
                      </th>

                      <th>
                        Temperature (°C)
                      </th>

                      <th>
                        Moisture (%)
                      </th>

                      <th>
                        Humidity (%)
                      </th>

                      <th>
                        pH
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    <tr>

                      <td>
                        <i className="status-dot"></i>
                        07 Sep 2025, 10:25 AM
                      </td>

                      <td>28.4</td>
                      <td>62</td>
                      <td>71</td>
                      <td>6.7</td>

                    </tr>

                    <tr>

                      <td>
                        <i className="status-dot"></i>
                        07 Sep 2025, 09:55 AM
                      </td>

                      <td>28.1</td>
                      <td>60</td>
                      <td>69</td>
                      <td>6.6</td>

                    </tr>

                    <tr>

                      <td>
                        <i className="status-dot"></i>
                        07 Sep 2025, 09:25 AM
                      </td>

                      <td>27.9</td>
                      <td>58</td>
                      <td>68</td>
                      <td>6.5</td>

                    </tr>

                    <tr>

                      <td>
                        <i className="status-dot"></i>
                        07 Sep 2025, 08:55 AM
                      </td>

                      <td>27.6</td>
                      <td>56</td>
                      <td>66</td>
                      <td>6.4</td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="dashboard-right">

            {/* =================================================
                LAND LOCATION
            ================================================= */}

            <div className="dashboard-card location-card">

              <div className="location-image">

                <div className="location-overlay">

                  <MapPin size={23} />

                  <div>

                    <span>
                      Land Location
                    </span>

                    <strong>
                      {getLocation()}
                    </strong>

                  </div>

                </div>

              </div>

              {/* LAND INFORMATION */}

              <div className="land-information">

                <div className="land-info-row">

                  <ClipboardList size={18} />

                  <div>

                    <span>
                      Survey Number
                    </span>

                    <strong>
                      {land.surveyNumber ||
                        "Not Registered"}
                    </strong>

                  </div>

                </div>

                <div className="land-info-row">

                  <Map size={18} />

                  <div>

                    <span>
                      Total Area
                    </span>

                    <strong>
                      {land.area ||
                        land.acres ||
                        land.landArea ||
                        "0"}{" "}
                      Acres
                    </strong>

                  </div>

                </div>

                <div className="land-info-row">

                  <Sprout size={18} />

                  <div>

                    <span>
                      Crop
                    </span>

                    <strong>
                      {land.crop ||
                        land.cropType ||
                        "Not Specified"}
                    </strong>

                  </div>

                </div>

                <div className="land-info-row">

                  <Globe2 size={18} />

                  <div>

                    <span>
                      Coordinates
                    </span>

                    <strong>

                      {land.latitude &&
                      land.longitude
                        ? `${land.latitude}, ${land.longitude}`
                        : "Not available"}

                    </strong>

                  </div>

                </div>

              </div>

              <button
                className="location-view-button"
                onClick={
                  handleViewLocation
                }
              >
                <Eye size={15} />
                View Land Location
              </button>

            </div>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div className="dashboard-card quick-actions-card">

              <div className="side-card-title">

                <h2>
                  Quick Actions
                </h2>

              </div>

              <div className="quick-actions-grid">

                <button
                  className="quick-action green"
                  onClick={() =>
                    goTo("/land-details")
                  }
                >

                  <Map size={19} />

                  <span>
                    View Land Details
                  </span>

                </button>

                <button
                  className="quick-action blue"
                  onClick={() =>
                    goTo("/sensor-data")
                  }
                >

                  <Radio size={19} />

                  <span>
                    Check Sensor Data
                  </span>

                </button>

                <button
                  className="quick-action purple"
                  onClick={() =>
                    goTo("/ai-assistant")
                  }
                >

                  <Sparkles size={19} />

                  <span>
                    Open AI Assistant
                  </span>

                </button>

                <button
                  className="quick-action orange"
                  onClick={
                    generateReport
                  }
                >

                  <FileText size={19} />

                  <span>
                    Generate Report
                  </span>

                </button>

              </div>

            </div>

            {/* =================================================
                RECENT ACTIVITY
            ================================================= */}

            <div className="dashboard-card activity-card">

              <div className="side-card-title">

                <h2>
                  Recent Activity
                </h2>

                <button>
                  View All
                </button>

              </div>

              <div className="activity-list">

                <div className="activity-item">

                  <div className="activity-icon green">
                    <Radio size={17} />
                  </div>

                  <div>

                    <strong>
                      Sensor data updated
                    </strong>

                    <span>
                      07 Sep 2025, 10:25 AM
                    </span>

                  </div>

                </div>

                <div className="activity-item">

                  <div className="activity-icon blue">
                    <FileText size={17} />
                  </div>

                  <div>

                    <strong>
                      Land registration verified
                    </strong>

                    <span>
                      06 Sep 2025, 04:12 PM
                    </span>

                  </div>

                </div>

                <div className="activity-item">

                  <div className="activity-icon orange">
                    <Bell size={17} />
                  </div>

                  <div>

                    <strong>
                      New notification
                    </strong>

                    <span>
                      06 Sep 2025, 11:30 AM
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default LandDashboard;