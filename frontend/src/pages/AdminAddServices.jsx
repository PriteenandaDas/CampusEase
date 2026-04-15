import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminAddService = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      form.append("name", formData.name);
      form.append("category", formData.category);
      form.append("description", formData.description);

      if (formData.image) {
        form.append("image", formData.image);
      }

      const res = await fetch(`${backendUrl}/api/service/add`, {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const data = await res.json();

      toast(data.message);

      if (data.success) {
        navigate("/admin-dashboard"); // go back to dashboard
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="mb-4" style={{ color: "#4b2e2e" }}>
          Add New Service
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label">Service Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category */}
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

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Image */}
          <div className="mb-3">
            <label className="form-label">Service Image</label>
            <input
              type="file"
              className="form-control"
              onChange={handleImageChange}
            />
          </div>

          {/* Buttons */}
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
            >
              Add Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddService;