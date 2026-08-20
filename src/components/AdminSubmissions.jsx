import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue } from "firebase/database";
import {
  approveSubmission,
  rejectSubmission,
} from "../firebase/challengeService";
import { CheckCircle, XCircle } from "lucide-react";

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

  const handleApprove = async (challengeId, uid) => {
    await approveSubmission(challengeId, uid);
  };

  const handleReject = async (challengeId, uid) => {
    const confirmReject = window.confirm("Reject this submission?");
    if (!confirmReject) return;
    await rejectSubmission(challengeId, uid);
  };

  const pending = submissions.filter((s) => s.status === "pending");
  const reviewed = submissions.filter((s) => s.status !== "pending");

  return (
    <div className="admin-section">
      <h2>Pending Submissions ({pending.length})</h2>

      {pending.length === 0 ? (
        <p className="admin-empty">No submissions waiting for review.</p>
      ) : (
        pending.map((sub) => (
          <div className="admin-card" key={`${sub.challengeId}-${sub.uid}`}>
            <div className="admin-avatar">
              {sub.memberName?.charAt(0).toUpperCase()}
            </div>
            <div className="admin-content">
              <h3>{sub.memberName}</h3>
              <p>
                <strong>Challenge:</strong> {sub.challengeTitle}
              </p>
              <audio
                controls
                src={sub.audioData}
                style={{ width: "100%", marginBottom: 14 }}
              />
              <div className="admin-buttons">
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(sub.challengeId, sub.uid)}
                >
                  <CheckCircle size={14} /> Approve
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleReject(sub.challengeId, sub.uid)}
                >
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      <div className="admin-section" style={{ marginTop: 24 }}>
        <h2>Reviewed ({reviewed.length})</h2>
        {reviewed.length === 0 ? (
          <p className="admin-empty">Nothing reviewed yet.</p>
        ) : (
          reviewed.map((sub) => (
            <div className="admin-card" key={`${sub.challengeId}-${sub.uid}`}>
              <div className="admin-avatar">
                {sub.memberName?.charAt(0).toUpperCase()}
              </div>
              <div className="admin-content">
                <h3>{sub.memberName}</h3>
                <p>
                  <strong>Challenge:</strong> {sub.challengeTitle} —{" "}
                  <span
                    style={{
                      color:
                        sub.status === "approved"
                          ? "var(--olive-deep)"
                          : "#b3413a",
                    }}
                  >
                    {sub.status}
                  </span>
                </p>
                <audio
                  controls
                  src={sub.audioData}
                  style={{ width: "100%", marginBottom: 14 }}
                />
                <div className="admin-buttons">
                  {sub.status !== "approved" && (
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(sub.challengeId, sub.uid)}
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                  )}
                  {sub.status !== "rejected" && (
                    <button
                      className="delete-btn"
                      onClick={() => handleReject(sub.challengeId, sub.uid)}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
