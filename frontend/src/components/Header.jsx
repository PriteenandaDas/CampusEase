import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import "../styles/Header.css";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, logout, userData } = useContext(AppContext);
  const handleDashboard = () => {
    if (userData?.role === "admin") return navigate("/admin-dashboard");
    if (userData?.role === "teacher") return navigate("/teacher-dashboard");
    return navigate("/student-dashboard");
  };

  return (
    <nav className="navbar navbar-expand-lg px-4 custom-navbar d-flex align-items-center justify-content-between border-bottom border-secondary">
      <div className="container-fluid">
        {/* Logo */}
        <div
          className="navbar-brand d-flex align-items-center text-white"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <img
            src={assets.logo}
            alt="CampusEase Logo"
            width="40"
            height="40"
            className="rounded-circle me-2"
          />
          <span className="fw-bold">CampusEase</span>
        </div>

        {/* Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <span
                className="nav-link text-white"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                Home
              </span>
            </li>

            <li className="nav-item">
              <span
                className="nav-link text-white"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/services")}
              >
                Services
              </span>
            </li>

            <li className="nav-item">
              <span
                className="nav-link text-white"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/about")}
              >
                About
              </span>
            </li>

            <li className="nav-item">
              <span
                className="nav-link text-white"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/contact")}
              >
                Contacts
              </span>
            </li>

            {isLoggedIn && (
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  style={{ cursor: "pointer" }}
                  onClick={handleDashboard}
                >
                  Dashboard
                </span>
              </li>
            )}
          </ul>

          {/* Auth Buttons */}
          <div className="d-flex">
            {isLoggedIn ? (
              <div className="dropdown me-5">
                <img
                  src={assets.profile}
                  alt="profile"
                  className="rounded-circle"
                  height="40"
                  width="40"
                  role="button"
                  data-bs-toggle="dropdown"
                  style={{ cursor: "pointer" }}
                />

                <ul className="dropdown-menu dropdown-menu-end bg-coffee">
                  <li>
                    <button
                      onClick={() => navigate("/my-profile")}
                      className="dropdown-item text-light"
                    >
                      My Profile
                    </button>
                  </li>
                  {/* <li>
                    <button
                      onClick={() => navigate("/appointments")}
                      className="dropdown-item text-light"
                    >
                      My Appointments
                    </button>
                  </li> */}
                  <li>
                    <button
                      onClick={async () => {
                        await logout();
                        navigate("/");
                      }}
                      className="dropdown-item text-light"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-outline-light me-2"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="btn btnCoffee"
                >
                  Signup
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
