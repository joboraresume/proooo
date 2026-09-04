import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "./RoleRegistration.css";

// Configure default Marker icon for Leaflet on React
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapClickHandler({ setLocation, setMarker }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarker({ lat, lng });
      setLocation(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
    }
  });
  return null;
}

function ForeignerRegistration() {

  const navigate = useNavigate();


  const [formData, setFormData] = useState({

    fullName: "",
    nationality: "",
    passportNumber: "",
    phone: "",
    address: "",
    purpose: "",
    landLocation: "",
    landName: "",
    surveyNumber: "",
    district: "",
    village: "",
    area: "",
    waterSource: ""
  });

  const [mapMarker, setMapMarker] = useState(null);


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

      !formData.nationality ||

      !formData.passportNumber ||

      !formData.landLocation

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

        nationality: formData.nationality,

        passport_number: formData.passportNumber,

        phone: user.phone || null,

        email: user.email || null,

        address: formData.address || null,

        purpose: formData.purpose || null,

        land_location: formData.landLocation,

        land_name: formData.landName || null,
        survey_number: formData.surveyNumber || null,
        district: formData.district || null,
        village: formData.village || null,
        area: formData.area ? parseFloat(formData.area) : null,
        water_source: formData.waterSource || null
      };


      const response = await fetch(

        "http://localhost:5000/api/profiles/foreigner",

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

        alert(data.detail || "Foreigner registration failed.");

        return;

      }


      alert(

        "Foreigner registration completed successfully!"

      );


      localStorage.setItem("showDashboardAfterRegistration", "true");
      navigate("/dashboard");


    } catch (error) {

      console.error("Error creating foreigner profile:", error);

      alert("Unable to connect to the server. Please try again.");

    }

  };


  return (

    <div className="registration-page">

      <div className="registration-card large-card">


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
          🌐 Foreigner Registration
        </h1>


        <p className="registration-subtitle">
          Enter your personal details
        </p>


        <form
          className="registration-form"
          onSubmit={handleSubmit}
        >
          <div className="map-layout">
            <div className="form-fields">


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
                Nationality *
              </label>

              <input
                type="text"
                name="nationality"
                placeholder="Enter your nationality"
                value={formData.nationality}
                onChange={handleChange}
              />


              <label>
                Passport Number *
              </label>

              <input
                type="text"
                name="passportNumber"
                placeholder="Enter passport number"
                value={formData.passportNumber}
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
                Purpose
              </label>

              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
              >

                <option value="">
                  Select purpose
                </option>

                <option value="agriculture">
                  Agricultural Activities
                </option>

                <option value="research">
                  Agricultural Research
                </option>

                <option value="tourism">
                  Tourism
                </option>

                <option value="other">
                  Other
                </option>

              </select>


              <label>
                Land Name
              </label>

              <input
                type="text"
                name="landName"
                placeholder="Example: My Foreign Land"
                value={formData.landName}
                onChange={handleChange}
              />


              <label>
                Survey Number
              </label>

              <input
                type="text"
                name="surveyNumber"
                placeholder="Example: 123/4A"
                value={formData.surveyNumber}
                onChange={handleChange}
              />


              <label>
                District
              </label>

              <input
                type="text"
                name="district"
                placeholder="Example: Colombo"
                value={formData.district}
                onChange={handleChange}
              />


              <label>
                Village / Town
              </label>

              <input
                type="text"
                name="village"
                placeholder="Example: Mount Lavinia"
                value={formData.village}
                onChange={handleChange}
              />


              <label>
                Land Area (Acres)
              </label>

              <input
                type="number"
                name="area"
                min="0"
                step="0.01"
                placeholder="Example: 2.5"
                value={formData.area}
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

                <option value="well">
                  Well
                </option>

                <option value="borewell">
                  Borewell
                </option>

                <option value="canal">
                  Canal
                </option>

                <option value="river">
                  River
                </option>

                <option value="rainwater">
                  Rainwater
                </option>

              </select>

            </div>
            <div className="map-section">

              <label>
                Land Selection *
              </label>

              <input
                type="text"
                name="landLocation"
                placeholder="Click on the map or type location"
                value={formData.landLocation}
                onChange={handleChange}
              />

              <div className="map-wrapper-box">
                <MapContainer center={[9.9816, 76.2999]} zoom={1} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler
                    setLocation={(loc) => setFormData(prev => ({ ...prev, landLocation: loc }))}
                    setMarker={setMapMarker}
                  />
                  {mapMarker && <Marker position={[mapMarker.lat, mapMarker.lng]} />}
                </MapContainer>
              </div>
            </div>
          </div>

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


export default ForeignerRegistration;
