import React, { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  Home,
  ClipboardList,
  MapPin,
  Wallet,
  MessageSquare,
  Settings,
  LogOut,
  CheckCircle2,
  Clock3,
  IndianRupee,
  CalendarCheck,
  Sprout,
  Droplets,
  Tractor,
  Map,
  UserRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import "./WorkerDashboard.css";

const WorkerDashboard = () => {

  const navigate = useNavigate();

  const [worker, setWorker] = useState({
    workerName: "Worker",
    fieldName: "No Field Registered",
    place: "Location not available",
    district: "",
    state: "",
    workType: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {

    const savedWorker =
      localStorage.getItem("agrisenseWorker");

    if (savedWorker) {
      setWorker(JSON.parse(savedWorker));
    }

  }, []);

  const openMap = () => {

    if (worker.latitude && worker.longitude) {

      const url = `https://www.google.com/maps?q=${worker.latitude},${worker.longitude}`;

      window.open(url, "_blank");

    } else {

      const location = `${worker.place}, ${worker.district}, ${worker.state}`;

      const url =
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          location
        )}`;

      window.open(url, "_blank");
    }
  };

  const tasks = [
    {
      icon: <Sprout size={18} />,
      title: "Weeding & Soil Care",
      field: `${worker.fieldName} · ${worker.place}`,
      time: "Today, 8:00 AM",
      status: "Completed",
      statusClass: "completed",
    },
    {
      icon: <Droplets size={18} />,
      title: "Irrigation Setup",
      field: `${worker.fieldName} · ${worker.place}`,
      time: "Today, 11:00 AM",
      status: "In Progress",
      statusClass: "progress",
    },
    {
      icon: <Tractor size={18} />,
      title: "Harvesting Support",
      field: `${worker.fieldName} · ${worker.place}`,
      time: "Today, 3:00 PM",
      status: "Pending",
      statusClass: "pending",
    },
  ];

  return (
    <div className="worker-dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-logo">
            <Sprout size={29} />
          </div>

          <div>
            <h2>AgriSense</h2>
            <p>Smart Farming · Better Tomorrow</p>
          </div>

        </div>

        <nav className="sidebar-menu">

          <div className="menu-item active">
            <Home size={20} />
            <span>Dashboard</span>
          </div>

          <div className="menu-item">
            <ClipboardList size={20} />
            <span>Assigned Tasks</span>
          </div>

          <div
            className="menu-item"
            onClick={() => navigate("/land-details")}
          >
            <MapPin size={20} />
            <span>Land Details</span>
          </div>

          <div className="menu-item">
            <Wallet size={20} />
            <span>Earnings</span>
          </div>

          <div className="menu-item">
            <MessageSquare size={20} />
            <span>Messages</span>
          </div>

          <div className="menu-item">
            <Settings size={20} />
            <span>Settings</span>
          </div>

        </nav>

        <div className="logout">
          <LogOut size={19} />
          <span>Logout</span>
        </div>

      </aside>

      {/* MAIN */}

      <main className="main-content">

        {/* HEADER */}

        <header className="top-header">

          <div>

            <h1>Worker Dashboard</h1>

            <p>
              Your work today helps build a greener tomorrow.
            </p>

          </div>

          <div className="header-right">

            <div className="notification">

              <Bell size={21} />

              <span className="notification-count">
                2
              </span>

            </div>

            <div className="profile">

              <div className="profile-avatar">
                <UserRound size={20} />
              </div>

              <div className="profile-info">

                <strong>
                  {worker.workerName}
                </strong>

                <span>Worker</span>

              </div>

              <ChevronDown size={17} />

            </div>

          </div>

        </header>

        {/* STATISTICS */}

        <section className="stats-grid">

          <div className="stat-card green-card">

            <div className="stat-icon green-icon">
              <ClipboardList size={22} />
            </div>

            <div className="stat-details">

              <span>Today's Tasks</span>

              <strong>3</strong>

              <small>2 Completed</small>

            </div>

          </div>

          <div className="stat-card blue-card">

            <div className="stat-icon blue-icon">
              <Clock3 size={22} />
            </div>

            <div className="stat-details">

              <span>Hours Worked</span>

              <strong>
                5.5 <small className="unit">hrs</small>
              </strong>

              <small>Today</small>

            </div>

          </div>

          <div className="stat-card yellow-card">

            <div className="stat-icon yellow-icon">
              <IndianRupee size={22} />
            </div>

            <div className="stat-details">

              <span>Today's Earning</span>

              <strong>₹ 550</strong>

              <small>Estimated</small>

            </div>

          </div>

          <div className="stat-card purple-card">

            <div className="stat-icon purple-icon">
              <CalendarCheck size={22} />
            </div>

            <div className="stat-details">

              <span>Task Completion</span>

              <strong>67%</strong>

              <small>This Week</small>

            </div>

          </div>

        </section>

        {/* CONTENT */}

        <section className="dashboard-grid">

          {/* LEFT */}

          <div className="left-column">

            <div className="dashboard-card tasks-card">

              <div className="card-header">

                <h2>Assigned Tasks</h2>

                <button>
                  View All
                </button>

              </div>

              <div className="task-list">

                {tasks.map((task, index) => (

                  <div
                    className="task-item"
                    key={index}
                  >

                    <div
                      className={`task-icon task-${index}`}
                    >
                      {task.icon}
                    </div>

                    <div className="task-info">

                      <h3>
                        {task.title}
                      </h3>

                      <span>
                        {task.field}
                      </span>

                      <small>
                        {task.time}
                      </small>

                    </div>

                    <div
                      className={`task-status ${task.statusClass}`}
                    >

                      {task.statusClass === "completed" && (
                        <CheckCircle2 size={13} />
                      )}

                      {task.statusClass !== "completed" && (
                        <Clock3 size={13} />
                      )}

                      {task.status}

                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* FARM BANNER */}

            <div className="farm-banner">

              <div className="farm-image">

                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80"
                  alt="Healthy farm"
                />

              </div>

              <div className="farm-text">

                <h2>Healthy Fields</h2>
                <h3>Happy Farmers</h3>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="right-column">

            {/* LOCATION */}

            <div className="dashboard-card location-card">

              <div className="card-header">

                <h2>
                  Your Work Location
                </h2>

              </div>

              <div className="map-preview">

                <div className="map-background">

                  <MapPin
                    className="big-map-pin"
                    size={42}
                  />

                </div>

              </div>

              <div className="location-details">

                <div>

                  <strong>
                    {worker.fieldName}
                  </strong>

                  <span>
                    {worker.place}
                    {worker.district &&
                      `, ${worker.district}`}
                    {worker.state &&
                      `, ${worker.state}`}
                  </span>

                </div>

                <button
                  className="map-button"
                  onClick={openMap}
                >

                  <Map size={16} />

                  View on Map

                </button>

              </div>

            </div>

            {/* RECENT UPDATES */}

            <div className="dashboard-card updates-card">

              <div className="card-header">

                <h2>Recent Updates</h2>

                <button>
                  View All
                </button>

              </div>

              <div className="update-item">

                <div className="update-icon">
                  <Bell size={17} />
                </div>

                <div className="update-content">

                  <strong>
                    New task assigned
                  </strong>

                  <span>
                    {worker.workType ||
                      "New work assigned"}
                  </span>

                  <small>
                    Today, 10:15 AM
                  </small>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default WorkerDashboard;