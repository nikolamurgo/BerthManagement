import React from "react";

const TopBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <div className="container-fluid justify-content-between">
        <span className="navbar-brand fw-bold">⚓ Port AI Planner</span>

        <div className="d-flex align-items-center text-white gap-3">
          <i className="bi bi-bell fs-5" title="Notifications"></i>
          <i className="bi bi-gear fs-5" title="Settings"></i>
          <span className="fw-semibold">Admin</span>
          <i className="bi bi-person-circle fs-4" title="Account"></i>
          <i className="bi bi-box-arrow-right fs-5" title="Logout" style={{ cursor: "pointer" }}></i>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
