import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";


function Login() {

  const navigate = useNavigate();


  const [identifier, setIdentifier] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleLogin = async (e) => {

    e.preventDefault();


    if (!identifier.trim()) {

      alert(
        "Please enter your email or phone number."
      );

      return;
    }


    if (!password) {

      alert(
        "Please enter your password."
      );

      return;
    }


    try {

      setLoading(true);


      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            identifier,

            password

          })

        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        alert(
          data.detail ||
          "Login failed."
        );

        return;
      }


      localStorage.setItem(
        "agrisenseUser",
        JSON.stringify(
          data.user
        )
      );


      navigate("/dashboard");


    } catch (error) {

      console.error(error);

      alert(
        "Unable to connect to the server."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="login-page">

      <div className="login-card">

        <h1>
          Login
        </h1>

        <p className="login-subtitle">
          Login using your registered
          email or phone number
        </p>


        <form onSubmit={handleLogin}>

          <label>
            Email or Phone Number
          </label>

          <input
            type="text"
            placeholder="Email or 10-digit phone number"
            value={identifier}
            onChange={(e) =>
              setIdentifier(
                e.target.value
              )
            }
          />


          <div className="password-label">

            <label>
              Password
            </label>

            <button
              type="button"
              className="forgot-password"
              onClick={() =>
                navigate(
                  "/forgot-password"
                )
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
              setPassword(
                e.target.value
              )
            }
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