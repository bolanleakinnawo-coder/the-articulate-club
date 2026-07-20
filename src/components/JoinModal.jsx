import React from "react";

export default function JoinModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="join-modal-overlay" onClick={onClose}>
      <div className="join-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          ×
        </button>

        <h2>Join Articulate Club</h2>

        <p>
          Become part of our growing community and improve your communication
          skills through weekly challenges, conversations and mentorship.
        </p>

        <a
          href="https://chat.whatsapp.com/EJrCL5ySVf89XVsYNUu0fR?s=cl&p=i&ilr=1&amv=0"
          target="_blank"
          rel="noopener noreferrer"
          className="join-link"
        >
          Join WhatsApp Community
        </a>

        <a
          href="https://telegram.me/+5V0h0auyXPhkZjI0"
          target="_blank"
          rel="noopener noreferrer"
          className="join-link"
        >
          Join Telegram Community
        </a>
      </div>
    </div>
  );
}
