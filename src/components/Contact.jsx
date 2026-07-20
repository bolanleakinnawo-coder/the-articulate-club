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

  const handleSubmit = (e) => {
    e.preventDefault();

    const whatsappMessage = `Hello Articulate Team,

*Name:* ${form.name}
*Email:* ${form.email}

*Message:*
${form.message}`;

    const url = `https://wa.me/2348133146418?text=${encodeURIComponent(
      whatsappMessage,
    )}`;

    window.open(url, "_blank");

    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <section className="contact">
      <div className="contact-container">
        <div className="contact-left">
          <p className="contact-eyebrow">GET IN TOUCH</p>

          <h2 className="contact-title">Contact</h2>

          <div className="contact-list">
            <div className="contact-item">
              <span>★</span>
              <p>Business Enquiries</p>
            </div>

            <div className="contact-item">
              <span>★</span>
              <p>Partnerships</p>
            </div>

            <div className="contact-item">
              <span>★</span>
              <p>Speaking Invitations</p>
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
              placeholder="Email"
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
