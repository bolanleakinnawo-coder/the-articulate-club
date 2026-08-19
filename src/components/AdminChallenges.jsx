import { useEffect, useState } from "react";
import { Mic, BookOpen, Sparkles, Plus, Pencil, Trash2 } from "lucide-react";
import { db } from "../firebase/firebase";
import { ref, onValue, remove } from "firebase/database";
import ChallengeForm from "./ChallengeForm";

const TYPE_META = {
  weeklySpeaking: { label: "Speaking Challenge", icon: Mic },
  weeklyVocabulary: { label: "Vocabulary Challenge", icon: BookOpen },
  special: { label: "Special Challenge", icon: Sparkles },
};

const STATUS_ORDER = ["published", "scheduled", "draft", "locked"];
const STATUS_LABEL = {
  published: "Published",
  scheduled: "Scheduled",
  draft: "Draft",
  locked: "Locked",
};

export default function AdminChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [filterTab, setFilterTab] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list"); // list | form
  const [editingChallenge, setEditingChallenge] = useState(null);

  useEffect(() => {
    const challengesRef = ref(db, "challenges");
    return onValue(challengesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setChallenges([]);
        return;
      }
      const list = Object.entries(data)
        .map(([id, value]) => ({ id, ...value }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setChallenges(list);
    });
  }, []);

  const deleteChallenge = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this challenge permanently?\n\nThis action cannot be undone.",
    );
    if (!confirmDelete) return;
    await remove(ref(db, `challenges/${id}`));
    alert("Challenge deleted.");
  };

  const filtered = challenges.filter((c) => {
    const matchesSearch = c.title?.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filterTab === "weekly")
      return c.type === "weeklySpeaking" || c.type === "weeklyVocabulary";
    if (filterTab === "special") return c.type === "special";
    if (filterTab === "draft") return c.status === "draft";
    return true;
  });

  const grouped = STATUS_ORDER.map((status) => ({
    status,
    items: filtered.filter((c) => c.status === status),
  })).filter((g) => g.items.length > 0);

  if (view === "form") {
    return (
      <ChallengeForm
        existing={editingChallenge}
        onDone={() => {
          setView("list");
          setEditingChallenge(null);
        }}
      />
    );
  }

  return (
    <div className="admin-section">
      <div className="challenges-toolbar">
        <h2>Challenges ({challenges.length})</h2>
        <button
          className="add-challenge-btn"
          onClick={() => {
            setEditingChallenge(null);
            setView("form");
          }}
        >
          <Plus size={16} /> New Challenge
        </button>
      </div>

      <div className="challenges-filter-row">
        <div className="challenges-filter-tabs">
          {["all", "weekly", "special", "draft"].map((tab) => (
            <button
              key={tab}
              className={
                filterTab === tab ? "filter-chip active" : "filter-chip"
              }
              onClick={() => setFilterTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="text"
          className="challenges-search"
          placeholder="Search challenges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {grouped.length === 0 ? (
        <p className="admin-empty">No challenges match this filter.</p>
      ) : (
        grouped.map(({ status, items }) => (
          <div key={status} className="challenges-group">
            <p className="challenges-group-label">{STATUS_LABEL[status]}</p>

            {items.map((challenge) => {
              const meta =
                TYPE_META[challenge.type] || TYPE_META.weeklySpeaking;
              const Icon = meta.icon;

              return (
                <div className="admin-card challenge-card" key={challenge.id}>
                  <div className="admin-avatar challenge-icon">
                    <Icon size={22} />
                  </div>

                  <div className="admin-content">
                    <div className="challenge-card-top">
                      <div>
                        <h3>{challenge.title}</h3>
                        <span className="challenge-type-label">
                          {meta.label}
                        </span>
                      </div>
                      <span
                        className={`status-badge status-${challenge.status}`}
                      >
                        {STATUS_LABEL[challenge.status]}
                      </span>
                    </div>

                    {challenge.deadline && (
                      <p className="challenge-deadline-line">
                        Deadline:{" "}
                        {new Date(challenge.deadline).toLocaleString(
                          undefined,
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    )}

                    <div className="admin-buttons">
                      <button
                        className="hide-btn"
                        onClick={() => {
                          setEditingChallenge(challenge);
                          setView("form");
                        }}
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteChallenge(challenge.id)}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}
