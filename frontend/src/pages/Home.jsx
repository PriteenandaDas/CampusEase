import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Home.css";
import { categoryData,assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <>
      {/* Hero Section */}
      <header className="hero-section text-white text-center d-flex align-items-center justify-content-center position-relative"
       style={{
        background: `url(${assets.heroImage}) no-repeat center center/cover`,
    
      }}>
        {/* Overlay */}
        <div className="overlay"></div>

        <div className="container position-relative">
          <h1 className="fw-bold display-4">CampusEase</h1>
          <h3 className="fw-semibold mb-3">Book Appointments Across Campus</h3>
          <p className="lead mb-4">
            From academic advising and administrative help to health & wellness
            and campus facilities, CampusEase makes scheduling appointments
            simple, fast, and stress‑free.
          </p>
          <a href="#serviceSection" className="btn btnCoffee btn-lg">
            Book Appointment 🡢
          </a>
        </div>
      </header>

      {/* About Section */}
      <section className="container my-5">
        <p className="text-center fs-5">
          CampusEase is your one‑stop appointment booking system designed to
          simplify student life. From academic advising and administrative
          services to health & wellness and campus facilities, our platform
          ensures you can book appointments seamlessly and stay on track with
          your university journey.
        </p>
      </section>

      {/* Services Section */}
      <section id="serviceSection" className="container my-5">
        <h2 className="text-center fw-bold mb-4">Explore Campus Services</h2>
        <div className="row g-4">
          {categoryData.map((category, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <div className="card h-100 shadow-sm">
                <img
                  src={category.image}
                  className="card-img-top"
                  alt={category.name}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{category.name}</h5>
                  <p className="card-text">{category.description}</p>
                  <button
                    onClick={() => navigate(`/services/${category.name}`)}
                    className="btn btnCoffee"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;
