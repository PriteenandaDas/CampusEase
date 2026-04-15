import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ServiceContext } from "../context/ServiceContext.jsx";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Services = () => {
  const navigate = useNavigate();
  const { serviceData, loading } = useContext(ServiceContext);
  const { isLoggedIn, userData } = useContext(AppContext);
  const { category } = useParams();

  const [filterService, setFilterService] = useState([]);

  // ✅ Apply filter
  const applyFilter = () => {
    if (!serviceData || serviceData.length === 0) return;

    if (category) {
      setFilterService(
        serviceData.filter(
          (service) =>
            service.category.toLowerCase() === category.toLowerCase(),
        ),
      );
    } else {
      setFilterService(serviceData);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [serviceData, category]);

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-dark"></div>
        <p className="mt-2">Loading services...</p>
      </div>
    );
  }

  const handleServiceClick = (serviceId) => {
    // ❌ Not logged in
    if (!isLoggedIn) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    // ❌ Not student
    if (userData?.role !== "student") {
      toast.error("Only students can book appointments");
      return;
    }

    // ✅ Student → go to appointment
    navigate(`/appointment/${serviceId}`);
  };

  return (
    <div className="container-fluid my-5">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="list-group">
            <button
              onClick={() =>
                category === "academic"
                  ? navigate("/services")
                  : navigate("/services/academic")
              }
              className={`list-group-item list-group-item-action fw-bold mb-3 rounded ${
                category === "academic" ? "bg-secondary text-light" : ""
              }`}
            >
              Academic
            </button>

            <button
              onClick={() =>
                category === "administrative"
                  ? navigate("/services")
                  : navigate("/services/administrative")
              }
              className={`list-group-item list-group-item-action fw-bold mb-3 rounded ${
                category === "administrative" ? "bg-secondary text-light" : ""
              }`}
            >
              Administrative
            </button>

            <button
              onClick={() =>
                category === "campus facility"
                  ? navigate("/services")
                  : navigate("/services/campus facility")
              }
              className={`list-group-item list-group-item-action fw-bold mb-3 rounded ${
                category === "campus facility" ? "bg-secondary text-light" : ""
              }`}
            >
              Campus Facility
            </button>

            <button
              onClick={() =>
                category === "health & wellness"
                  ? navigate("/services")
                  : navigate("/services/health & wellness")
              }
              className={`list-group-item list-group-item-action fw-bold mb-3 rounded ${
                category === "health & wellness"
                  ? "bg-secondary text-light"
                  : ""
              }`}
            >
              Health & Wellness
            </button>

            <button
              onClick={() =>
                category === "hostel & housing"
                  ? navigate("/services")
                  : navigate("/services/hostel & housing")
              }
              className={`list-group-item list-group-item-action fw-bold mb-3 rounded ${
                category === "hostel & housing" ? "bg-secondary text-light" : ""
              }`}
            >
              Hostel & Housing
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <div className="mb-4 text-center">
            <h3
              style={{ color: "#4b2e2e", fontWeight: "bold" }}
              className="fw-bold"
            >
              {category
                ? `Browse through ${category} services`
                : "Browse through all services"}
            </h3>
          </div>

          <div className="row">
            {filterService.length > 0 ? (
              filterService.map((service) => (
                <div className="col-md-4 mb-4" key={service._id}>
                  <div
                   onClick={() => handleServiceClick(service._id)}
                    className="card h-100 shadow border-0"
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={service.image}
                      alt="service"
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{service.name}</h5>
                      <p className="card-text text-secondary">
                        {service.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center mt-5">
                <h5>No services found</h5>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
