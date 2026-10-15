import React, { useEffect, useMemo, useState } from "react";
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
  MapPin,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CloudSun,
  Waves,
  ImagePlus,
} from "lucide-react";

import "./AgricultureofficerDashboard.css";
import { subscribeLiveSensors } from "../services/sensorservice";
const fmt = (v, unit = "") =>
  v === null || v === undefined || v === "" ? "--" : `${v}${unit}`;

const buildSensorSummary = (live) => ({
  connected: Boolean(live),
  source: "Live field sensors",
  temperature: fmt(live?.temperature, "°C"),
  humidity: fmt(live?.humidity, "%"),
  soilPh: fmt(live?.ph ?? live?.soilPh),
  moisture: fmt(live?.moisture ?? live?.soilMoisture, "%"),
  updatedAt: live?.timestamp
    ? new Date(live.timestamp).toLocaleTimeString()
    : "--",
});

const navItems = [
  { label: "Dashboard", icon: Home, sectionId: "officer-top" },
  { label: "Farmers", icon: Users, sectionId: "officer-farmers" },
  { label: "Reports", icon: FileText, action: "generate-report" },
  { label: "Disease Monitoring", icon: Activity, sectionId: "officer-disease" },
  { label: "Soil & Crop Analysis", icon: Sprout, sectionId: "officer-soil" },
];

const diseaseAlerts = [
  {
    name: "Rice Leaf Blast",
    severity: "High",
    location: "Field 3 - Kottarakkara",
    reported: "2 days ago",
  },
  {
    name: "Tomato Early Blight",
    severity: "Medium",
    location: "Field 7 - Chengannur",
    reported: "3 days ago",
  },
];

function buildOfficerReport({ officerName, department, sensors }) {
  const generatedAt = new Date().toLocaleString();
  const pendingCount = registrations.filter((r) => r.status === "Pending").length;
  const approvedCount = registrations.filter((r) => r.status === "Approved").length;

  return {
    title: "AgriSense Agriculture Officer Report",
    generatedAt,
    officerName,
    department,
    summary: {
      totalFarmers: 248,
      registeredLands: 186,
      activeFields: 142,
      issuesReported: 7,
      cropHealthyPercent: 78,
      pendingRegistrations: pendingCount,
      approvedRegistrations: approvedCount,
    },
    sensors,
    registrations,
    diseaseAlerts,
    wildlifeDetections,
  };
}

