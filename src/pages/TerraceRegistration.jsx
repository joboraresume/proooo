import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RoleRegistration.css";


function TerraceRegistration() {

  const navigate = useNavigate();


  const terraceType =
    localStorage.getItem("terraceType")
    || "soil";


  const [formData, setFormData] = useState({

    name: "",
    location: "",
    area: "",
    crop: "",
    numberOfPlants: "",
    waterSource: ""

  });


  const handleChange = (event) => {

    const {
      name,
      value
    } = event.target;


    setFormData({

      ...formData,

      [name]: value

    });

  };


  const handleSubmit = async (event) => {

    event.preventDefault();


    if (

      !formData.name ||

      !formData.location ||

      !formData.area ||

      !formData.crop

    ) {

      alert(

        "Please fill all required fields."

      );


      return;

    }


    try {

      const userStr = localStorage.getItem("agrisenseUser");

      if (!userStr) {

        alert("User not logged in. Please log in first.");

        navigate("/login");

        return;

      }

      const user = JSON.parse(userStr);


      const payload = {

        user_id: user.id,

        terrace_type: terraceType,

        name: formData.name,

        location: formData.location,

        area: parseFloat(formData.area),

        crop: formData.crop,

        number_of_plants: formData.numberOfPlants ? parseInt(formData.numberOfPlants, 10) : null,

        water_source: formData.waterSource || null

      };


      const response = await fetch(

        "http://localhost:5000/api/profiles/terrace",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

          },

          body: JSON.stringify(payload)

        }

      );


      const data = await response.json();


      if (!response.ok) {

        alert(data.detail || "Terrace registration failed.");

        return;

      }


      alert(

        "Terrace farming registration completed successfully!"

      );


      navigate("/role-selection");


    } catch (error) {

      console.error("Error creating terrace profile:", error);

      alert("Unable to connect to the server. Please try again.");

    }

  };


  return (

    <div className="registration-page">

      <div className="registration-card">


        <button
          type="button"
          className="registration-back"
          onClick={() =>
            navigate("/terrace-farming")
          }
        >
          ← Back
        </button>


        <h1>
          🪴 Terrace Registration
        </h1>


        <p className="registration-subtitle">

          {terraceType === "soil"
            ? "Cultivated in Soil"
            : "Cultivated in Vase"}

        </p>


        <form
          className="registration-form"
          onSubmit={handleSubmit}
        >


          <label>
            Terrace / Garden Name *
          </label>

          <input
            type="text"
            name="name"
            placeholder="Example: Home Terrace Garden"
            value={formData.name}
            onChange={handleChange}
          />


          <label>
            Location *
          </label>

          <input
            type="text"
            name="location"
            placeholder="Example: Kochi, Kerala"
            value={formData.location}
            onChange={handleChange}
          />


          <label>
            Available Area (sq.ft) *
          </label>

          <input
            type="number"
            name="area"
            min="0"
            placeholder="Example: 300"
            value={formData.area}
            onChange={handleChange}
          />


          <label>
            Main Crop *
          </label>

          <input
            type="text"
            name="crop"
            placeholder="Example: Tomato"
            value={formData.crop}
            onChange={handleChange}
          />


          <label>
            Number of Plants
          </label>

          <input
            type="number"
            name="numberOfPlants"
            min="0"
            placeholder="Example: 20"
            value={formData.numberOfPlants}
            onChange={handleChange}
          />


          <label>
            Water Source
          </label>

          <select
            name="waterSource"
            value={formData.waterSource}
            onChange={handleChange}
          >

            <option value="">
              Select water source
            </option>

            <option value="tap">
              Tap Water
            </option>

            <option value="rainwater">
              Rainwater
            </option>

            <option value="well">
              Well
            </option>

            <option value="borewell">
              Borewell
            </option>

            <option value="other">
              Other
            </option>

          </select>


          <button
            type="submit"
            className="registration-submit"
          >
            Complete Registration
          </button>


        </form>

      </div>

    </div>

  );

}


export default TerraceRegistration;