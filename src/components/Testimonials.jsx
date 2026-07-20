import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Hauwa",
    text: "I finally stopped rehearsing every sentence in my head before saying it out loud.",
  },
  {
    name: "Ibrahim",
    text: "The Monday shadowing exercise changed how I listen, not just how I speak.",
  },
  {
    name: "Aisha",
    text: "This community helped me become more confident every single week.",
  },
  {
    name: "Maryam",
    text: "The feedback is kind, practical and has completely changed how I communicate.",
  },
  {
    name: "Daniel",
    text: "Speaking in front of people no longer feels frightening. I actually enjoy it now.",
  },
  {
    name: "Fatima",
    text: "I've found a safe space where I'm encouraged to grow without being judged.",
  },
  {
    name: "John",
    text: "The weekly challenges helped me become more expressive and confident.",
  },
  {
    name: "Sarah",
    text: "This community keeps me accountable to my communication goals.",
  },
  {
    name: "David",
    text: "The practical sessions are worth every minute.",
  },
];

export default function Testimonials() {
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

  const totalSlides = Math.ceil(testimonials.length / cardsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  return (
    <section className="testimonials">
      <div className="testimonial-container">
        <p className="testimonial-eyebrow">REAL VOICES, REAL GROWTH</p>

        <h2 className="testimonial-title">What Our Members Are Saying</h2>

        <div className="testimonial-slider">
          <div
            className="testimonial-track"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div className="testimonial-slide" key={slideIndex}>
                {testimonials
                  .slice(
                    slideIndex * cardsPerSlide,
                    slideIndex * cardsPerSlide + cardsPerSlide,
                  )
                  .map((item, index) => (
                    <div className="testimonial-card" key={index}>
                      <span className="quote-mark">❝</span>

                      <p>{item.text}</p>

                      <div className="testimonial-footer">
                        <div className="testimonial-line"></div>
                        <span>{item.name}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        <div className="testimonial-controls">
          <button onClick={prevSlide} className="arrow-btn">
            <ChevronLeft size={20} />
          </button>

          <div className="dots">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <span
                key={index}
                className={`dot ${currentSlide === index ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>

          <button onClick={nextSlide} className="arrow-btn">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
