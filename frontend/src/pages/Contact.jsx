const Contact = () => {
  return (
    <>
    <div className="container my-5">
      {/* Heading */}
      <div className="text-center fs-2 pt-2 text-secondary fw-bold">
        CONTACT US
      </div>

      {/* Contact Section */}
      <div className="d-flex flex-column flex-md-row align-items-center gap-5 my-5">
        {/* Left Image */}
        <div className="flex-shrink-0">
          <img
            src="./images/contact-us.jpg"
            alt="contact image"
            className="img-fluid rounded shadow"
            style={{ maxWidth: "400px" }}
          />
        </div>

        {/* Right Info */}
        <div className="text-secondary">
          <h5 className="fw-bold">OUR OFFICE</h5>
          <p>
            CampusEase HQ <br />
            123 Academic Lane <br />
            Suite 101, Bhubaneswar, India
          </p>
          <p>
            Tel: (+91) 00000‑00000 <br />
            Email: support@campusease.com
          </p>

          <h5 className="fw-bold mt-4">CAREERS AT CAMPUSEASE</h5>
          <p>
            Learn more about our teams and job openings. We’re always looking
            for passionate individuals to join us in building smarter campus
            solutions.
          </p>
          <button className="btn btn-coffee fw-bold">Explore Jobs</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Contact;
