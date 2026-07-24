import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* Navigation Bar */}
      <header className="navbar">

        <div className="logo">
          🌱 AgriSense X Pro
        </div>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>

        <button
          className="nav-login-button"
          onClick={() => navigate("/login")}
        >
          Login
        </button>

      </header>


      {/* Main Landing Section */}
      <main className="landing-content">

        {/* Left Side */}
        <div className="landing-text">

          <div className="tagline">
            🌱 Smart Farming, Better Future
          </div>

          <h1>
            AI-Powered
            <br />

            Agriculture for a
            <br />

            <span>Sustainable Future</span>
          </h1>

          <p>
            Empowering farmers, land owners, workers and home gardeners
            with smart insights, real-time data and intelligent assistance.
          </p>


          {/* Buttons */}
          <div className="button-group">

            <button
              className="get-started"
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>

            <button
              className="learn-more"
              onClick={() =>
                alert("More features coming soon!")
              }
            >
              Learn More
            </button>

          </div>

        </div>


        {/* Right Side Image */}
        <div className="landing-image">

          <img
            src="/image.png"
            alt="AgriSense Smart Farming"
          />

        </div>

      </main>


      {/* Features Section */}
      <section
        id="features"
        className="features-section"
      >

        <h2>
          Smart Agriculture Features
        </h2>

        <div className="feature-cards">

          <div className="feature-card">
            <h3>🤖 AI Farming</h3>
            <p>
              AI-powered crop recommendation and plant disease detection.
            </p>
          </div>

          <div className="feature-card">
            <h3>💧 Smart Irrigation</h3>
            <p>
              Monitor soil moisture and automatically control irrigation.
            </p>
          </div>

          <div className="feature-card">
            <h3>🦌 Wildlife Detection</h3>
            <p>
              Detect animals entering farms using AI cameras.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default LandingPage;