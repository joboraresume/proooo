import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FarmMap from "../components/FarmMap";

import "./LandRegistration.css";


function LandRegistration() {

  const navigate = useNavigate();


  const [userType, setUserType] =
    useState("Farmer");


  const [location, setLocation] =
    useState("");


  const [formData, setFormData] = useState({

    farmName: "",

    surveyNumber: "",

    district: "",

    village: "",

    area: "",

    soilType: "",

    waterSource: ""

  });


  const handleChange = (event) => {

    const { name, value } =
      event.target;


    setFormData({

      ...formData,

      [name]: value

    });

  };


  const handleSubmit = (event) => {

    event.preventDefault();


    if (
      !formData.farmName ||
      !formData.surveyNumber ||
      !formData.district ||
      !formData.village ||
      !formData.area ||
      !location
    ) {

      alert(
        "Please fill all required fields."
      );

      return;

    }


    alert(
      "Land registered successfully!"
    );


    console.log({

      userType,

      ...formData,

      location

    });

  };


  return (

    <div className="land-page">


      {/* HEADER */}

      <header className="land-header">


        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >

          ← Dashboard

        </button>


        <div>

          <h1>
            🌾 Land Registration
          </h1>

          <p>
            Register your agricultural land
          </p>

        </div>


      </header>



      {/* MAIN CONTENT */}

      <div className="land-layout">


        {/* LEFT SIDE */}

        <div className="land-form-card">


          <h2>
            Register Your Land
          </h2>


          <p className="description">

            Enter your land information
            and farm location.

          </p>



          <form
            onSubmit={handleSubmit}
          >


            {/* USER TYPE */}

            <label>
              Register As
            </label>


            <div className="user-type-container">


              <button
                type="button"

                className={
                  userType === "Farmer"
                    ? "type-button active"
                    : "type-button"
                }

                onClick={() =>
                  setUserType("Farmer")
                }
              >

                👨‍🌾 Farmer

              </button>


              <button
                type="button"

                className={
                  userType === "Land Owner"
                    ? "type-button active"
                    : "type-button"
                }

                onClick={() =>
                  setUserType("Land Owner")
                }
              >

                🏡 Land Owner

              </button>


            </div>



            {/* FARM NAME */}

            <label>
              Farm / Land Name *
            </label>


            <input
              type="text"

              name="farmName"

              placeholder="Example: Green Valley Farm"

              value={formData.farmName}

              onChange={handleChange}
            />



            {/* SURVEY NUMBER */}

            <label>
              Survey Number *
            </label>


            <input
              type="text"

              name="surveyNumber"

              placeholder="Example: 123/4A"

              value={formData.surveyNumber}

              onChange={handleChange}
            />



            {/* DISTRICT */}

            <label>
              District *
            </label>


            <input
              type="text"

              name="district"

              placeholder="Example: Ernakulam"

              value={formData.district}

              onChange={handleChange}
            />



            {/* VILLAGE */}

            <label>
              Village *
            </label>


            <input
              type="text"

              name="village"

              placeholder="Example: Kumbalangi"

              value={formData.village}

              onChange={handleChange}
            />



            {/* AREA */}

            <label>
              Land Area (Acres) *
            </label>


            <input
              type="number"

              name="area"

              placeholder="Example: 2.5"

              step="0.01"

              value={formData.area}

              onChange={handleChange}
            />



            {/* LOCATION */}

            <label>
              Farm Location *
            </label>


            <input
              type="text"

              placeholder="Example: Kottarakara, Kerala"

              value={location}

              onChange={(event) =>
                setLocation(
                  event.target.value
                )
              }
            />


            <small className="location-help">

              Enter the location and click
              <b> Search Location </b>
              on the map.

            </small>



            {/* SOIL */}

            <label>
              Soil Type
            </label>


            <select

              name="soilType"

              value={formData.soilType}

              onChange={handleChange}

            >

              <option value="">
                Select Soil Type
              </option>

              <option value="Loamy">
                Loamy
              </option>

              <option value="Clay">
                Clay
              </option>

              <option value="Sandy">
                Sandy
              </option>

              <option value="Silt">
                Silt
              </option>

              <option value="Laterite">
                Laterite
              </option>

            </select>



            {/* WATER SOURCE */}

            <label>
              Water Source
            </label>


            <select

              name="waterSource"

              value={formData.waterSource}

              onChange={handleChange}

            >

              <option value="">
                Select Water Source
              </option>

              <option value="Well">
                Well
              </option>

              <option value="Borewell">
                Borewell
              </option>

              <option value="Canal">
                Canal
              </option>

              <option value="River">
                River
              </option>

              <option value="Rainwater">
                Rainwater
              </option>

            </select>



            {/* DOCUMENT */}

            <label>
              Land Document
            </label>


            <input

              type="file"

              accept=".pdf,.jpg,.jpeg,.png"

            />



            {/* SUBMIT */}

            <button

              type="submit"

              className="register-button"

            >

              Register Land

            </button>


          </form>


        </div>



        {/* RIGHT SIDE MAP */}

        <div className="land-right">


          <FarmMap
            location={location}
          />



          {/* REGISTERED LAND */}

          <div className="registered-card">


            <h2>
              Your Registered Lands
            </h2>


            <div className="registered-item">

              <div>

                <strong>
                  🌾 Green Valley Farm
                </strong>

                <p>
                  2.5 Acres • Kerala
                </p>

              </div>


              <span>
                Registered
              </span>

            </div>



            <div className="registered-item">

              <div>

                <strong>
                  🌱 South Field
                </strong>

                <p>
                  5.1 Acres • Kerala
                </p>

              </div>


              <span>
                Registered
              </span>

            </div>


          </div>


        </div>


      </div>


    </div>

  );

}


export default LandRegistration;