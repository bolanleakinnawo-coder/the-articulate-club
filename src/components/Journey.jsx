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
    title: "Structured Journey",
    copy: "A repeatable seven day rhythm, not a random feed of tips.",
  },
  {
    icon: Sparkles,
    title: "Practical Practice",
    copy: "Small daily actions that build your voice, not more theory.",
  },
  {
    icon: Users,
    title: "Real Community",
    copy: "People practicing alongside you, every single week.",
  },
];

const WEEK = [
  { day: "MON", label: "Shadow Monday" },
  { day: "TUE", label: "Reading Tuesday" },
  { day: "WED", label: "Word Power" },
  { day: "THU", label: "Thinking Aloud" },
  { day: "FRI", label: "Feedback Friday" },
  { day: "SAT", label: "Live Session" },
  { day: "SUN", label: "Reflection" },
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
              <h2 className="ac-h2">A Journey You Repeat Every Week</h2>
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

          <Reveal>
            <div className="week-row">
              <div className="week-row-line" />
              {WEEK.map((d) => (
                <div key={d.day} className="week-item">
                  <div className="week-dot" />
                  <div className="week-day">{d.day}</div>
                  <div className="week-label">{d.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Journey;
