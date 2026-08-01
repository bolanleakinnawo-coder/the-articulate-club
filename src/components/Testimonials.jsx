import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { db } from "../firebase/firebase"; // adjust path if needed

import { ref, push, onValue } from "firebase/database";

const countries = [
  { code: "ng", name: "Nigeria" },
  { code: "gh", name: "Ghana" },
  { code: "zm", name: "Zambia" },
  { code: "qa", name: "Qatar" },
  { code: "cm", name: "Cameroon" },
  { code: "lr", name: "Liberia" },
  { code: "fr", name: "France" },
  { code: "ug", name: "Uganda" },
  { code: "za", name: "South Africa" },
  { code: "ci", name: "Côte d'Ivoire" },
  { code: "gn", name: "Guinea" },
  { code: "bj", name: "Benin Republic" },
  { code: "gm", name: "The Gambia" },
  { code: "rw", name: "Rwanda" },
  { code: "my", name: "Malaysia" },
];

const STORY_LIMIT = 70;

export default function CommunityWall() {
  // Stories from Firebase
  const [stories, setStories] = useState([]);

  // Form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [story, setStory] = useState("");

  // UI
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");

  // Which story cards are expanded (Read more)
  const [expandedIds, setExpandedIds] = useState({});

  // Slider
  const [cardsPerSlide, setCardsPerSlide] = useState(3);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCardsPerSlide(1);
      } else if (window.innerWidth <= 992) {
        setCardsPerSlide(2);
      } else {
        setCardsPerSlide(3);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dotRefs = useRef([]);

  useEffect(() => {
    dotRefs.current[currentSlide]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [currentSlide]);

  useEffect(() => {
    const storiesRef = ref(db, "communityWall");

    const unsubscribe = onValue(storiesRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setStories([]);
        setLoading(false);
        return;
      }

      const approvedStories = Object.entries(data)
        .map(([id, value]) => ({
          id,
          ...value,
        }))
        .filter((item) => item.approved === true)
        .sort((a, b) => b.createdAt - a.createdAt);

      setStories(approvedStories);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const totalSlides = Math.max(1, Math.ceil(stories.length / cardsPerSlide));

  // Which comment number is currently in view (e.g. 1/90)
  const currentCommentNumber = Math.min(
    currentSlide * cardsPerSlide + 1,
    stories.length || 1,
  );
  const nextSlide = () => {
    setExpandedIds({});
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setExpandedIds({});
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !country || !story.trim())
      return;

    setSending(true);

    try {
      await push(ref(db, "communityWall"), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        country,
        story: story.trim(),
        approved: false,
        createdAt: Date.now(),
      });

      setFirstName("");
      setLastName("");
      setCountry("");
      setStory("");

      setSuccess("Thank you! Your story has been submitted for review.");

      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (err) {
      console.log(err);

      alert("Unable to submit your story.");
    }

    setSending(false);
  };

  return (
    <section className="community-wall">
      <div className="community-container">
        {/* Heading */}

        <p className="community-eyebrow">REAL VOICES, REAL GROWTH</p>

        <h2 className="community-title">Our Community Wall</h2>

        <p className="community-description">
          Every journey looks different. Here, members of The Articulate Club
          share their experiences, celebrate their progress, and reflect on how
          their communication is evolving.
        </p>

        {/* FORM */}

        <form className="community-form" onSubmit={handleSubmit}>
          <h3>Share Your Experience</h3>

          <p className="community-form-intro">
            How has <strong>The Articulate Club</strong> impacted your
            communication journey? Your story may encourage someone else to
            begin theirs.
          </p>

          <div className="community-form-row">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              maxLength={40}
              required
            />

            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              maxLength={40}
              required
            />
          </div>

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className="community-country-select"
          >
            <option value="" disabled>
              Select your country
            </option>
            {countries.map((c) => (
              <option key={c.code} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <textarea
            rows="6"
            placeholder="Share your experience..."
            value={story}
            onChange={(e) => setStory(e.target.value)}
            required
          />

          <div className="community-form-footer">
            <small className="community-note">
              To maintain a positive and meaningful space, all submissions are
              reviewed before they appear on the Community Wall.
            </small>

            {success && <div className="community-success">{success}</div>}

            <button type="submit" disabled={sending}>
              {sending ? "Submitting..." : "Share Your Experience"}
            </button>
          </div>
        </form>

        {/* COMMUNITY WALL */}

        <div className="community-heading">
          <h3>Recent Stories</h3>

          {stories.length > 0 && (
            <span className="community-count">
              {currentCommentNumber}/{stories.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="community-empty">
            <h3>Loading Members Stories...</h3>
          </div>
        ) : stories.length === 0 ? (
          <div className="community-empty">
            <div iv className="community-empty-icon">
              💬
            </div>

            <h3>Be the first to share your story.</h3>

            <p>
              Your experience could inspire someone else to begin their
              communication journey.
            </p>
          </div>
        ) : (
          <>
            <div className="community-slider">
              <div
                className="community-track"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {Array.from({
                  length: totalSlides,
                }).map((_, slideIndex) => (
                  <div className="community-slide" key={slideIndex}>
                    {stories
                      .slice(
                        slideIndex * cardsPerSlide,
                        slideIndex * cardsPerSlide + cardsPerSlide,
                      )
                      .map((item) => {
                        const isExpanded = !!expandedIds[item.id];
                        const isLong = item.story?.length > STORY_LIMIT;
                        const displayText =
                          isLong && !isExpanded
                            ? item.story.slice(0, STORY_LIMIT) + "..."
                            : item.story;

                        return (
                          <div className="community-card" key={item.id}>
                            <div className="community-avatar">
                              {item.firstName?.charAt(0).toUpperCase() ||
                                item.name?.charAt(0).toUpperCase()}
                            </div>

                            <p
                              className={`community-story ${isExpanded ? "expanded" : ""}`}
                            >
                              {item.story}
                            </p>

                            {isLong && (
                              <button
                                type="button"
                                className="read-more-btn"
                                onClick={() => toggleExpanded(item.id)}
                              >
                                {isExpanded ? "Read less" : "Read more"}
                              </button>
                            )}

                            <div className="community-footer">
                              <div className="community-line" />

                              <h4>{item.name}</h4>

                              <span>Member, The Articulate Club</span>

                              {item.country && (
                                <span className="community-location">
                                  {item.country}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>

            <div className="community-nav-row">
              <button onClick={prevSlide} className="arrow-btn">
                <ChevronLeft size={18} />
              </button>

              <div className="community-dots">
                {Array.from({
                  length: totalSlides,
                }).map((_, index) => (
                  <span
                    ref={(el) => (dotRefs.current[index] = el)}
                    key={index}
                    className={`dot ${currentSlide === index ? "active" : ""}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>

              <button onClick={nextSlide} className="arrow-btn">
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
