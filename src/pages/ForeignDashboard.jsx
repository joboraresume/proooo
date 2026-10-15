import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, MapPin, Cpu, Radio, Leaf, Droplet, FlaskConical, Sprout,
  Users, Phone, PawPrint, Bell, FileText, TrendingUp, Bot, Settings, LogOut,
  Search, ChevronRight, ChevronDown, Camera, Waves, HeartPulse, Thermometer,
  Droplets, CloudRain, AlertTriangle, Send, Clock, Calendar, User, Plus, X,
  AlertCircle, Loader2, CheckCircle,
} from "lucide-react";

import { subscribeFields, addField } from "../services/fieldService";
import { subscribeSensorReadings } from "../services/sensorService";
import {
  subscribeWorkers,
  subscribeOwnerWorkerRequests,
  sendWorkerConnectionRequest,
} from "../services/workerService";

import "./ForeignDashboard.css";

/* ---------------- CONSTANTS / HELPERS ---------------- */

const RANGES = {
  temperature: [15, 35],
  moisture: [40, 80],
  humidity: [40, 85],
  ph: [5.5, 7.5],
};
const LABELS = {
  temperature: "Temperature",
  moisture: "Soil moisture",
  humidity: "Humidity",
  ph: "Soil pH",
};
const SOIL_TYPES = ["Clay", "Sandy", "Loamy", "Silty", "Red soil", "Black soil", "Laterite", "Other"];
const TASKS = ["Fertilizer Application", "Irrigation", "Grass Removal", "Pest Control", "Harvesting"];
const EMPTY_FORM = {
  fieldName: "", area: "", cropType: "", soilType: "", country: "", state: "",
  district: "", city: "", address: "", latitude: "", longitude: "", sensorDeviceId: "",
};
const MENU = [
  ["Dashboard", LayoutDashboard, "top"], ["My Lands", MapPin, "lands"],
  ["Machine Monitoring", Cpu, "machine"], ["Live Sensor Data", Radio, "sensors"],
  ["Crop Health", Leaf, "sensors"], ["Smart Irrigation", Droplet, "machine"],
  ["Soil Analysis", FlaskConical, "sensors"], ["Crop Recommendation", Sprout, "lands"],
  ["Farmer & Tasks", Users, "tasks"], ["Call / Assign", Phone, "tasks"],
  ["Wildlife Monitor", PawPrint, "alerts"], ["Notifications", Bell, "alerts"],
  ["Reports", FileText, "report"], ["Market & Profit", TrendingUp, "top"],
  ["AI Assistant", Bot, "top"],
];

