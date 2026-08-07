import { useState } from "react";
import "./ForgotPassword.css";
function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous messages
    setError("");
    setSuccess("");

    // Check email
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // Current functionality
    setSuccess("Password reset link sent to " + email);
  };

  return (
    <div style={{ padding: "40px" }}>

      <h2>Forgot Password</h2>

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

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
            setSuccess("");
          }}
        />

        <br />
        <br />

        <button type="submit">
          Send Reset Link
        </button>

      </form>

    </div>
  );
}

export default ForgotPassword;