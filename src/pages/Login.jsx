import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setError("");
    setSuccess("");

    // Check email / phone
    if (!identifier.trim()) {
      setError("Please enter your email or phone number.");
      return;
    }

    // Check password
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            identifier,
            password,
          }),
        }
      );

      const data = await response.json();

      // Backend returned an error
      if (!response.ok) {
        setError(
          data.detail || "Incorrect email/phone number or password."
        );
        return;
      }

      // Login successful
      setSuccess("Login successful!");

      localStorage.setItem(
        "agrisenseUser",
        JSON.stringify(data.user)
      );

      // Small delay so user can see success message
      setTimeout(() => {
        navigate("/role-selection");
      }, 500);

    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to the server. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Login</h1>

        <p className="login-subtitle">
          Login using your registered
          email or phone number
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

        <form onSubmit={handleLogin}>

          <label>
            Email or Phone Number
          </label>

          <input
            type="text"
            placeholder="Email or 10-digit phone number"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setError("");
            }}
          />

          <div className="password-label">

            <label>
              Password
            </label>

            <button
              type="button"
              className="forgot-password"
              onClick={() =>
                navigate("/forgot-password")
              }
            >
              Forgot Password?
            </button>

          </div>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p className="register-text">

          Don't have an account?

          <button
            type="button"
            className="register-link"
            onClick={() =>
              navigate("/register")
            }
          >
            Register
          </button>

        </p>

      </div>

    </div>
  );
}

export default Login;