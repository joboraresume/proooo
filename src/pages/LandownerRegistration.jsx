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

function LandownerRegistration() {

  const navigate = useNavigate();


  const [formData, setFormData] = useState({

    fullName: "",
    address: "",

    landName: "",
    surveyNumber: "",
    district: "",
    village: "",
    area: "",

    landLocation: "",
    waterSource: ""

  });


  const [document, setDocument] =
    useState(null);

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

      !formData.landName ||

      !formData.surveyNumber ||

      !formData.district ||

      !formData.village ||

      !formData.area ||

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

        phone: user.phone,

        email: user.email || null,

        address: formData.address || null,

        land_name: formData.landName,

        survey_number: formData.surveyNumber,

        district: formData.district,

        village: formData.village,

        area: parseFloat(formData.area),

        water_source: formData.waterSource || null,

        land_location: formData.landLocation

      };


      const response = await fetch(

        "http://localhost:5000/api/profiles/landowner",

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

        alert(data.detail || "Landowner registration failed.");

        return;

      }


      alert(

        "Landowner registration completed successfully!"

      );


      navigate("/role-selection");


    } catch (error) {

      console.error("Error creating landowner profile:", error);

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
            navigate("/role-selection")
          }
        >
          ← Back
        </button>


        <h1>
          🏡 Landowner Registration
        </h1>


        <p className="registration-subtitle">
          Register your agricultural land
        </p>


        <form
          className="registration-form"
          onSubmit={handleSubmit}
        >
          <div className="map-layout">
            <div className="form-fields">

              {/* OWNER DETAILS */}

              <label>
                Full Name *
              </label>

              <input
                type="text"
                name="fullName"
                placeholder="Enter landowner name"
                value={formData.fullName}
                onChange={handleChange}
              />



              <label>
                Owner Address
              </label>

              <textarea
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
              />


              {/* LAND DETAILS */}

              <label>
                Land / Farm Name *
              </label>

              <input
                type="text"
                name="landName"
                placeholder="Example: Green Valley Farm"
                value={formData.landName}
                onChange={handleChange}
              />


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


              <label>
                Land Area (Acres) *
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


              <label>
                Land Ownership Document
              </label>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(event) =>
                  setDocument(
                    event.target.files[0]
                  )
                }
              />
            </div>

            <div className="map-section">

              <label>
                Land Location *
              </label>

              <input
                type="text"
                name="landLocation"
                placeholder="Click on the map or type location"
                value={formData.landLocation}
                onChange={handleChange}
              />

              <div className="map-wrapper-box">
                <MapContainer center={[9.9816, 76.2999]} zoom={10} style={{ height: "100%", width: "100%" }}>
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
            Complete Landowner Registration
          </button>


        </form>

      </div>

    </div>

  );

}


export default LandownerRegistration;