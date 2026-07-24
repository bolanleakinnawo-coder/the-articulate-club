import React, { useEffect, useRef, useState } from "react";

import {
  Compass,
  Sparkles,
  Users,
  ArrowRight,
  User,
  Circle,
  Menu,
  X,
} from "lucide-react";

import logo from "./assets/logo.png";
import Countries from "./components/Countries";
import Hero from "./components/Hero";
import About from "./components/About";
import Journey from "./components/Journey";
import Testimonials from "./components/Testimonials";
import CommentSection from "./components/CommentSection";
import Academy from "./components/Academy";
import Contact from "./components/Contact";
import JoinModal from "./components/JoinModal";
import CommunityWall from "./components/Testimonials"; // Import the CommunityWall component
import Footer from "./components/Footer";

const NAV_LINKS = ["About", "Journey", "Join", "Academy"];

function useReveal() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal${inView ? " in-view" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function ArticulateClubHome() {
  const [showModal, setShowModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="ac-page">
      {/* NAV */}
      <nav className={`ac-nav${scrolled ? " scrolled" : ""}`}>
        <div className="ac-logo">
          <img src={logo} alt="Azimah" className="logo-img" />
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-nav">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="nav-link">
              {link}
            </a>
          ))}

          <button className="btn-light" onClick={() => setShowModal(true)}>
            Join The Club
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu */}
        <div className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link}
            </a>
          ))}

          <button
            className="btn-light"
            onClick={() => {
              setShowModal(true);
              setMobileMenuOpen(false);
            }}
          >
            Join The Club
          </button>
        </div>
      </nav>
      {/* HERO */}
      <Hero openModal={() => setShowModal(true)} />
      <Countries />
      <About />
      <Journey />
      <CommunityWall />
      {/* <CommentSection /> */}
      <Academy />
      <Contact />
      {/* CLOSING OLIVE BAND */}
      <section className="ac-closing">
        <Reveal>
          <h2 className="ac-closing-title">Don’t Hold Back.</h2>

          <p className="ac-closing-text">
            The world needs what you have to say.
          </p>

          <p className="ac-closing-quote">
            <strong>
              Remember: Your voice is more powerful than you think.
            </strong>
          </p>

          <button className="btn-primary" onClick={() => setShowModal(true)}>
            Join The Articulate Club
            <ArrowRight size={16} />
          </button>
        </Reveal>
      </section>
      <JoinModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <Footer />
    </div>
  );
}
