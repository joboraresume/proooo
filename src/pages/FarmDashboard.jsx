import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sprout,
  LayoutDashboard,
  Droplets,
  CloudSun,
  Thermometer,
  Waves,
  Camera,
  Activity,
  Bug,
  Leaf,
  FlaskConical,
  CalendarDays,
  TrendingUp,
  Wallet,
  LineChart,
  Settings,
  LogOut,
  Bell,
  Search,
  MapPin,
  Sun,
  RefreshCw,
  Trash2,
  ArrowLeft,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Mountain,
} from "lucide-react";

import "./FarmDashboard.css";

const API_BASE = (
  import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "crop-fertilizer", label: "Crop & Fertilizer Recommendation", icon: Sprout },
  { id: "market", label: "Market Price", icon: LineChart },
  { id: "profit", label: "Profit / Loss", icon: TrendingUp },
];

const ACTIVITIES = [
  { date: "10 Sep", crop: "Rice", activity: "Fertilizer application", status: "done" },
  { date: "09 Sep", crop: "Rice", activity: "Irrigation", status: "done" },
  { date: "08 Sep", crop: "Coconut", activity: "Pest inspection", status: "pending" },
  { date: "07 Sep", crop: "Banana", activity: "Soil sampling", status: "done" },
  { date: "06 Sep", crop: "Rice", activity: "Weeding", status: "pending" },
];

const DETECTIONS = [
  { name: "Wild Boar", conf: "96%", time: "2m ago", action: "Attacking Crops" },
  { name: "Wild Boar", conf: "93%", time: "2m ago", action: "Attacking Crops" },
  { name: "Wild Boar", conf: "91%", time: "3m ago", action: "Attacking Crops" },
];

function firstValue(object, keys, fallback = null) {
  for (const key of keys) {
    if (
      object?.[key] !== undefined &&
      object?.[key] !== null &&
      object?.[key] !== ""
    ) {
      return object[key];
    }
  }
  return fallback;
}

function Sparkline({ color = "#2d8a4e", points = "2,22 12,14 22,18 32,8 42,12 52,6 62,10" }) {
  return (
    <svg className="fd-spark" viewBox="0 0 64 28" preserveAspectRatio="none">
      <path d={`M${points}`} stroke={color} />
    </svg>
  );
}

