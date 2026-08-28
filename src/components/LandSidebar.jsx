import React from "react";
import "./LandSidebar.css";

function LandSidebar({
  activeItem = "overview",
  onNavigate,
  onLogout,
  onDeleteAccount,
}) {
  const menuItems = [
    {
      id: "overview",
      icon: "🏠",
      title: "Overview",
      subtitle: "Dashboard 2",
    },
    {
      id: "land-details",
      icon: "📋",
      title: "Land Details",
    },
    {
      id: "edit-land",
      icon: "✏️",
      title: "Edit Land",
    },
    {
      id: "land-location",
      icon: "🗺️",
      title: "Land Location",
    },
    {
      id: "documents",
      icon: "📄",
      title: "Documents",
    },
    {
      id: "account-settings",
      icon: "⚙️",
      title: "Account Settings",
    },
  ];

  return (
    <aside className="land-sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🌱</div>

        <div>
          <h2>AgriSense</h2>
        </div>
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">

        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-menu-item ${
              activeItem === item.id ? "active" : ""
            }`}
            onClick={() => onNavigate && onNavigate(item.id)}
          >
            <span className="sidebar-icon">
              {item.icon}
            </span>

            <span className="sidebar-label">
              <span className="sidebar-title">
                {item.title}
              </span>

              {item.subtitle && (
                <span className="sidebar-subtitle">
                  {item.subtitle}
                </span>
              )}
            </span>
          </button>
        ))}

        {/* SEPARATOR */}
        <div className="sidebar-divider"></div>

        {/* DELETE ACCOUNT */}
        <button
          className="sidebar-menu-item delete-item"
          onClick={onDeleteAccount}
        >
          <span className="sidebar-icon">🗑️</span>

          <span className="sidebar-label">
            <span className="sidebar-title">
              Delete Account
            </span>
          </span>
        </button>

        {/* LOGOUT */}
        <button
          className="sidebar-menu-item logout-item"
          onClick={onLogout}
        >
          <span className="sidebar-icon">🚪</span>

          <span className="sidebar-label">
            <span className="sidebar-title">
              Logout
            </span>
          </span>
        </button>

      </nav>

    </aside>
  );
}

export default LandSidebar;