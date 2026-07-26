import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://formspree.io/f/xqergzbe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("Your message has been sent successfully!");

        setForm({
          name: "",
          email: "",
          message: "",
        });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to send your message.");
    }
  };

  return (
    <section className="contact">
      <div className="contact-container">
        <div className="contact-left">
          <p className="contact-eyebrow">GET IN TOUCH</p>
          <h2 className="contact-title">We’d Love to Hear From You.</h2>
          <p>
            Whether you have a question, a collaboration opportunity, or you’d
            like to work together, we’d love to hear from you.
          </p>{" "}
          <br />
          <div className="contact-list">
            <div className="contact-item">
              <span>★</span>
              <p> Brand Partnerships</p>
            </div>

            <div className="contact-item">
              <span>★</span>
              <p>Sponsorships</p>
            </div>

            <div className="contact-item">
              <span>★</span>
              <p>Speaking Invitations</p>
            </div>

            <div className="contact-item">
              <span>★</span>
              <p> Workshop & Training Requests</p>
            </div>

            <div className="contact-item">
              <span>★</span>
              <p>The Articulate Academy Enquiries</p>
            </div>
          </div>
        </div>

        <div className="contact-card">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              placeholder="Email address"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <textarea
              placeholder="Message"
              rows="8"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
}
