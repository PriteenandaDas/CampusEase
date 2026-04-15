import "../styles/About.css";

const About = () => {
  return (
    <>
      <div className="container my-5">
        {/* Heading */}
        <div className="text-center fs-2 pt-2 text-secondary fw-bold">
          ABOUT US
        </div>

        {/* Content Section */}
        <div className="d-flex flex-column flex-md-row align-items-center gap-5 my-5">
          {/* Left Image */}
          <div className="flex-shrink-0">
            <img
              src="./images/aboutUs.jpg"
              alt="about image"
              className="img-fluid rounded shadow"
              style={{ maxWidth: "400px" }}
            />
          </div>

          {/* Right Text */}
          <div className="text-secondary">
            <p>
              Welcome to <span className="fw-bold">CampusEase</span>, your
              trusted partner in simplifying campus appointment booking and
              resource management. We understand the challenges students,
              faculty, and staff face when it comes to scheduling meetings,
              reserving facilities, and managing campus services efficiently.
            </p>
            <p>
              CampusEase is committed to excellence in campus technology. We
              continuously refine our platform, integrating modern design and
              responsive features to enhance usability and deliver a seamless
              experience. Whether you’re booking your first appointment or
              managing ongoing campus activities, CampusEase is here to support
              you every step of the way.
            </p>
            <h5 className="fw-bold mt-4">Our Vision</h5>
            <p>
              Our vision at CampusEase is to create a unified, user‑friendly
              system that bridges the gap between campus communities and service
              providers. We aim to make it easier for everyone to access the
              resources they need, when they need them, while maintaining
              consistency with campus branding and accessibility standards.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="text-center fs-3 fw-bold text-secondary mt-5">
          WHY CHOOSE US
        </div>

        <div className="row mt-4">
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow border-0 choice-card">
              <div className="card-body">
                <h5 className="card-title fw-bold text-dark">EFFICIENCY</h5>
                <p className="card-text text-secondary">
                  Streamlined appointment scheduling and resource booking that
                  fits into your busy academic life.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow border-0 choice-card">
              <div className="card-body">
                <h5 className="card-title fw-bold text-dark">CONVENIENCE</h5>
                <p className="card-text text-secondary">
                  Centralized access to campus services, facilities, and staff —
                  all in one place.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow border-0 choice-card">
              <div className="card-body">
                <h5 className="card-title fw-bold text-dark">
                  PERSONALIZATION
                </h5>
                <p className="card-text text-secondary">
                  Tailored reminders, theme‑consistent design, and accessibility
                  features to help you stay organized and connected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
