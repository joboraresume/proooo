import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RoleRegistration.css";


function WorkerRegistration() {

  const navigate = useNavigate();


  const [formData, setFormData] = useState({

    fullName: "",
    fullName: "",
    address: "",
    workType: "",
    experience: "",
    preferredLocation: ""

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

      !formData.fullName ||

      !formData.workType

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

        full_name: formData.fullName,

        phone: user.phone,

        email: user.email || null,

        address: formData.address || null,

        work_type: formData.workType,

        experience: formData.experience ? parseInt(formData.experience, 10) : null,

        preferred_location: formData.preferredLocation || null

      };


      const response = await fetch(

        "http://localhost:5000/api/profiles/worker",

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

        alert(data.detail || "Worker registration failed.");

        return;

      }


      alert(

        "Worker registration completed successfully!"

      );


      localStorage.setItem("showDashboardAfterRegistration", "true");
      navigate("/dashboard");


    } catch (error) {

      console.error("Error creating worker profile:", error);

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
            navigate("/dashboard")
          }
        >
          ← Back
        </button>


        <h1>
          👷 Worker Registration
        </h1>


        <p className="registration-subtitle">
          Enter your work details
        </p>


        <form
          className="registration-form"
          onSubmit={handleSubmit}
        >


          <label>
            Full Name *
          </label>

          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
          />



          <label>
            Address
          </label>

          <textarea
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
          />


          <label>
            Type of Work *
          </label>

          <select
            name="workType"
            value={formData.workType}
            onChange={handleChange}
          >

            <option value="">
              Select work type
            </option>

            <option value="planting">
              Planting
            </option>

            <option value="harvesting">
              Harvesting
            </option>

            <option value="irrigation">
              Irrigation
            </option>

            <option value="land-preparation">
              Land Preparation
            </option>

            <option value="general-farming">
              General Farming
            </option>

            <option value="other">
              Other
            </option>

          </select>


          <label>
            Work Experience
          </label>

          <input
            type="number"
            name="experience"
            min="0"
            placeholder="Years of experience"
            value={formData.experience}
            onChange={handleChange}
          />


          <label>
            Preferred Work Location
          </label>

          <input
            type="text"
            name="preferredLocation"
            placeholder="Example: Ernakulam"
            value={formData.preferredLocation}
            onChange={handleChange}
          />


          <button
            type="submit"
            className="registration-submit"
          >
            Complete Worker Registration
          </button>


        </form>

      </div>

    </div>

  );

}


export default WorkerRegistration;