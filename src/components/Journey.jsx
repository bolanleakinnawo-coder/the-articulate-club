import React, { useEffect, useRef, useState } from "react";
import {
  Compass,
  Sparkles,
  Users,
  ArrowRight,
  User,
  Circle,
} from "lucide-react";
const METHOD_ITEMS = [
  {
    icon: Compass,
    title: "A Clear Weekly Structure",
    copy: "Never wonder what to practise next. Every day has a clear focus designed to help you become a more confident and articulate communicator.",
  },
  {
    icon: Sparkles,
    title: " Practice, Not Just Theory",
    copy: "Communication isn’t learned by reading alone. Every lesson is followed by an opportunity to practise what you’ve learned.",
  },
  {
    icon: Users,
    title: "A Community That Keeps You Consistent",
    copy: "It’s easier to grow, stay accountable, and keep showing up when you’re surrounded by people on the same journey.",
  },
];

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

const Journey = () => {
  return (
    <div>
      <section className="ac-method">
        <div className="ac-method-inner">
          <Reveal>
            <div className="ac-method-header">
              <div className="ac-eyebrow">THE ARTICULATE METHOD</div>
              <h2 className="ac-h2">Your Weekly Communication Journey</h2>
            </div>
          </Reveal>

          <div className="method-grid">
            {METHOD_ITEMS.map(({ icon: Icon, title, copy }, i) => (
              <Reveal key={title} delay={i * 90}>
                <div className="method-card">
                  <div className="method-icon">
                    <Icon size={20} color="#FFFFFF" strokeWidth={1.6} />
                  </div>
                  <div className="method-title">{title}</div>
                  <p className="method-copy">{copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section>
        <section>
          <div className="about-closing">
            <p>
              Curious what you’ll be doing every day inside The Articulate Club?
            </p>

            <a
              href="/handbook.pdf"
              className="about-closing-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore our Member Handbook →
            </a>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Journey;
