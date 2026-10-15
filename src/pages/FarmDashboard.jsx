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

<<<<<<< HEAD
import { subscribeSensorReadings, subscribeLiveSensors } from "../services/sensorservice";
=======
>>>>>>> a14f7c100e58b059d90a93f072994e087a6aeef6
import FarmMap from "../components/FarmMap";
import "./FarmDashboard.css";
import { subscribeEnvironment } from "../services/sensorservice";

const FARMER_FIELDS_KEY = "agrisenseFarmerFields";

function loadFarmerFieldsBundle(userId) {
  try {
    const raw = localStorage.getItem(FARMER_FIELDS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.userId != null && String(parsed.userId) === String(userId)) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function saveFarmerFieldsBundle(bundle) {
  localStorage.setItem(FARMER_FIELDS_KEY, JSON.stringify(bundle));
  localStorage.setItem(
    "agrisenseFarmer",
    JSON.stringify({
      full_name: bundle.fullName,
      address: bundle.address,
      experience: bundle.experience,
      fields: bundle.fields,
    })
  );
}

function setFarmerProfileFlag(isRegistered) {
  try {
    const profiles = JSON.parse(
      localStorage.getItem("agrisenseProfiles") || "{}"
    );
    const next = {
      ...(profiles && typeof profiles === "object" ? profiles : {}),
      farmer: Boolean(isRegistered),
    };
    if (!isRegistered) {
      delete next.farmer;
    } else {
      next.farmer = true;
    }
    localStorage.setItem("agrisenseProfiles", JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

function formatReading(value, suffix = "") {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (Number.isFinite(num)) {
    const text = Number.isInteger(num) ? String(num) : num.toFixed(1);
    return `${text}${suffix}`;
  }
  return `${value}${suffix}`;
}

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
  if (!values?.length) {
    return (
      <div className="fd-area-chart" style={{ display: "grid", placeItems: "center", color: "var(--fd-muted)", fontSize: 13 }}>
        Waiting for sensor moisture data…
      </div>
    );
  }

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
  const [farmerFields, setFarmerFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [showDeleteFields, setShowDeleteFields] = useState(false);
  const [fieldsToDelete, setFieldsToDelete] = useState([]);
  const [deletingFields, setDeletingFields] = useState(false);
  const [sensorData, setSensorData] = useState([]);
  const [liveSensor, setLiveSensor] = useState(null);   // ← add
  const [sensorsConnected, setSensorsConnected] = useState(false);
  const [sensorError, setSensorError] = useState("");
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
    loadProfile().finally(() => setLoading(false));
  }, [user?.id, roleType]);

  useEffect(() => {
    if (!user?.id || !isFarmer) {
      if (!isFarmer) {
        setFarmerFields([]);
        setSelectedFieldId("field1");
      }
      return;
    }

    const bundle = loadFarmerFieldsBundle(user.id);
    const fields = Array.isArray(bundle?.fields) ? bundle.fields : [];
    setFarmerFields(fields);
    setSelectedFieldId((prev) => {
      if (prev && fields.some((f) => f.id === prev)) return prev;
      return fields[0]?.id || null;
    });

    if (bundle) {
      setLand((prev) => ({
        ...prev,
        full_name: bundle.fullName || prev.full_name,
        address: bundle.address || prev.address,
        experience: bundle.experience ?? prev.experience,
      }));
    }
  }, [user?.id, isFarmer]);

  useEffect(() => {
    if (!user?.id) return undefined;

    const fieldId = isFarmer ? selectedFieldId : "field1";
    if (!fieldId) {
      setSensorData([]);
      setSensorsConnected(false);
      setSensorError("");
      return undefined;
    }

    setSensorError("");
    setSensorData([]);
    const unsubscribe = subscribeSensorReadings(
      user.id,
      fieldId,
      (readings) => {
        setSensorData(readings);
        setSensorsConnected(true);
        setSensorError("");
      },
      (error) => {
        setSensorData([]);
        setSensorsConnected(false);
        setSensorError(error?.message || "Could not read sensors from Firebase");
      }
    );

    return unsubscribe;
  }, [user?.id, selectedFieldId, isFarmer]);
  useEffect(() => {
    const unsub = subscribeLiveSensors(setLiveSensor, (e) =>
      console.error("Live sensor error:", e)
    );
    return () => unsub?.();
  }, []);
  const loadAll = async () => {
    setLoading(true);
    await loadProfile();
    if (user?.id && isFarmer) {
      const bundle = loadFarmerFieldsBundle(user.id);
      const fields = Array.isArray(bundle?.fields) ? bundle.fields : [];
      setFarmerFields(fields);
      setSelectedFieldId((prev) => {
        if (prev && fields.some((f) => f.id === prev)) return prev;
        return fields[0]?.id || null;
      });
    }
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

    const readings = sensorData.length ? sensorData : liveSensor ? [liveSensor] : [];
  const latest = readings[0] || {};
  const hasSensorReading = readings.length > 0;

  const temperature = firstValue(latest, [
    "temperature",
    "temp",
    "temperature_c",
    "temperatureC",
  ]);
  const moisture = firstValue(latest, [
    "soilMoisture",
    "soil_moisture",
    "moisture",
  ]);
  const humidity = firstValue(latest, ["humidity", "airHumidity"]);
  const ph = firstValue(latest, ["soilPH", "soil_ph", "ph"]);
  const waterPh = firstValue(latest, ["waterPH", "water_ph"]);

  const moistureTrend = useMemo(() => {
    const values = readings
      .slice(0, 7)
      .reverse()
      .map((row) =>
        Number(
          firstValue(row, ["soilMoisture", "soil_moisture", "moisture"])
        )
      )
      .filter((value) => Number.isFinite(value));

    return values.length ? values : [];
  }, [readings]);

  const selectedField = useMemo(
    () => farmerFields.find((f) => f.id === selectedFieldId) || null,
    [farmerFields, selectedFieldId]
  );

  const locationLabel = useMemo(() => {
    if (isFarmer && selectedField?.locationLabel) {
      return selectedField.locationLabel;
    }
    const parts = [
      land.village,
      land.district,
      land.city,
      land.state,
    ].filter(Boolean);
    if (parts.length) return [...new Set(parts)].join(", ");
    if (isFarmer && farmerFields.length) {
      return `${farmerFields.length} field${farmerFields.length === 1 ? "" : "s"} registered`;
    }
    return "Kollam, Kerala";
  }, [land, isFarmer, selectedField, farmerFields]);

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

  const openDeleteFieldsModal = () => {
    if (!isFarmer || !farmerFields.length) {
      alert("No fields to remove.");
      return;
    }
    setFieldsToDelete([]);
    setShowDeleteFields(true);
  };

  const toggleFieldForDelete = (fieldId) => {
    setFieldsToDelete((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleConfirmDeleteFields = async () => {
    if (!user?.id || !fieldsToDelete.length) {
      alert("Select which field you want to delete.");
      return;
    }

    const bundle = loadFarmerFieldsBundle(user.id);
    if (!bundle?.fields?.length) {
      setShowDeleteFields(false);
      return;
    }

    const remaining = bundle.fields.filter(
      (field) => !fieldsToDelete.includes(field.id)
    );

    setDeletingFields(true);

    try {
      if (remaining.length > 0) {
        const nextBundle = { ...bundle, fields: remaining };
        saveFarmerFieldsBundle(nextBundle);
        setFarmerProfileFlag(true);
        setFarmerFields(remaining);
        setSelectedFieldId((prev) =>
          remaining.some((f) => f.id === prev) ? prev : remaining[0].id
        );
        setShowDeleteFields(false);
        setFieldsToDelete([]);
        alert(
          remaining.length === 1
            ? "Selected field(s) deleted. 1 field remains — use Go to dashboard from role selection."
            : `Selected field(s) deleted. ${remaining.length} fields remain — use Go to dashboard from role selection.`
        );
        return;
      }

      // All fields removed → delete farmer role completely
      await deleteFarmerRoleFully(
        "All fields removed and farmer role deleted. You can register as farmer again from role selection."
      );
      setShowDeleteFields(false);
      setFieldsToDelete([]);
    } catch {
      alert("Unable to delete fields. Please try again.");
    } finally {
      setDeletingFields(false);
    }
  };

  const deleteFarmerRoleFully = async (successMessage) => {
    const response = await fetch(
      `${API_BASE}/api/profiles/${profileApiRole}/${user.id}`,
      { method: "DELETE" }
    );
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || `Unable to delete ${roleLabel} role.`);
    }

    localStorage.removeItem(FARMER_FIELDS_KEY);
    localStorage.removeItem("agrisenseFarmer");
    setFarmerProfileFlag(false);
    setFarmerFields([]);
    setSelectedFieldId(null);
    alert(successMessage || `${roleLabel} role deleted successfully.`);
    navigate("/dashboard");
  };

  const handleDeleteRole = async () => {
    const ok = window.confirm(
      isFarmer
        ? "Delete your Farmer role completely?\n\nAll fields will be removed and you can register as farmer again from role selection."
        : `Delete your ${roleLabel} role?\n\nYour ${roleLabel.toLowerCase()} profile may be removed from the system.`
    );
    if (!ok || !user?.id) return;

    try {
      if (isFarmer) {
        await deleteFarmerRoleFully(
          "Farmer role deleted successfully. You can register again from role selection."
        );
        return;
      }

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
    } catch (error) {
      alert(error?.message || "Unable to connect to server to delete role.");
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
      {showDeleteFields && (
        <div
          className="fd-modal-overlay"
          onClick={() => !deletingFields && setShowDeleteFields(false)}
        >
          <div
            className="fd-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="fd-delete-fields-title"
          >
            <h3 id="fd-delete-fields-title">Select fields to delete</h3>
            <p>
              Choose which field you want to delete. If fields remain, farmer
              stays registered and role selection will show Go to dashboard. If
              you delete every field, the farmer role is removed and Register
              appears again.
            </p>
            <div className="fd-delete-field-list">
              {farmerFields.map((field) => (
                <label key={field.id} className="fd-delete-field-item">
                  <input
                    type="checkbox"
                    checked={fieldsToDelete.includes(field.id)}
                    onChange={() => toggleFieldForDelete(field.id)}
                    disabled={deletingFields}
                  />
                  <span>
                    <strong>{field.name || field.id}</strong>
                    <small>{field.locationLabel || "No location"}</small>
                  </span>
                </label>
              ))}
            </div>
            <div className="fd-modal-actions">
              <button
                type="button"
                className="fd-secondary-btn"
                disabled={deletingFields}
                onClick={() => setShowDeleteFields(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="fd-danger-btn"
                disabled={deletingFields || !fieldsToDelete.length}
                onClick={handleConfirmDeleteFields}
              >
                {deletingFields
                  ? "Deleting…"
                  : fieldsToDelete.length === farmerFields.length
                  ? "Delete all fields & role"
                  : "Delete selected"}
              </button>
            </div>
          </div>
        </div>
      )}

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
          {isFarmer && farmerFields.length > 0 && (
            <button
              type="button"
              className="fd-nav-item danger"
              onClick={openDeleteFieldsModal}
            >
              <Trash2 size={17} />
              <span>Remove fields</span>
            </button>
          )}
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
                {isFarmer && selectedField
                  ? ` Tracking ${selectedField.name}.`
                  : land.land_name || land.farm_name
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
                {formatReading(temperature, "°C")}
              </span>
              <span className="fd-pill">
                <Activity size={13} />
                 {sensorError && !hasSensorReading
                  ? "Sensors offline"
                  : hasSensorReading
                  ? "Live sensors"
                  : sensorsConnected
                  ? "Waiting for sensors"
                  : "Connecting…"}
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

          {isFarmer && (
            <section className="fd-fields-panel" id="fd-fields">
              <div className="fd-fields-head">
                <div>
                  <h2>Your fields</h2>
                  <p>
                    {farmerFields.length
                      ? "Select a field to view its sensors below."
                      : "No fields yet. Register Field 1 to start monitoring."}
                  </p>
                </div>
                <div className="fd-fields-actions">
                  {farmerFields.length > 0 && (
                    <button
                      type="button"
                      className="fd-secondary-btn"
                      onClick={openDeleteFieldsModal}
                    >
                      Remove fields
                    </button>
                  )}
                  {farmerFields.length < 3 && (
                    <button
                      type="button"
                      className="fd-primary-btn"
                      onClick={() => navigate("/farmer-registration")}
                    >
                      Add field
                    </button>
                  )}
                </div>
              </div>

              {!farmerFields.length ? (
                <div className="fd-fields-empty">
                  <p>Finish farmer registration to pin your fields on the map.</p>
                  <button
                    type="button"
                    className="fd-primary-btn"
                    onClick={() => navigate("/farmer-registration")}
                  >
                    Go to registration
                  </button>
                </div>
              ) : (
                <div className="fd-fields-layout">
                  <div className="fd-map-square">
                    <FarmMap
                      fields={farmerFields}
                      selectedFieldId={selectedFieldId}
                      onSelectField={setSelectedFieldId}
                      height={380}
                    />
                  </div>

                  <div className="fd-field-side">
                    <p className="fd-field-side-label">Fields</p>
                    <div className="fd-field-list">
                      {farmerFields.map((field) => {
                        const active = selectedFieldId === field.id;
                        return (
                          <button
                            key={field.id}
                            type="button"
                            className={`fd-field-row${active ? " active" : ""}`}
                            onClick={() => setSelectedFieldId(field.id)}
                          >
                            <span className="fd-field-row-main">
                              <strong>{field.name || field.id}</strong>
                              <small>
                                {field.locationLabel ||
                                  field.farmingType ||
                                  "No location"}
                              </small>
                            </span>
                            <span className="fd-field-row-status">
                              {active ? "Selected" : "View"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {selectedField && (
                      <p className="fd-selected-field-note">
                        Showing sensors for{" "}
                        <strong>{selectedField.name}</strong>
                        {selectedField.farmingType
                          ? ` · ${selectedField.farmingType}`
                          : ""}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

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
                <strong>pH {formatReading(ph)}</strong>
                <span className={hasSensorReading ? "good" : "normal"}>
                  {hasSensorReading ? "Live" : "No data"}
                </span>
              </div>
              <small style={{ color: "var(--fd-muted)", fontSize: 11 }}>
                {hasSensorReading ? "From hardware sensors" : "Waiting for hardware"}
              </small>
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
                <strong>{formatReading(moisture, "%")}</strong>
                <span className={hasSensorReading ? "normal" : "normal"}>
                  {hasSensorReading ? "Live" : "No data"}
                </span>
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
                <strong>{formatReading(humidity, "%")}</strong>
                <span className="normal">{hasSensorReading ? "Live" : "No data"}</span>
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
                <strong>{formatReading(temperature, "°C")}</strong>
                <span className="normal">{hasSensorReading ? "Live" : "No data"}</span>
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
                <strong>pH {formatReading(waterPh)}</strong>
                <span className={hasSensorReading ? "good" : "normal"}>
                  {hasSensorReading ? "Live" : "No data"}
                </span>
              </div>
              <small style={{ color: "var(--fd-muted)", fontSize: 11 }}>
                {hasSensorReading ? "From hardware sensors" : "Waiting for hardware"}
              </small>
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
                  <strong>{formatReading(temperature, "°C")}</strong>
                  <span>{hasSensorReading ? "From farm sensors" : "Waiting for sensors"}</span>
                </div>
              </div>
              <div className="fd-weather-stats">
                <div>
                  <label>Humidity</label>
                  <b>{formatReading(humidity, "%")}</b>
                </div>
                <div>
                  <label>Moisture</label>
                  <b>{formatReading(moisture, "%")}</b>
                </div>
                <div>
                  <label>Soil pH</label>
                  <b>{formatReading(ph)}</b>
                </div>
              </div>
            </article>

            <article className="fd-card" id="fd-capture">
              <div className="fd-card-head">
                <h3>Crop Camera</h3>
                <small>Demo sensor feed</small>
              </div>
              <div className="fd-capture">
                <p>
                  Crop images will come from field cameras and sensors. Showing a
                  demo leaf capture for now.
                </p>
                <div className="fd-capture-preview">
                  <img
                    src="/imagesdisease.jpg"
                    alt="Demo crop leaf image from farm camera"
                    className="fd-capture-image"
                  />
                  <span className="tag">Demo · Leaf · 94%</span>
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
                  <small>Demo farm camera · Crop protection</small>
                </div>
                <span className="fd-live-badge">● DEMO</span>
              </div>

              <div className="fd-wildlife">
                <div className="fd-wildlife-feed">
                  <img
                    src="/attack.png"
                    alt="Demo wild animal attack detected near crops"
                    className="fd-wildlife-image"
                  />
                  <div className="fd-camera-label">Farm Cam · Demo</div>
                  <div className="fd-time-label">Live preview</div>
                  <div className="fd-crop-alert">Wild attack detected</div>
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
