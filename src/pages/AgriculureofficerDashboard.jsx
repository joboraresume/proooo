import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Home,
  Map,
  Users,
  FileText,
  Activity,
  Sprout,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  UsersRound,
  BookOpen,
  Leaf,
  TriangleAlert,
  Thermometer,
  Droplets,
  FlaskConical,
  Eye,
  ShieldAlert,
  Send,
  Camera,
  ArrowUpRight,
  MoreHorizontal,
  Search,
  Plus,
  MapPin,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ImagePlus,
} from "lucide-react";

import "./AgricultureofficerDashboard.css";

const navItems = [
  { label: "Dashboard", icon: Home },
  { label: "Land Registration", icon: Map },
  { label: "Farmers", icon: Users },
  { label: "Reports", icon: FileText },
  { label: "Disease Monitoring", icon: Activity },
  { label: "Soil & Crop Analysis", icon: Sprout },
];

const registrations = [
  {
    farmer: "Rajesh Kumar",
    location: "Kottarakkara, Kerala",
    crop: "Rice",
    area: "2.4 acres",
    status: "Approved",
  },
  {
    farmer: "Meera Thomas",
    location: "Chengannur, Kerala",
    crop: "Banana",
    area: "1.8 acres",
    status: "Pending",
  },
  {
    farmer: "Suresh Nair",
    location: "Mavelikkara, Kerala",
    crop: "Coconut",
    area: "3.2 acres",
    status: "Approved",
  },
];

const wildlifeDetections = [
  {
    name: "Wild Boar",
    confidence: "96%",
    time: "2 min ago",
  },
  {
    name: "Elephant",
    confidence: "92%",
    time: "18 min ago",
  },
  {
    name: "Deer",
    confidence: "87%",
    time: "1 hr ago",
  },
];

