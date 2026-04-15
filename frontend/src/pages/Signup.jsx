import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Auth.css";
import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const Signup = () => {
  const { backendUrl, setIsLoggedIn, setUserData } = useContext(AppContext);
  const [formData, setFormData] = useState({
    fullname: "",
    role: "student",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Validation
  const validate = () => {
    if (formData.fullname.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  // ✅ Signup handler
  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/signup`, formData, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Account created 🎉");

        setIsLoggedIn(true);
        setUserData(res.data.user);

        setTimeout(() => {
          if (res.data.user.role === "student") {
            navigate("/student-dashboard");
          } else if (res.data.user.role === "teacher") {
            navigate("/teacher-dashboard");
          }
        }, 100);
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light mt-5 mb-5 auth-page">
      <div className="row shadow-lg rounded overflow-hidden w-75 auth-card">
        {/* LEFT SECTION */}
        <div className="col-md-6 bg-white p-5">
          <h2 className="fw-bold mb-3">Create Account</h2>
          <p className="text-muted mb-4">Join our campus community today.</p>

          {/* Inputs */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="form-control"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-control"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">University Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="john.doe@university.edu"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="btn btn-primary w-100 mt-3"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="mt-3 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none auth-link">
              Login here
            </Link>
          </p>
        </div>

        {/* RIGHT INFO PANEL */}
        <div className="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center auth-info-section">
          <img
            src="/images/campus_facility.jpg"
            alt="Campus"
            className="img-fluid rounded mb-3 auth-image"
          />
          <h3 className="fw-bold">Welcome to CampusEase</h3>
          <p className="text-center">
            Access all your campus services, appointments, and academic
            documents in one place. Your journey starts here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