const readStoredUser = () => {
  try { return JSON.parse(localStorage.getItem("agrisenseUser")); } catch { return null; }
};
const hasValue = (v) => v !== null && v !== undefined && v !== "";
const pick = (src, keys) => {
  if (!src) return null;
  for (const k of keys) if (hasValue(src[k])) return src[k];
  return null;
};
const getFieldName = (l) => l?.landName || l?.fieldName || l?.name || "Unnamed Field";
const getArea = (l) => Number(l?.area || l?.acres || l?.landArea || 0);
const getLocationText = (l) => {
  const parts = [l?.city, l?.district, l?.state, l?.country].filter(Boolean);
  return parts.length ? parts.join(", ") : l?.address || l?.location || "Location not available";
};
const getCoordinates = (l) => {
  const lat = l?.latitude ?? l?.lat ?? l?.location?.latitude;
  const lng = l?.longitude ?? l?.lng ?? l?.lon ?? l?.location?.longitude;
  return hasValue(lat) && hasValue(lng) ? { latitude: lat, longitude: lng } : null;
};
const getWorkerName = (w) => w?.name || w?.fullName || w?.displayName || "Worker";
const readingTime = (r) => r?.timestamp || r?.createdAt || null;
const formatTime = (v) => {
  if (!v) return "--";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "--" : d.toLocaleString();
};
const isRecent = (r, hours = 24) => {
  const t = readingTime(r);
  if (!t) return false;
  const age = Date.now() - new Date(t).getTime();
  return !Number.isNaN(age) && age <= hours * 3600000;
};
const extractSensorValues = (r) => ({
  reading: r,
  temperature: pick(r, ["temperature", "temp", "temperatureC"]),
  moisture: pick(r, ["moisture", "soilMoisture", "soil_moisture"]),
  humidity: pick(r, ["humidity", "airHumidity"]),
  ph: pick(r, ["ph", "soilPh", "soil_pH"]),
  wind: pick(r, ["windSpeed", "wind", "windKmh"]),
  weather: pick(r, ["weather", "condition", "weatherCondition"]),
  camera: pick(r, ["camera", "cameraStatus"]),
  pump: pick(r, ["pump", "pumpStatus"]),
  position: pick(r, ["position", "currentPosition"]),
  wildlife: pick(r, ["wildlife", "wildlifeAlert"]),
});
const rangeLabel = (key, value) => {
  const n = Number(value);
  if (!hasValue(value) || Number.isNaN(n)) return null;
  const [min, max] = RANGES[key];
  return n < min ? "Low" : n > max ? "High" : "Optimal";
};
const calculateHealth = (values) => {
  if (!values.reading) return { score: null, status: "No Data", tone: "unknown" };
  let total = 0, count = 0;
  Object.keys(RANGES).forEach((key) => {
    const n = Number(values[key]);
    if (!hasValue(values[key]) || Number.isNaN(n)) return;
    const [min, max] = RANGES[key];
    count += 1;
    total += n >= min && n <= max ? 100 : Math.max(0, 100 - (n < min ? min - n : n - max) * 10);
  });
  if (!count) return { score: null, status: "No Data", tone: "unknown" };
  const score = Math.round(total / count);
  if (score >= 80) return { score, status: "Healthy", tone: "healthy" };
  if (score >= 60) return { score, status: "Moderate", tone: "warning" };
  return { score, status: "Needs Attention", tone: "warning" };
};
const statusText = (v, fallback) => (hasValue(v) ? String(v) : fallback);
const isOnline = (v, fallbackOnline) =>
  hasValue(v) ? !/off|down|fail|error/i.test(String(v)) : fallbackOnline;

/* ---------------- SMALL COMPONENTS ---------------- */

const StatCard = ({ tone, icon: Icon, title, value, unit = "", hint, onClick }) => (
  <div className={`ad-stat ${tone}`} onClick={onClick}>
    <div className="ad-stat-icon"><Icon size={30} /></div>
    <div className="ad-stat-text">
      <span>{title}</span>
      <strong>{hasValue(value) ? `${value}${unit}` : "--"}</strong>
      {hint && <small>{hint}</small>}
    </div>
    {onClick && <ChevronRight size={16} className="ad-stat-arrow" />}
  </div>
);

const StatusItem = ({ icon: Icon, label, online, text }) => (
  <div className="ad-status-item">
    <Icon size={26} />
    <div>
      <strong>{label}</strong>
      <span className={online ? "on" : "off"}><i />{text}</span>
    </div>
  </div>
);

const FormRow = ({ label, children }) => (
  <div className="ad-form-row"><label>{label}</label>{children}</div>
);

const Field = ({ label, full, children }) => (
  <div className={`form-field ${full ? "full" : ""}`}>
    <label>{label}</label>{children}
  </div>
);

/* ---------------- MAIN ---------------- */

