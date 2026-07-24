import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}

        <div className="footer-brand">
          <h2>The Articulate Club</h2>

          <p>
            Helping people become confident, articulate, and intentional
            communicators through consistent practice and community.
          </p>
        </div>

        {/* Quick Links */}

        <div className="footer-links">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <a
                href="/MemberHandbook.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Member Handbook
              </a>
            </li>

            <li>
              <Link to="/academy">The Articulate Academy</Link>
            </li>

            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Socials */}

        <div className="footer-links">
          <h3>Connect with Azimah</h3>

          <ul>
            <li>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>

            <li>
              <a
                href="https://tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                TikTok
              </a>
            </li>

            <li>
              <a
                href="https://wa.me/2348133146418"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </li>

            <li>
              <a href="mailto:theazimahofficial@gmail.com">Email</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 The Articulate Club. All rights reserved.</p>
      </div>
    </footer>
  );
}
