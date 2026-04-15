import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, backendUrl, fetchProfile } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    image: null,
  });

  // Pre-fill form when edit starts
  useEffect(() => {
    if (userData) {
      setFormData({
        fullname: userData.fullname || "",
        email: userData.email || "",
        image: null,
      });
    }
  }, [userData, isEdit]);

  if (!userData) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Save profile
  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("fullname", formData.fullname);
      data.append("email", formData.email);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const res = await fetch(`${backendUrl}/api/user/update/${userData._id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        await fetchProfile(); // refresh user
        setIsEdit(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>My Profile</h2>
          {!isEdit ? (
            <button className="btn btn-danger" onClick={() => setIsEdit(true)}>
              Edit
            </button>
          ) : (
            <div>
              <button className="btn btn-success me-2" onClick={handleSave}>
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
          {/* LEFT - IMAGE */}
          <div className="col-md-4 text-center">
            <img
              src={
                formData.image
                  ? URL.createObjectURL(formData.image)
                  : userData.image || "/images/default_profile.png"
              }
              alt="Profile"
              className="rounded-circle mb-3"
              width="150"
              height="150"
              style={{ objectFit: "cover" }}
            />

            {isEdit && (
              <input
                type="file"
                className="form-control"
                onChange={handleImageChange}
              />
            )}
          </div>

          {/* RIGHT - DETAILS */}
          <div className="col-md-8">
            {/* Name */}
            <div className="mb-3">
              <label className="form-label">Name</label>
              {isEdit ? (
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <p className="form-control bg-light">{userData.fullname}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              {isEdit ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <p className="form-control bg-light">{userData.email}</p>
              )}
            </div>

            {/* Role (non-editable) */}
            <div className="mb-3">
              <label className="form-label">Role</label>
              <p className="form-control bg-light text-capitalize">
                {userData.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
