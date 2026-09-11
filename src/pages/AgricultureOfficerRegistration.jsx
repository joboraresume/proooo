import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RoleRegistration.css";

const API_BASE = (
  import.meta?.env?.VITE_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

function AgricultureOfficerRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    department: "",
    designation: "",
    district: "",
    officeAddress: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.fullName ||
      !formData.employeeId ||
      !formData.department ||
      !formData.district
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
        employee_id: formData.employeeId,
        department: formData.department,
        designation: formData.designation || null,
        phone: user.phone,
        email: user.email || null,
        district: formData.district,
        office_address: formData.officeAddress || null,
      };

      const response = await fetch(
        `${API_BASE}/api/profiles/agriculture-officer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Officer registration failed.");
        return;
      }

      /*
       * IMPORTANT:
       * Keep the user on the main Dashboard after registration.
       * The Dashboard will now recognize the officer registration and
       * show "Open dashboard" on the Agriculture Officer card.
       */
      localStorage.setItem("agricultureOfficerRegistered", "true");
      localStorage.setItem("agrisenseRole", "agriculture-officer");
      localStorage.setItem("showDashboardAfterRegistration", "true");
      localStorage.setItem(
        "agrisenseOfficer",
        JSON.stringify({
          full_name: formData.fullName,
          employee_id: formData.employeeId,
          department: formData.department,
          designation: formData.designation || null,
          district: formData.district,
          office_address: formData.officeAddress || null,
        })
      );

      /*
       * Store the officer profile locally as a fallback so the role
       * remains visible even if the profile GET request is temporarily
       * stale or unavailable.
       */
      try {
        const existingProfiles = JSON.parse(
          localStorage.getItem("agrisenseProfiles") || "{}"
        );

        const normalizedProfiles =
          Array.isArray(existingProfiles)
            ? {
                officer: true,
                agriculture_officer: true,
              }
            : {
                ...existingProfiles,
                officer: true,
                agriculture_officer: true,
              };

        localStorage.setItem(
          "agrisenseProfiles",
          JSON.stringify(normalizedProfiles)
        );
      } catch {
        localStorage.setItem(
          "agrisenseProfiles",
          JSON.stringify({
            officer: true,
            agriculture_officer: true,
          })
        );
      }

      alert(
        "Agriculture officer registration completed successfully!"
      );

      // Go to the main dashboard, NOT directly to the officer dashboard.
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating officer profile:", error);
      alert("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-card">
        <button
          type="button"
          className="registration-back"
          onClick={() => navigate("/dashboard")}
        >
          ← Back
        </button>

        <h1>👨‍💼 Agriculture Officer</h1>

        <p className="registration-subtitle">
          Enter your official details
        </p>

        <form className="registration-form" onSubmit={handleSubmit}>
          <label>Full Name *</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <label>Employee ID *</label>
          <input
            type="text"
            name="employeeId"
            placeholder="Enter employee ID"
            value={formData.employeeId}
            onChange={handleChange}
          />

          <label>Department *</label>
          <input
            type="text"
            name="department"
            placeholder="Enter department"
            value={formData.department}
            onChange={handleChange}
          />

          <label>Designation</label>
          <input
            type="text"
            name="designation"
            placeholder="Example: Agricultural Officer"
            value={formData.designation}
            onChange={handleChange}
          />

          <label>District *</label>
          <input
            type="text"
            name="district"
            placeholder="Example: Ernakulam"
            value={formData.district}
            onChange={handleChange}
          />

          <label>Office Address</label>
          <textarea
            name="officeAddress"
            placeholder="Enter office address"
            value={formData.officeAddress}
            onChange={handleChange}
          />

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

export default AgricultureOfficerRegistration;
