import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "./RoleRegistration.css";

const MAX_FIELDS = 3;
const FIELDS_KEY = "agrisenseFarmerFields";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapClickHandler({ setLocation, setMarker }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarker({ lat, lng });
      setLocation(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
    },
  });
  return null;
}

function parseCoords(marker, locationLabel) {
  if (marker?.lat != null && marker?.lng != null) {
    return { lat: marker.lat, lng: marker.lng };
  }
  const match = String(locationLabel || "").match(
    /Lat:\s*(-?\d+\.?\d*).*Lng:\s*(-?\d+\.?\d*)/i
  );
  if (match) {
    return { lat: Number(match[1]), lng: Number(match[2]) };
  }
  return { lat: null, lng: null };
}

function loadFarmerFields(userId) {
  try {
    const raw = localStorage.getItem(FIELDS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.userId != null && String(parsed.userId) === String(userId)) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function FarmerRegistration() {
  const navigate = useNavigate();
  const [mapMarker, setMapMarker] = useState(null);
  const [saving, setSaving] = useState(false);
  const [personalLocked, setPersonalLocked] = useState(false);
  const [savedBundle, setSavedBundle] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    experience: "",
    farmingType: "",
    irrigationMethod: "",
    farmingLocation: "",
  });

  useEffect(() => {
    const userStr = localStorage.getItem("agrisenseUser");
    if (!userStr) {
      navigate("/login");
      return;
    }
    try {
      const user = JSON.parse(userStr);
      const existing = loadFarmerFields(user.id);
      if (existing?.fields?.length) {
        setSavedBundle(existing);
        setPersonalLocked(true);
        setFormData((prev) => ({
          ...prev,
          fullName: existing.fullName || "",
          address: existing.address || "",
          experience:
            existing.experience != null ? String(existing.experience) : "",
          farmingType: "",
          irrigationMethod: "",
          farmingLocation: "",
        }));
        if (existing.fields.length >= MAX_FIELDS) {
          setShowSuccess(true);
        }
      }
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const fieldCount = savedBundle?.fields?.length || 0;
  const nextFieldNumber = fieldCount + 1;
  const canAddMore = fieldCount < MAX_FIELDS;

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (personalLocked && (name === "fullName" || name === "address")) {
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const clearFieldInputs = () => {
    setMapMarker(null);
    setFormData((prev) => ({
      ...prev,
      farmingType: "",
      irrigationMethod: "",
      farmingLocation: "",
    }));
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

    if (!canAddMore) {
      setShowSuccess(true);
      return;
    }

    const userStr = localStorage.getItem("agrisenseUser");
    if (!userStr) {
      alert("User not logged in. Please log in first.");
      navigate("/login");
      return;
    }

    const user = JSON.parse(userStr);
    const { lat, lng } = parseCoords(mapMarker, formData.farmingLocation);
    const fieldId = `field${nextFieldNumber}`;
    const fieldEntry = {
      id: fieldId,
      name: `Field ${nextFieldNumber}`,
      farmingType: formData.farmingType,
      irrigationMethod: formData.irrigationMethod || null,
      lat,
      lng,
      locationLabel: formData.farmingLocation,
    };

    setSaving(true);

    try {
      let bundle = loadFarmerFields(user.id);

      if (!bundle || !bundle.fields?.length) {
        const payload = {
          user_id: user.id,
          full_name: formData.fullName,
          phone: user.phone,
          email: user.email || null,
          address: formData.address || null,
          experience: formData.experience
            ? parseInt(formData.experience, 10)
            : null,
          farming_type: formData.farmingType,
          irrigation_method: formData.irrigationMethod || null,
          farming_location: formData.farmingLocation,
        };

        const response = await fetch(
          "http://localhost:5000/api/profiles/farmer",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          alert(data.detail || "Farmer registration failed.");
          setSaving(false);
          return;
        }

        bundle = {
          userId: user.id,
          fullName: formData.fullName,
          address: formData.address || "",
          experience: formData.experience
            ? parseInt(formData.experience, 10)
            : null,
          fields: [fieldEntry],
        };
      } else {
        bundle = {
          ...bundle,
          fullName: bundle.fullName || formData.fullName,
          address: bundle.address || formData.address || "",
          experience:
            bundle.experience != null
              ? bundle.experience
              : formData.experience
              ? parseInt(formData.experience, 10)
              : null,
          fields: [...bundle.fields, fieldEntry],
        };
      }

      localStorage.setItem(FIELDS_KEY, JSON.stringify(bundle));
      localStorage.setItem(
        "agrisenseFarmer",
        JSON.stringify({
          full_name: bundle.fullName,
          address: bundle.address,
          experience: bundle.experience,
          farming_type: fieldEntry.farmingType,
          irrigation_method: fieldEntry.irrigationMethod,
          farming_location: fieldEntry.locationLabel,
          fields: bundle.fields,
        })
      );
      try {
        const profiles = JSON.parse(
          localStorage.getItem("agrisenseProfiles") || "{}"
        );
        localStorage.setItem(
          "agrisenseProfiles",
          JSON.stringify({
            ...(profiles && typeof profiles === "object" ? profiles : {}),
            farmer: true,
          })
        );
      } catch {
        /* ignore */
      }

      setSavedBundle(bundle);
      setPersonalLocked(true);
      setShowSuccess(true);
      clearFieldInputs();
    } catch (error) {
      console.error("Error creating farmer profile:", error);
      alert("Unable to connect to the server. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const startNextField = () => {
    setShowSuccess(false);
    clearFieldInputs();
  };

  if (showSuccess && savedBundle) {
    const count = savedBundle.fields.length;
    return (
      <div className="registration-page">
        <div className="registration-card large-card">
          <button
            type="button"
            className="registration-back"
            onClick={() => navigate("/dashboard")}
          >
            ← Back
          </button>

          <h1>Farmer Registration</h1>
          <p className="registration-subtitle">
            {count} field{count === 1 ? "" : "s"} saved for {savedBundle.fullName}
          </p>

          <div className="registration-success-panel">
            <p>
              Field details are stored. Sensors for each field will show on the
              dashboard from Firebase.
            </p>
            <ul className="registration-field-list">
              {savedBundle.fields.map((field) => (
                <li key={field.id}>
                  <strong>{field.name}</strong>
                  <span>{field.locationLabel || "No location"}</span>
                </li>
              ))}
            </ul>

            <div className="registration-success-actions">
              {count < MAX_FIELDS && (
                <button
                  type="button"
                  className="registration-submit secondary"
                  onClick={startNextField}
                >
                  Register next field
                </button>
              )}
              <button
                type="button"
                className="registration-submit"
                onClick={() => navigate("/farmer-dashboard")}
              >
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-page">
      <div className="registration-card large-card">
        <button
          type="button"
          className="registration-back"
          onClick={() => navigate("/dashboard")}
        >
          ← Back
        </button>

        <h1>Farmer Registration</h1>
        <p className="registration-subtitle">
          {personalLocked
            ? `Enter details for Field ${nextFieldNumber} (name & address locked)`
            : "Enter your farming details for Field 1"}
        </p>

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
                readOnly={personalLocked}
                className={personalLocked ? "input-locked" : undefined}
              />

              <label>Address</label>
              <textarea
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                readOnly={personalLocked}
                className={personalLocked ? "input-locked" : undefined}
              />

              <label>Farming Experience</label>
              <input
                type="number"
                name="experience"
                min="0"
                placeholder="Years of experience"
                value={formData.experience}
                onChange={handleChange}
                readOnly={personalLocked}
                className={personalLocked ? "input-locked" : undefined}
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
              <label>
                {personalLocked
                  ? `Field ${nextFieldNumber} Location *`
                  : "Farming Location *"}
              </label>
              <input
                type="text"
                name="farmingLocation"
                placeholder="Click on the map or type location (e.g. Ernakulam, Kerala)"
                value={formData.farmingLocation}
                onChange={handleChange}
              />

              <div className="map-wrapper-box">
                <MapContainer
                  center={[9.9816, 76.2999]}
                  zoom={10}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler
                    setLocation={(loc) =>
                      setFormData((prev) => ({ ...prev, farmingLocation: loc }))
                    }
                    setMarker={setMapMarker}
                  />
                  {mapMarker && (
                    <Marker position={[mapMarker.lat, mapMarker.lng]} />
                  )}
                </MapContainer>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="registration-submit"
            disabled={saving || !canAddMore}
          >
            {saving
              ? "Saving…"
              : personalLocked
              ? `Save Field ${nextFieldNumber}`
              : "Save Field 1 & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FarmerRegistration;
