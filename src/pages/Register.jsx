import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  // Message states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const sendOTP = async (e) => {
    e.preventDefault();

    clearMessages();

    // Name validation
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    // Phone validation
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    // Email validation
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register/send-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            phone,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      // Backend error
      if (!response.ok) {
        setError(
          data.detail || "Unable to send OTP."
        );
        return;
      }

      // OTP sent successfully
      setSuccess("OTP has been sent to your email.");

      setStep(2);

    } catch (error) {
      console.error(error);

      setError(
        "Cannot connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();

    clearMessages();

    // OTP validation
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register/verify-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      // Incorrect OTP / backend error
      if (!response.ok) {
        setError(
          data.detail || "Incorrect OTP."
        );
        return;
      }

      // Account created successfully
      setSuccess(
        "Account created successfully!"
      );

      // Give user time to see success message
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      console.error(error);

      setError(
        "Cannot connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <h1>
          🌱 Create Account
        </h1>

        <p>
          Create your AgriSense X Pro account
        </p>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="success-message">
            ✅ {success}
          </div>
        )}

        {/* STEP 1 - REGISTRATION */}
        {step === 1 && (

          <form onSubmit={sendOTP}>

            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearMessages();
              }}
            />

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="10-digit phone number"
              maxLength="10"
              value={phone}
              onChange={(e) => {
                setPhone(
                  e.target.value.replace(/\D/g, "")
                );
                clearMessages();
              }}
            />

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearMessages();
              }}
            />

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearMessages();
              }}
            />

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearMessages();
              }}
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Sending OTP..."
                : "Create Account"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Already have an account? Login
            </button>

          </form>
        )}

        {/* STEP 2 - OTP VERIFICATION */}
        {step === 2 && (

          <form onSubmit={verifyOTP}>

            <h2>
              Verify Your Email
            </h2>

            <p>
              A 6-digit OTP was sent to:
            </p>

            <strong>
              {email}
            </strong>

            <label>
              Enter OTP
            </label>

            <input
              type="text"
              maxLength="6"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                setOtp(
                  e.target.value.replace(/\D/g, "")
                );
                clearMessages();
              }}
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Verify OTP & Create Account"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                clearMessages();
              }}
            >
              Back
            </button>

          </form>
        )}

      </div>

    </div>
  );
}

export default Register;