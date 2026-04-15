import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Auth.css";
import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, setUserData } = useContext(AppContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Validation
  const validate = () => {
    if (!formData.email || !formData.password) {
      toast.error("All fields are required");
      return false;
    }
    return true;
  };

  // ✅ Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/login`, formData, {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error(res.data.message || "Login failed");
        return;
      }

      toast.success("Login successful 🎉");

      // since login API only returns role → fetch full profile
      const profileRes = await axios.get(`${backendUrl}/api/user/profile`, {
        withCredentials: true,
      });

      const user = profileRes.data.user;

      setIsLoggedIn(true);
      setUserData(user);

      // navigate based on role
      if (user.role === "teacher") {
        navigate("/teacher-dashboard");
      } else if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }
      // navigate(
      //   user.role === "teacher"
      //     ? "/teacher-dashboard"
      //     : "/student-dashboard"
      // );
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      console.log(err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row shadow-lg rounded overflow-hidden login-card">
        {/* LEFT IMAGE SECTION */}
        <div className="col-md-6 p-0 position-relative">
          <div
            className="h-100 d-flex flex-column justify-content-center align-items-center text-white text-center p-4"
            style={{
              backgroundImage: "url('./images/login_bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="login-overlay rounded">
              <h1 className="fw-bold">Your gateway to campus excellence.</h1>
              <p className="lead">
                Access your academic scheduling, administrative requests, and
                faculty bookings in one central hub.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="col-md-6 bg-light p-5">
          <h2 className="fw-bold mb-3">Welcome Back</h2>
          <p className="text-muted mb-4">
            Enter your credentials to access your dashboard
          </p>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="name@university.edu"
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
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-coffee w-100 mb-3"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>

            <p className="text-center">
              Don't have an account yet?{" "}
              <Link to="/signup" className="auth-link">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
