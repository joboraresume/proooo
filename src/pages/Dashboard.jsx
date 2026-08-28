import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [page, setPage] = useState("dashboard");

  const navigate = useNavigate();

  // Go to main dashboard
  const goDashboard = () => {
    setPage("dashboard");
  };

  // -----------------------------------------
  // FIELD PAGE
  // -----------------------------------------

  if (page === "own-land") {
    return (
      <div className="dashboard-page">

        <header className="top-header">

          <button
            className="back-button"
            onClick={() => setPage("field")}
          >
            ←
          </button>

          <h2>My Own Land</h2>

          <div className="header-bell">
            🔔
          </div>

        </header>


        <main className="sub-page">

          <h1>My Own Land</h1>

          <p className="sub-description">
            Manage and register your own agricultural land.
          </p>


          <div className="sub-options">

            {/* MY OWN LAND */}

            <button
              className="sub-option"
              onClick={() => navigate("/land-registration")}
            >

              <div className="sub-icon">
                📋
              </div>

              <div className="sub-text">
                <h3> Land Registration</h3>

                <p>
                  Register your agricultural land
                </p>
              </div>

              <span className="option-arrow">
                →
              </span>

            </button>


            {/* RENT */}

            <button
              className="sub-option"
              onClick={() => setPage("rent")}
            >

              <div className="sub-icon">
                🤝
              </div>

              <div className="sub-text">
                <h3>Rent</h3>

                <p>
                  Manage rented land
                </p>
              </div>

              <span className="option-arrow">
                →
              </span>

            </button>

          </div>

        </main>

      </div>
    );
  }


  // -----------------------------------------
  // TERRACE FARMING PAGE
  // -----------------------------------------

  if (page === "terrace") {
    return (
      <div className="dashboard-page">

        <header className="top-header">

          <button
            className="back-button"
            onClick={goDashboard}
          >
            ←
          </button>

          <h2>Terrace Farming</h2>

          <div className="header-bell">
            🔔
          </div>

        </header>


        <main className="sub-page">

          <h1>Choose an option</h1>

          <p className="sub-description">
            Select how you cultivate your terrace garden.
          </p>


          <div className="sub-options">

            {/* SOIL */}

            <button
              className="sub-option"
              onClick={() => setPage("soil")}
            >

              <div className="sub-icon">
                🌱
              </div>

              <div className="sub-text">

                <h3>
                  Cultivated in Soil
                </h3>

                <p>
                  Grow crops in soil
                </p>

              </div>

              <span className="option-arrow">
                →
              </span>

            </button>


            {/* VASE */}

            <button
              className="sub-option"
              onClick={() => setPage("vase")}
            >

              <div className="sub-icon">
                🪴
              </div>

              <div className="sub-text">

                <h3>
                  Cultivated in Vase
                </h3>

                <p>
                  Grow crops in vases / pots
                </p>

              </div>

              <span className="option-arrow">
                →
              </span>

            </button>

          </div>

        </main>

      </div>
    );
  }


  // -----------------------------------------
  // MY OWN LAND PAGE
  // -----------------------------------------

  if (page === "own-land") {
    return (
      <SimplePage
        title="My Own Land"
        icon="🌾"
        description="Register and manage your own agricultural land."
        back={() => setPage("field")}
      />
    );
  }


  // -----------------------------------------
  // RENT PAGE
  // -----------------------------------------

  if (page === "rent") {
    return (
      <SimplePage
        title="Rent"
        icon="🤝"
        description="Register and manage agricultural land taken on rent."
        back={() => setPage("field")}
      />
    );
  }


  // -----------------------------------------
  // SOIL PAGE
  // -----------------------------------------

  if (page === "soil") {
    return (
      <SimplePage
        title="Cultivated in Soil"
        icon="🌱"
        description="Manage terrace farming where crops are cultivated directly in soil."
        back={() => setPage("terrace")}
      />
    );
  }


  // -----------------------------------------
  // VASE PAGE
  // -----------------------------------------

  if (page === "vase") {
    return (
      <SimplePage
        title="Cultivated in Vase"
        icon="🪴"
        description="Manage terrace farming using vases, containers, or pots."
        back={() => setPage("terrace")}
      />
    );
  }


  // -----------------------------------------
  // FOREIGNERS PAGE
  // -----------------------------------------

  if (page === "foreigners") {
    return (
      <SimplePage
        title="Foreigners"
        icon="🌍"
        description="Agriculture information and available services for foreigners."
        back={goDashboard}
      />
    );
  }


  // -----------------------------------------
  // WORKER PAGE
  // -----------------------------------------

  if (page === "worker") {
    return (
      <SimplePage
        title="Worker"
        icon="👨‍🌾"
        description="Find agricultural work opportunities and manage worker activities."
        back={goDashboard}
      />
    );
  }


  // -----------------------------------------
  // AGRICULTURE OFFICER PAGE
  // -----------------------------------------

  if (page === "officer") {
    return (
      <SimplePage
        title="Agriculture Officer"
        icon="👮"
        description="Agricultural support, farmer assistance, and farm monitoring."
        back={goDashboard}
      />
    );
  }


  // -----------------------------------------
  // MAIN DASHBOARD
  // -----------------------------------------

  return (
    <div className="dashboard-page">

      {/* HEADER */}

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

          <span className="notification">
            🔔
          </span>

          <div className="user-profile">
            👤
          </div>

        </div>

      </header>


      {/* WELCOME */}

      <section className="welcome">

        <h1>
          Welcome to AgriSense!
        </h1>

        <p>
          Choose the option that best describes you.
        </p>

      </section>


      {/* OPTIONS */}

      <section className="dashboard-options">

        {/* FIELD */}

        <button
          className="dashboard-card"
          onClick={() => setPage("field")}
        >

          <div className="card-icon">
            🌾
          </div>

          <h3>
            Field
          </h3>

          <p>
            Manage agricultural fields
          </p>

          <span className="card-arrow">
            →
          </span>

        </button>


        {/* FOREIGNERS */}

        <button
          className="dashboard-card"
          onClick={() => setPage("foreigners")}
        >

          <div className="card-icon">
            🌍
          </div>

          <h3>
            Foreigners
          </h3>

          <p>
            Agriculture information and services
          </p>

          <span className="card-arrow">
            →
          </span>

        </button>


        {/* WORKER */}

        <button
          className="dashboard-card"
          onClick={() => setPage("worker")}
        >

          <div className="card-icon">
            👨‍🌾
          </div>

          <h3>
            Worker
          </h3>

          <p>
            Agricultural work and opportunities
          </p>

          <span className="card-arrow">
            →
          </span>

        </button>


        {/* AGRICULTURE OFFICER */}

        <button
          className="dashboard-card"
          onClick={() => setPage("officer")}
        >

          <div className="card-icon">
            👮
          </div>

          <h3>
            Agriculture Officer
          </h3>

          <p>
            Agricultural support and monitoring
          </p>

          <span className="card-arrow">
            →
          </span>

        </button>


        {/* TERRACE FARMING */}

        <button
          className="dashboard-card"
          onClick={() => setPage("terrace")}
        >

          <div className="card-icon">
            🪴
          </div>

          <h3>
            Terrace Farming
          </h3>

          <p>
            Manage terrace and home farming
          </p>

          <span className="card-arrow">
            →
          </span>

        </button>

      </section>


      {/* INFORMATION */}

      <section className="dashboard-info">

        <h2>
          Smart Farming with AgriSense
        </h2>

        <p>
          Select Field to manage agricultural land or
          choose Terrace Farming for home and terrace cultivation.
        </p>

      </section>

    </div>
  );
}


// =========================================
// REUSABLE SIMPLE PAGE
// =========================================

function SimplePage({
  title,
  icon,
  description,
  back
}) {
  return (
    <div className="dashboard-page">

      <header className="top-header">

        <button
          className="back-button"
          onClick={back}
        >
          ←
        </button>

        <h2>
          {title}
        </h2>

        <div className="header-bell">
          🔔
        </div>

      </header>


      <main className="simple-page">

        <div className="simple-icon">
          {icon}
        </div>

        <h1>
          {title}
        </h1>

        <p>
          {description}
        </p>

      </main>

    </div>
  );
}

export default Dashboard;