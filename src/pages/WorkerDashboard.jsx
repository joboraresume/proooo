import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Home,
  ClipboardList,
  MapPin,
  LogOut,
  CheckCircle2,
  Clock3,
  CalendarCheck,
  Sprout,
  Droplets,
  Tractor,
  Map as MapIcon,
  UserRound,
  Thermometer,
  Cloud,
  Inbox,
  XCircle,
  Loader2,
  Activity,
  Wind,
  Check,
} from "lucide-react";

import { subscribeField, getOwnerName } from "../services/fieldService";
import { subscribeSensorReadings } from "../services/sensorService";
import {
  subscribeWorkerProfile,
  subscribeWorkerRequests,
  respondToWorkerRequest,
} from "../services/workerService";
import {
  subscribeWorkerTasks,
  updateTaskStatus,
} from "../services/taskService";

import "./WorkerDashboard.css";

/* --------------------------------------------------
   HELPERS
-------------------------------------------------- */

const readStoredWorker = () => {
  for (const key of ["agrisenseWorker", "agrisenseUser"]) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value) return value;
    } catch (err) {
      console.error("Unable to read", key, err);
    }
  }
  return null;
};

const hasValue = (value) =>
  value !== null && value !== undefined && value !== "";

const pick = (source, keys) => {
  if (!source) return null;

  for (const key of keys) {
    if (hasValue(source[key])) return source[key];
  }

  return null;
};

const getFieldName = (field) =>
  field?.landName || field?.fieldName || field?.name || "Field";

const getLocationText = (field) => {
  if (!field) return "Location not available";

  const parts = [field.city, field.district, field.state, field.country].filter(
    Boolean
  );

  if (parts.length) return parts.join(", ");

  return field.address || field.location || "Location not available";
};

const getCoordinates = (field) => {
  const latitude = field?.latitude ?? field?.lat ?? field?.location?.latitude;
  const longitude =
    field?.longitude ?? field?.lng ?? field?.lon ?? field?.location?.longitude;

  if (!hasValue(latitude) || !hasValue(longitude)) return null;

  return { latitude, longitude };
};

const formatTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "--" : date.toLocaleString();
};

const isToday = (value) => {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toDateString() === new Date().toDateString();
};

const readingTime = (reading) => reading?.timestamp || reading?.createdAt || null;

const sensorValues = (reading) => ({
  temperature: pick(reading, ["temperature", "temp", "temperatureC"]),
  moisture: pick(reading, ["moisture", "soilMoisture", "soil_moisture"]),
  humidity: pick(reading, ["humidity", "airHumidity"]),
  ph: pick(reading, ["ph", "soilPh", "soil_pH"]),
  wind: pick(reading, ["windSpeed", "wind", "windKmh"]),
  weather: pick(reading, ["weather", "condition", "weatherCondition"]),
});

const normalizeStatus = (status) => {
  const value = String(status || "pending").toLowerCase().replace(/[\s-]/g, "_");

  if (value === "completed" || value === "done") return "completed";
  if (value === "in_progress" || value === "progress") return "in_progress";
  return "pending";
};

const STATUS_LABEL = {
  completed: "Completed",
  in_progress: "In Progress",
  pending: "Pending",
};

const STATUS_CLASS = {
  completed: "completed",
  in_progress: "progress",
  pending: "pending",
};

const taskIcon = (task) => {
  const text = `${task.type || ""} ${task.title || ""}`.toLowerCase();

  if (/(irrigat|water)/.test(text)) return <Droplets size={18} />;
  if (/(harvest|tractor|plough|plow)/.test(text)) return <Tractor size={18} />;
  if (/(weed|soil|sow|plant|seed)/.test(text)) return <Sprout size={18} />;
  return <ClipboardList size={18} />;
};

const SensorCard = ({ icon: Icon, title, value, unit = "" }) => (
  <div className="wd-sensor-card">
    <Icon size={18} />
    <span>{title}</span>
    <strong>{hasValue(value) ? `${value}${unit}` : "--"}</strong>
  </div>
);

const requestKey = (request) => `${request.ownerId}/${request.fieldId}`;

/* --------------------------------------------------
   MAIN COMPONENT
-------------------------------------------------- */

