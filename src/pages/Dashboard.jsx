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
  LogOut,
  LayoutDashboard,
  Mountain,
  X,
} from "lucide-react";

import "./Dashboard.css";

const API_BASE = (
  import.meta?.env?.VITE_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

const roleConfig = [
  {
    id: "cultivated-land",
    name: "Cultivated on Land",
    description: "Manage agricultural land and farming activities",
    icon: LandPlot,
    className: "earth",
    isCategory: true,
    subRoles: ["farmer", "rented"],
  },

  {
    id: "farmer",
    name: "Farmer",
    description: "Farming activities and crop management",
    icon: Sprout,
    registration: "/farmer-registration",
    dashboard: "/farmer-dashboard",
    className: "green",
    parentCategory: "cultivated-land",
  },

  {
    id: "rented",
    name: "Rented",
    description: "Land registration and land monitoring",
    icon: LandPlot,
    registration: "/land-registration",
    dashboard: "/land-dashboard",
    className: "earth",
    parentCategory: "cultivated-land",
  },

  {
    id: "terrace-farming",
    name: "Terrace Farming",
    description: "Sustainable farming on terraced landscapes",
    icon: Mountain,
    className: "teal",
    isCategory: true,
    subRoles: ["cultivated-waste", "cultivated-soil"],
  },

  {
    id: "cultivated-waste",
    name: "Cultivated on Waste",
    description: "Utilization of waste land for agriculture",
    icon: Sprout,
    registration: "/terrace-farming",
    dashboard: "/terrace-dashboard",
    className: "yellow",
    parentCategory: "terrace-farming",
  },

  {
    id: "cultivated-soil",
    name: "Cultivated on Soil",
    description: "Traditional soil-based cultivation",
    icon: Sprout,
    registration: "/terrace-farming",
    dashboard: "/terrace-dashboard",
    className: "brown",
    parentCategory: "terrace-farming",
  },

  {
    id: "worker",
    name: "Agricultural Worker",
    description: "Agricultural work and opportunities",
    icon: HardHat,
    registration: "/worker-registration",
    dashboard: "/worker-dashboard",
    className: "orange",
  },

  {
    id: "foreigner",
    name: "Foreigner",
    description: "Agricultural opportunities and services",
    icon: Globe2,
    registration: "/foreigner-registration",
    dashboard: "/foreign-dashboard",
    className: "blue",
  },

  {
    id: "officer",
    name: "Agriculture Officer",
    description: "Agricultural administration and monitoring",
    icon: ShieldCheck,
    registration: "/agriculture-officer-registration",
    dashboard: "/agriculture-officer-dashboard",
    className: "purple",
  },
];

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [modalCategory, setModalCategory] = useState(null);

  // =========================================================
  // LOAD USER
  // =========================================================

  useEffect(() => {
    try {
      const savedUser = JSON.parse(
        localStorage.getItem("agrisenseUser") || "null"
      );

      setUser(savedUser);

      if (savedUser?.id) {
        loadProfiles(savedUser.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Unable to read user:", error);
      setLoading(false);
    }
  }, []);

  // =========================================================
  // LOAD PROFILES FROM BACKEND
  // =========================================================

  const loadProfiles = async (userId) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/profiles/${userId}`
      );

      if (response.ok) {
        const data = await response.json();

        console.log("Profile API response:", data);

        /*
         * Backend may return:
         *
         * 1. Object:
         * {
         *   farmer: true,
         *   agriculture_officer: true
         * }
         *
         * OR
         *
         * 2. Array:
         * [
         *   { role: "agriculture_officer" }
         * ]
         */

        const normalizedProfiles = {};

        // -----------------------------------------------------
        // CASE 1: Object response
        // -----------------------------------------------------

        if (
          typeof data === "object" &&
          data !== null &&
          !Array.isArray(data)
        ) {
          if (data.farmer) {
            normalizedProfiles.farmer = true;
          }

          if (data.landowner || data.rented) {
            normalizedProfiles.rented = true;
          }

          if (data.foreigner) {
            normalizedProfiles.foreigner = true;
          }

          if (data.worker) {
            normalizedProfiles.worker = true;
          }

          // IMPORTANT:
          // Backend may call it agriculture_officer
          // while frontend role is officer.

          if (
            data.agriculture_officer ||
            data.agricultureOfficer ||
            data.officer
          ) {
            normalizedProfiles.officer = true;
            normalizedProfiles.agriculture_officer = true;
          }

          if (data.terrace) {
            normalizedProfiles.terrace = true;
          }

          if (data["cultivated-waste"]) {
            normalizedProfiles["cultivated-waste"] = true;
          }

          if (data["cultivated-soil"]) {
            normalizedProfiles["cultivated-soil"] = true;
          }
        }

        // -----------------------------------------------------
        // CASE 2: Array response
        // -----------------------------------------------------

        if (Array.isArray(data)) {
          data.forEach((profile) => {
            if (!profile) return;

            const role =
              profile.role ||
              profile.role_id ||
              profile.roleId ||
              profile.profile_type ||
              profile.type;

            if (!role) return;

            if (role === "farmer") {
              normalizedProfiles.farmer = true;
            }

            if (
              role === "rented" ||
              role === "landowner" ||
              role === "land_owner"
            ) {
              normalizedProfiles.rented = true;
            }

            if (role === "foreigner") {
              normalizedProfiles.foreigner = true;
            }

            if (role === "worker" || role === "agricultural_worker") {
              normalizedProfiles.worker = true;
            }

            if (
              role === "officer" ||
              role === "agriculture_officer" ||
              role === "agriculture-officer"
            ) {
              normalizedProfiles.officer = true;
              normalizedProfiles.agriculture_officer = true;
            }

            if (
              role === "terrace" ||
              role === "terrace-farming"
            ) {
              normalizedProfiles.terrace = true;
            }
          });
        }

        // -----------------------------------------------------
        // Keep local officer registration as a fallback
        // -----------------------------------------------------

        if (
          localStorage.getItem(
            "agricultureOfficerRegistered"
          ) === "true"
        ) {
          normalizedProfiles.officer = true;
          normalizedProfiles.agriculture_officer = true;
        }

        console.log(
          "Normalized profiles:",
          normalizedProfiles
        );

        // Keep farmer registered when local multi-fields still exist
        try {
          const farmerFieldsRaw = localStorage.getItem(
            "agrisenseFarmerFields"
          );
          if (farmerFieldsRaw) {
            const farmerBundle = JSON.parse(farmerFieldsRaw);
            if (
              String(farmerBundle?.userId) === String(userId) &&
              Array.isArray(farmerBundle.fields) &&
              farmerBundle.fields.length > 0
            ) {
              normalizedProfiles.farmer = true;
            }
          }
        } catch {
          /* ignore */
        }

        setProfiles(normalizedProfiles);

        localStorage.setItem(
          "agrisenseProfiles",
          JSON.stringify(normalizedProfiles)
        );

        setLoading(false);

        return;
      }

      console.warn(
        "Profile API returned status:",
        response.status
      );
    } catch (error) {
      console.warn(
        "Unable to load profiles from server. Using local profile data.",
        error
      );
    }

    // =========================================================
    // FALLBACK TO LOCAL STORAGE
    // =========================================================

    try {
      const localProfiles = JSON.parse(
        localStorage.getItem("agrisenseProfiles") || "{}"
      );

      const normalizedLocalProfiles = {};

      if (
        localProfiles &&
        typeof localProfiles === "object" &&
        !Array.isArray(localProfiles)
      ) {
        Object.keys(localProfiles).forEach((key) => {
          if (localProfiles[key] === true) {
            normalizedLocalProfiles[key] = true;
          }
        });
      }

      // Officer fallback
      if (
        localStorage.getItem(
          "agricultureOfficerRegistered"
        ) === "true"
      ) {
        normalizedLocalProfiles.officer = true;
        normalizedLocalProfiles.agriculture_officer = true;
      }

      try {
        const farmerFieldsRaw = localStorage.getItem(
          "agrisenseFarmerFields"
        );
        if (farmerFieldsRaw) {
          const farmerBundle = JSON.parse(farmerFieldsRaw);
          if (
            Array.isArray(farmerBundle.fields) &&
            farmerBundle.fields.length > 0
          ) {
            normalizedLocalProfiles.farmer = true;
          }
        }
      } catch {
        /* ignore */
      }

      setProfiles(normalizedLocalProfiles);
    } catch (error) {
      console.error(
        "Unable to read local profile data:",
        error
      );

      setProfiles({});
    }

    setLoading(false);
  };

  // =========================================================
  // CHECK IF ROLE IS REGISTERED
  // =========================================================

  const getProfileForRole = (roleId) => {
    /*
     * Agriculture Officer special handling.
     *
     * Frontend:
     *    officer
     *
     * Backend:
     *    agriculture_officer
     */

    if (roleId === "officer") {
      return (
        profiles.officer === true ||
        profiles.agriculture_officer === true ||
        localStorage.getItem(
          "agricultureOfficerRegistered"
        ) === "true"
      );
    }

    return profiles[roleId] === true;
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    localStorage.removeItem("agrisenseUser");
    localStorage.removeItem("agrisenseRole");

    navigate("/login");
  };

  // =========================================================
  // GO TO REGISTRATION PAGE
  // =========================================================

  const goToRegistration = () => {
    navigate("/dashboard-registration");
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="dashboard-page">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#06473b",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          Loading your AgriSense dashboard...
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="dashboard-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="dashboard-header">

        <div className="brand">

          <div className="brand-logo">
            🌱
          </div>

          <div>
            <h2>AgriSense</h2>

            <span>
              Smart Agriculture
            </span>
          </div>

        </div>

        <div className="header-right">

          {/* ================================================
              AGRICULTURE OFFICER QUICK ACCESS
          ================================================= */}

          {getProfileForRole("officer") && (
            <button
              type="button"
              className="show-dashboard-btn"
              onClick={() =>
                navigate(
                  "/agriculture-officer-dashboard"
                )
              }
            >
              🌿 Officer Dashboard
            </button>
          )}

          {/* ================================================
              SHOW DASHBOARD BUTTON
          ================================================= */}

          <button
            type="button"
            className="show-dashboard-btn"
            onClick={() =>
              setShowDashboard(!showDashboard)
            }
          >
            {showDashboard
              ? "← Role Selection"
              : "Show Dashboard"}
          </button>

          {/* ================================================
              USER
          ================================================= */}

          <div className="user-profile">

            <span>
              {user?.name ||
                user?.phone ||
                "User"}
            </span>

            <span>
              👤
            </span>

          </div>

          {/* ================================================
              LOGOUT
          ================================================= */}

          <button
            type="button"
            className="logout-button"
            onClick={logout}
            title="Logout"
          >
            <LogOut size={18} />
          </button>

        </div>

      </header>

      {/* =====================================================
          ROLE SELECTION
      ===================================================== */}

      {!showDashboard && (

        <section className="role-selection-section">

          <div className="role-selection-header">

            <p className="role-eyebrow">
              AGRISENSE · ROLES
            </p>

            <h1>
              Choose your role
            </h1>

            <p>
              Pick a path to register, or open a
              dashboard you already use.
            </p>

          </div>

          <div className="role-selection-grid">

            {roleConfig
              .filter(
                (role) => !role.parentCategory
              )
              .map((role) => {

                const registered =
                  getProfileForRole(role.id);

                const Icon = role.icon;

                // =================================================
                // CATEGORY CARD
                // =================================================

                if (role.isCategory) {

                  return (
                    <article
                      key={role.id}
                      className="role-card category-card"
                      onClick={() =>
                        setModalCategory(role)
                      }
                    >

                      <div className="role-card-top">

                        <div
                          className={`role-card-icon ${role.className}`}
                        >
                          <Icon size={24} />
                        </div>

                      </div>

                      <div className="role-card-content">

                        <h3>
                          {role.name}
                        </h3>

                        <p>
                          {role.description}
                        </p>

                      </div>

                      <div className="role-card-footer">

                        <button
                          type="button"
                          className="view-options-btn"
                          onClick={(event) => {
                            event.stopPropagation();
                            setModalCategory(role);
                          }}
                        >
                          View options
                          <ArrowRight size={17} />
                        </button>

                      </div>

                    </article>
                  );
                }

                // =================================================
                // NORMAL ROLE CARD
                // =================================================

                return (
                  <article
                    key={role.id}
                    className={`role-card ${
                      registered
                        ? "registered"
                        : "not-registered"
                    }`}
                  >

                    <div className="role-card-top">

                      <div
                        className={`role-card-icon ${role.className}`}
                      >
                        <Icon size={24} />
                      </div>

                      {registered && (

                        <span
                          className="status-dot registered"
                          title="Registered"
                          aria-label="Registered"
                        >
                          <CheckCircle2 size={14} />
                        </span>

                      )}

                    </div>

                    <div className="role-card-content">

                      <h3>
                        {role.name}
                      </h3>

                      <p>
                        {role.description}
                      </p>

                    </div>

                    <div className="role-card-footer">

                      {registered ? (

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              role.dashboard
                            )
                          }
                        >
                          {role.id === "farmer"
                            ? "Go to dashboard"
                            : "Open dashboard"}
                          <ArrowRight size={17} />
                        </button>

                      ) : (

                        <button
                          type="button"
                          className="register-role"
                          onClick={() =>
                            navigate(
                              role.registration
                            )
                          }
                        >
                          Register this role
                          <ArrowRight size={17} />
                        </button>

                      )}

                    </div>

                  </article>
                );
              })}

          </div>

        </section>
      )}

      {/* =====================================================
          DASHBOARD VIEW
      ===================================================== */}

      {showDashboard && (

        <section className="dashboard-view-section">

          <div className="dashboard-header-content">

            <h1>
              Your Dashboard
            </h1>

            <p>
              Manage your registered roles and
              access your dashboards
            </p>

          </div>

          <div className="registered-roles-grid">

            {roleConfig.map((role) => {

              const registered =
                getProfileForRole(role.id);

              if (!registered) {
                return null;
              }

              /*
               * Category cards such as cultivated-land
               * do not have their own dashboard.
               *
               * We therefore don't show category-only
               * cards here.
               */

              if (role.isCategory) {
                return null;
              }

              const Icon = role.icon;

              return (
                <div
                  key={role.id}
                  className="registered-role-card"
                  onClick={() =>
                    navigate(role.dashboard)
                  }
                >

                  <div
                    className={`role-icon ${role.className}`}
                  >
                    <Icon size={32} />
                  </div>

                  <h3>
                    {role.name}
                  </h3>

                  <p>
                    View your{" "}
                    {role.name.toLowerCase()}{" "}
                    dashboard
                  </p>

                  <div className="role-arrow">
                    <ArrowRight size={20} />
                  </div>

                </div>
              );
            })}

          </div>

          {/* =================================================
              NO REGISTERED ROLES
          ================================================= */}

          {roleConfig.filter(
            (role) =>
              !role.isCategory &&
              getProfileForRole(role.id)
          ).length === 0 && (

            <div className="no-roles-message">

              <p>
                You haven't registered for
                any roles yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowDashboard(false)
                }
              >
                Register a Role
              </button>

            </div>

          )}

        </section>
      )}

      {/* =====================================================
          DASHBOARD BOTTOM CARD
      ===================================================== */}

      {showDashboard && (

        <section className="dashboard-bottom">

          <div className="dashboard-info-card">

            <div className="info-card-icon">

              <LayoutDashboard size={23} />

            </div>

            <div>

              <h3>
                Need another role?
              </h3>

              <p>
                You can register multiple roles
                and access each dashboard
                independently.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setShowDashboard(false)
              }
            >
              Explore roles

              <ArrowRight size={17} />

            </button>

          </div>

        </section>
      )}

      {/* =====================================================
          CATEGORY MODAL
      ===================================================== */}

      {modalCategory && (

        <div
          className="modal-overlay"
          onClick={() =>
            setModalCategory(null)
          }
        >

          <div
            className="modal-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =============================================
                MODAL HEADER
            ============================================== */}

            <div className="modal-header">

              <div className="modal-title">

                <div
                  className={`modal-icon ${modalCategory.className}`}
                >
                  {React.createElement(
                    modalCategory.icon,
                    { size: 28 }
                  )}
                </div>

                <div>

                  <h2>
                    {modalCategory.name}
                  </h2>

                  <p>
                    {modalCategory.description}
                  </p>

                </div>

              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setModalCategory(null)
                }
              >
                <X size={24} />
              </button>

            </div>

            {/* =============================================
                MODAL BODY
            ============================================== */}

            <div className="modal-body">

              <div className="modal-sub-roles">

                {roleConfig
                  .filter(
                    (subRole) =>
                      subRole.parentCategory ===
                      modalCategory.id
                  )
                  .map((subRole) => {

                    const subRegistered =
                      getProfileForRole(
                        subRole.id
                      );

                    const SubIcon =
                      subRole.icon;

                    return (
                      <article
                        key={subRole.id}
                        className={`modal-sub-role-card ${
                          subRegistered
                            ? "registered"
                            : "not-registered"
                        }`}
                      >

                        <div
                          className={`modal-sub-role-icon ${subRole.className}`}
                        >
                          <SubIcon size={24} />
                        </div>

                        <div className="modal-sub-role-content">

                          <h3>
                            {subRole.name}
                          </h3>

                          <p>
                            {subRole.description}
                          </p>

                          {subRegistered ? (

                            <span className="status-badge registered-badge">

                              <CheckCircle2
                                size={12}
                              />

                              Registered

                            </span>

                          ) : (

                            <span className="status-badge">
                              Not registered
                            </span>

                          )}

                        </div>

                        <div className="modal-sub-role-action">

                          {subRegistered ? (

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  subRole.dashboard
                                )
                              }
                            >
                              {subRole.id === "farmer"
                                ? "Go to dashboard"
                                : "Open dashboard"}
                              <ArrowRight
                                size={16}
                              />
                            </button>

                          ) : (

                            <button
                              type="button"
                              className="register-role"
                              onClick={() =>
                                navigate(
                                  subRole.registration
                                )
                              }
                            >
                              Register
                              <ArrowRight
                                size={16}
                              />
                            </button>

                          )}

                        </div>

                      </article>
                    );
                  })}

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Dashboard;