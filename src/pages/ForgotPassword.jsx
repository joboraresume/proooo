import { useState } from "react";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Password reset link sent to " + email);
  };

  return (
    <div style={{padding:"40px"}}>

      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <br /><br />

        <button>
          Send Reset Link
        </button>

      </form>

    </div>
  );
}

export default ForgotPassword;