function AreaChart({ values }) {
  const width = 320;
  const height = 160;
  const pad = 8;
  const max = Math.max(...values, 1);
  const step = (width - pad * 2) / (values.length - 1 || 1);

  const coords = values.map((v, i) => {
    const x = pad + i * step;
    const y = height - pad - (v / max) * (height - pad * 2);
    return `${x},${y}`;
  });

  const line = coords.join(" ");
  const area = `${pad},${height - pad} ${line} ${pad + (values.length - 1) * step},${height - pad}`;

  return (
    <svg className="fd-area-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="fdMoistureFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3aa05c" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3aa05c" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#fdMoistureFill)" />
      <polyline
        points={line}
        fill="none"
        stroke="#2d8a4e"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Shared AgriSense-style dashboard for farmer + rented roles.
 * @param {"farmer"|"rented"} roleType
 */
function FarmDashboard({ roleType = "rented" }) {
  const navigate = useNavigate();
  const isFarmer = roleType === "farmer";
  const roleLabel = isFarmer ? "Farmer" : "Rented";
  const profileApiRole = isFarmer ? "farmer" : "landowner";
  const homePath = isFarmer ? "/farmer-dashboard" : "/land-dashboard";
  const detailsPath = isFarmer ? "/farmer-dashboard" : "/land-details";

  const [user, setUser] = useState(null);
  const [land, setLand] = useState({});
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("agrisenseUser");
    if (!savedUser) {
      navigate("/login");
      return;
    }
    try {
      setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem("agrisenseUser");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!user?.id) return;
    loadAll();
  }, [user?.id, roleType]);

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadProfile(), loadSensors()]);
    setLoading(false);
  };

  const loadProfile = async () => {
    try {
      const endpoints = isFarmer
        ? [
            `${API_BASE}/api/profiles/farmer/${user.id}`,
            `${API_BASE}/api/farmer/${user.id}`,
          ]
        : [
            `${API_BASE}/api/landowner/${user.id}`,
            `${API_BASE}/api/profiles/landowner/${user.id}`,
          ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (!response.ok) continue;
          const data = await response.json();
          const profile = Array.isArray(data) ? data[0] : data;
          if (profile && typeof profile === "object") {
            setLand(profile);
            localStorage.setItem(
              isFarmer ? "agrisenseFarmer" : "agrisenseLand",
              JSON.stringify(profile)
            );
            return;
          }
        } catch {
          /* try next */
        }
      }

      const localKey = isFarmer ? "agrisenseFarmer" : "agrisenseLand";
      const saved = localStorage.getItem(localKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setLand(Array.isArray(parsed) ? parsed[0] || {} : parsed || {});
      }
    } catch {
      setLand({});
    }
  };

  const loadSensors = async () => {
    try {
      const endpoints = [
        `${API_BASE}/api/sensor-data/${user.id}`,
        `${API_BASE}/api/sensors/${user.id}`,
        `${API_BASE}/api/landowner/${user.id}/sensors`,
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (!response.ok) continue;
          const data = await response.json();
          const readings = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.readings)
            ? data.readings
            : [];
          if (readings.length) {
            setSensorData(
              readings.sort(
                (a, b) =>
                  new Date(b.timestamp || b.createdAt || b.date || 0) -
                  new Date(a.timestamp || a.createdAt || a.date || 0)
              )
            );
            return;
          }
        } catch {
          /* try next */
        }
      }
      setSensorData([]);
    } catch {
      setSensorData([]);
    }
  };

  const latest = sensorData[0] || {};

  const temperature = firstValue(latest, ["temperature", "temp", "temperature_c", "temperatureC"], 28.4);
  const moisture = firstValue(latest, ["soilMoisture", "soil_moisture", "moisture"], 62);
  const humidity = firstValue(latest, ["humidity", "airHumidity"], 71);
  const ph = firstValue(latest, ["soilPH", "soil_ph", "ph"], 6.7);
  const waterPh = firstValue(latest, ["waterPH", "water_ph"], 7.1);

  const moistureTrend = useMemo(() => {
    if (sensorData.length >= 4) {
      return sensorData
        .slice(0, 7)
        .reverse()
        .map((row) =>
          Number(
            firstValue(row, ["soilMoisture", "soil_moisture", "moisture"], 55)
          )
        );
    }
    return [48, 52, 58, 55, 61, 59, 62];
  }, [sensorData]);

  const locationLabel = useMemo(() => {
    const parts = [
      land.village,
      land.district,
      land.city,
      land.state,
    ].filter(Boolean);
    if (parts.length) return [...new Set(parts)].join(", ");
    return "Kollam, Kerala";
  }, [land]);

  const displayName =
    user?.name ||
    user?.full_name ||
    land.full_name ||
    roleLabel;

  const initials = String(displayName)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "U";

  const handleLogout = () => {
    localStorage.removeItem("agrisenseUser");
    localStorage.removeItem("agrisenseRole");
    navigate("/login");
  };

  const handleDeleteRole = async () => {
    const ok = window.confirm(
      `Delete your ${roleLabel} role?\n\nYour ${roleLabel.toLowerCase()} profile may be removed from the system.`
    );
    if (!ok || !user?.id) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/profiles/${profileApiRole}/${user.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert(data.detail || `Unable to delete ${roleLabel} role.`);
        return;
      }
      alert(`${roleLabel} role deleted successfully.`);
      navigate("/dashboard");
    } catch {
      alert("Unable to connect to server to delete role.");
    }
  };

  const scrollTo = (id) => {
    setActiveNav(id);
    setMobileOpen(false);
    const el = document.getElementById(`fd-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div className="fd-loading">
        <div className="fd-spinner" />
        <h2>Loading {roleLabel} dashboard</h2>
        <p>Fetching your farm monitoring data…</p>
      </div>
    );
  }

  const renderNav = (items) =>
    items.map((item) => {
      const Icon = item.icon;
      return (
        <button
          key={item.id}
          type="button"
          className={`fd-nav-item ${activeNav === item.id ? "active" : ""}`}
          onClick={() => scrollTo(item.id)}
        >
          <Icon size={17} />
          <span>{item.label}</span>
        </button>
      );
    });

  return (
    <div className="farm-dashboard">
      <div
        className={`fd-overlay ${mobileOpen ? "show" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={`fd-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="fd-sidebar-brand">
          <div className="fd-brand-icon">
            <Sprout size={22} />
          </div>
          <div>
            <h2>AgriSense X Pro</h2>
            <p>Smart Farming for a Better Tomorrow</p>
          </div>
        </div>

        <nav className="fd-nav">
          {renderNav(NAV_ITEMS)}
        </nav>

        <div className="fd-nav-footer">
          <button
            type="button"
            className="fd-nav-item"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={17} />
            <span>All Roles</span>
          </button>
          <button
            type="button"
            className="fd-nav-item"
            onClick={() => navigate(detailsPath)}
          >
            <Settings size={17} />
            <span>Settings</span>
          </button>
          <button
            type="button"
            className="fd-nav-item danger"
            onClick={handleDeleteRole}
          >
            <Trash2 size={17} />
            <span>Delete Role</span>
          </button>
          <button type="button" className="fd-nav-item" onClick={handleLogout}>
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="fd-main">
        <header className="fd-topbar">
          <button
            type="button"
            className="fd-menu-btn"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            ☰
          </button>

          <label className="fd-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search anything…"
            />
          </label>

          <div className="fd-topbar-right">
            <button type="button" className="fd-bell" title="Notifications">
              <Bell size={18} />
              <span>3</span>
            </button>

            <button type="button" className="fd-profile" onClick={() => navigate("/dashboard")}>
              <div className="fd-avatar">{initials}</div>
              <div className="fd-profile-text">
                <strong>{displayName}</strong>
                <small>{roleLabel}</small>
              </div>
            </button>
          </div>
        </header>

        <div className="fd-content">
          {/* HERO */}
          <section className="fd-hero" id="fd-dashboard">
            <div className="fd-hero-copy">
              <h1>Welcome back, {String(displayName).split(" ")[0]}!</h1>
              <p>
                Your farm is being monitored and managed automatically.
                {land.land_name || land.farm_name
                  ? ` Tracking ${land.land_name || land.farm_name}.`
                  : ""}
              </p>
            </div>
            <div className="fd-hero-meta">
              <span className="fd-pill">
                <MapPin size={13} />
                {locationLabel}
              </span>
              <span className="fd-pill">
                <CloudSun size={13} />
                {temperature}°C
              </span>
              <button
                type="button"
                className="fd-pill"
                style={{ cursor: "pointer", border: "none" }}
                onClick={loadAll}
              >
                <RefreshCw size={13} />
                Refresh
              </button>
            </div>
          </section>

          {/* METRICS */}
          <section className="fd-metrics" id="fd-soil">
            <article className="fd-metric">
              <div className="fd-metric-top">
                <div className="fd-metric-icon soil">
                  <Mountain size={18} />
                </div>
                <button type="button" className="fd-metric-link">View Details</button>
              </div>
              <h3>Soil</h3>
              <div className="fd-metric-value">
                <strong>pH {ph}</strong>
                <span className="good">Good</span>
              </div>
              <small style={{ color: "var(--fd-muted)", fontSize: 11 }}>Fertility High</small>
              <Sparkline color="#4a6b3a" />
            </article>

            <article className="fd-metric" id="fd-moisture">
              <div className="fd-metric-top">
                <div className="fd-metric-icon moisture">
                  <Droplets size={18} />
                </div>
                <button type="button" className="fd-metric-link">View Details</button>
              </div>
              <h3>Soil Moisture</h3>
              <div className="fd-metric-value">
                <strong>{moisture}%</strong>
                <span className="normal">Normal</span>
              </div>
              <Sparkline color="#2b6cb0" points="2,18 12,16 22,20 32,10 42,14 52,8 62,12" />
            </article>

            <article className="fd-metric" id="fd-humidity">
              <div className="fd-metric-top">
                <div className="fd-metric-icon humidity">
                  <CloudSun size={18} />
                </div>
                <button type="button" className="fd-metric-link">View Details</button>
              </div>
              <h3>Humidity</h3>
              <div className="fd-metric-value">
                <strong>{humidity}%</strong>
                <span className="normal">Normal</span>
              </div>
              <Sparkline color="#4c6ef5" points="2,20 12,12 22,16 32,9 42,15 52,7 62,11" />
            </article>

            <article className="fd-metric" id="fd-temperature">
              <div className="fd-metric-top">
                <div className="fd-metric-icon temp">
                  <Thermometer size={18} />
                </div>
                <button type="button" className="fd-metric-link">View Details</button>
              </div>
              <h3>Temperature</h3>
              <div className="fd-metric-value">
                <strong>{temperature}°C</strong>
                <span className="normal">Normal</span>
              </div>
              <Sparkline color="#dd6b20" points="2,16 12,18 22,14 32,12 42,10 52,13 62,8" />
            </article>

            <article className="fd-metric" id="fd-water">
              <div className="fd-metric-top">
                <div className="fd-metric-icon water">
                  <Waves size={18} />
                </div>
                <button type="button" className="fd-metric-link">View Details</button>
              </div>
              <h3>Water Quality</h3>
              <div className="fd-metric-value">
                <strong>pH {waterPh}</strong>
                <span className="good">Good</span>
              </div>
              <small style={{ color: "var(--fd-muted)", fontSize: 11 }}>TDS Good</small>
              <Sparkline color="#0d9488" />
            </article>
          </section>

          {/* MIDDLE */}
          <section className="fd-row-3">
            <article className="fd-card" id="fd-weather">
              <div className="fd-card-head">
                <h3>Weather</h3>
                <small>Today</small>
              </div>
              <div className="fd-weather-main">
                <div className="fd-weather-icon">
                  <CloudSun size={28} />
                </div>
                <div>
                  <strong>{temperature}°C</strong>
                  <span>Partly Cloudy</span>
                </div>
              </div>
              <div className="fd-weather-stats">
                <div>
                  <label>Humidity</label>
                  <b>{humidity}%</b>
                </div>
                <div>
                  <label>Rainfall</label>
                  <b>2.4 mm</b>
                </div>
                <div>
                  <label>Wind</label>
                  <b>12 km/h</b>
                </div>
              </div>
            </article>

            <article className="fd-card" id="fd-capture">
              <div className="fd-card-head">
                <h3>Capture Image</h3>
                <small>AI analysis</small>
              </div>
              <div className="fd-capture">
                <p>Capture crop images for disease, pest, and nutrient analysis.</p>
                <div className="fd-capture-preview">
                  <span className="tag">Leaf · 94%</span>
                </div>
                <button type="button" className="fd-primary-btn">
                  <Camera size={16} />
                  Open Camera
                </button>
              </div>
            </article>

            <article className="fd-card fd-wildlife-card" id="fd-wildlife">
              <div className="fd-card-head">
                <div>
                  <h3>Wildlife Detection</h3>
                  <small>Farm camera · Crop protection</small>
                </div>
                <span className="fd-live-badge">● LIVE</span>
              </div>

              <div className="fd-wildlife">
                <div className="fd-wildlife-feed">
                  <img
                    src="/wildlife.jpg"
                    alt="Wild boars detected attacking crops in a farm field"
                    className="fd-wildlife-image"
                  />
                  <div className="fd-camera-label">📷 Farm Cam · Crop Monitoring</div>
                  <div className="fd-time-label">05:27:36 AM</div>
                  <div className="fd-crop-alert">⚠ Crop Damage Detected</div>
                </div>

                <div className="fd-detections">
                  <div className="fd-alert-summary">
                    <div>
                      <strong>3 Wild Boars</strong>
                      <span>Detected in crop area</span>
                    </div>
                    <b>HIGH RISK</b>
                  </div>

                  <div className="fd-impact-grid">
                    <div><span>Crops affected</span><strong>12.6 m²</strong></div>
                    <div><span>Activity</span><strong>Attacking Crops</strong></div>
                    <div><span>Detection</span><strong>93.3%</strong></div>
                    <div><span>Action</span><strong>Alert Sent</strong></div>
                  </div>

                  <h4>Recent Detections</h4>
                  {DETECTIONS.map((d, index) => (
                    <div key={`${d.name}-${index}`} className="fd-detection">
                      <div>
                        <strong>{d.name}</strong>
                        <span>{d.action}</span>
                      </div>
                      <div className="fd-detection-meta">
                        <b>{d.conf}</b>
                        <span>{d.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>

          {/* DATA */}
          <section className="fd-row-data">
            <article className="fd-card">
              <div className="fd-card-head">
                <h3>Soil Health</h3>
                <small>Overall</small>
              </div>
              <div className="fd-gauge-wrap">
                <div className="fd-gauge">
                  <svg viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke="#e8f0e4"
                      strokeWidth="3.5"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke="#2d8a4e"
                      strokeWidth="3.5"
                      strokeDasharray="85 100"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="fd-gauge-label">
                    <strong>85%</strong>
                    <span>Good</span>
                  </div>
                </div>
                <div className="fd-nutrients">
                  <div className="fd-nutrient">
                    <span>Nitrogen</span>
                    <b>42</b>
                    <span className="fd-chip good">Good</span>
                  </div>
                  <div className="fd-nutrient">
                    <span>Phosphorus</span>
                    <b>28</b>
                    <span className="fd-chip medium">Med</span>
                  </div>
                  <div className="fd-nutrient">
                    <span>Potassium</span>
                    <b>35</b>
                    <span className="fd-chip good">Good</span>
                  </div>
                  <div className="fd-nutrient">
                    <span>Organic Matter</span>
                    <b>3.8%</b>
                    <span className="fd-chip high">High</span>
                  </div>
                </div>
              </div>
            </article>

            <article className="fd-card">
              <div className="fd-card-head">
                <h3>Soil Moisture Trend</h3>
                <small>Last 7 Days</small>
              </div>
              <AreaChart values={moistureTrend} />
            </article>

            <article className="fd-card" id="fd-activity">
              <div className="fd-card-head">
                <h3>Farm Activity</h3>
                <small>Recent</small>
              </div>
              <table className="fd-activity-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Crop</th>
                    <th>Activity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ACTIVITIES.map((row) => (
                    <tr key={`${row.date}-${row.activity}`}>
                      <td>{row.date}</td>
                      <td>{row.crop}</td>
                      <td>{row.activity}</td>
                      <td>
                        <span
                          className={`fd-status ${
                            row.status === "done" ? "done" : "pending"
                          }`}
                        >
                          {row.status === "done" ? "Completed" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </section>

          {/* FOOTER */}
          <section className="fd-row-footer">
            <article className="fd-card">
              <div className="fd-card-head">
                <h3>Quick Insights</h3>
              </div>
              <div className="fd-insight-list">
                <div className="fd-insight">
                  <div className="fd-insight-icon">
                    <CheckCircle2 size={15} />
                  </div>
                  <span>Soil fertility is good for the current crop cycle.</span>
                </div>
                <div className="fd-insight">
                  <div className="fd-insight-icon">
                    <Droplets size={15} />
                  </div>
                  <span>Moisture levels are within the optimal range.</span>
                </div>
                <div className="fd-insight">
                  <div className="fd-insight-icon">
                    <Sun size={15} />
                  </div>
                  <span>Light rainfall expected in the next 24 hours.</span>
                </div>
              </div>
            </article>

            <article className="fd-card">
              <div className="fd-card-head">
                <h3>Recent Alerts</h3>
              </div>
              <div className="fd-alert-list">
                <div className="fd-alert">
                  <div className="fd-alert-dot">!</div>
                  <div>
                    Disease risk flagged in Row 1
                    <small>Today · 09:14</small>
                  </div>
                </div>
                <div className="fd-alert">
                  <div className="fd-alert-dot">!</div>
                  <div>
                    Wildlife movement near south fence
                    <small>Today · 07:42</small>
                  </div>
                </div>
                <div className="fd-alert">
                  <div className="fd-alert-dot">!</div>
                  <div>
                    Irrigation schedule pending for Block B
                    <small>Yesterday · 18:20</small>
                  </div>
                </div>
              </div>
            </article>

            <article className="fd-card">
              <div className="fd-card-head">
                <h3>Quick Actions</h3>
              </div>
              <div className="fd-actions">
                <button type="button" className="fd-action a1" onClick={() => scrollTo("soil")}>
                  <Mountain size={18} />
                  Check Soil Fertility
                </button>
                <button type="button" className="fd-action a2" onClick={() => scrollTo("weather")}>
                  <CloudSun size={18} />
                  View Weather
                </button>
                <button type="button" className="fd-action a3" onClick={() => scrollTo("activity")}>
                  <Activity size={18} />
                  Check Farm Activity
                </button>
                <button type="button" className="fd-action a4" onClick={() => scrollTo("water")}>
                  <Waves size={18} />
                  Water Quality Info
                </button>
                <button type="button" className="fd-action a5" onClick={() => scrollTo("wildlife")}>
                  <AlertTriangle size={18} />
                  Wildlife Alerts
                </button>
                <button type="button" className="fd-action a6" onClick={() => navigate(homePath)}>
                  <HelpCircle size={18} />
                  Help / FAQs
                </button>
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}

export default FarmDashboard;
