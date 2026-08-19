import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Mic,
  BookOpen,
  Flame,
  CheckCircle,
  Trophy,
  Clock,
  Play,
} from "lucide-react";
import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import { db } from "../firebase/firebase";
import {
  getLocalSession,
  getMemberProfile,
  logoutLocal,
} from "../firebase/authService";
import "./dashboard.css";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const uid = getLocalSession();
    if (!uid) {
      navigate("/login");
      return;
    }

    (async () => {
      const memberProfile = await getMemberProfile(uid);
      setProfile(memberProfile);

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
          .filter((c) => c.type !== "special");

        setChallenges(list);
      }

      setLoading(false);
    })();
  }, [navigate]);

  const handleLogout = () => {
    logoutLocal();
    navigate("/login");
  };

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

  if (loading || !profile) {
    return (
      <div className="dash-loading">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <header className="dash-header">
        <p className="dash-logo">
          THE
          <br />
          ARTICULATE
          <br />
          CLUB
        </p>

        <div className="dash-header-icons">
          <button className="dash-icon-btn" aria-label="Notifications">
            <Bell size={19} />
            <span className="dash-dot" />
          </button>
          <button
            className="dash-avatar"
            onClick={handleLogout}
            title="Log out"
          >
            {profile.name?.charAt(0).toUpperCase() || "A"}
          </button>
        </div>
      </header>

      <div className="dash-container">
        <section className="dash-greeting">
          <h1>Hi, {profile.name?.split(" ")[0] || "Articulator"} 💚</h1>
          <p>Time to work on your communication skills.</p>
        </section>

        <section className="dash-progress">
          <p className="dash-eyebrow">YOUR PROGRESS</p>
          <div className="dash-progress-grid">
            <div className="dash-stat-card">
              <div className="dash-stat-icon flame">
                <Flame size={20} />
              </div>
              <p className="dash-stat-value">{profile.streak || 0}</p>
              <p className="dash-stat-label">week streak</p>
              <p className="dash-stat-sub">Keep it going!</p>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon check">
                <CheckCircle size={20} />
              </div>
              <p className="dash-stat-value">
                {profile.challengesCompleted || 0}
              </p>
              <p className="dash-stat-label">challenges completed</p>
              <p className="dash-stat-sub">You're doing great!</p>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon trophy">
                <Trophy size={20} />
              </div>
              <p className="dash-stat-value">{profile.totalPoints || 0}</p>
              <p className="dash-stat-label">total points</p>
              <p className="dash-stat-sub">Every effort counts!</p>
            </div>
          </div>
        </section>

        <section className="dash-week">
          <div className="dash-section-header">
            <p className="dash-eyebrow">THIS WEEK AT THE CLUB</p>
            <a href="/challenges" className="dash-view-all">
              View all
            </a>
          </div>

          {challenges.length === 0 ? (
            <div className="dash-empty-challenges">
              <p>No challenges published yet. Check back soon!</p>
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
        </section>

        <section className="dash-recordings">
          <p className="dash-eyebrow">YOUR RECENT RECORDING</p>

          <div className="dash-recordings-empty">
            <p>You haven't submitted a recording yet.</p>
            <p className="dash-recordings-sub">
              Complete a speaking challenge above to see it here.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
