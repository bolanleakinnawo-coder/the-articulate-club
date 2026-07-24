import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { db } from "../firebase/firebase"; // adjust path if needed

import { ref, push, onValue } from "firebase/database";

export default function CommunityWall() {
  // This will later hold your approved Firebase testimonials
  // Stories from Firebase
  const [stories, setStories] = useState([]);

  // Form
  const [name, setName] = useState("");
  const [story, setStory] = useState("");

  // UI
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !story.trim()) return;

    setSending(true);

    try {
      await push(ref(db, "communityWall"), {
        name: name.trim(),
        story: story.trim(),
        approved: false,
        createdAt: Date.now(),
      });

      setName("");
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
          Every story here comes from a member of The Articulate Club. Share
          your experience with us. Your story will be reviewed before it appears
          on the Community Wall.
        </p>

        {/* FORM */}

        <form className="community-form" onSubmit={handleSubmit}>
          <h3>Share Your Experience</h3>

          <p className="community-form-intro">
            How has <strong>The Articulate Club</strong> impacted your
            communication journey? Your story may encourage someone else to
            begin theirs.
          </p>

          <input
            type="text"
            placeholder="Your name (e.g. David | Ghana)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            required
          />

          <textarea
            rows="6"
            placeholder="Share your experience..."
            value={story}
            onChange={(e) => setStory(e.target.value)}
            maxLength={500}
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
            <div className="community-controls">
              <button onClick={prevSlide} className="arrow-btn">
                <ChevronLeft size={18} />
              </button>

              <button onClick={nextSlide} className="arrow-btn">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="community-empty">
            <h3>Loading Community Wall...</h3>
          </div>
        ) : stories.length === 0 ? (
          <div className="community-empty">
            <div className="community-empty-icon">💬</div>

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
                      .map((item, index) => (
                        <div className="community-card" key={index}>
                          <div className="community-avatar">
                            {item.name?.charAt(0).toUpperCase()}
                          </div>

                          <p className="community-story">{item.story}</p>

                          <div className="community-footer">
                            <div className="community-line" />

                            <h4>{item.name}</h4>

                            <span>Articulate Club Member</span>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="community-dots">
              {Array.from({
                length: totalSlides,
              }).map((_, index) => (
                <span
                  key={index}
                  className={`dot ${currentSlide === index ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
