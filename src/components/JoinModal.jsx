import React, { useState } from "react";
import WhatsAppGroupsModal from "./WhatsAppGroupsModal";

export default function JoinModal({ isOpen, onClose }) {
  const [showGroups, setShowGroups] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="join-modal-overlay" onClick={onClose}>
        <div className="join-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-modal" onClick={onClose}>
            ×
          </button>

          <h2>Join The Articulate Club</h2>

          <p>
            Become part of our growing community and improve your communication
            skills through weekly challenges, conversations and mentorship.
          </p>

          <button
            className="join-link join-button"
            onClick={() => setShowGroups(true)}
          >
            Join WhatsApp Community
          </button>

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

      <WhatsAppGroupsModal
        isOpen={showGroups}
        onClose={() => setShowGroups(false)}
      />
    </>
  );
}
