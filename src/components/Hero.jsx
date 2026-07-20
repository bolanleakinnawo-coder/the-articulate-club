import React from "react";
import { Circle } from "lucide-react";
import heroPortrait from "../assets/heroimg.jpeg";

const Hero = ({ openModal }) => {
  return (
    <header className="ac-hero">
      <div className="ac-hero-ring" />

      <div className="hero-grid">
        {/* LEFT CONTENT */}
        <div>
          <div className="hero-badge">Hi, I'm Azimah.</div>

          <h1 className="hero-headline">
            Become a More Confident, Articulate Communicator.
          </h1>

          <p className="hero-subhead">
            A free, structured community where practice, not theory, builds your
            voice.
          </p>

          <div className="hero-cta-row">
            <button className="btn-primary" onClick={openModal}>
              Join The Club
            </button>

            <a href="#about" className="btn-secondary">
              Learn More
            </a>
          </div>

          <div className="hero-stats">
            {[
              ["3,500+", "Members"],
              ["Free", "Community"],
              ["Weekly", "Activities"],
            ].map(([number, label]) => (
              <div key={label}>
                <div className="hero-stat-num">{number}</div>
                <div className="hero-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hero-portrait">
          <img src={heroPortrait} alt="Azimah" />

          <div className="hero-live-card">
            <Circle
              size={9}
              className="pulse-dot"
              fill="#3B4A2C"
              color="#3B4A2C"
            />
            Live Every Saturday
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
