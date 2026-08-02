import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  return (
    <div className="dashboard">

      <div className="dashboard-header">

        <div>
          <h1>🌱 AgriSense X Pro</h1>
          <p>Smart Agriculture Dashboard</p>
        </div>

        <button
          className="logout-btn"
          onClick={() => navigate("/")}
        >
          Logout
        </button>

      </div>


      <div className="welcome">

        <h2>Welcome to AgriSense X Pro 👋</h2>

        <p>
          Manage your farm and use smart agriculture tools.
        </p>

      </div>


      {/* Dashboard Buttons */}

      <div className="dashboard-grid">


        {/* 1. FARM */}

        <div className="dashboard-card">

          <div className="card-icon">
            🌾
          </div>

          <h3>Farm</h3>

          <p>
            Manage your farm activities.
          </p>

          <button
            onClick={() => alert("Farm page coming soon")}
          >
            Open Farm →
          </button>

        </div>


        {/* 2. LAND REGISTRATION - SEPARATE */}

        <div
          className="dashboard-card clickable"
          onClick={() =>
            navigate("/land-registration")
          }
        >

          <div className="card-icon">
            📋
          </div>

          <h3>Land Registration</h3>

          <p>
            Register and manage your agricultural land.
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/land-registration");
            }}
          >
            Register Land →
          </button>

        </div>


        {/* 3. CROPS */}

        <div className="dashboard-card">

          <div className="card-icon">
            🌱
          </div>

          <h3>Crops</h3>

          <p>
            Manage your crops and cultivation.
          </p>

          <button>
            View Crops →
          </button>

        </div>


        {/* 4. SMART IRRIGATION */}

        <div className="dashboard-card">

          <div className="card-icon">
            💧
          </div>

          <h3>Smart Irrigation</h3>

          <p>
            Monitor soil moisture and irrigation.
          </p>

          <button>
            Open Irrigation →
          </button>

        </div>


        {/* 5. AI ASSISTANT */}

        <div className="dashboard-card">

          <div className="card-icon">
            🤖
          </div>

          <h3>AI Assistant</h3>

          <p>
            Get smart recommendations for farming.
          </p>

          <button>
            Open AI →
          </button>

        </div>


      </div>


      {/* Live Farm Status */}

      <div className="sensor-section">

        <h2>Live Farm Status</h2>

        <div className="sensor-grid">

          <div>
            💧
            <strong>Soil Moisture</strong>
            <span>32%</span>
          </div>

          <div>
            🌡️
            <strong>Temperature</strong>
            <span>29°C</span>
          </div>

          <div>
            🌿
            <strong>Plant Health</strong>
            <span>Good</span>
          </div>

          <div>
            🦌
            <strong>Wildlife</strong>
            <span>No Animal Detected</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;