const ForeignDashboard = () => {
  const [user] = useState(readStoredUser);
  const [lands, setLands] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [sensorData, setSensorData] = useState({});
  const [workers, setWorkers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null);
  const [search, setSearch] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [task, setTask] = useState({
    workerId: "", task: TASKS[0], date: "Tomorrow", time: "09:00", crop: "", instructions: "",
  });
  const [tasks, setTasks] = useState([]);
  const [taskBusy, setTaskBusy] = useState(false);

  const userId = user?.uid || user?.id || user?.userId || user?.user?.uid;

  /* ---- Firebase subscriptions (unchanged data logic) ---- */

  useEffect(() => {
    if (!userId) {
      setError("Please log in again to see your fields.");
      setLoading(false);
      return undefined;
    }
    const unsub = subscribeFields(
      userId,
      (list) => { setLands(list); setError(""); setLoading(false); },
      (e) => { console.error("Field Firebase error:", e); setError("Unable to load your fields from Firebase."); setLoading(false); }
    );
    return () => unsub?.();
  }, [userId]);

  const idsKey = lands.map((l) => l.id).join("|");

  useEffect(() => {
    if (!userId || !idsKey) { setSensorData({}); return undefined; }
    const unsubs = idsKey.split("|").map((fieldId) =>
      subscribeSensorReadings(
        userId, fieldId,
        (readings) => setSensorData((p) => ({ ...p, [fieldId]: readings })),
        (e) => console.error(`Sensor error for field ${fieldId}:`, e)
      )
    );
    return () => unsubs.forEach((u) => u?.());
  }, [userId, idsKey]);

  useEffect(() => {
    const unsub = subscribeWorkers(setWorkers, (e) => console.error("Worker Firebase error:", e));
    return () => unsub?.();
  }, []);

  useEffect(() => {
    if (!userId) return undefined;
    const unsub = subscribeOwnerWorkerRequests(userId, setRequests, (e) =>
      console.error("Worker request Firebase error:", e)
    );
    return () => unsub?.();
  }, [userId]);

  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(null), 4500);
    return () => clearTimeout(t);
  }, [notice]);

  /* ---- Derived data ---- */

  const selectedLand = lands.find((l) => l.id === selectedId) || lands[0] || null;
  const latestReading = (id) => (sensorData[id] || [])[0] || null;
  const values = extractSensorValues(selectedLand ? latestReading(selectedLand.id) : null);
  const health = calculateHealth(values);
  const live = isRecent(values.reading);

  const totalPlants = Number(pick(selectedLand, ["totalPlants", "plantCount", "plants"])) || null;
  const healthyPlants = hasValue(selectedLand?.healthyPlants)
    ? Number(selectedLand.healthyPlants)
    : totalPlants && health.score !== null
    ? Math.round((totalPlants * health.score) / 100)
    : null;

  const liveFields = lands.filter((l) => isRecent(latestReading(l.id))).length;
  const pendingRequests = requests.filter((r) => r.status === "pending").length;

  const alerts = useMemo(() => {
    const list = [];
    if (values.reading) {
      Object.keys(RANGES).forEach((key) => {
        const label = rangeLabel(key, values[key]);
        if (label && label !== "Optimal") {
          list.push({ icon: AlertTriangle, text: `${LABELS[key]} ${label.toLowerCase()}: ${values[key]}` });
        }
      });
    }
    if (values.wildlife) {
      list.push({ icon: PawPrint, text: `Wildlife detected near ${getFieldName(selectedLand)}` });
    }
    if (pendingRequests > 0) {
      list.push({ icon: Users, text: `${pendingRequests} worker request(s) pending` });
    }
    return list;
  }, [values, selectedLand, pendingRequests]);

  const visibleLands = lands.filter((l) =>
    `${getFieldName(l)} ${getLocationText(l)}`.toLowerCase().includes(search.toLowerCase())
  );

  const requestByField = useMemo(() => {
    const map = {};
    requests.forEach((r) => { if (!map[r.fieldId] || r.status === "accepted") map[r.fieldId] = r; });
    return map;
  }, [requests]);
  const fieldRequest = selectedLand ? requestByField[selectedLand.id] : null;
  const assignedWorkerId =
    selectedLand?.assignedWorkerId || selectedLand?.workerId ||
    (fieldRequest?.status === "accepted" ? fieldRequest.workerId : "");

  /* ---- Actions ---- */

  const scrollTo = (id) => {
    if (id === "report") return downloadReport();
    if (id === "top") return window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const openAddModal = () => { setForm(EMPTY_FORM); setFormError(""); setShowAddModal(true); };
  const updateForm = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleAddLand = async () => {
    setFormError("");
    if (!form.fieldName.trim()) return setFormError("Please enter a field name.");
    if (!(Number(form.area) > 0)) return setFormError("Please enter the area in acres (greater than 0).");
    if (!form.country.trim()) return setFormError("Please enter the country where the land is located.");
    const lat = form.latitude.trim(), lng = form.longitude.trim();
    if ((lat && !lng) || (!lat && lng)) return setFormError("Enter both latitude and longitude, or leave both empty.");
    if (lat && (Number.isNaN(Number(lat)) || Math.abs(Number(lat)) > 90)) return setFormError("Latitude must be between -90 and 90.");
    if (lng && (Number.isNaN(Number(lng)) || Math.abs(Number(lng)) > 180)) return setFormError("Longitude must be between -180 and 180.");
    setSaving(true);
    try {
      const newId = await addField(userId, form);
      setSelectedId(newId);
      setShowAddModal(false);
      setNotice({ type: "success", text: "Field added successfully." });
    } catch (err) {
      console.error("Add field error:", err);
      setFormError(err?.message || "Unable to save the field.");
    } finally {
      setSaving(false);
    }
  };

  const chosenWorkerId = task.workerId || assignedWorkerId || workers[0]?.id || "";
  const chosenWorker = workers.find((w) => w.id === chosenWorkerId);

  const callFarmer = () => {
    const phone = chosenWorker?.phone || chosenWorker?.mobile || chosenWorker?.phoneNumber;
    if (!phone) return setNotice({ type: "error", text: "This farmer has no phone number saved." });
    window.location.href = `tel:${phone}`;
  };

  const assignTask = async () => {
    if (!selectedLand || !chosenWorkerId) return setNotice({ type: "error", text: "Select a farm and a farmer first." });
    setTaskBusy(true);
    try {
      // Sends a connection request if this farmer is not yet connected to the field.
      if (assignedWorkerId !== chosenWorkerId) {
        await sendWorkerConnectionRequest({ ownerId: userId, fieldId: selectedLand.id, workerId: chosenWorkerId });
      }
      setTasks((p) => [
        { id: Date.now(), title: task.task, when: `${task.date} · ${task.time}`, worker: getWorkerName(chosenWorker), status: "Waiting for confirmation" },
        ...p,
      ]);
      setNotice({ type: "success", text: "Task assigned. Waiting for the farmer to confirm." });
    } catch (err) {
      console.error("Assign task error:", err);
      setNotice({ type: "error", text: err?.message || "Unable to assign the task." });
    } finally {
      setTaskBusy(false);
    }
  };

  const openMap = () => {
    const c = selectedLand && getCoordinates(selectedLand);
    if (!selectedLand) return;
    const q = c ? `${c.latitude},${c.longitude}` : encodeURIComponent(getLocationText(selectedLand));
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank", "noopener,noreferrer");
  };

  const downloadReport = () => {
    const report = {
      owner: { id: userId, name: user?.name || user?.displayName || "", email: user?.email || "" },
      generatedAt: new Date().toISOString(),
      fields: lands.map((land) => {
        const reading = latestReading(land.id);
        const v = extractSensorValues(reading);
        return {
          fieldId: land.id, fieldName: getFieldName(land), area: getArea(land),
          cropType: land.cropType || null, location: getLocationText(land),
          lastReadingAt: readingTime(reading),
          sensors: { temperature: v.temperature, moisture: v.moisture, humidity: v.humidity, ph: v.ph, wind: v.wind, weather: v.weather },
          health: calculateHealth(v),
        };
      }),
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url; a.download = "agrisense-field-report.json";
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem("agrisenseUser");
    localStorage.removeItem("agrisenseLand");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="ad-loading"><Loader2 size={30} className="spin" /><p>Loading your fields...</p></div>
    );
  }

  const pathText = values.position || null;
  const sensorsOnline = live;
  const ownerName = user?.name || user?.displayName || "Foreign Owner";

  /* ---------------- RENDER ---------------- */

  return (
    <div className="ad-root" id="top">
      {/* SIDEBAR */}
      <aside className="ad-sidebar">
        <div className="ad-brand"><Sprout size={34} /><h2>AgriSense</h2></div>
        <nav className="ad-menu">
          {MENU.map(([label, Icon, target]) => (
            <button
              key={label}
              className={`ad-menu-item ${activeMenu === label ? "active" : ""}`}
              onClick={() => { setActiveMenu(label); scrollTo(target); }}
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === "Notifications" && alerts.length > 0 && <b className="ad-dot">{alerts.length}</b>}
            </button>
          ))}
        </nav>
        <div className="ad-divider" />
        <button className="ad-menu-item"><Settings size={19} /><span>Settings</span></button>
        <div className="ad-divider" />
        <button className="ad-menu-item ad-logout" onClick={handleLogout}><LogOut size={19} /><span>Logout</span></button>
      </aside>

      <div className="ad-body">
        {/* TOP BAR */}
        <header className="ad-topbar">
          <label className="ad-search">
            <Search size={16} />
            <input placeholder="Search fields..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
          <button className="ad-bell" title="Alerts" onClick={() => scrollTo("alerts")}>
            <Bell size={20} />
            {alerts.length > 0 && <b className="ad-dot">{alerts.length}</b>}
          </button>
          <div className="ad-profile-wrap">
            <button className="ad-profile" onClick={() => setShowProfileMenu((o) => !o)}>
              <span className="ad-avatar"><User size={18} /></span>
              <strong>{ownerName}</strong>
              <ChevronDown size={14} />
            </button>
            {showProfileMenu && (
              <div className="ad-profile-menu">
                <div><strong>{ownerName}</strong><span>{user?.email || "No email"}</span></div>
                <button onClick={handleLogout}><LogOut size={15} /> Logout</button>
              </div>
            )}
          </div>
          <button className="ad-gear"><Settings size={22} /></button>
        </header>

        {notice && (
          <div className={`ad-notice ${notice.type}`}>{notice.text}</div>
        )}
        {error && (
          <div className="ad-notice error"><AlertCircle size={16} /> {error}</div>
        )}

        <div className="ad-grid">
          {/* LEFT COLUMN */}
          <div className="ad-col">
            {/* WELCOME */}
            <section className="ad-welcome" id="lands">
              <Sprout size={64} className="ad-welcome-leaf" />
              <div className="ad-welcome-text">
                <h1>Welcome back! 👋</h1>
                <p>
                  {live
                    ? "Your farm is being monitored automatically."
                    : lands.length
                    ? "Waiting for the latest sensor reading."
                    : "Add your first field to start monitoring."}
                </p>
              </div>
              <div className="ad-welcome-actions">
                {lands.length > 0 && (
                  <select
                    value={selectedLand?.id || ""}
                    onChange={(e) => setSelectedId(e.target.value)}
                    aria-label="Select field"
                  >
                    {visibleLands.map((l) => (
                      <option key={l.id} value={l.id}>{getFieldName(l)}</option>
                    ))}
                  </select>
                )}
                <button className="ad-btn primary" onClick={openAddModal}><Plus size={15} /> Add Land</button>
              </div>
            </section>

            {/* STAT CARDS */}
            <section className="ad-stats" id="sensors">
              <StatCard tone="blue" icon={Cpu} title="Machine" value={live ? "ACTIVE" : "IDLE"} onClick={() => scrollTo("machine")} />
              <StatCard
                tone="green" icon={Sprout} title="Plants"
                value={totalPlants ? `${healthyPlants ?? "--"}/${totalPlants}` : "--"}
              />
              <StatCard
                tone="green" icon={HeartPulse} title="Healthy"
                value={healthyPlants ?? (health.score !== null ? `${health.score}%` : null)}
                hint={health.score !== null && !healthyPlants ? health.status : undefined}
              />
              <StatCard tone="blue" icon={Droplet} title="Moisture" value={values.moisture} unit="%" hint={rangeLabel("moisture", values.moisture)} />
              <StatCard tone="purple" icon={CloudRain} title="Humidity" value={values.humidity} unit="%" hint={rangeLabel("humidity", values.humidity)} />
              <StatCard tone="orange" icon={Thermometer} title="Temp" value={values.temperature} unit="°C" hint={rangeLabel("temperature", values.temperature)} />
            </section>

            {/* MACHINE MONITORING */}
            <section className="ad-panel" id="machine">
              <h2 className="ad-title"><Cpu size={22} /> MACHINE MONITORING</h2>
              <div className="ad-path">
                {pathText ? (
                  String(pathText).split(/→|->/).map((p, i, arr) => (
                    <React.Fragment key={i}><b>{p.trim()}</b>{i < arr.length - 1 && <span>→</span>}</React.Fragment>
                  ))
                ) : (
                  <b>{selectedLand ? getFieldName(selectedLand) : "No field selected"}</b>
                )}
              </div>
              <div className="ad-progress-row">
                <div className="health-bar"><div className={`health-bar-fill ${health.tone}`} style={{ width: `${health.score ?? 0}%` }} /></div>
                <strong>{health.score !== null ? `${health.score}%` : "--"}</strong>
              </div>
              <div className="ad-status-row">
                <StatusItem icon={Camera} label="Camera" online={isOnline(values.camera, live)} text={statusText(values.camera, live ? "Online" : "Offline")} />
                <StatusItem icon={Radio} label="Sensors" online={sensorsOnline} text={sensorsOnline ? "Online" : "Offline"} />
                <StatusItem icon={Waves} label="Pump" online={isOnline(values.pump, live)} text={statusText(values.pump, live ? "Online" : "Offline")} />
              </div>
              <p className="ad-muted"><Clock size={12} /> Last updated {formatTime(readingTime(values.reading))} · {liveFields}/{lands.length} fields live</p>
            </section>

            {/* ALERTS + WILDLIFE */}
            <div className="ad-two" id="alerts">
              <section className="ad-panel danger">
                <h2 className="ad-title red"><AlertTriangle size={24} /> ALERTS</h2>
                {alerts.length === 0 ? (
                  <p className="ad-empty"><CheckCircle size={18} /> No alerts. Readings are within range.</p>
                ) : (
                  alerts.map((a, i) => (
                    <div className="ad-alert" key={i}>
                      <span className="ad-alert-icon"><a.icon size={18} /></span>
                      <span>{a.text}</span>
                      <ChevronRight size={15} />
                    </div>
                  ))
                )}
              </section>

              <section className="ad-panel danger">
                <h2 className="ad-title red"><PawPrint size={22} /> Wildlife</h2>
                {values.wildlife ? (
                  <>
                    <p className="ad-wild-text">
                      <strong>Wildlife Detected</strong>
                      {typeof values.wildlife === "string" ? values.wildlife : values.wildlife?.label || "Animal entered the farm"}
                    </p>
                    {(values.wildlife?.imageUrl || selectedLand?.wildlifeImage) && (
                      <img className="ad-wild-img" src={values.wildlife?.imageUrl || selectedLand.wildlifeImage} alt="Wildlife detected" />
                    )}
                    <div className="ad-wild-meta"><span>{formatTime(readingTime(values.reading))}</span><span>{selectedLand ? getFieldName(selectedLand) : ""}</span></div>
                  </>
                ) : (
                  <p className="ad-empty"><PawPrint size={18} /> No wildlife detected recently.</p>
                )}
              </section>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="ad-col">
            <section className="ad-camera">
              {(selectedLand?.cameraUrl || "/imageag.avif") && (
                <img src={selectedLand?.cameraUrl || "/imageag.avif"} alt="Field camera" />
              )}
              <span className={`ad-live ${live ? "" : "off"}`}>● {live ? "LIVE" : "OFFLINE"}</span>
              <span className="ad-cam-name">{selectedLand ? getFieldName(selectedLand) : "No field"} · Camera 1</span>
            </section>

            <section className="ad-panel" id="tasks">
              <h2 className="ad-title"><Users size={22} /> Farmer &amp; Tasks</h2>
              <div className="ad-call-head"><Phone size={18} /> CALL / ASSIGN FARMER</div>

              <FormRow label="Farmer">
                <select value={chosenWorkerId} onChange={(e) => setTask((p) => ({ ...p, workerId: e.target.value }))}>
                  {workers.length === 0 && <option value="">No workers available</option>}
                  {workers.map((w) => <option key={w.id} value={w.id}>{getWorkerName(w)}</option>)}
                </select>
              </FormRow>
              <FormRow label="Farm">
                <select value={selectedLand?.id || ""} onChange={(e) => setSelectedId(e.target.value)}>
                  {lands.length === 0 && <option value="">No fields yet</option>}
                  {lands.map((l) => <option key={l.id} value={l.id}>{getFieldName(l)}</option>)}
                </select>
              </FormRow>
              <FormRow label="Task">
                <select value={task.task} onChange={(e) => setTask((p) => ({ ...p, task: e.target.value }))}>
                  {TASKS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </FormRow>
              <FormRow label="Date">
                <div className="ad-icon-input"><Calendar size={15} />
                  <input value={task.date} onChange={(e) => setTask((p) => ({ ...p, date: e.target.value }))} />
                </div>
              </FormRow>
              <FormRow label="Time">
                <div className="ad-icon-input"><Clock size={15} />
                  <input type="time" value={task.time} onChange={(e) => setTask((p) => ({ ...p, time: e.target.value }))} />
                </div>
              </FormRow>
              <FormRow label="Crop">
                <input value={task.crop || selectedLand?.cropType || ""} onChange={(e) => setTask((p) => ({ ...p, crop: e.target.value }))} placeholder="e.g. Tomato" />
              </FormRow>
              <FormRow label="Instructions">
                <textarea rows={3} value={task.instructions} onChange={(e) => setTask((p) => ({ ...p, instructions: e.target.value }))} placeholder="e.g. Apply to rows 5–10" />
              </FormRow>

              <div className="ad-btn-row">
                <button className="ad-btn primary" onClick={callFarmer}><Phone size={16} /> Call Farmer</button>
                <button className="ad-btn teal" onClick={assignTask} disabled={taskBusy}>
                  {taskBusy ? <Loader2 size={16} className="spin" /> : <Send size={16} />} Assign Task
                </button>
              </div>
            </section>

            <section className="ad-panel">
              <h2 className="ad-title"><FileText size={22} /> UPCOMING TASKS</h2>
              {tasks.length === 0 ? (
                <p className="ad-empty"><Clock size={18} /> No tasks yet. Assign one above.</p>
              ) : (
                <>
                  {tasks.map((t) => (
                    <div className="ad-task" key={t.id}>
                      <Leaf size={20} />
                      <div><strong>{t.title}</strong><small>{t.worker}</small></div>
                      <span>{t.when}</span>
                    </div>
                  ))}
                  <div className="ad-task-status"><Clock size={18} /> Status: {tasks[0].status}</div>
                </>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* ADD LAND MODAL */}
      {showAddModal && (
        <div className="land-modal-overlay" onClick={() => !saving && setShowAddModal(false)}>
          <div className="land-modal land-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="land-modal-header">
              <div><h2>Add Land</h2><p>Register a field you own so you can monitor it remotely</p></div>
              <button disabled={saving} onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>
            <div className="land-form">
              <Field label="Field name *"><input value={form.fieldName} onChange={updateForm("fieldName")} placeholder="e.g. North paddy field" /></Field>
              <Field label="Area (acres) *"><input type="number" min="0" step="any" value={form.area} onChange={updateForm("area")} placeholder="e.g. 2.5" /></Field>
              <Field label="Crop"><input value={form.cropType} onChange={updateForm("cropType")} placeholder="e.g. Rice, coconut" /></Field>
              <Field label="Soil type">
                <select value={form.soilType} onChange={updateForm("soilType")}>
                  <option value="">Select soil type</option>
                  {SOIL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <div className="form-section-title">Where is the land?</div>
              <Field label="Country *"><input value={form.country} onChange={updateForm("country")} placeholder="Country of the land" /></Field>
              <Field label="State / Province"><input value={form.state} onChange={updateForm("state")} /></Field>
              <Field label="District"><input value={form.district} onChange={updateForm("district")} /></Field>
              <Field label="City / Village"><input value={form.city} onChange={updateForm("city")} /></Field>
              <Field label="Address / landmark" full><input value={form.address} onChange={updateForm("address")} placeholder="Survey number, road, nearby landmark" /></Field>
              <Field label="Latitude"><input value={form.latitude} onChange={updateForm("latitude")} placeholder="e.g. 10.5276" /></Field>
              <Field label="Longitude"><input value={form.longitude} onChange={updateForm("longitude")} placeholder="e.g. 76.2144" /></Field>
              <Field label="Sensor device ID (optional)" full><input value={form.sensorDeviceId} onChange={updateForm("sensorDeviceId")} placeholder="ID printed on the field's sensor kit" /></Field>
              {formError && <div className="form-error"><AlertCircle size={14} />{formError}</div>}
            </div>
            <div className="land-modal-footer">
              <button className="modal-close-btn" disabled={saving} onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="modal-connect-btn" disabled={saving} onClick={handleAddLand}>
                {saving ? <><Loader2 size={14} className="spin" /> Saving...</> : <><Plus size={14} /> Save Field</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForeignDashboard;