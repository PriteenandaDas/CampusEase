import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

const ManageServices = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [service, setService] = useState(null);
  const [allResources, setAllResources] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    image: null,
  });

  const categories = [
    "academic",
    "administrative",
    "campus facility",
    "health & wellness",
    "Hostel & housing",
  ];

  //Display the resources acc to the category and hides the assigned resource
  const filteredResources = service
    ? allResources.filter(
        (r) =>
          r.category === service.category &&
          !service.resources?.some((sr) => sr._id === r._id),
      )
    : [];

  // Fetch service (with resources)
  const fetchService = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/service/get-by-id/${id}`);
      const data = await res.json();

      if (data.success) {
        setService(data.service);
        setFormData({
          name: data.service.name,
          category: data.service.category,
          description: data.service.description,
          image: null,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all resources
  const fetchResources = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/resource/get`);
      const data = await res.json();

      if (data.success) {
        setAllResources(data.resources);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchService();
    fetchResources();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // UPDATE SERVICE
  const handleUpdate = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("description", formData.description);

      if (formData.image) data.append("image", formData.image);

      const res = await fetch(`${backendUrl}/api/service/update/${id}`, {
        method: "PUT",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        setIsEdit(false);
        fetchService();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Update failed");
    }
  };

  // DELETE SERVICE
  const handleDelete = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/service/delete/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        navigate("/admin-dashboard");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  // ADD RESOURCE
  const handleAddResource = async (resourceId) => {
    const res = await fetch(`${backendUrl}/api/service/add-resource/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resourceId }),
    });

    const data = await res.json();
    toast[data.success ? "success" : "error"](data.message);

    if (data.success) fetchService();
  };

  // REMOVE RESOURCE
  const handleRemoveResource = async (resourceId) => {
    const res = await fetch(`${backendUrl}/api/service/remove-resource/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resourceId }),
    });

    if (!window.confirm("Remove this resource from service?")) return;
    const data = await res.json();
    toast[data.success ? "success" : "error"](data.message);

    if (data.success) fetchService();
  };

  if (!service) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Manage Service</h2>

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

        <div className="row mt-4">
          {/* IMAGE */}
          <div className="col-md-4 text-center">
            <img
              src={
                formData.image
                  ? URL.createObjectURL(formData.image)
                  : service.image
              }
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

          {/* DETAILS */}
          <div className="col-md-8">
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
                <p className="form-control bg-light">{service.name}</p>
              )}
            </div>

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
                <p className="form-control bg-light">{service.category}</p>
              )}
            </div>

            <div className="mb-3">
              <label>Description</label>
              {isEdit ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <p className="form-control bg-light">{service.description}</p>
              )}
            </div>
            {/* 🔥 RESOURCES HERE */}
            <div className="mt-4">
              <h5 style={{ color: "#4b2e2e" }}>Assigned Resources</h5>

              <div className="row">
                {service.resources?.map((r) => (
                  <div className="col-md-6 mb-3" key={r._id}>
                    <div
                      className="card shadow-sm p-2 d-flex flex-row align-items-center"
                      style={{ transition: "0.3s" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.02)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <img
                        src={r.image}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />

                      <div className="ms-3 flex-grow-1">
                        <p className="mb-1 fw-semibold">{r.name}</p>

                        <button
                          className="btn btn-danger btn-sm"
                          disabled={!isEdit}
                          onClick={() => handleRemoveResource(r._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 🔥 ADD RESOURCES */}
            <div className="mt-4">
              <h5 style={{ color: "#4b2e2e" }}>Add Resources</h5>

              <div className="row">
                {filteredResources.map((r) => (
                  <div className="col-md-6 mb-3" key={r._id}>
                    <div
                      className="card shadow-sm p-2 d-flex flex-row align-items-center"
                      style={{ transition: "0.3s" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.02)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <img
                        src={r.image}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />

                      <div className="ms-3 flex-grow-1">
                        <p className="mb-1 fw-semibold">{r.name}</p>

                        <button
                          className="btn btn-success btn-sm"
                          disabled={!isEdit}
                          onClick={() => handleAddResource(r._id)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RESOURCES SECTION
        <div className="mt-5">
          <h4>Assigned Resources</h4>

          <div className="row">
            {service.resources?.map((r) => (
              <div className="col-md-3 mb-3" key={r._id}>
                <div className="card p-2 text-center shadow-sm">
                  <img
                    src={r.image}
                    style={{
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <p className="mt-2">{r.name}</p>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveResource(r._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h4 className="mt-4">Add Resources</h4>

          <div className="row">
            {filteredResources.map((r) => (
              <div className="col-md-3 mb-3" key={r._id}>
                <div className="card p-2 text-center shadow-sm">
                  <img
                    src={r.image}
                    style={{
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <p className="mt-2">{r.name}</p>

                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleAddResource(r._id)}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ManageServices;
