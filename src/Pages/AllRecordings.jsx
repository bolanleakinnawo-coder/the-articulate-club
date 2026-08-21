import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getLocalSession } from "../firebase/authService";
import { getMemberAllSubmissions } from "../firebase/challengeService";
import "./dashboard.css";
import logo from "../assets/logo.png";

export default function AllRecordings() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const uid = getLocalSession();
    if (!uid) {
      navigate("/login");
      return;
    }

    (async () => {
      const all = await getMemberAllSubmissions(uid);
      setSubmissions(all);
      setLoading(false);
    })();
  }, [navigate]);

  return (
    <div className="dash-page">
      <header className="dash-header">
        <button
          className="dash-icon-btn"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={20} />
        </button>
        <img src={logo} alt="Logo" className="logo-img" />
        <div style={{ width: 20 }} />
      </header>

      <div className="dash-container">
        <section className="dash-greeting">
          <h1>All Recordings</h1>
          <p>Every recording you've submitted, newest first.</p>
        </section>

        {loading ? (
          <p>Loading...</p>
        ) : submissions.length === 0 ? (
          <div className="dash-recordings-empty">
            <p>You haven't submitted a recording yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {submissions.map((sub, i) => (
              <div
                className="dash-recording-card"
                key={`${sub.challengeId}-${i}`}
                style={{
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: 10,
                }}
              >
                <div className="dash-recording-info">
                  <h4>{sub.challengeTitle}</h4>
                  <span>
                    Submitted on{" "}
                    {new Date(sub.submittedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <audio controls src={sub.audioData} style={{ width: "100%" }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
