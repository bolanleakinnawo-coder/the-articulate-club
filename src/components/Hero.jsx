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
          <div className="hero-badge">Find your voice.</div>

          <h1 className="hero-headline">
            Become a More Confident, Articulate Communicator.
          </h1>

          <p className="hero-subhead">
            A free, structured community where practice, not theory, transforms
            the way you communicate.
          </p>

          <div className="hero-cta-row">
            <button className="btn-primary" onClick={openModal}>
              Join The Articulate Club.
            </button>
            <a href="/handbook.pdf" className="btn-secondary">
              Read the Member Handbook
            </a>
          </div>

          <div className="hero-stats">
            {[
              ["4,000+", "Members"],
              ["100% Free", "Community"],
              ["Weekly", "Activities"],
              ["15+", "Countries"],
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
            <span className="founder-name">Azimah</span>
            <span className="founder-role">Founder, The Articulate Club</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
