import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

const ManageResources = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [resource, setResource] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [teachers, setTeachers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    category: "",
    location: "",
    department: "",
    image: null,
    userId: "",
  });

  const categories = [
    "academic",
    "administrative",
    "campus facility",
    "health & wellness",
    "Hostel & housing",
  ];

  // 🔹 Fetch resource
  const fetchResource = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/resource/get-by-id/${id}`);
      const data = await res.json();

      if (data.success) {
        setResource(data.resource);

        setFormData({
          name: data.resource.name || "",
          type: data.resource.type || "",
          category: data.resource.category || "",
          location: data.resource.details?.location || null,
          department: data.resource.details?.department || null,
          image: null,
          userId: data.resource.userId?._id || "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResource();
  }, [id]);

  // 🔹 Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // 🔹 Update resource
  const handleUpdate = async () => {
    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("type", formData.type);
      data.append("category", formData.category);
      data.append("location", formData.location || "");
      data.append("department", formData.department || "");

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (formData.userId) {
        data.append("userId", formData.userId);
      }

      const res = await fetch(`${backendUrl}/api/resource/update/${id}`, {
        method: "PUT",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        setIsEdit(false);
        fetchResource();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // 🔹 Delete resource
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${backendUrl}/api/resource/delete/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        navigate("/admin-dashboard");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Delete failed");
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

  if (!resource) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Manage Resource</h2>

          {!isEdit ? (
            <div>
              <button className="btn btn-danger me-2" onClick={handleDelete}>
                Delete
              </button>

              <button
                className="btn text-white"
                style={{ background: "#342516" }}
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
            </div>
          ) : (
            <div>
              <button className="btn btn-success me-2" onClick={handleUpdate}>
                Save
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setIsEdit(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="row">
          {/* 🔹 IMAGE */}
          <div className="col-md-4 text-center">
            <img
              src={
                formData.image
                  ? URL.createObjectURL(formData.image)
                  : resource.image
              }
              alt="resource"
              className="img-fluid rounded"
              style={{ height: "200px", objectFit: "cover" }}
            />

            {isEdit && (
              <input
                type="file"
                className="form-control mt-2"
                onChange={handleImageChange}
              />
            )}
          </div>

          {/* 🔹 DETAILS */}
          <div className="col-md-8">
            {/* Name */}
            <div className="mb-3">
              <label>Name</label>
              {isEdit ? (
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <p className="form-control bg-light">{resource.name}</p>
              )}
            </div>

            {/* Type */}
            <div className="mb-3">
              <label>Type</label>
              {isEdit ? (
                <input
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <p className="form-control bg-light">{resource.type}</p>
              )}
            </div>

            {["teacher", "doctor", "staff"].includes(
              formData.type.toLowerCase(),
            ) && (
              <div className="mb-3">
                <label>Assign User Email</label>
                {isEdit ? (
                  <select
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select User</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.email}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="form-control bg-light">
                    {resource.userId ? resource.userId.email : "N/A"}
                  </p>
                )}
              </div>
            )}

            {/* Category */}
            <div className="mb-3">
              <label>Category</label>
              {isEdit ? (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="form-control bg-light">{resource.category}</p>
              )}
            </div>

            {/* Location */}
            <div className="mb-3">
              <label>Location</label>
              {isEdit ? (
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <p className="form-control bg-light">
                  {resource.details?.location || "N/A"}
                </p>
              )}
            </div>

            {/* Department */}
            <div className="mb-3">
              <label>Department</label>
              {isEdit ? (
                <input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <p className="form-control bg-light">
                  {resource.details?.department || "N/A"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageResources;
