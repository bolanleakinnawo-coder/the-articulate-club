import React from "react";
import { Link } from "react-router-dom";
import AboutImg from "../assets/about.jpeg";

const checklistItems = [
  "You often know what to say but struggle to express it clearly.",
  "You want to become more confident in conversations and public speaking.",
  "You're looking for consistent speaking practice in a supportive community.",
  "You're ready to grow into a confident, articulate communicator.",
];

export default function About() {
  return (
    <section className="about">
      {/* ================= Header ================= */}
      <div className="about-band">
        <div className="about-band-inner">
          <p className="about-eyebrow">About The Articulate Club</p>

          <h1 className="about-headline">
            Every Voice Deserves to Be Heard Clearly
          </h1>
        </div>
      </div>

      {/* ================= Story ================= */}
      <div className="about-story">
        <div className="about-story-inner">
          {/* Left - Image */}
          <div className="about-portrait">
            <img src={AboutImg} alt="Azimah, Founder of The Articulate Club" />
          </div>

          {/* Right - Story */}
          <div className="about-story-text">
            <p>
              Many people are intelligent but struggle to express themselves
              with confidence. Some speak too fast. Some second-guess every
              word. Others stay silent because they're afraid of getting it
              wrong.
            </p>

            <p>
              The Articulate Club was created to change that. Through consistent
              practice, meaningful conversations, and a supportive community, we
              help people become confident communicators—one week at a time.
            </p>

            <blockquote className="about-quote">
              “...a community that feels like home.”
              <cite>— Azimah, Founder</cite>
            </blockquote>

            {/* Mission & Vision */}
            <div className="about-cards">
              <div className="about-card">
                <span className="about-card-icon">✦</span>

                <h3>Mission</h3>

                <p>
                  To help people become confident, articulate, and intentional
                  communicators through practical speaking experiences and
                  genuine community.
                </p>
              </div>

              <div className="about-card">
                <span className="about-card-icon">✦</span>

                <h3>Vision</h3>

                <p>
                  To become one of Africa's most trusted communities for raising
                  confident voices and impactful communicators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Who This Is For ================= */}
      <div className="about-checklist">
        <div className="about-checklist-inner">
          <p className="check-eyebrow">Who This Is For</p>

          <h2>You'll Feel Right at Home Here If...</h2>

          <div className="check-grid">
            {checklistItems.map((item, index) => (
              <div className="check-card" key={index}>
                <span className="check-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= Closing ================= */}
      <div className="about-closing">
        <p>Wherever you're starting from, there's a place for you here.</p>

        <Link to="/journey" className="about-closing-link">
          See the Weekly Journey →
        </Link>
      </div>
    </section>
  );
}
