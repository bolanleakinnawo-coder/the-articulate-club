import { useState } from "react";
import { ref, push } from "firebase/database";
import { db } from "../firebase/firebase";

export default function Academy() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      await push(ref(db, "waitlist"), {
        ...form,
        createdAt: new Date().toISOString(),
      });

      setMessage("🎉 You're now on the waitlist!");

      setForm({
        name: "",
        email: "",
        phone: "",
      });
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <section className="academy">
      <div className="academy-container">
        <p className="academy-eyebrow">TAKE YOUR GROWTH FURTHER.</p>

        <h2 className="academy-title">THE ARTICULATE ACADEMY</h2>

        <p className="academy-text">
          The Articulate Academy is the premium learning arm of The Articulate
          Club, created for individuals who want deeper, personalised coaching,
          structured learning, and practical speaking experiences that help you
          grow into a confident, articulate communicator.
        </p>
        <p className="academy-text">
          Whether you’re looking to become a more articulate and confident
          speaker, strengthen your workplace or daily communication, prepare for
          important opportunities, or continue growing as a communicator, the
          Academy gives you the guidance, practical experience, and personalised
          feedback you need to get there.
        </p>

        {/* Benefits */}

        <div className="academy-list">
          <div className="academy-item">
            <div className="academy-icon">✓</div>
            <p>Structured communication programmes</p>
          </div>

          <div className="academy-item">
            <div className="academy-icon">✓</div>
            <p> Small group coaching</p>
          </div>

          <div className="academy-item">
            <div className="academy-icon">✓</div>
            <p> One-on-one mentorship</p>
          </div>

          <div className="academy-item">
            <div className="academy-icon">✓</div>
            <p>Live workshops and masterclasses</p>
          </div>

          <div className="academy-item">
            <div className="academy-icon">✓</div>
            <p>Personalised feedback</p>
          </div>

          <div className="academy-item">
            <div className="academy-icon">✓</div>
            <p> Practical speaking experiences</p>
          </div>
        </div>

        {/* Waitlist Card */}

        <div className="waitlist-card">
          <h3>Join the Waitlist</h3>

          <p className="subtitle">
            Be the first to hear about new programmes and upcoming cohorts.
          </p>

          <form className="waitlist-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder=" WhatsApp Number (with country code)"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Joining..." : "Join the Waitlist"}
            </button>
          </form>

          {message && (
            <p
              className={
                message.includes("wrong") ? "error-message" : "success-message"
              }
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
