import { Link } from "react-router-dom";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}

        <div className="footer-brand">
          <h2>Connect with Azimah</h2>
        </div>

        {/* Socials */}

        <div className="footer-links">
          <div className="footer-socials">
            <a
              href="https://www.instagram.com/the_azimah?igsh=MWF0NWcyZnQ4bGRxYg%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="social-icon"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://www.tiktok.com/@the_azimah?_r=1&_t=ZS-98Loo5UG4BR"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="social-icon"
            >
              <FaTiktok size={20} />
            </a>
            <a
              href="https://wa.me/message/VVAUUQXJO2DZO1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="social-icon"
            >
              <FaWhatsapp size={20} />
            </a>
            <a
              href="mailto:theazimahofficial@gmail.com"
              aria-label="Email"
              className="social-icon"
            >
              <MdEmail size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 The Articulate Club. All rights reserved.</p>
      </div>
    </footer>
  );
}
