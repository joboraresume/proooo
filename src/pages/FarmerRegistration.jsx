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

function FarmerRegistration() {
  const navigate = useNavigate();
  const [mapMarker, setMapMarker] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    experience: "",
    farmingType: "",
    irrigationMethod: "",
    farmingLocation: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.fullName ||
      !formData.farmingType ||
      !formData.farmingLocation
    ) {
      alert("Please fill all required fields.");
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
        experience: formData.experience ? parseInt(formData.experience, 10) : null,
        farming_type: formData.farmingType,
        irrigation_method: formData.irrigationMethod || null,
        farming_location: formData.farmingLocation
      };

      const response = await fetch(
        "http://localhost:5000/api/profiles/farmer",
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
        alert(data.detail || "Farmer registration failed.");
        return;
      }

      alert("Farmer registration completed successfully!");
      navigate("/role-selection");

    } catch (error) {
      console.error("Error creating farmer profile:", error);
      alert("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-card large-card">
        <button
          type="button"
          className="registration-back"
          onClick={() => navigate("/role-selection")}
        >
          ← Back
        </button>

        <h1>👨‍🌾 Farmer Registration</h1>
        <p className="registration-subtitle">Enter your farming details</p>

        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="map-layout">
            <div className="form-fields">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
              />

              <label>Address</label>
              <textarea
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
              />

              <label>Farming Experience</label>
              <input
                type="number"
                name="experience"
                min="0"
                placeholder="Years of experience"
                value={formData.experience}
                onChange={handleChange}
              />

              <label>Type of Farming *</label>
              <select
                name="farmingType"
                value={formData.farmingType}
                onChange={handleChange}
              >
                <option value="">Select farming type</option>
                <option value="organic">Organic Farming</option>
                <option value="traditional">Traditional Farming</option>
                <option value="mixed">Mixed Farming</option>
                <option value="commercial">Commercial Farming</option>
                <option value="other">Other</option>
              </select>

              <label>Irrigation Method</label>
              <select
                name="irrigationMethod"
                value={formData.irrigationMethod}
                onChange={handleChange}
              >
                <option value="">Select irrigation method</option>
                <option value="drip">Drip Irrigation</option>
                <option value="sprinkler">Sprinkler Irrigation</option>
                <option value="canal">Canal</option>
                <option value="well">Well</option>
                <option value="rainwater">Rainwater</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="map-section">
              <label>Farming Location *</label>
              <input
                type="text"
                name="farmingLocation"
                placeholder="Click on the map or type location (e.g. Ernakulam, Kerala)"
                value={formData.farmingLocation}
                onChange={handleChange}
              />

              <div className="map-wrapper-box">
                <MapContainer center={[9.9816, 76.2999]} zoom={10} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler
                    setLocation={(loc) => setFormData(prev => ({ ...prev, farmingLocation: loc }))}
                    setMarker={setMapMarker}
                  />
                  {mapMarker && <Marker position={[mapMarker.lat, mapMarker.lng]} />}
                </MapContainer>
              </div>
            </div>
          </div>

          <button type="submit" className="registration-submit">
            Complete Farmer Registration
          </button>
        </form>
      </div>
    </div>
  );
}

export default FarmerRegistration;