const WorkerDashboard = () => {
  const navigate = useNavigate();

  const [stored] = useState(readStoredWorker);

  const workerId =
    stored?.uid ||
    stored?.id ||
    stored?.workerId ||
    stored?.userId ||
    stored?.user?.uid;

  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [fieldsByKey, setFieldsByKey] = useState({});
  const [readingsByKey, setReadingsByKey] = useState({});
  const [ownerNames, setOwnerNames] = useState({});

  const [selectedKey, setSelectedKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null);
  const [respondingId, setRespondingId] = useState(null);
  const [taskBusyId, setTaskBusyId] = useState(null);
  const [showAllTasks, setShowAllTasks] = useState(false);

  /* ---------------- FIREBASE: PROFILE / REQUESTS / TASKS ---------------- */

  useEffect(() => {
    if (!workerId) {
      setError("Please log in again to see your dashboard.");
      setLoading(false);
      return undefined;
    }

    const unsubscribers = [
      subscribeWorkerProfile(workerId, setProfile, (err) =>
        console.error("Worker profile error:", err)
      ),

      subscribeWorkerRequests(
        workerId,
        (list) => {
          setRequests(list);
          setError("");
          setLoading(false);
        },
        (err) => {
          console.error("Worker requests error:", err);
          setError("Unable to load your connection requests.");
          setLoading(false);
        }
      ),

      subscribeWorkerTasks(workerId, setTasks, (err) =>
        console.error("Worker tasks error:", err)
      ),
    ];

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe?.());
  }, [workerId]);

  /* ---------------- DERIVED REQUEST LISTS ---------------- */

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const acceptedRequests = requests.filter((r) => r.status === "accepted");

  const fieldKeys = [...pendingRequests, ...acceptedRequests]
    .map(requestKey)
    .filter((key, index, all) => all.indexOf(key) === index)
    .sort()
    .join("|");

  const acceptedKeys = acceptedRequests
    .map(requestKey)
    .filter((key, index, all) => all.indexOf(key) === index)
    .sort()
    .join("|");

  const ownerKeys = [...pendingRequests, ...acceptedRequests]
    .map((r) => r.ownerId)
    .filter((id, index, all) => id && all.indexOf(id) === index)
    .sort()
    .join("|");

  /* ---------------- FIREBASE: FIELD DETAILS ---------------- */

  useEffect(() => {
    if (!fieldKeys) return undefined;

    const unsubscribers = fieldKeys.split("|").map((key) => {
      const [ownerId, fieldId] = key.split("/");

      return subscribeField(
        ownerId,
        fieldId,
        (field) => setFieldsByKey((previous) => ({ ...previous, [key]: field })),
        (err) => console.warn(`Field ${key} not readable yet:`, err.message)
      );
    });

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe?.());
  }, [fieldKeys]);

  /* ---------------- FIREBASE: LIVE SENSOR READINGS (accepted only) ---------------- */

  useEffect(() => {
    if (!acceptedKeys) return undefined;

    const unsubscribers = acceptedKeys.split("|").map((key) => {
      const [ownerId, fieldId] = key.split("/");

      return subscribeSensorReadings(
        ownerId,
        fieldId,
        (readings) =>
          setReadingsByKey((previous) => ({ ...previous, [key]: readings })),
        (err) => console.warn(`Sensor data ${key} not readable:`, err.message)
      );
    });

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe?.());
  }, [acceptedKeys]);

  /* ---------------- OWNER NAMES ---------------- */

  useEffect(() => {
    if (!ownerKeys) return;

    ownerKeys.split("|").forEach(async (ownerId) => {
      const name = await getOwnerName(ownerId);
      if (name) setOwnerNames((previous) => ({ ...previous, [ownerId]: name }));
    });
  }, [ownerKeys]);

  /* ---------------- NOTICE AUTO-DISMISS ---------------- */

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

  /* ---------------- DERIVED DATA ---------------- */

  const assignedFields = useMemo(
    () =>
      acceptedRequests
        .filter(
          (request, index, all) =>
            all.findIndex((r) => requestKey(r) === requestKey(request)) === index
        )
        .map((request) => {
          const key = requestKey(request);

          return {
            key,
            request,
            field: fieldsByKey[key] || null,
            readings: readingsByKey[key] || [],
          };
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [requests, fieldsByKey, readingsByKey]
  );

  const selected =
    assignedFields.find((item) => item.key === selectedKey) ||
    assignedFields[0] ||
    null;

  const latest = selected?.readings?.[0] || null;
  const values = sensorValues(latest);

  const workerName =
    profile?.name ||
    profile?.fullName ||
    profile?.displayName ||
    stored?.workerName ||
    stored?.name ||
    stored?.displayName ||
    "Worker";

  const todayTasks = tasks.filter((task) => isToday(task.scheduledAt));
  const todayDone = todayTasks.filter(
    (task) => normalizeStatus(task.status) === "completed"
  ).length;

  const completedTotal = tasks.filter(
    (task) => normalizeStatus(task.status) === "completed"
  ).length;

  const completionRate = tasks.length
    ? Math.round((completedTotal / tasks.length) * 100)
    : null;

  const visibleTasks = showAllTasks ? tasks : tasks.slice(0, 5);

  const fieldLabelForTask = (task) => {
    const field = fieldsByKey[`${task.ownerId}/${task.fieldId}`];
    return field
      ? `${getFieldName(field)} · ${getLocationText(field)}`
      : "Field details unavailable";
  };

  const updates = useMemo(() => {
    const items = [];

    requests.forEach((request) => {
      const field = fieldsByKey[requestKey(request)];
      const name = field ? getFieldName(field) : "a field";

      if (request.status === "pending") {
        items.push({
          id: `r-${request.id}`,
          title: "New connection request",
          text: `A land owner wants you to work on ${name}`,
          time: request.createdAt,
        });
      } else if (request.status === "accepted") {
        items.push({
          id: `r-${request.id}`,
          title: "Connected to a field",
          text: `You accepted ${name}`,
          time: request.respondedAt || request.createdAt,
        });
      }
    });

    tasks.forEach((task) => {
      items.push({
        id: `t-${task.id}`,
        title:
          normalizeStatus(task.status) === "completed"
            ? "Task completed"
            : "Task assigned",
        text: task.title || "Task",
        time: task.completedAt || task.createdAt || task.scheduledAt,
      });
    });

    return items
      .sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0))
      .slice(0, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests, tasks, fieldsByKey]);

  /* ---------------- ACTIONS ---------------- */

  const respond = async (request, accept) => {
    setRespondingId(request.id);

    try {
      await respondToWorkerRequest({ request, workerId, accept });

      if (accept) setSelectedKey(requestKey(request));

      setNotice({
        type: "success",
        text: accept
          ? "Request accepted. The land owner can now see you as connected."
          : "Request declined.",
      });
    } catch (err) {
      console.error("Respond error:", err);
      setNotice({ type: "error", text: err?.message || "Unable to respond." });
    } finally {
      setRespondingId(null);
    }
  };

  const changeTaskStatus = async (task, status) => {
    setTaskBusyId(task.id);

    try {
      await updateTaskStatus(task.id, status);
    } catch (err) {
      console.error("Task update error:", err);
      setNotice({ type: "error", text: "Unable to update the task." });
    } finally {
      setTaskBusyId(null);
    }
  };

  const openMap = (field) => {
    if (!field) return;

    const coordinates = getCoordinates(field);
    const query = coordinates
      ? `${coordinates.latitude},${coordinates.longitude}`
      : encodeURIComponent(getLocationText(field));

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const handleLogout = () => {
    localStorage.removeItem("agrisenseWorker");
    localStorage.removeItem("agrisenseUser");
    navigate("/login");
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="worker-dashboard">
        <main className="wd-main" style={{ marginLeft: 0, width: "100%" }}>
          <div className="wd-empty">
            <Loader2 size={30} className="wd-spin" />
            <p>Loading your dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className="worker-dashboard">
      {/* SIDEBAR */}

      <aside className="wd-sidebar">
        <div className="wd-brand">
          <div className="wd-brand-logo">
            <Sprout size={26} />
          </div>

          <div>
            <h2>AgriSense</h2>
            <p>Smart Farming</p>
          </div>
        </div>

        <nav className="wd-menu">
          <button
            className="wd-menu-item active"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Home size={19} />
            <span>Dashboard</span>
          </button>

          <button className="wd-menu-item" onClick={() => scrollTo("requests")}>
            <Inbox size={19} />
            <span>Requests</span>
          </button>

          <button className="wd-menu-item" onClick={() => scrollTo("tasks")}>
            <ClipboardList size={19} />
            <span>Assigned Tasks</span>
          </button>

          <button className="wd-menu-item" onClick={() => scrollTo("fields")}>
            <MapPin size={19} />
            <span>My Fields</span>
          </button>
        </nav>

        <button className="wd-logout" onClick={handleLogout}>
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </aside>

      {/* MAIN */}

      <main className="wd-main">
        <header className="wd-header">
          <div>
            <h1>Worker Dashboard</h1>
            <p>Your work today helps build a greener tomorrow.</p>
          </div>

          <div className="wd-header-right">
            <button
              className="wd-notification"
              title="Pending requests"
              onClick={() => scrollTo("requests")}
            >
              <Bell size={20} />
              {pendingRequests.length > 0 && (
                <span>{pendingRequests.length}</span>
              )}
            </button>

            <div className="wd-profile">
              <div className="wd-profile-avatar">
                <UserRound size={19} />
              </div>

              <div className="wd-profile-info">
                <strong>{workerName}</strong>
                <span>Worker</span>
              </div>
            </div>
          </div>
        </header>

        {notice && (
          <div className={`wd-notice ${notice.type === "error" ? "error" : ""}`}>
            {notice.text}
          </div>
        )}

        {error && <div className="wd-notice error">{error}</div>}

        {/* STATS */}

        <section className="wd-stats">
          <div className="wd-stat-card">
            <div className="wd-stat-icon green">
              <MapPin size={22} />
            </div>
            <div>
              <span>Assigned Fields</span>
              <strong>{assignedFields.length}</strong>
              <small>connected to you</small>
            </div>
          </div>

          <div className="wd-stat-card">
            <div className="wd-stat-icon blue">
              <Inbox size={22} />
            </div>
            <div>
              <span>New Requests</span>
              <strong>{pendingRequests.length}</strong>
              <small>waiting for your reply</small>
            </div>
          </div>

          <div className="wd-stat-card">
            <div className="wd-stat-icon yellow">
              <ClipboardList size={22} />
            </div>
            <div>
              <span>Today's Tasks</span>
              <strong>{todayTasks.length}</strong>
              <small>{todayDone} completed</small>
            </div>
          </div>

          <div className="wd-stat-card">
            <div className="wd-stat-icon purple">
              <CalendarCheck size={22} />
            </div>
            <div>
              <span>Task Completion</span>
              <strong>{completionRate !== null ? `${completionRate}%` : "--"}</strong>
              <small>{tasks.length} tasks in total</small>
            </div>
          </div>
        </section>

        <section className="wd-grid">
          {/* LEFT COLUMN */}

          <div className="wd-column">
            {/* CONNECTION REQUESTS */}

            <div className="wd-card" id="requests">
              <div className="wd-card-header">
                <h2>Connection Requests</h2>
                <span className="wd-count">{pendingRequests.length} pending</span>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="wd-empty small">
                  <Inbox size={26} />
                  <p>No pending requests. Land owners who rent you will appear here.</p>
                </div>
              ) : (
                <div className="wd-request-list">
                  {pendingRequests.map((request) => {
                    const field = fieldsByKey[requestKey(request)];
                    const busy = respondingId === request.id;

                    return (
                      <div className="wd-request" key={request.id}>
                        <div className="wd-task-icon">
                          <Sprout size={18} />
                        </div>

                        <div className="wd-request-info">
                          <h3>{field ? getFieldName(field) : "Field request"}</h3>

                          <span>
                            {ownerNames[request.ownerId]
                              ? `From ${ownerNames[request.ownerId]}`
                              : "From a land owner"}
                            {field && ` · ${getLocationText(field)}`}
                          </span>

                          <small>
                            {field?.area ? `${field.area} acres · ` : ""}
                            Requested {formatTime(request.createdAt)}
                          </small>
                        </div>

                        <div className="wd-request-actions">
                          <button
                            className="wd-btn ghost"
                            disabled={busy}
                            onClick={() => respond(request, false)}
                          >
                            <XCircle size={14} />
                            Decline
                          </button>

                          <button
                            className="wd-btn primary"
                            disabled={busy}
                            onClick={() => respond(request, true)}
                          >
                            {busy ? (
                              <Loader2 size={14} className="wd-spin" />
                            ) : (
                              <Check size={14} />
                            )}
                            Accept
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* TASKS */}

            <div className="wd-card" id="tasks">
              <div className="wd-card-header">
                <h2>Assigned Tasks</h2>

                {tasks.length > 5 && (
                  <button
                    className="wd-link-btn"
                    onClick={() => setShowAllTasks((value) => !value)}
                  >
                    {showAllTasks ? "Show Less" : "View All"}
                  </button>
                )}
              </div>

              {tasks.length === 0 ? (
                <div className="wd-empty small">
                  <ClipboardList size={26} />
                  <p>No tasks assigned yet.</p>
                </div>
              ) : (
                <div className="wd-task-list">
                  {visibleTasks.map((task) => {
                    const status = normalizeStatus(task.status);
                    const busy = taskBusyId === task.id;

                    return (
                      <div className="wd-task" key={task.id}>
                        <div className="wd-task-icon">{taskIcon(task)}</div>

                        <div className="wd-task-info">
                          <h3>{task.title || "Untitled task"}</h3>
                          <span>{fieldLabelForTask(task)}</span>
                          <small>{formatTime(task.scheduledAt)}</small>
                        </div>

                        <div className="wd-task-side">
                          <div className={`wd-task-status ${STATUS_CLASS[status]}`}>
                            {status === "completed" ? (
                              <CheckCircle2 size={13} />
                            ) : (
                              <Clock3 size={13} />
                            )}
                            {STATUS_LABEL[status]}
                          </div>

                          {status !== "completed" && (
                            <button
                              className="wd-btn small"
                              disabled={busy}
                              onClick={() =>
                                changeTaskStatus(
                                  task,
                                  status === "pending" ? "in_progress" : "completed"
                                )
                              }
                            >
                              {status === "pending" ? "Start" : "Mark Done"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* BANNER */}

            <div className="wd-banner">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80"
                alt="Healthy farm"
              />

              <div>
                <h2>Healthy Fields</h2>
                <h3>Happy Farmers</h3>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}

          <div className="wd-column" id="fields">
            {/* WORK LOCATION */}

            <div className="wd-card">
              <div className="wd-card-header">
                <h2>Your Work Location</h2>
              </div>

              {assignedFields.length > 1 && (
                <div className="wd-field-tabs">
                  {assignedFields.map((item) => (
                    <button
                      key={item.key}
                      className={`wd-field-tab ${
                        selected?.key === item.key ? "active" : ""
                      }`}
                      onClick={() => setSelectedKey(item.key)}
                    >
                      {item.field ? getFieldName(item.field) : "Field"}
                    </button>
                  ))}
                </div>
              )}

              {!selected ? (
                <div className="wd-empty small">
                  <MapPin size={26} />
                  <p>
                    No field connected yet. Accept a request to see the field's
                    location and live conditions.
                  </p>
                </div>
              ) : (
                <>
                  <div className="wd-map-preview">
                    <div className="wd-map-background">
                      <MapPin className="wd-big-map-pin" size={42} />
                    </div>
                  </div>

                  <div className="wd-location-details">
                    <div>
                      <strong>
                        {selected.field ? getFieldName(selected.field) : "Field"}
                      </strong>
                      <span>{getLocationText(selected.field)}</span>
                      {selected.field?.area && (
                        <small>
                          {selected.field.area} acres
                          {selected.field.cropType
                            ? ` · ${selected.field.cropType}`
                            : ""}
                        </small>
                      )}
                    </div>

                    <button
                      className="wd-btn primary"
                      disabled={!selected.field}
                      onClick={() => openMap(selected.field)}
                    >
                      <MapIcon size={15} />
                      View on Map
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* LIVE FIELD CONDITIONS */}

            <div className="wd-card">
              <div className="wd-card-header">
                <h2>Field Conditions</h2>
                {latest && <span className="wd-live">Live</span>}
              </div>

              {!selected ? (
                <div className="wd-empty small">
                  <Activity size={26} />
                  <p>Conditions appear once a field is connected.</p>
                </div>
              ) : !latest ? (
                <div className="wd-empty small">
                  <Activity size={26} />
                  <p>Waiting for sensor data from this field.</p>
                </div>
              ) : (
                <>
                  <div className="wd-sensor-grid">
                    <SensorCard
                      icon={Thermometer}
                      title="Temperature"
                      value={values.temperature}
                      unit="°C"
                    />
                    <SensorCard
                      icon={Droplets}
                      title="Soil Moisture"
                      value={values.moisture}
                      unit="%"
                    />
                    <SensorCard
                      icon={Cloud}
                      title="Humidity"
                      value={values.humidity}
                      unit="%"
                    />
                    <SensorCard icon={Sprout} title="Soil pH" value={values.ph} />
                    <SensorCard
                      icon={Wind}
                      title="Wind"
                      value={values.wind}
                      unit=" km/h"
                    />
                    <SensorCard
                      icon={Cloud}
                      title="Weather"
                      value={values.weather}
                    />
                  </div>

                  <div className="wd-sensor-footer">
                    <Clock3 size={13} />
                    Last updated {formatTime(readingTime(latest))}
                  </div>
                </>
              )}
            </div>

            {/* RECENT UPDATES */}

            <div className="wd-card">
              <div className="wd-card-header">
                <h2>Recent Updates</h2>
              </div>

              {updates.length === 0 ? (
                <div className="wd-empty small">
                  <Bell size={26} />
                  <p>Nothing new yet.</p>
                </div>
              ) : (
                updates.map((item) => (
                  <div className="wd-update-item" key={item.id}>
                    <div className="wd-update-icon">
                      <Bell size={16} />
                    </div>

                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.text}</span>
                      <small>{formatTime(item.time)}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WorkerDashboard;