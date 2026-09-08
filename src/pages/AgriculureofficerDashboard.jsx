import React from "react";
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
} from "lucide-react";

import "./AgricultureOfficerDashboard.css";

const AgricultureOfficerDashboard = () => {
  return (
    <div className="officer-dashboard">

      {/* ================= SIDEBAR ================= */}

      <aside className="officer-sidebar">

        <div className="officer-brand">

          <div className="officer-logo">
            <Leaf size={27} />
          </div>

          <div>
            <h2>AgriSense</h2>
            <p>Smart Farming · Better Tomorrow</p>
          </div>

        </div>

        <nav className="officer-menu">

          <div className="officer-menu-item active">
            <Home size={19} />
            <span>Dashboard</span>
          </div>

          <div className="officer-menu-item">
            <Map size={19} />
            <span>Land Registration</span>
          </div>

          <div className="officer-menu-item">
            <Users size={19} />
            <span>Farmers</span>
          </div>

          <div className="officer-menu-item">
            <FileText size={19} />
            <span>Reports</span>
          </div>

          <div className="officer-menu-item">
            <Activity size={19} />
            <span>Disease Monitoring</span>
          </div>

          <div className="officer-menu-item">
            <Sprout size={19} />
            <span>Soil & Crop Analysis</span>
          </div>

          <div className="officer-menu-item">
            <Settings size={19} />
            <span>Settings</span>
          </div>

        </nav>

        <div className="officer-logout">
          <LogOut size={19} />
          <span>Logout</span>
        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="officer-main">

        {/* HEADER */}

        <header className="officer-header">

          <div>

            <h1>Agriculture Officer Dashboard</h1>

            <p>
              Monitor farms, support farmers, and ensure sustainable agriculture.
            </p>

          </div>

          <div className="officer-header-right">

            <div className="officer-notification">

              <Bell size={20} />

              <span>3</span>

            </div>

            <div className="officer-profile">

              <div className="officer-avatar">
                <UsersRound size={19} />
              </div>

              <div className="officer-profile-info">

                <strong>Anitha S</strong>

                <small>Agriculture Officer</small>

              </div>

              <ChevronDown size={16} />

            </div>

          </div>

        </header>

        {/* ================= STAT CARDS ================= */}

        <section className="officer-stats">

          {/* TOTAL FARMERS */}

          <div className="officer-stat-card green-stat">

            <div className="officer-stat-icon green-stat-icon">
              <UsersRound size={23} />
            </div>

            <div className="officer-stat-content">

              <span>Total Farmers</span>

              <strong>248</strong>

              <small>+12 this month</small>

            </div>

          </div>

          {/* REGISTERED LANDS */}

          <div className="officer-stat-card blue-stat">

            <div className="officer-stat-icon blue-stat-icon">
              <BookOpen size={23} />
            </div>

            <div className="officer-stat-content">

              <span>Registered Lands</span>

              <strong>186</strong>

              <small>+8 this month</small>

            </div>

          </div>

          {/* ACTIVE FIELDS */}

          <div className="officer-stat-card yellow-stat">

            <div className="officer-stat-icon yellow-stat-icon">
              <Leaf size={23} />
            </div>

            <div className="officer-stat-content">

              <span>Active Fields</span>

              <strong>142</strong>

              <small>+5 this month</small>

            </div>

          </div>

          {/* ISSUES */}

          <div className="officer-stat-card purple-stat">

            <div className="officer-stat-icon purple-stat-icon">
              <TriangleAlert size={23} />
            </div>

            <div className="officer-stat-content">

              <span>Issues Reported</span>

              <strong>7</strong>

              <small>Needs Attention</small>

            </div>

          </div>

        </section>

        {/* ================= FIRST ROW ================= */}

        <section className="officer-content-row">

          {/* CROP HEALTH */}

          <div className="officer-panel crop-health-panel">

            <div className="officer-panel-header">

              <h2>Crop Health Overview</h2>

              <select>
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>Last 3 Months</option>
              </select>

            </div>

            <div className="crop-health-content">

              <div className="donut-chart">

                <div className="donut-inner">

                  <strong>78%</strong>

                  <span>Healthy Crops</span>

                </div>

              </div>

              <div className="crop-legend">

                <div>
                  <span className="legend-dot healthy"></span>
                  <span>Healthy</span>
                  <strong>78%</strong>
                </div>

                <div>
                  <span className="legend-dot moderate"></span>
                  <span>Moderate</span>
                  <strong>15%</strong>
                </div>

                <div>
                  <span className="legend-dot risk"></span>
                  <span>At Risk</span>
                  <strong>7%</strong>
                </div>

              </div>

            </div>

          </div>

          {/* DISEASE ALERTS */}

          <div className="officer-panel disease-panel">

            <div className="officer-panel-header">

              <h2>Recent Disease Alerts</h2>

              <button>View All</button>

            </div>

            <div className="disease-list">

              <div className="disease-item">

                <div className="disease-icon red-disease">
                  <Sprout size={19} />
                </div>

                <div className="disease-info">

                  <strong>Rice Leaf Blast</strong>

                  <span>Field 3 · Kottarakkara</span>

                </div>

                <div className="disease-right">

                  <span className="high-badge">High</span>

                  <small>2 days ago</small>

                </div>

              </div>

              <div className="disease-item">

                <div className="disease-icon green-disease">
                  <Leaf size={19} />
                </div>

                <div className="disease-info">

                  <strong>Tomato Early Blight</strong>

                  <span>Field 7 · Chengannur</span>

                </div>

                <div className="disease-right">

                  <span className="medium-badge">Medium</span>

                  <small>3 days ago</small>

                </div>

              </div>

              <div className="disease-item">

                <div className="disease-icon yellow-disease">
                  <Sprout size={19} />
                </div>

                <div className="disease-info">

                  <strong>Maize Fall Armyworm</strong>

                  <span>Field 12 · Mavelikkara</span>

                </div>

                <div className="disease-right">

                  <span className="medium-badge">Medium</span>

                  <small>4 days ago</small>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ================= SECOND ROW ================= */}

        <section className="officer-content-row second-row">

          {/* SOIL WEATHER */}

          <div className="officer-panel soil-panel">

            <div className="officer-panel-header">

              <h2>Soil & Weather Summary</h2>

            </div>

            <div className="soil-summary-grid">

              <div className="soil-item">

                <div className="soil-item-icon temperature">
                  <Thermometer size={20} />
                </div>

                <span>Avg. Temperature</span>

                <strong>28.4°C</strong>

              </div>

              <div className="soil-item">

                <div className="soil-item-icon humidity">
                  <Droplets size={20} />
                </div>

                <span>Avg. Humidity</span>

                <strong>71%</strong>

              </div>

              <div className="soil-item">

                <div className="soil-item-icon ph">
                  <FlaskConical size={20} />
                </div>

                <span>Avg. Soil pH</span>

                <strong>6.7</strong>

              </div>

              <div className="soil-item">

                <div className="soil-item-icon moisture">
                  <Leaf size={20} />
                </div>

                <span>Avg. Moisture</span>

                <strong>62%</strong>

              </div>

            </div>

          </div>

          {/* QUICK ACTIONS */}

          <div className="officer-panel quick-panel">

            <div className="officer-panel-header">

              <h2>Quick Actions</h2>

            </div>

            <div className="quick-actions">

              <button className="quick-action green-action">

                <Map size={17} />

                <span>View Land Details</span>

              </button>

              <button className="quick-action green-action">

                <FileText size={17} />

                <span>Generate Report</span>

              </button>

              <button className="quick-action blue-action">

                <ShieldAlert size={17} />

                <span>Check Disease Alerts</span>

              </button>

              <button className="quick-action blue-action">

                <Send size={17} />

                <span>Send Advisory</span>

              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default AgricultureOfficerDashboard;