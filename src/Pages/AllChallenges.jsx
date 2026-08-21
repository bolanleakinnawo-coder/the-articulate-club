import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, BookOpen, Clock } from "lucide-react";
import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import { db } from "../firebase/firebase";
import "./dashboard.css";
import logo from "../assets/logo.png";

export default function AllChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const challengesRef = ref(db, "challenges");
      const publishedQuery = query(
        challengesRef,
        orderByChild("status"),
        equalTo("published"),
      );
      const snap = await get(publishedQuery);

      if (snap.exists()) {
        const data = snap.val();
        const list = Object.entries(data)
          .map(([id, value]) => ({ id, ...value }))
          .filter((c) => c.type !== "special")
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setChallenges(list);
      }

      setLoading(false);
    })();
  }, []);

  const formatDeadline = (deadline) => {
    if (!deadline) return "";
    const date = new Date(deadline);
    if (isNaN(date)) return deadline;
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

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
          <h1>All Challenges</h1>
          <p>Every published challenge, newest first.</p>
        </section>

        {loading ? (
          <p>Loading...</p>
        ) : challenges.length === 0 ? (
          <div className="dash-empty-challenges">
            <p>No challenges published yet.</p>
          </div>
        ) : (
          <div className="dash-challenge-grid">
            {challenges.map((challenge) => (
              <div className="dash-challenge-card" key={challenge.id}>
                <div className="dash-challenge-icon">
                  {challenge.type === "weeklyVocabulary" ? (
                    <BookOpen size={20} />
                  ) : (
                    <Mic size={20} />
                  )}
                </div>

                <p className="dash-challenge-tag">
                  {challenge.type === "weeklyVocabulary"
                    ? "WORD OF THE WEEK"
                    : "SPEAKING CHALLENGE"}
                </p>

                <h3 className="dash-challenge-title">{challenge.title}</h3>

                <p className="dash-challenge-desc">
                  {challenge.type === "weeklyVocabulary"
                    ? "Learn it, use it, and record yourself using it."
                    : "Record your answer and submit it."}
                </p>

                <button
                  className="dash-challenge-btn"
                  onClick={() => navigate(`/challenges/${challenge.id}`)}
                >
                  Start Challenge
                </button>

                {challenge.deadline && (
                  <p className="dash-challenge-deadline">
                    <Clock size={13} />
                    Closes {formatDeadline(challenge.deadline)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
