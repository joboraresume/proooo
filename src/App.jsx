import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


import LandingPage
  from "./pages/LandingPage";

import Login
  from "./pages/Login";

import Dashboard
  from "./pages/Dashboard";

import LandRegistration
  from "./pages/LandRegistration";


function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* LANDING PAGE */}

        <Route

          path="/"

          element={
            <LandingPage />
          }

        />


        {/* LOGIN */}

        <Route

          path="/login"

          element={
            <Login />
          }

        />


        {/* DASHBOARD */}

        <Route

          path="/dashboard"

          element={
            <Dashboard />
          }

        />


        {/* LAND REGISTRATION */}

        <Route

          path="/land-registration"

          element={
            <LandRegistration />
          }

        />


      </Routes>

    </BrowserRouter>

  );

}


export default App;