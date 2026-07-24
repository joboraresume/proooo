import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [loginMethod, setLoginMethod] = useState("email");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");

  const [otp, setOtp] = useState("");

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [resetEmail, setResetEmail] = useState("");


  /* Email Login */

  const handleEmailLogin = (e) => {

    e.preventDefault();


    if (email === "") {

      alert("Please enter your email");

      return;
    }


    if (!email.includes("@")) {

      alert("Please enter a valid email");

      return;
    }


    if (password === "") {

      alert("Please enter your password");

      return;
    }


    if (password.length < 6) {

      alert(
        "Password must contain at least 6 characters"
      );

      return;
    }


    alert("Login successful!");

    navigate("/dashboard");

  };


  /* Send OTP */

  const handleSendOTP = () => {

    if (phone.length !== 10) {

      alert(
        "Please enter a valid 10-digit phone number"
      );

      return;
    }


    alert("OTP sent successfully!");

  };


  /* Verify OTP */

  const handleVerifyOTP = (e) => {

    e.preventDefault();


    if (otp.length !== 6) {

      alert("OTP must contain 6 digits");

      return;
    }


    alert("OTP Login successful!");

    navigate("/dashboard");

  };


  /* Forgot Password */

  const handleForgotPassword = (e) => {

    e.preventDefault();


    if (!resetEmail.includes("@")) {

      alert("Please enter a valid email");

      return;
    }


    alert(
      "Password reset link sent to your email"
    );

    setShowForgotPassword(false);

  };


  return (

    <div className="login-page">

      <div className="login-card">


        <h1>Login</h1>


        <p className="login-subtitle">

          Enter your credentials to access your account

        </p>


        {/* Login Tabs */}

        <div className="login-tabs">


          <button

            className={
              loginMethod === "email"
                ? "active-tab"
                : ""
            }

            onClick={() =>
              setLoginMethod("email")
            }

          >

            Email / Password

          </button>


          <button

            className={
              loginMethod === "otp"
                ? "active-tab"
                : ""
            }

            onClick={() =>
              setLoginMethod("otp")
            }

          >

            Login with OTP

          </button>


        </div>


        {/* Email Login */}

        {loginMethod === "email" &&
          !showForgotPassword && (

            <form
              onSubmit={handleEmailLogin}
            >


              <label>Email</label>


              <input

                type="email"

                placeholder="Enter your email"

                value={email}

                onChange={(e) =>
                  setEmail(e.target.value)
                }

              />


              <div className="password-label">


                <label>Password</label>


                <button

                  type="button"

                  className="forgot-password"

                  onClick={() =>
                    setShowForgotPassword(true)
                  }

                >

                  Forgot Password?

                </button>


              </div>


              <input

                type="password"

                placeholder="Enter your password"

                value={password}

                onChange={(e) =>
                  setPassword(e.target.value)
                }

              />


              <button

                type="submit"

                className="login-button"

              >

                Login

              </button>


            </form>

          )}


        {/* OTP Login */}

        {loginMethod === "otp" && (

          <form
            onSubmit={handleVerifyOTP}
          >


            <label>Phone Number</label>


            <input

              type="tel"

              placeholder="Enter 10-digit phone number"

              value={phone}

              onChange={(e) =>
                setPhone(e.target.value)
              }

            />


            <button

              type="button"

              className="otp-button"

              onClick={handleSendOTP}

            >

              Send OTP

            </button>


            <label>Enter OTP</label>


            <input

              type="text"

              placeholder="Enter 6-digit OTP"

              value={otp}

              onChange={(e) =>
                setOtp(e.target.value)
              }

            />


            <button

              type="submit"

              className="login-button"

            >

              Verify OTP

            </button>


          </form>

        )}


        {/* Forgot Password */}

        {showForgotPassword && (

          <form
            onSubmit={handleForgotPassword}
          >


            <h2>Forgot Password?</h2>


            <p>

              Enter your email to reset your password.

            </p>


            <label>Email</label>


            <input

              type="email"

              placeholder="Enter your email"

              value={resetEmail}

              onChange={(e) =>
                setResetEmail(e.target.value)
              }

            />


            <button

              type="submit"

              className="login-button"

            >

              Send Reset Link

            </button>


            <button

              type="button"

              className="back-button"

              onClick={() =>
                setShowForgotPassword(false)
              }

            >

              Back to Login

            </button>


          </form>

        )}


        {/* Register */}

        {!showForgotPassword && (

          <p className="register-text">

            Don't have an account?


            <button

              className="register-link"

              onClick={() =>
                navigate("/register")
              }

            >

              Register

            </button>


          </p>

        )}


      </div>

    </div>

  );

}

export default Login;