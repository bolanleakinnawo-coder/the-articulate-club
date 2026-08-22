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
  Sparkles,
  Play,
  Pause,
} from "lucide-react";
import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import { db } from "../firebase/firebase";
import {
  getLocalSession,
  getMemberProfile,
  logoutLocal,
} from "../firebase/authService";
import { getMemberRecentSubmission } from "../firebase/challengeService";
import "./dashboard.css";
import logo from "../assets/logo.png";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentSubmission, setRecentSubmission] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useState(() => new Audio())[0];
  const navigate = useNavigate();

  useEffect(() => {
    const uid = getLocalSession();

    if (!uid) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const challengesRef = ref(db, "challenges");
        const publishedQuery = query(
          challengesRef,
          orderByChild("status"),
          equalTo("published"),
        );

        const [memberProfile, recent, snap] = await Promise.all([
          getMemberProfile(uid),
          getMemberRecentSubmission(uid),
          get(publishedQuery),
        ]);

        setProfile(memberProfile);
        setRecentSubmission(recent);

        if (snap.exists()) {
          const data = snap.val();
          const list = Object.entries(data).map(([id, value]) => ({
            id,
            ...value,
          }));
          setChallenges(list);
        } else {
          setChallenges([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleLogout = () => {
    logoutLocal();
    navigate("/login");
  };

  const togglePlay = () => {
    if (!recentSubmission) return;

    if (isPlaying) {
      audioRef.pause();
      setIsPlaying(false);
    } else {
      audioRef.src = recentSubmission.audioData;
      audioRef.play();
      setIsPlaying(true);
      audioRef.onended = () => setIsPlaying(false);
    }
  };

  const formatDuration = (secs) => {
    if (!secs) return "0:00";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
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

  const specialChallenges = challenges.filter((c) => c.type === "special");

  const visibleWeekly = challenges
    .filter((c) => c.type !== "special")
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 2);

  return (
    <div className="dash-page">
      <header className="dash-header">
        <img src={logo} alt="Logo" className="logo-img" />

        <div className="dash-header-icons">
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
          <h1>Hi, {profile.name?.split(" ")[0] || "Articulator"}</h1>
          <p>Time to work on your communication skills.</p>
        </section>

        {specialChallenges.length > 0 && (
          <section className="dash-special">
            {specialChallenges.map((challenge) => (
              <div
                className="dash-special-card"
                key={challenge.id}
                onClick={() => navigate(`/challenges/${challenge.id}`)}
              >
                <span className="dash-special-badge">
                  <Sparkles size={13} /> SPECIAL CHALLENGE
                </span>
                <h2 className="dash-special-title">{challenge.title}</h2>
                <p className="dash-special-desc">{challenge.description}</p>
                <button
                  className="dash-special-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/challenges/${challenge.id}`);
                  }}
                >
                  Accept the Challenge
                </button>
              </div>
            ))}
          </section>
        )}

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
            <button
              className="dash-view-all"
              onClick={() => navigate("/challenges")}
            >
              View all
            </button>
          </div>

          {visibleWeekly.length === 0 ? (
            <div className="dash-empty-challenges">
              <p>No challenges published yet. Check back soon!</p>
            </div>
          ) : (
            <div className="dash-challenge-grid">
              {visibleWeekly.map((challenge) => (
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

          {recentSubmission ? (
            <>
              <div className="dash-recording-card">
                <button className="dash-recording-play" onClick={togglePlay}>
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                <div className="dash-recording-info">
                  <h4>{recentSubmission.challengeTitle}</h4>
                  <span>
                    Submitted on{" "}
                    {new Date(recentSubmission.submittedAt).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>

                <span className="dash-recording-duration">
                  {formatDuration(recentSubmission.durationSeconds)}
                </span>
              </div>

              <button
                className="dash-view-all-recordings"
                onClick={() => navigate("/recordings")}
              >
                View all recordings →
              </button>
            </>
          ) : (
            <div className="dash-recordings-empty">
              <p>You haven't submitted a recording yet.</p>
              <p className="dash-recordings-sub">
                Complete a speaking challenge above to see it here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
