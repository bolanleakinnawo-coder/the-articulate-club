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

          {/* Right - Story */}
          <div className="about-story-text">
            <p>
              I believe too many people stay silent, not because they have
              nothing to say, but because they struggle to express themselves
              with confidence.
            </p>
            <p>
              That’s why I created The Articulate Club. A place where
              communication isn’t just taught. It’s practised. Where mistakes
              are welcomed, growth is intentional, and every member has the
              opportunity to become a more confident, articulate communicator.
              Today, that vision has grown into a global community of people who
              are choosing to show up, practise consistently, and find their
              voice together.
            </p>

            <blockquote className="about-quote">
              Azimah
              <cite>— Founder, The Articulate Club</cite>
            </blockquote>
            {/* Mission & Vision */}
            <div className="about-cards">
              <div className="about-card">
                <span className="about-card-icon">✦</span>

                <h3>Mission</h3>

                <p>
                  To help you become a confident, articulate, and intentional
                  communicator through consistent practice, practical speaking
                  experiences, and a supportive community.
                </p>
              </div>

              <div className="about-card">
                <span className="about-card-icon">✦</span>

                <h3>Vision</h3>

                <p>
                  To build a trusted global community where every voice is
                  trained to communicate with confidence, clarity, and purpose.
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
     
    </section>
  );
}
