import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue } from "firebase/database";

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const subsRef = ref(db, "submissions");
    return onValue(subsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setSubmissions([]);
        return;
      }

      const list = [];
      Object.entries(data).forEach(([challengeId, byUid]) => {
        Object.entries(byUid).forEach(([uid, submission]) => {
          list.push({ challengeId, uid, ...submission });
        });
      });

      list.sort((a, b) => b.submittedAt - a.submittedAt);
      setSubmissions(list);
    });
  }, []);

  return (
    <div className="admin-section">
      <h2>Submissions ({submissions.length})</h2>

      {submissions.length === 0 ? (
        <p className="admin-empty">No recordings submitted yet.</p>
      ) : (
        submissions.map((sub) => (
          <div className="admin-card" key={`${sub.challengeId}-${sub.uid}`}>
            <div className="admin-avatar">
              {sub.memberName?.charAt(0).toUpperCase()}
            </div>
            <div className="admin-content">
              <h3>{sub.memberName}</h3>
              <p>
                <strong>Challenge:</strong> {sub.challengeTitle}
              </p>
              <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                Submitted{" "}
                {new Date(sub.submittedAt).toLocaleString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
              <audio
                controls
                src={sub.audioData}
                style={{ width: "100%", marginTop: 10 }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