function reportToHtml(report) {
  const rows = report.registrations
    .map(
      (farm) => `
      <tr>
        <td>${farm.farmer}</td>
        <td>${farm.location}</td>
        <td>${farm.crop}</td>
        <td>${farm.area}</td>
        <td>${farm.status}</td>
      </tr>`
    )
    .join("");

  const diseases = report.diseaseAlerts
    .map(
      (item) => `
      <li>
        <strong>${item.name}</strong> (${item.severity}) —
        ${item.location} · ${item.reported}
      </li>`
    )
    .join("");

  const wildlife = report.wildlifeDetections
    .map(
      (item) => `
      <li>
        <strong>${item.name}</strong> — ${item.confidence} · ${item.time}
      </li>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${report.title}</title>
  <style>
    body { font-family: Segoe UI, Arial, sans-serif; color: #1a2e22; padding: 32px; line-height: 1.45; }
    h1 { margin: 0 0 6px; font-size: 24px; }
    h2 { margin: 28px 0 10px; font-size: 16px; color: #1f6b3a; }
    .meta { color: #6b7c72; font-size: 13px; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .card { border: 1px solid #e2eae4; border-radius: 12px; padding: 14px; background: #f3faf5; }
    .card span { display: block; color: #6b7c72; font-size: 12px; }
    .card strong { display: block; margin-top: 6px; font-size: 22px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { border: 1px solid #e2eae4; padding: 10px; text-align: left; font-size: 13px; }
    th { background: #e8f5eb; }
    ul { margin: 0; padding-left: 18px; }
    .note { margin-top: 28px; font-size: 12px; color: #6b7c72; }
  </style>
</head>
<body>
  <h1>${report.title}</h1>
  <div class="meta">
    Generated: ${report.generatedAt}<br/>
    Officer: ${report.officerName}<br/>
    Department: ${report.department}
  </div>

  <h2>Summary</h2>
  <div class="grid">
    <div class="card"><span>Total Farmers</span><strong>${report.summary.totalFarmers}</strong></div>
    <div class="card"><span>Registered Lands</span><strong>${report.summary.registeredLands}</strong></div>
    <div class="card"><span>Active Fields</span><strong>${report.summary.activeFields}</strong></div>
    <div class="card"><span>Issues Reported</span><strong>${report.summary.issuesReported}</strong></div>
  </div>

  <h2>Crop Health</h2>
  <p>Healthy fields: <strong>${report.summary.cropHealthyPercent}%</strong></p>
  <p>Approved registrations: ${report.summary.approvedRegistrations} · Pending: ${report.summary.pendingRegistrations}</p>

  <h2>Demo Sensor Readings</h2>
  <p>
    Temperature ${report.sensors.temperature} ·
    Moisture ${report.sensors.moisture} ·
    Humidity ${report.sensors.humidity} ·
    Soil pH ${report.sensors.soilPh}
  </p>
  <p class="meta">${report.sensors.source} · Updated ${report.sensors.updatedAt}</p>

  <h2>Recent Farm Registrations</h2>
  <table>
    <thead>
      <tr>
        <th>Farmer</th>
        <th>Location</th>
        <th>Crop</th>
        <th>Area</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <h2>Disease Alerts</h2>
  <ul>${diseases}</ul>

  <h2>Wildlife Detections</h2>
  <ul>${wildlife}</ul>

  <p class="note">
    This is a generated AgriSense officer report. Demo sensor values will be replaced
    when live field sensors are connected.
  </p>
</body>
</html>`;
}

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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getInitials(name) {
  return (
    String(name || "AO")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "AO"
  );
}

const AgricultureOfficerDashboard = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [notifications, setNotifications] = useState(3);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
    const [liveSensor, setLiveSensor] = useState(null);

  useEffect(() => {
    const unsub = subscribeLiveSensors(setLiveSensor, (e) =>
      console.error("Live sensor error:", e)
    );
    return () => unsub?.();
  }, []);

  const sensors = useMemo(() => buildSensorSummary(liveSensor), [liveSensor]);
  const [user, setUser] = useState(null);
  const [officerProfile, setOfficerProfile] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  useEffect(() => {
    try {
      const savedUser = JSON.parse(
        localStorage.getItem("agrisenseUser") || "null"
      );
      if (!savedUser) {
        navigate("/login");
        return;
      }
      setUser(savedUser);

      const savedOfficer = JSON.parse(
        localStorage.getItem("agrisenseOfficer") || "null"
      );
      setOfficerProfile(savedOfficer);
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const displayName = useMemo(() => {
    return (
      officerProfile?.full_name ||
      officerProfile?.fullName ||
      user?.name ||
      user?.full_name ||
      user?.fullName ||
      "Agriculture Officer"
    );
  }, [officerProfile, user]);

  const firstName = useMemo(
    () => String(displayName).split(" ").filter(Boolean)[0] || "Officer",
    [displayName]
  );

  const scrollToSection = (sectionId) => {
    if (!sectionId) return;
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const generateReport = () => {
    const report = buildOfficerReport({
      officerName: displayName,
      department:
        officerProfile?.department ||
        officerProfile?.designation ||
        "Agriculture Department",
      sensors: sensors,
    });
    setGeneratedReport(report);
    setShowReportModal(true);
    setActiveNav("Reports");
    setMobileOpen(false);
  };

  const downloadReport = () => {
    if (!generatedReport) return;
    const html = reportToHtml(generatedReport);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `agrisense-officer-report-${stamp}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    if (!generatedReport) return;
    const html = reportToHtml(generatedReport);
    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) {
      alert("Please allow pop-ups to print the report.");
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => printWindow.print(), 300);
  };

  const handleNavClick = (label, sectionId, action) => {
    setActiveNav(label);
    setMobileOpen(false);

    if (action === "generate-report" || label === "Reports") {
      generateReport();
      return;
    }

    window.setTimeout(() => scrollToSection(sectionId), 50);
  };

  const handleLogout = () => {
    localStorage.removeItem("agrisenseUser");
    localStorage.removeItem("agrisenseRole");
    navigate("/login");
  };

  return (
    <div className="officer-dashboard">
      {showReportModal && generatedReport && (
        <div
          className="officer-report-overlay"
          onClick={() => setShowReportModal(false)}
        >
          <div
            className="officer-report-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="officer-report-title"
          >
            <div className="officer-report-head">
              <div>
                <span className="panel-eyebrow">GENERATED REPORT</span>
                <h3 id="officer-report-title">{generatedReport.title}</h3>
                <p>
                  {generatedReport.generatedAt} · {generatedReport.officerName}
                </p>
              </div>
              <button
                type="button"
                className="officer-report-close"
                onClick={() => setShowReportModal(false)}
              >
                Close
              </button>
            </div>

            <div className="officer-report-summary">
              <div>
                <span>Farmers</span>
                <strong>{generatedReport.summary.totalFarmers}</strong>
              </div>
              <div>
                <span>Lands</span>
                <strong>{generatedReport.summary.registeredLands}</strong>
              </div>
              <div>
                <span>Active fields</span>
                <strong>{generatedReport.summary.activeFields}</strong>
              </div>
              <div>
                <span>Issues</span>
                <strong>{generatedReport.summary.issuesReported}</strong>
              </div>
            </div>

            <div className="officer-report-body">
              <p>
                Crop health: <strong>{generatedReport.summary.cropHealthyPercent}%</strong> healthy
              </p>
              <p>
                Sensors (demo): {generatedReport.sensors.temperature},{" "}
                {generatedReport.sensors.moisture} moisture,{" "}
                {generatedReport.sensors.humidity} humidity, pH{" "}
                {generatedReport.sensors.soilPh}
              </p>
              <p>
                Registrations: {generatedReport.summary.approvedRegistrations} approved,{" "}
                {generatedReport.summary.pendingRegistrations} pending
              </p>
              <p>
                Disease alerts: {generatedReport.diseaseAlerts.length} · Wildlife
                detections: {generatedReport.wildlifeDetections.length}
              </p>
            </div>

            <div className="officer-report-actions">
              <button type="button" className="primary-button" onClick={downloadReport}>
                <FileText size={15} />
                Download Report
              </button>
              <button type="button" className="secondary-button report-print-btn" onClick={printReport}>
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`officer-overlay ${mobileOpen ? "show" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className={`officer-sidebar ${mobileOpen ? "open" : ""}`}>

        <div className="officer-brand">
          <div className="officer-logo">
            <Sprout size={22} />
          </div>

          <div>
            <h2>AgriSense X Pro</h2>
            <p>Smart Farming for a Better Tomorrow</p>
          </div>
        </div>

        <div className="sidebar-label">
          MAIN MENU
        </div>

        <nav className="officer-menu">
          {navItems.map(({ label, icon: Icon, sectionId, action }) => (
            <button
              key={label}
              type="button"
              className={`officer-menu-item ${
                activeNav === label ? "active" : ""
              }`}
              onClick={() => handleNavClick(label, sectionId, action)}
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
          className={`officer-menu-item ${
            activeNav === "Settings" ? "active" : ""
          }`}
          onClick={() => handleNavClick("Settings", "officer-settings")}
        >
          <Settings size={17} strokeWidth={1.9} />
          <span>Settings</span>
        </button>

        <button
          type="button"
          className="officer-logout"
          onClick={handleLogout}
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
          <button
            type="button"
            className="officer-menu-btn"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            ☰
          </button>

          <div className="welcome-block">
            <div className="eyebrow">
              AGRICULTURE OFFICER
            </div>

            <h1>
              {getGreeting()}, {firstName}
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
                {getInitials(displayName)}
              </div>

              <div className="officer-profile-info">
                <strong>{displayName}</strong>
                <small>
                  {officerProfile?.designation ||
                    officerProfile?.department ||
                    "Agriculture Officer"}
                </small>
              </div>

            </div>
          </div>
        </header>

        {/* Demo sensor connection — replace sensors when hardware is live */}
        <section className="officer-sensor-strip" aria-label="Sensor status">
          <span className={`officer-sensor-pill ${sensors.connected ? "live" : "demo"}`}>
            <Activity size={13} />
            {sensors.connected ? "Sensors connected" : "Sensors offline"}
          </span>
          <span className="officer-sensor-pill demo">
            Demo data
          </span>
          <span className="officer-sensor-pill">
            <Thermometer size={13} />
            {sensors.temperature}
          </span>
          <span className="officer-sensor-pill">
            <Droplets size={13} />
            {sensors.moisture}
          </span>
          <span className="officer-sensor-pill">
            <CloudSun size={13} />
            {sensors.humidity}
          </span>
          <span className="officer-sensor-pill">
            <Waves size={13} />
            pH {sensors.soilPh}
          </span>
          <span className="officer-sensor-meta">
            {sensors.source} · Updated {sensors.updatedAt}
          </span>
        </section>

        {/* ===================================================
            HERO — full-bleed image like farmer dashboard
        =================================================== */}

        <section className="hero-card">
          <img
            src="/imageag.avif"
            alt="Farm landscape"
            className="hero-real-image"
          />
          <div className="hero-image-overlay" />

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
                onClick={generateReport}
              >
                <FileText size={15} />
                Review Reports
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  handleNavClick("Disease Monitoring", "officer-disease")
                }
              >
                <TriangleAlert size={15} />
                View Alerts
              </button>
            </div>
          </div>

          <div className="hero-floating-card">
            <div className="hero-floating-icon">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <strong>142 active fields</strong>
              <span>Protected & monitored</span>
            </div>
          </div>
        </section>

        {/* ===================================================
            STATISTICS
        =================================================== */}

        <section className="officer-stats" id="officer-top">

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

          <article
            className="officer-panel crop-health-panel"
            id="officer-reports"
          >

            <div className="officer-panel-header">

              <div>
                <span className="panel-eyebrow">
                  FIELD STATUS
                </span>

                <h2>
                  Crop Health Overview
                </h2>
              </div>

              <button type="button" onClick={generateReport}>
                Generate Report
                <FileText size={14} />
              </button>

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

          <article
            className="officer-panel disease-panel"
            id="officer-disease"
          >

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

          <article
            className="officer-panel registration-panel"
            id="officer-farmers"
          >

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

          <article className="officer-panel soil-panel" id="officer-soil">

            <div className="officer-panel-header">

              <div>
                <span className="panel-eyebrow">
                  ENVIRONMENT · DEMO SENSORS
                </span>

                <h2>
                  Soil & Weather Summary
                </h2>
              </div>

              <span className="location-chip">
                <Activity size={11} />
                Live demo feed
              </span>

            </div>

            <p className="soil-demo-note">
              Showing demo sensor readings for now. These values will be replaced
              when field sensors are connected.
            </p>

            <div className="soil-summary-grid">

              <div className="soil-item">

                <div className="soil-item-icon temperature">
                  <Thermometer size={18} />
                </div>

                <span>Temperature</span>
                <strong>{sensors.temperature}</strong>

              </div>

              <div className="soil-item">

                <div className="soil-item-icon humidity">
                  <Droplets size={18} />
                </div>

                <span>Humidity</span>
                <strong>{sensors.humidity}</strong>

              </div>

              <div className="soil-item">

                <div className="soil-item-icon ph">
                  <FlaskConical size={18} />
                </div>

                <span>Soil pH</span>
                <strong>{sensors.soilPh}</strong>

              </div>

              <div className="soil-item">

                <div className="soil-item-icon moisture">
                  <Leaf size={18} />
                </div>

                <span>Moisture</span>
                <strong>{sensors.moisture}</strong>

              </div>

            </div>
          </article>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <article className="officer-panel quick-panel" id="officer-settings">

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
                onClick={generateReport}
              >
                <FileText size={16} />
                <span>Generate Report</span>
                <ArrowUpRight size={13} />
              </button>

              <button
                type="button"
                className="quick-action blue-action"
                onClick={() =>
                  handleNavClick("Disease Monitoring", "officer-disease")
                }
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