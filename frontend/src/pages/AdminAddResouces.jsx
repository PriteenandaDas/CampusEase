import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminAddResource = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [teachers, setTeachers] = useState([]);

  const [formData, setFormData] = useState({
    type: "",
    name: "",
    category: "",
    department: "",
    location: "",
    image: null,
    userId: "",
  });

  // Handle text change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      form.append("type", formData.type);
      form.append("name", formData.name);
      form.append("category", formData.category);
      form.append("department",formData.department || "");
      form.append("location",formData.location || "");

      if (formData.image) {
        form.append("image", formData.image);
      }

      if (formData.userId) {
        form.append("userId", formData.userId);
      }

      const res = await fetch(`${backendUrl}/api/resource/add`, {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const data = await res.json();

      toast.success(data.message);

      if (data.success) {
        navigate("/admin-dashboard"); // back to dashboard
      }
    } catch (err) {
      toast.error(err);
    }
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/user/teachers`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          setTeachers(data.teachers);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTeachers();
  }, []);

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="mb-4" style={{ color: "#4b2e2e" }}>
          Add New Resource
        </h3>

        <form onSubmit={handleSubmit}>
          {/* TYPE */}
          <div className="mb-3">
            <label className="form-label">Type</label>
            <input
              type="text"
              name="type"
              className="form-control"
              value={formData.type}
              onChange={handleChange}
              placeholder="e.g. teacher, doctor, sports, library, appliances, facility etc"
              required
            />
          </div>

          {["teacher", "doctor", "staff"].includes(
            formData.type.toLowerCase(),
          ) && (
            <div className="mb-3">
              <label className="form-label">Assign User Email</label>
              <select
                name="userId"
                className="form-control"
                value={formData.userId}
                onChange={handleChange}
                required
              >
                <option value="">Select User</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.email};  
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* NAME */}
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Dr. Mithali Raj, Common Room 100 etc"
              required
            />
          </div>

          {/* CATEGORY */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="academic">Academic</option>
              <option value="administrative">Administrative</option>
              <option value="campus facility">Campus Facility</option>
              <option value="health & wellness">Health & Wellness</option>
              <option value="hostel & housing">Hostel & Housing</option>
            </select>
          </div>

          {/* DEPARTMENT */}
          <div className="mb-3">
            <label className="form-label">Department (Optional)</label>
            <input
              type="text"
              name="department"
              className="form-control"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. CSE, Admin Office"
            />
          </div>

          {/* LOCATION */}
          <div className="mb-3">
            <label className="form-label">Location (Optional)</label>
            <input
              type="text"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Block A, Room 101"
            />
          </div>

          {/* IMAGE */}
          <div className="mb-3">
            <label className="form-label">Resource Image</label>
            <input
              type="file"
              className="form-control"
              onChange={handleImageChange}
            />
          </div>

          {/* BUTTONS */}
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/admin-dashboard")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn text-white"
              style={{ background: "#342516" }}
              onClick={() => navigate("/admin-dashboard")}
            >
              Add Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddResource;
