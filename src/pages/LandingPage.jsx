import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "What is AgriSense?",
      answer:
        "AgriSense is a smart agriculture platform that helps farmers manage their agricultural land, monitor crops, access weather information, view market prices, and use intelligent farming services."
    },
    {
      question: "Who can use AgriSense?",
      answer:
        "AgriSense is designed for farmers, land owners, workers, foreigners involved in agriculture, agriculture officers, and terrace farming users."
    },
    {
      question: "How can I register my land?",
      answer:
        "After logging in, select Field, choose My Own Land, and then select Land Registration. You can enter your land details and location information through the registration page."
    },
    {
      question: "Can I register rented land?",
      answer:
        "Yes. Select Field from the dashboard and then choose Rent. The rented-land option can be used to manage agricultural land that you cultivate through a rental arrangement."
    },
    {
      question: "What happens after my land is registered?",
      answer:
        "After successful land registration, you can access your registered land dashboard. It provides an overview of your land and allows you to access land details, location, documents, editing options, and account settings."
    },
    {
      question: "Can I edit my registered land details?",
      answer:
        "Yes. From the registered land dashboard, select Edit Land to update the available land information."
    },
    {
      question: "Does AgriSense provide weather information?",
      answer:
        "Yes. The agriculture dashboard can provide weather-related information that can help farmers make better decisions for cultivation and farm activities."
    },
    {
      question: "Can I check crop diseases?",
      answer:
        "AgriSense is designed to provide disease detection features that can help identify possible crop diseases using intelligent analysis."
    },
    {
      question: "Can I check agricultural market prices?",
      answer:
        "Yes. The platform includes a Market Price feature where users can access agricultural commodity price information."
    },
    {
      question: "What is Terrace Farming in AgriSense?",
      answer:
        "Terrace Farming is a separate option for users who grow plants on terraces. It provides two choices: Cultivated in Soil and Cultivated in Vase."
    }
  ];

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="landing-page">

      {/* ================= HEADER ================= */}
      <header className="landing-header">

        <div className="landing-logo">
          <span className="logo-icon">🌱</span>
          <span>AgriSense</span>
        </div>

        <nav className="landing-nav">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-buttons">
          <button
            className="login-button"
            onClick={goToLogin}
          >
            Login
          </button>

          <button
            className="signup-button"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>

      </header>


      {/* ================= HERO ================= */}
      <section className="hero-section" id="home">

        <div className="hero-content">

          <div className="hero-text">

            <span className="hero-tag">
              🌾 SMART AGRICULTURE PLATFORM
            </span>

            <h1>
              Smart Farming for a
              <span> Better Future</span>
            </h1>

            <p>
              AgriSense connects farmers, land owners, workers and
              agriculture officers through a smart digital agriculture
              platform.
            </p>

            <div className="hero-buttons">

              <button
                className="primary-button"
                onClick={goToLogin}
              >
                Get Started →
              </button>

              <a
                href="#features"
                className="secondary-button"
              >
                Explore Features
              </a>

            </div>

          </div>


          <div className="hero-visual">

            <div className="hero-card main-card">

              <div className="card-header">
                <span>🌱</span>
                <strong>AgriSense</strong>
                <span>🔔</span>
              </div>

              <div className="welcome-box">
                <h3>Welcome to AgriSense!</h3>
                <p>
                  Choose the option that best describes you.
                </p>
              </div>

              <div className="role-grid">

                <div className="role-card">
                  <span>🌾</span>
                  <strong>Field</strong>
                </div>

                <div className="role-card">
                  <span>🌍</span>
                  <strong>Foreigners</strong>
                </div>

                <div className="role-card">
                  <span>👨‍🌾</span>
                  <strong>Worker</strong>
                </div>

                <div className="role-card">
                  <span>👮</span>
                  <strong>Agriculture Officer</strong>
                </div>

                <div className="role-card">
                  <span>🪴</span>
                  <strong>Terrace Farming</strong>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section className="features-section" id="features">

        <div className="section-heading">

          <span>OUR FEATURES</span>

          <h2>
            Everything You Need for
            <strong> Smart Farming</strong>
          </h2>

          <p>
            AgriSense brings essential agricultural services together
            in one platform.
          </p>

        </div>


        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">🌾</div>
            <h3>Land Management</h3>
            <p>
              Register, manage and monitor your agricultural land
              digitally.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📡</div>
            <h3>Sensor Monitoring</h3>
            <p>
              Monitor important farm conditions using smart sensors.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🩺</div>
            <h3>Disease Detection</h3>
            <p>
              Detect possible crop diseases using intelligent analysis.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">☁️</div>
            <h3>Weather Information</h3>
            <p>
              Access weather information useful for agricultural
              planning.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Market Prices</h3>
            <p>
              View agricultural market price information and trends.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Land Location</h3>
            <p>
              Manage your registered land location and geographical
              information.
            </p>
          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="how-section" id="about">

        <div className="section-heading">

          <span>HOW IT WORKS</span>

          <h2>
            Start Using <strong>AgriSense</strong>
          </h2>

        </div>


        <div className="steps-container">

          <div className="step-card">

            <div className="step-number">01</div>

            <div className="step-icon">🔐</div>

            <h3>Create an Account</h3>

            <p>
              Register and securely log in to the AgriSense platform.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="step-card">

            <div className="step-number">02</div>

            <div className="step-icon">👨‍🌾</div>

            <h3>Select Your Role</h3>

            <p>
              Choose Field, Worker, Foreigner, Agriculture Officer or
              Terrace Farming.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="step-card">

            <div className="step-number">03</div>

            <div className="step-icon">🌱</div>

            <h3>Use Smart Services</h3>

            <p>
              Access land management, monitoring and agricultural
              information.
            </p>

          </div>

        </div>

      </section>


      {/* ================= FIELD FLOW ================= */}
      <section className="flow-section">

        <div className="section-heading">

          <span>LAND MANAGEMENT</span>

          <h2>
            Simple <strong>Land Registration</strong>
          </h2>

          <p>
            Manage your own agricultural land through a simple
            navigation flow.
          </p>

        </div>


        <div className="flow-container">

          <div className="flow-box">
            <div className="flow-icon">🏠</div>
            <h3>Dashboard</h3>
            <p>Select Field</p>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-box">
            <div className="flow-icon">🌾</div>
            <h3>Field</h3>
            <p>Choose an option</p>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-box">
            <div className="flow-icon">📋</div>
            <h3>My Own Land</h3>
            <p>Land Registration</p>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-box">
            <div className="flow-icon">📊</div>
            <h3>Dashboard 2</h3>
            <p>Registered Land Overview</p>
          </div>

        </div>


        <div className="alternative-flow">

          <div>
            <span>Field</span>
            <strong>→ My Own Land → Land Registration</strong>
          </div>

          <div>
            <span>Field</span>
            <strong>→ Rent → Rent Land Management</strong>
          </div>

          <div>
            <span>Terrace Farming</span>
            <strong>→ Soil / Vase</strong>
          </div>

        </div>

      </section>


      {/* ================= FAQ ================= */}
      <section className="faq-section" id="faq">

        <div className="faq-heading">

          <span>FAQ</span>

          <h2>
            Frequently Asked
            <strong> Questions</strong>
          </h2>

          <p>
            Find answers to common questions about AgriSense.
          </p>

        </div>


        <div className="faq-container">

          {faqs.map((faq, index) => (

            <div
              className={`faq-item ${
                openFAQ === index ? "faq-open" : ""
              }`}
              key={index}
            >

              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >

                <span>
                  {faq.question}
                </span>

                <span className="faq-plus">
                  {openFAQ === index ? "−" : "+"}
                </span>

              </button>


              {openFAQ === index && (

                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>

              )}

            </div>

          ))}

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="cta-section">

        <div className="cta-content">

          <span>🌱 AGRISENSE</span>

          <h2>
            Ready to make farming smarter?
          </h2>

          <p>
            Join AgriSense and manage your agricultural activities
            through one smart platform.
          </p>

          <button
            className="cta-button"
            onClick={goToLogin}
          >
            Get Started →
          </button>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="landing-footer" id="contact">

        <div className="footer-main">

          <div className="footer-brand">

            <div className="footer-logo">
              🌱 AgriSense
            </div>

            <p>
              Smart agriculture solutions for a better and more
              sustainable future.
            </p>

          </div>


          <div className="footer-column">

            <h3>AgriSense</h3>

            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#faq">FAQ</a>

          </div>


          <div className="footer-column">

            <h3>Services</h3>

            <a href="#features">Land Management</a>
            <a href="#features">Sensor Monitoring</a>
            <a href="#features">Disease Detection</a>
            <a href="#features">Market Prices</a>

          </div>


          <div className="footer-column">

            <h3>Contact</h3>

            <p>📧 support@agrisense.com</p>
            <p>📍 Kerala, India</p>

          </div>

        </div>


        <div className="footer-bottom">

          <p>
            © 2026 AgriSense. All rights reserved.
          </p>

          <div>
            <a href="#home">Privacy Policy</a>
            <a href="#home">Terms</a>
          </div>

        </div>

      </footer>

    </div>
  );
}

export default LandingPage;