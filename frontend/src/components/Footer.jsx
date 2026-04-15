import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer text-white py-3">
      <div className="container text-center">
        {/* Links */}
        <div className="footer_links mb-2">
          <Link to="/privacy" className="mx-2 text-decoration-none footer-link">
            Privacy Policy
          </Link>
          <Link to="/terms" className="mx-2 text-decoration-none footer-link">
            Terms of Service
          </Link>
          <Link to="/emergency" className="mx-2 text-decoration-none footer-link">
            Emergency Contact
          </Link>
        </div>

        {/* Copy */}
        <p className="footer_copy mb-0 small">
          © 2026 CampusEase University Portal. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
