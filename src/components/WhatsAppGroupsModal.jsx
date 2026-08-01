import React from "react";

const groups = [
  {
    name: "The Articulate Group(5) ",
    link: "https://chat.whatsapp.com/EJrCL5ySVf89XVsYNUu0fR?s=cl&p=i&ilr=2&amv=0",
  },
  {
    name: "The Articulate Group(4) ",
    link: "https://chat.whatsapp.com/IHJtQw62jFR2ldrb7y7NXt?s=cl&p=i&ilr=2&amv=0",
  },
  {
    name: "The Articulate Group(3) ",
    link: "https://chat.whatsapp.com/EXqdAAqvvzl1OF1amSEbbb?s=cl&p=i&ilr=2&amv=0",
  },
  {
    name: "The Articulate Group(2) ",
    link: "https://chat.whatsapp.com/HH53neAlIl77rjCi6PpU4X?s=cl&p=i&ilr=2&amv=0",
  },
  {
    name: "The Articulate Group(1) ",
    link: "https://chat.whatsapp.com/BEVfJWYxwiL9ZgGe5a1sva?s=cl&p=i&ilr=2&amv=0",
  },
];

export default function WhatsAppGroupsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="groups-modal-overlay" onClick={onClose}>
      <div className="groups-modal" onClick={(e) => e.stopPropagation()}>
        <button className="groups-close-btn" onClick={onClose}>
          ×
        </button>

        <h2>Choose The Articulate Group</h2>

        <p>
          Select any available group below to join The Articulate Club
          community.
        </p>

        <div className="groups-list">
          {groups.map((group) => (
            <a
              key={group.name}
              href={group.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group-link"
            >
              <strong>{group.name}</strong>
             
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
