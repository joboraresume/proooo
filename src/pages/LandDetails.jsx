import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import "./LandDetails.css";


const API_BASE = (
  import.meta?.env?.VITE_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");


function LandDetails() {

  const navigate =
    useNavigate();


  const [user, setUser] =
    useState(null);

  const [landDetails, setLandDetails] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");


  // =========================================================
  // GET USER
  // =========================================================

  const getUser = () => {

    const storedUser =
      localStorage.getItem(
        "agrisenseUser"
      );


    if (!storedUser) {
      navigate("/login");
      return null;
    }


    try {

      const parsed =
        JSON.parse(storedUser);

      setUser(parsed);

      return parsed;

    } catch (err) {

      console.error(
        "Invalid user:",
        err
      );

      localStorage.removeItem(
        "agrisenseUser"
      );

      navigate("/login");

      return null;
    }
  };


  // =========================================================
  // FETCH LAND
  // =========================================================

  const fetchLandDetails = async (
    showLoader = true
  ) => {

    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }


    setError("");


    try {

      const currentUser =
        getUser();


      if (!currentUser) {
        return;
      }


      // -----------------------------------------------------
      // LOCAL LAND DATA FIRST
      // -----------------------------------------------------

      const localLand =
        localStorage.getItem(
          "agrisenseLand"
        );


      if (localLand) {

        try {

          const parsed =
            JSON.parse(localLand);

          if (
            parsed &&
            typeof parsed === "object"
          ) {

            setLandDetails(
              parsed
            );

          }

        } catch (err) {

          console.warn(
            "Invalid local land data:",
            err
          );

        }
      }


      // -----------------------------------------------------
      // SERVER
      // -----------------------------------------------------

      const response =
        await fetch(
          `${API_BASE}/api/landowner/${currentUser.id}`,
          {
            method: "GET",

            headers: {
              Accept:
                "application/json",
            },
          }
        );


      if (!response.ok) {

        throw new Error(
          `Server returned ${response.status}`
        );

      }


      const data =
        await response.json();


      if (
        data &&
        typeof data === "object"
      ) {

        setLandDetails(
          data
        );


        localStorage.setItem(
          "agrisenseLand",
          JSON.stringify(data)
        );

      }


    } catch (err) {

      console.error(
        "Error fetching land details:",
        err
      );


      setError(
        "Could not connect to the server. Showing saved land information if available."
      );


    } finally {

      setLoading(false);

      setRefreshing(false);

    }
  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    fetchLandDetails(
      true
    );

  }, []);


  // =========================================================
  // HELPERS
  // =========================================================

  const getValue = (
    ...values
  ) => {

    for (
      const value of values
    ) {

      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {

        return value;

      }

    }

    return "Not provided";
  };


  const formatArea = () => {

    const area =
      getValue(
        landDetails?.land_area,
        landDetails?.landArea,
        landDetails?.area,
        landDetails?.acres,
        landDetails?.total_area,
        landDetails?.totalArea
      );


    if (
      area === "Not provided"
    ) {
      return area;
    }


    return `${area} acres`;
  };


  const getLocationText = () => {

    return getValue(
      landDetails?.location,
      landDetails?.address,
      landDetails?.place,
      landDetails?.village,
      landDetails?.district
    );

  };


  const openMap = () => {

    const latitude =
      landDetails?.latitude ??
      landDetails?.lat;

    const longitude =
      landDetails?.longitude ??
      landDetails?.lng ??
      landDetails?.lon;


    let query = "";


    if (
      latitude !== undefined &&
      longitude !== undefined &&
      latitude !== "" &&
      longitude !== ""
    ) {

      query =
        `${latitude},${longitude}`;

    } else {

      query =
        getLocationText();

    }


    if (
      !query ||
      query === "Not provided"
    ) {

      alert(
        "No land location is available."
      );

      return;
    }


    const mapUrl =
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        query
      )}`;


    window.open(
      mapUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {

    localStorage.removeItem(
      "agrisenseUser"
    );

    localStorage.removeItem(
      "agrisenseRole"
    );

    navigate(
      "/login",
      { replace: true }
    );
  };


  // =========================================================
  // DELETE LANDOWNER ROLE
  // =========================================================

  const deleteLandownerRole =
    async () => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete your Rented role? This action cannot be undone."
        );


      if (!confirmed) {
        return;
      }


      try {

        const storedUser =
          localStorage.getItem(
            "agrisenseUser"
          );


        if (!storedUser) {

          navigate("/login");

          return;
        }


        const currentUser =
          JSON.parse(storedUser);


        const response =
          await fetch(
            `${API_BASE}/api/profiles/landowner/${currentUser.id}`,
            {
              method: "DELETE",

              headers: {
                Accept:
                  "application/json",
              },
            }
          );


        if (!response.ok) {

          let message =
            "Unable to delete the Rented role.";

          try {

            const data =
              await response.json();

            message =
              data?.detail ||
              data?.message ||
              message;

          } catch {
            // Ignore
          }


          throw new Error(
            message
          );
        }


        localStorage.removeItem(
          "agrisenseLand"
        );


        const savedProfiles =
          localStorage.getItem(
            "agrisenseProfiles"
          );


        if (savedProfiles) {

          try {

            const profiles =
              JSON.parse(
                savedProfiles
              );

            profiles.landowner =
              false;

            localStorage.setItem(
              "agrisenseProfiles",
              JSON.stringify(
                profiles
              )
            );

          } catch {
            // Ignore local cache errors
          }
        }


        alert(
          "Rented role deleted successfully."
        );


        navigate(
          "/dashboard",
          { replace: true }
        );


      } catch (err) {

        console.error(
          "Delete role error:",
          err
        );


        alert(
          err.message ||
          "Unable to connect to the server."
        );
      }
    };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="land-details-page">

        <div className="land-details-loading">

          <div className="land-loading-spinner" />

          <h2>
            Loading land information...
          </h2>

          <p>
            Please wait while we retrieve
            your registered land details.
          </p>

        </div>

      </div>

    );
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="land-details-page">


      {/* =====================================================
          TOPBAR
      ===================================================== */}

      <header className="land-details-topbar">

        <div
          className="land-details-brand"
          onClick={() =>
            navigate(
              "/land-dashboard"
            )
          }
        >

          <div className="land-brand-icon">
            🌱
          </div>

          <div>

            <strong>
              AgriSense
            </strong>

            <span>
              Rented Portal
            </span>

          </div>

        </div>


        <div className="land-details-actions">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/land-dashboard"
              )
            }
          >
            ← Dashboard
          </button>


          <button
            type="button"
            onClick={() =>
              fetchLandDetails(
                false
              )
            }
            disabled={refreshing}
          >
            {refreshing
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>


          <button
            type="button"
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="land-details-content">


        {/* PAGE HEADER */}

        <section className="land-details-heading">

          <div>

            <span>
              LAND MANAGEMENT
            </span>

            <h1>
              Land Details
            </h1>

            <p>
              View the land information
              associated with your
              AgriSense Rented account.
            </p>

          </div>


          <button
            className="map-button"
            onClick={openMap}
          >
            🗺️ Open Location
          </button>

        </section>


        {/* SERVER WARNING */}

        {error && (

          <div className="land-warning">

            <span>
              ⚠️
            </span>

            <div>

              <strong>
                Server information unavailable
              </strong>

              <p>
                {error}
              </p>

            </div>

          </div>

        )}


        {/* =================================================
            MAIN CARD
        ================================================= */}

        <section className="land-details-main-card">


          <div className="land-card-header">

            <div>

              <span className="card-label">
                REGISTERED PROPERTY
              </span>

              <h2>
                Your Land Information
              </h2>

            </div>


            <div className="land-status">
              ● Active
            </div>

          </div>


          <div className="land-info-grid">


            {/* OWNER */}

            <div className="land-info-item">

              <span>
                👤
              </span>

              <div>

                <label>
                  Rented
                </label>

                <strong>
                  {getValue(
                    landDetails?.name,
                    landDetails?.owner_name,
                    landDetails?.ownerName,
                    user?.name
                  )}
                </strong>

              </div>

            </div>


            {/* PHONE */}

            <div className="land-info-item">

              <span>
                📱
              </span>

              <div>

                <label>
                  Phone Number
                </label>

                <strong>
                  {getValue(
                    landDetails?.phone,
                    landDetails?.phone_number,
                    landDetails?.mobile,
                    user?.phone
                  )}
                </strong>

              </div>

            </div>


            {/* AREA */}

            <div className="land-info-item">

              <span>
                📐
              </span>

              <div>

                <label>
                  Total Land Area
                </label>

                <strong>
                  {formatArea()}
                </strong>

              </div>

            </div>


            {/* LOCATION */}

            <div className="land-info-item">

              <span>
                📍
              </span>

              <div>

                <label>
                  Location
                </label>

                <strong>
                  {getLocationText()}
                </strong>

              </div>

            </div>


            {/* SOIL */}

            <div className="land-info-item">

              <span>
                🌱
              </span>

              <div>

                <label>
                  Soil Type
                </label>

                <strong>
                  {getValue(
                    landDetails?.soil_type,
                    landDetails?.soilType,
                    landDetails?.soil
                  )}
                </strong>

              </div>

            </div>


            {/* CROP */}

            <div className="land-info-item">

              <span>
                🌾
              </span>

              <div>

                <label>
                  Crop / Farming Type
                </label>

                <strong>
                  {getValue(
                    landDetails?.crop,
                    landDetails?.crop_type,
                    landDetails?.cropType,
                    landDetails?.farming_type,
                    landDetails?.farmingType
                  )}
                </strong>

              </div>

            </div>


            {/* DISTRICT */}

            <div className="land-info-item">

              <span>
                🏙️
              </span>

              <div>

                <label>
                  District
                </label>

                <strong>
                  {getValue(
                    landDetails?.district
                  )}
                </strong>

              </div>

            </div>


            {/* STATE */}

            <div className="land-info-item">

              <span>
                🗺️
              </span>

              <div>

                <label>
                  State
                </label>

                <strong>
                  {getValue(
                    landDetails?.state
                  )}
                </strong>

              </div>

            </div>

          </div>


          {/* COORDINATES */}

          <div className="coordinates-box">

            <div>

              <span>
                Latitude
              </span>

              <strong>
                {getValue(
                  landDetails?.latitude,
                  landDetails?.lat
                )}
              </strong>

            </div>


            <div>

              <span>
                Longitude
              </span>

              <strong>
                {getValue(
                  landDetails?.longitude,
                  landDetails?.lng,
                  landDetails?.lon
                )}
              </strong>

            </div>


            <button
              onClick={openMap}
            >
              View on Map →
            </button>

          </div>

        </section>


        {/* =================================================
            ACTIONS
        ================================================= */}

        <section className="land-details-actions-grid">


          <button
            className="land-action-card"
            onClick={() =>
              navigate(
                "/land-dashboard"
              )
            }
          >

            <span>
              📊
            </span>

            <div>

              <strong>
                Land Dashboard
              </strong>

              <p>
                View land overview,
                sensors and monitoring.
              </p>

            </div>

            <b>
              →
            </b>

          </button>


          <button
            className="land-action-card"
            onClick={() =>
              navigate(
                "/land-dashboard"
              )
            }
          >

            <span>
              📡
            </span>

            <div>

              <strong>
                Sensor Details
              </strong>

              <p>
                Open your sensor
                monitoring dashboard.
              </p>

            </div>

            <b>
              →
            </b>

          </button>


          <button
            className="land-action-card"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >

            <span>
              🔄
            </span>

            <div>

              <strong>
                All Dashboards
              </strong>

              <p>
                Switch between your
                AgriSense roles.
              </p>

            </div>

            <b>
              →
            </b>

          </button>

        </section>


        {/* =================================================
            DANGER ZONE
        ================================================= */}

        <section className="land-danger-zone">

          <div>

            <span className="danger-icon">
              ⚠️
            </span>

            <div>

              <h3>
                Rented Role
              </h3>

              <p>
                Removing this role will
                delete the registered
                Rented profile from
                the server.
              </p>

            </div>

          </div>


          <button
            onClick={
              deleteLandownerRole
            }
          >
            Delete Rented Role
          </button>

        </section>

      </main>

    </div>
  );
}


export default LandDetails;