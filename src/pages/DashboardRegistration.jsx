import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Sprout,
  LandPlot,
  HardHat,
  Globe2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
} from "lucide-react";

import "./DashboardRegistration.css";

const API_BASE = (
  import.meta?.env?.VITE_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

const roles = [
  {
    id: "farmer",
    title: "Farmer",
    subtitle: "Manage farming activities",
    icon: Sprout,
    color: "green",
    registration: "/farmer-registration",
    dashboard: "/farmer-dashboard",
  },
  {
    id: "rented",
    title: "Land / Rented",
    subtitle: "Register and monitor land",
    icon: LandPlot,
    color: "earth",
    registration: "/rented-registration",
    dashboard: "/rented-dashboard",
  },
  {
    id: "worker",
    title: "Agricultural Worker",
    subtitle: "Find and manage farm work",
    icon: HardHat,
    color: "orange",
    registration: "/worker-registration",
    dashboard: "/worker-dashboard",
  },
  {
    id: "foreigner",
    title: "Foreigner",
    subtitle: "Explore agricultural opportunities",
    icon: Globe2,
    color: "blue",
    registration: "/foreigner-registration",
    dashboard: "/foreign-dashboard",
  },
  {
    id: "officer",
    title: "Agriculture Officer",
    subtitle: "Monitor agricultural operations",
    icon: ShieldCheck,
    color: "purple",
    registration: "/agriculture-officer-registration",
    dashboard: "/agriculture-officer-dashboard",
  },
];

function DashboardRegistration() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("farmer");
  const [registeredRoles, setRegisteredRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("agrisenseUser") || "null");
    } catch {
      return null;
    }
  };

  useEffect(() => {
    loadRegisteredRoles();
  }, []);

  const loadRegisteredRoles = async () => {
    setLoading(true);

    const user = getUser();

    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/profiles/${user.id}`
      );

      if (response.ok) {
        const data = await response.json();

        const profiles = Array.isArray(data)
          ? data
          : data.profiles || [];

        const roleNames = profiles
          .map((profile) =>
            String(
              profile.role ||
              profile.profile_type ||
              profile.user_type ||
              ""
            ).toLowerCase()
          )
          .filter(Boolean);

        setRegisteredRoles(roleNames);

        localStorage.setItem(
          "agrisenseProfiles",
          JSON.stringify(profiles)
        );

        setLoading(false);
        return;
      }
    } catch (error) {
      console.log("Profile API unavailable");
    }

    // Local fallback
    try {
      const localProfiles = JSON.parse(
        localStorage.getItem("agrisenseProfiles") || "[]"
      );

      if (Array.isArray(localProfiles)) {
        setRegisteredRoles(
          localProfiles
            .map((profile) =>
              String(
                profile.role ||
                profile.profile_type ||
                profile.user_type ||
                ""
              ).toLowerCase()
            )
            .filter(Boolean)
        );
      }
    } catch {
      setRegisteredRoles([]);
    }

    setLoading(false);
  };

  const isRegistered = (roleId) => {
    const aliases = {
      farmer: ["farmer"],
      rented: [
        "rented",
        "landowner",
        "land owner",
        "land",
        "rented role",
        "landowner role",
      ],
      worker: [
        "worker",
        "agricultural worker",
        "farm worker",
      ],
      foreigner: [
        "foreigner",
        "foreign",
      ],
      officer: [
        "officer",
        "agriculture officer",
        "agricultural officer",
      ],
    };

    return (aliases[roleId] || []).some((name) =>
      registeredRoles.some((registered) =>
        registered.includes(name)
      )
    );
  };

  const selected = roles.find(
    (role) => role.id === selectedRole
  );

  const handleRoleClick = (role) => {
    setSelectedRole(role.id);
  };

  const handleRegister = () => {
    if (!selected) return;

    navigate(selected.registration);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="registration-page">

      {/* Only the role tabs + dashboard button at the top */}
      <div className="registration-topbar">

        <div className="role-tabs">
          {roles.map((role) => {
            const Icon = role.icon;
            const registered = isRegistered(role.id);

            return (
              <button
                key={role.id}
                className={`role-tab ${
                  selectedRole === role.id ? "active" : ""
                }`}
                onClick={() => handleRoleClick(role)}
              >
                <Icon size={19} />

                <span>{role.title}</span>

                {registered && (
                  <CheckCircle2
                    className="registered-icon"
                    size={16}
                  />
                )}
              </button>
            );
          })}
        </div>

        <button
          className="show-dashboard-button"
          onClick={handleDashboard}
        >
          <LayoutDashboard size={19} />
          <span>Show Dashboard</span>
          <ArrowRight size={18} />
        </button>

      </div>

      {/* Main registration area */}
      <main className="registration-content">

        <section className="registration-hero">

          <div className="hero-copy">
            <span className="eyebrow">
              AGRISENSE · ROLE REGISTRATION
            </span>

            <h1>
              Choose how you want to
              <span> use AgriSense.</span>
            </h1>

            <p>
              Register a role to unlock the tools and dashboard
              designed for your agricultural journey.
            </p>

            <div className="hero-actions">

              <button
                className="primary-registration-button"
                onClick={handleRegister}
              >
                Register as {selected?.title}
                <ArrowRight size={19} />
              </button>

              <button
                className="secondary-dashboard-button"
                onClick={handleDashboard}
              >
                <LayoutDashboard size={18} />
                View my dashboard
              </button>

            </div>
          </div>

          <div className="hero-visual">

            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />

            <div className="hero-land-card">

              <div className="land-card-top">
                <span>AGRISENSE</span>
                <span className="live-dot">● LIVE</span>
              </div>

              <div className="field-visual">
                <div className="field-row row-1" />
                <div className="field-row row-2" />
                <div className="field-row row-3" />
                <div className="field-row row-4" />
                <div className="field-row row-5" />
              </div>

              <div className="field-bottom">
                <div>
                  <small>SELECTED ROLE</small>
                  <strong>{selected?.title}</strong>
                </div>

                <div className="field-status">
                  {isRegistered(selectedRole) ? (
                    <>
                      <CheckCircle2 size={15} />
                      Registered
                    </>
                  ) : (
                    "Not registered"
                  )}
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* Selected role information */}
        <section className="selected-role-section">

          <div className="selected-role-heading">
            <div>
              <span className="section-label">
                SELECTED ROLE
              </span>

              <h2>{selected?.title}</h2>
            </div>

            {isRegistered(selectedRole) && (
              <div className="already-registered">
                <CheckCircle2 size={17} />
                Already registered
              </div>
            )}
          </div>

          <div className="role-information-grid">

            <div className="information-card">
              <div className={`information-icon ${selected?.color}`}>
                {selected &&
                  React.createElement(selected.icon, {
                    size: 24,
                  })}
              </div>

              <div>
                <h3>{selected?.title}</h3>
                <p>{selected?.subtitle}</p>
              </div>
            </div>

            <div className="information-card">
              <div className="information-number">
                {registeredRoles.length}
              </div>

              <div>
                <h3>Registered roles</h3>
                <p>
                  Your registered roles appear in your dashboard.
                </p>
              </div>
            </div>

            <div className="information-card action-card">
              <button onClick={handleRegister}>
                {isRegistered(selectedRole)
                  ? "Open registration"
                  : "Start registration"}
                <ArrowRight size={18} />
              </button>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default DashboardRegistration;