const AgricultureOfficerDashboard = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [notifications, setNotifications] = useState(3);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  const handleNavClick = (label) => {
    setActiveNav(label);
    // Add navigation logic based on the selected menu item
    switch(label) {
      case "Dashboard":
        // Already on dashboard
        break;
      case "Land Registration":
        navigate("/landowner-registration");
        break;
      case "Farmers":
        navigate("/farmer-registration");
        break;
      case "Reports":
        // Navigate to reports page if exists
        break;
      case "Disease Monitoring":
        // Navigate to disease monitoring page if exists
        break;
      case "Soil & Crop Analysis":
        // Navigate to soil analysis page if exists
        break;
      case "Settings":
        // Navigate to settings page if exists
        break;
      default:
        break;
    }
  };

  return (
    <div className="officer-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="officer-sidebar">

        <div className="officer-brand">
          <div className="officer-logo">
            <Leaf size={22} />
          </div>

          <div>
            <h2>AgriSense</h2>
            <p>SMART FARMING · BETTER TOMORROW</p>
          </div>
        </div>

        <div className="sidebar-label">
          MAIN MENU
        </div>

        <nav className="officer-menu">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              className={`officer-menu-item ${
                activeNav === label ? "active" : ""
              }`}
              onClick={() => setActiveNav(label)}
            >
              <Icon size={17} strokeWidth={1.9} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-label sidebar-label-bottom">
          SYSTEM
        </div>

        <button
          type="button"
          className="officer-menu-item"
          onClick={() => setActiveNav("Settings")}
        >
          <Settings size={17} strokeWidth={1.9} />
          <span>Settings</span>
        </button>

        <button
          type="button"
          className="officer-logout"
          onClick={() => {
            localStorage.removeItem("agrisenseRole");
            window.location.href = "/login";
          }}
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>

        <div className="sidebar-footer">
          <div className="sidebar-status-dot" />

          <div>
            <strong>System Online</strong>
            <span>All services operational</span>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="officer-main">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="officer-header">

          <div className="welcome-block">
            <div className="eyebrow">
              AGRICULTURE DEPARTMENT
            </div>

            <h1>
              Good morning, Anitha <span>🌿</span>
            </h1>

            <p>
              Monitor farms, support farmers, and protect every harvest.
            </p>
          </div>

          <div className="officer-header-right">

            <button
              type="button"
              className="notification-button"
              onClick={() => setNotifications(0)}
              aria-label="Notifications"
            >
              <Bell size={19} />

              {notifications > 0 && (
                <span>{notifications}</span>
              )}
            </button>

            <div className="officer-profile">

              <div className="officer-avatar">
                <UsersRound size={18} />
              </div>

              <div className="officer-profile-info">
                <strong>Anitha S</strong>
                <small>Agriculture Officer</small>
              </div>

              <ChevronDown size={15} />

            </div>
          </div>
        </header>

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="hero-card">

          <div className="hero-copy">

            <span className="hero-kicker">
              <Sprout size={14} />
              SMART AGRICULTURE COMMAND CENTER
            </span>

            <h2>
              One dashboard for every field.
            </h2>

            <p>
              Track registrations, crop health, soil conditions,
              disease alerts and wildlife activity from a single
              intelligent command center.
            </p>

            <div className="hero-actions">

              <button
                type="button"
                className="primary-button"
              >
                <Plus size={15} />
                Register New Farm
              </button>

              <button
                type="button"
                className="secondary-button"
              >
                <Map size={15} />
                Explore Farm Map
              </button>

            </div>
          </div>

          {/* IMAGE AREA */}

          <div className="hero-image-slot">

            {/* 
              LATER:
              Replace this placeholder with your uploaded farm image.

              Example:
              <img
                src="/farm-hero.jpg"
                alt="Agricultural farm"
                className="hero-real-image"
              />
            */}

            <div className="image-placeholder">

              <ImagePlus size={28} />

              <span>
                Farm hero image
              </span>

              <small>
                Upload your image later
              </small>

            </div>

            <div className="hero-image-overlay" />

            <div className="hero-floating-card">

              <div className="hero-floating-icon">
                <CheckCircle2 size={16} />
              </div>

              <div>
                <strong>142 active fields</strong>
                <span>Protected & monitored</span>
              </div>

            </div>

          </div>
        </section>

        {/* ===================================================
            STATISTICS
        =================================================== */}

        <section className="officer-stats">

          <div className="officer-stat-card green-stat">

            <div className="officer-stat-icon green-stat-icon">
              <UsersRound size={21} />
            </div>

            <div className="officer-stat-content">
              <span>Total Farmers</span>
              <strong>248</strong>
              <small>↗ +12 this month</small>
            </div>

            <ArrowUpRight
              className="stat-arrow"
              size={16}
            />

          </div>

          <div className="officer-stat-card blue-stat">

            <div className="officer-stat-icon blue-stat-icon">
              <BookOpen size={21} />
            </div>

            <div className="officer-stat-content">
              <span>Registered Lands</span>
              <strong>186</strong>
              <small>↗ +8 this month</small>
            </div>

            <ArrowUpRight
              className="stat-arrow"
              size={16}
            />

          </div>

          <div className="officer-stat-card yellow-stat">

            <div className="officer-stat-icon yellow-stat-icon">
              <Leaf size={21} />
            </div>

            <div className="officer-stat-content">
              <span>Active Fields</span>
              <strong>142</strong>
              <small>↗ +5 this month</small>
            </div>

            <ArrowUpRight
              className="stat-arrow"
              size={16}
            />

          </div>

          <div className="officer-stat-card purple-stat">

            <div className="officer-stat-icon purple-stat-icon">
              <TriangleAlert size={21} />
            </div>

            <div className="officer-stat-content">
              <span>Issues Reported</span>
              <strong>7</strong>
              <small>Needs attention</small>
            </div>

            <ArrowUpRight
              className="stat-arrow"
              size={16}
            />

          </div>

        </section>

        {/* ===================================================
            DASHBOARD GRID
        =================================================== */}

        <section className="dashboard-grid">

          {/* =================================================
              CROP HEALTH
          ================================================= */}

          <article className="officer-panel crop-health-panel">

            <div className="officer-panel-header">

              <div>
                <span className="panel-eyebrow">
                  FIELD STATUS
                </span>

                <h2>
                  Crop Health Overview
                </h2>
              </div>

              <select defaultValue="30">
                <option value="30">
                  Last 30 Days
                </option>

                <option value="7">
                  Last 7 Days
                </option>

                <option value="90">
                  Last 3 Months
                </option>
              </select>

            </div>

            <div className="crop-health-content">

              <div className="donut-chart">

                <div className="donut-inner">
                  <strong>78%</strong>
                  <span>Healthy</span>
                </div>

              </div>

              <div className="crop-health-summary">

                <div className="health-summary-main">
                  <strong>Good condition</strong>

                  <span>
                    Most monitored crops are growing normally.
                  </span>
                </div>

                <div className="crop-legend">

                  <div>
                    <span className="legend-dot healthy" />
                    <span>Healthy</span>
                    <strong>78%</strong>
                  </div>

                  <div>
                    <span className="legend-dot moderate" />
                    <span>Moderate</span>
                    <strong>15%</strong>
                  </div>

                  <div>
                    <span className="legend-dot risk" />
                    <span>At Risk</span>
                    <strong>7%</strong>
                  </div>

                </div>
              </div>
            </div>
          </article>

          {/* =================================================
              DISEASE
          ================================================= */}

          <article className="officer-panel disease-panel">

            <div className="officer-panel-header">

              <div>
                <span className="panel-eyebrow">
                  AI MONITORING
                </span>

                <h2>
                  Recent Disease Alerts
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAllAlerts(!showAllAlerts)
                }
              >
                {showAllAlerts ? "Collapse" : "View All"}
              </button>

            </div>

            <div className="disease-list">

              <div className="disease-item">

                <div className="disease-icon red-disease">
                  <Sprout size={17} />
                </div>

                <div className="disease-info">
                  <strong>Rice Leaf Blast</strong>
                  <span>
                    Field 3 · Kottarakkara
                  </span>
                </div>

                <div className="disease-right">
                  <span className="high-badge">
                    High
                  </span>

                  <small>
                    2 days ago
                  </small>
                </div>

              </div>

              <div className="disease-item">

                <div className="disease-icon green-disease">
                  <Leaf size={17} />
                </div>

                <div className="disease-info">
                  <strong>Tomato Early Blight</strong>
                  <span>
                    Field 7 · Chengannur
                  </span>
                </div>

                <div className="disease-right">
                  <span className="medium-badge">
                    Medium
                  </span>

                  <small>
                    3 days ago
                  </small>
                </div>

              </div>

              {showAllAlerts && (
                <div className="disease-item">

                  <div className="disease-icon yellow-disease">
                    <Sprout size={17} />
                  </div>

                  <div className="disease-info">
                    <strong>
                      Maize Fall Armyworm
                    </strong>

                    <span>
                      Field 12 · Mavelikkara
                    </span>
                  </div>

                  <div className="disease-right">

                    <span className="medium-badge">
                      Medium
                    </span>

                    <small>
                      4 days ago
                    </small>

                  </div>

                </div>
              )}

            </div>
          </article>

          {/* =================================================
              REGISTRATIONS
          ================================================= */}

          <article className="officer-panel registration-panel">

            <div className="officer-panel-header">

              <div>
                <span className="panel-eyebrow">
                  REGISTRATION
                </span>

                <h2>
                  Recent Farm Registrations
                </h2>
              </div>

              <button type="button">
                View All
                <ArrowUpRight size={11} />
              </button>

            </div>

            <div className="registration-toolbar">

              <div className="search-box">
                <Search size={14} />

                <input
                  placeholder="Search farmers or locations..."
                />
              </div>

              <button
                type="button"
                className="filter-button"
              >
                <CalendarDays size={14} />
                This month
              </button>

            </div>

            <div className="registration-list">

              {registrations.map((farm) => (

                <div
                  className="registration-row"
                  key={farm.farmer}
                >

                  <div className="farm-thumb">
                    <ImagePlus size={15} />
                  </div>

                  <div className="farm-name">

                    <strong>
                      {farm.farmer}
                    </strong>

                    <span>
                      <MapPin size={11} />
                      {farm.location}
                    </span>

                  </div>

                  <div className="farm-detail">

                    <span>Crop</span>
                    <strong>{farm.crop}</strong>

                  </div>

                  <div className="farm-detail area-detail">

                    <span>Area</span>
                    <strong>{farm.area}</strong>

                  </div>

                  <span
                    className={`registration-status ${
                      farm.status.toLowerCase()
                    }`}
                  >
                    {farm.status === "Approved" ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <Clock3 size={12} />
                    )}

                    {farm.status}
                  </span>

                  <button
                    type="button"
                    className="more-button"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                </div>

              ))}

            </div>
          </article>

          {/* =================================================
              WILDLIFE
          ================================================= */}

          <article className="officer-panel wildlife-panel">

            <div className="officer-panel-header">

              <div>
                <span className="panel-eyebrow alert-eyebrow">
                  LIVE CAMERA
                </span>

                <h2>
                  Wildlife & Crop Protection
                </h2>
              </div>

              <span className="live-pill">
                <span />
                LIVE
              </span>

            </div>

            <div className="wildlife-feed">

              <div className="wildlife-image-slot">

                <div className="image-placeholder dark">

                  <Camera size={26} />

                  <span>
                    Farm camera image
                  </span>

                  <small>
                    Upload wildlife image later
                  </small>

                </div>

                <div className="camera-label">
                  <Camera size={12} />
                  Farm Cam 01 · Crop Field
                </div>

                <div className="camera-time">
                  05:27:36 AM
                </div>

                <div className="wildlife-bbox">
                  <span>
                    Wild Boar · 96%
                  </span>
                </div>

                <div className="camera-bottom">

                  <span>
                    <Eye size={12} />
                    AI detection active
                  </span>

                  <span>
                    1920 × 1080
                  </span>

                </div>

              </div>

              <div className="wildlife-side">

                <div className="danger-alert">

                  <div className="danger-icon">
                    <ShieldAlert size={17} />
                  </div>

                  <div>
                    <strong>
                      Crop damage detected
                    </strong>

                    <span>
                      Wild animals are entering a monitored field.
                    </span>
                  </div>

                </div>

                <div className="wildlife-metrics">

                  <div>
                    <span>Activity</span>
                    <strong>Attacking Crops</strong>
                  </div>

                  <div>
                    <span>Affected Area</span>
                    <strong>12.6 m²</strong>
                  </div>

                  <div>
                    <span>Risk Level</span>
                    <strong className="high-risk">
                      HIGH
                    </strong>
                  </div>

                </div>

                <button
                  type="button"
                  className="alert-action"
                >
                  <Send size={14} />
                  Send Field Alert
                </button>

              </div>

            </div>

            <div className="recent-detection-title">

              <span>
                Recent Detections
              </span>

              <small>
                AI camera events
              </small>

            </div>

            <div className="recent-detections">

              {wildlifeDetections.map((item) => (

                <div
                  className="detection-card"
                  key={item.name}
                >

                  <div className="detection-thumb">
                    <ImagePlus size={13} />
                  </div>

                  <div>

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.confidence} · {item.time}
                    </span>

                  </div>

                  <span className="detection-alert-dot" />

                </div>

              ))}

            </div>
          </article>

          {/* =================================================
              SOIL
          ================================================= */}

          <article className="officer-panel soil-panel">

            <div className="officer-panel-header">

              <div>
                <span className="panel-eyebrow">
                  ENVIRONMENT
                </span>

                <h2>
                  Soil & Weather Summary
                </h2>
              </div>

              <span className="location-chip">
                <MapPin size={11} />
                Kerala
              </span>

            </div>

            <div className="soil-summary-grid">

              <div className="soil-item">

                <div className="soil-item-icon temperature">
                  <Thermometer size={18} />
                </div>

                <span>Temperature</span>
                <strong>28.4°C</strong>

              </div>

              <div className="soil-item">

                <div className="soil-item-icon humidity">
                  <Droplets size={18} />
                </div>

                <span>Humidity</span>
                <strong>71%</strong>

              </div>

              <div className="soil-item">

                <div className="soil-item-icon ph">
                  <FlaskConical size={18} />
                </div>

                <span>Soil pH</span>
                <strong>6.7</strong>

              </div>

              <div className="soil-item">

                <div className="soil-item-icon moisture">
                  <Leaf size={18} />
                </div>

                <span>Moisture</span>
                <strong>62%</strong>

              </div>

            </div>
          </article>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <article className="officer-panel quick-panel">

            <div className="officer-panel-header">

              <div>
                <span className="panel-eyebrow">
                  SHORTCUTS
                </span>

                <h2>
                  Quick Actions
                </h2>
              </div>

            </div>

            <div className="quick-actions">

              <button
                type="button"
                className="quick-action green-action"
              >
                <Map size={16} />
                <span>View Land Details</span>
                <ArrowUpRight size={13} />
              </button>

              <button
                type="button"
                className="quick-action green-action"
              >
                <FileText size={16} />
                <span>Generate Report</span>
                <ArrowUpRight size={13} />
              </button>

              <button
                type="button"
                className="quick-action blue-action"
              >
                <ShieldAlert size={16} />
                <span>Check Disease Alerts</span>
                <ArrowUpRight size={13} />
              </button>

              <button
                type="button"
                className="quick-action blue-action"
              >
                <Send size={16} />
                <span>Send Advisory</span>
                <ArrowUpRight size={13} />
              </button>

            </div>
          </article>

        </section>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="dashboard-footer">

          <span>
            AgriSense Officer Portal
          </span>

          <span>
            Last synced a few seconds ago ·{" "}
            <b>Secure connection</b>
          </span>

        </footer>

      </main>
    </div>
  );
};

export default AgricultureOfficerDashboard;