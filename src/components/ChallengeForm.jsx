import { useState } from "react";
import { ArrowLeft, Mic, BookOpen, Sparkles } from "lucide-react";
import { db } from "../firebase/firebase";
import { ref, push, update } from "firebase/database";

const TYPES = [
  { value: "weeklySpeaking", label: "Weekly Speaking", icon: Mic },
  { value: "weeklyVocabulary", label: "Weekly Vocabulary", icon: BookOpen },
  { value: "special", label: "Special Challenge", icon: Sparkles },
];

export default function ChallengeForm({ existing, onDone }) {
  const isEditing = !!existing;

  const [type, setType] = useState(existing?.type || "weeklySpeaking");
  const [title, setTitle] = useState(existing?.title || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [status, setStatus] = useState(existing?.status || "draft");
  const [deadline, setDeadline] = useState(
    existing?.deadline ? new Date(existing.deadline).toISOString().slice(0, 16) : ""
  );
  const [lockAfterDeadline, setLockAfterDeadline] = useState(
    existing?.lockAfterDeadline ?? true
  );
  const [allowResubmission, setAllowResubmission] = useState(
    existing?.allowResubmission ?? false
  );
  const [maxAttempts, setMaxAttempts] = useState(existing?.maxAttempts || 1);
  const [points, setPoints] = useState(existing?.points || 100);
  const [featureOnDashboard, setFeatureOnDashboard] = useState(
    existing?.featureOnDashboard ?? true
  );
  const [sendAnnouncement, setSendAnnouncement] = useState(
    existing?.sendAnnouncement ?? true
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in both title and description.");
      return;
    }

    setSaving(true);

    const payload = {
      type,
      title: title.trim(),
      description: description.trim(),
      status,
      deadline: deadline ? new Date(deadline).getTime() : null,
      lockAfterDeadline,
      allowResubmission,
      maxAttempts: Number(maxAttempts) || 1,
      points: Number(points) || 0,
      featureOnDashboard,
      sendAnnouncement,
    };

    try {
      if (isEditing) {
        await update(ref(db, `challenges/${existing.id}`), payload);
        alert("Challenge updated.");
      } else {
        await push(ref(db, "challenges"), {
          ...payload,
          createdAt: Date.now(),
        });
        alert("Challenge created.");
      }
      onDone();
    } catch (err) {
      console.error("Challenge save error:", err);
      alert("Something went wrong saving this challenge.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="challenge-form-header">
        <button className="back-link" onClick={onDone}>
          <ArrowLeft size={18} /> Back to challenges
        </button>
        <button className="save-challenge-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Challenge"}
        </button>
      </div>

      <h2>{isEditing ? "Edit Challenge" : "Create Challenge"}</h2>

      <div className="challenge-form">
        <label className="cf-label">
          Challenge Type
          <div className="cf-type-row">
            {TYPES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                className={type === value ? "cf-type-btn active" : "cf-type-btn"}
                onClick={() => setType(value)}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </label>

        <label className="cf-label">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Is it possible to be too honest?"
            maxLength={100}
          />
        </label>

        <label className="cf-label">
          Description
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What should members do for this challenge?"
            maxLength={300}
          />
        </label>

        <label className="cf-label">
          Challenge Status
          <div className="cf-status-grid">
            {["draft", "scheduled", "published", "locked"].map((s) => (
              <button
                key={s}
                type="button"
                className={status === s ? "cf-status-btn active" : "cf-status-btn"}
                onClick={() => setStatus(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </label>

        <label className="cf-label">
          Deadline
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </label>

        <div className="cf-toggle-row">
          <span>Lock after deadline</span>
          <input
            type="checkbox"
            checked={lockAfterDeadline}
            onChange={(e) => setLockAfterDeadline(e.target.checked)}
          />
        </div>

        <div className="cf-toggle-row">
          <span>Allow resubmission</span>
          <input
            type="checkbox"
            checked={allowResubmission}
            onChange={(e) => setAllowResubmission(e.target.checked)}
          />
        </div>

        <label className="cf-label">
          Maximum attempts
          <input
            type="number"
            min={1}
            value={maxAttempts}
            onChange={(e) => setMaxAttempts(e.target.value)}
          />
        </label>

        <label className="cf-label">
          Points
          <input
            type="number"
            min={0}
            step={10}
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
        </label>

        <div className="cf-toggle-row">
          <span>Feature on dashboard</span>
          <input
            type="checkbox"
            checked={featureOnDashboard}
            onChange={(e) => setFeatureOnDashboard(e.target.checked)}
          />
        </div>

        <div className="cf-toggle-row">
          <span>Send announcement</span>
          <input
            type="checkbox"
            checked={sendAnnouncement}
            onChange={(e) => setSendAnnouncement(e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
}