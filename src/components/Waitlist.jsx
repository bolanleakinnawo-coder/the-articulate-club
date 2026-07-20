import { useState } from "react";
import { ref, push } from "firebase/database";
import { db } from "../firebase/firebase";

export default function Waitlist() {
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

      setMessage("You're now on the waitlist!");

      setForm({
        name: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <section className="waitlist">
      <div className="waitlist-container">
        <h2>Articulate Academy</h2>

        <p>
          A premium mentorship experience for individuals who want deeper
          coaching, personalised guidance and lasting transformation.
        </p>

        {/* Checklist goes here */}

        <form onSubmit={handleSubmit}>
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
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Joining..." : "Join the Waitlist"}
          </button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </section>
  );
}
