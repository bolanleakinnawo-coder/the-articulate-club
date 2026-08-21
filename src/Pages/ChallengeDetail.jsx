import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mic,
  BookOpen,
  Clock,
  Star,
  Trophy,
  Target,
  Volume2,
  Sparkles,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  getChallenge,
  getMemberAttempt,
  submitRecording,
  getSubmissionCount,
} from "../firebase/challengeService";
import { getLocalSession, getMemberProfile } from "../firebase/authService";
import AudioRecorder from "../components/AudioRecorder";
import "./ChallengeDetail.css";

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [profile, setProfile] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const uid = getLocalSession();
    if (!uid) {
      navigate("/login");
      return;
    }

    (async () => {
      const c = await getChallenge(id);

      if (!c) {
        navigate("/dashboard");
        return;
      }

      const memberProfile = await getMemberProfile(uid);
      const existingAttempt = await getMemberAttempt(id, uid);
      const count = await getSubmissionCount(id);

      setChallenge(c);
      setProfile(memberProfile);
      setAttempt(existingAttempt);
      setParticipantCount(count);
      setLoading(false);
    })();
  }, [id, navigate]);

  const handleSubmitRecording = async (audioBlob, durationSeconds) => {
    const uid = getLocalSession();
    setSubmitting(true);

    try {
      await submitRecording({
        challengeId: id,
        challenge,
        uid,
        memberName: profile.name,
        audioBlob,
        durationSeconds,
      });
      alert("Your recording has been submitted!");
      navigate("/dashboard");
    } catch (err) {
      if (err.message === "attempt-limit-reached") {
        alert(
          "You've reached the maximum number of attempts for this challenge.",
        );
      } else if (err.message === "recording-too-large") {
        alert(
          "That recording is too long. Please keep it under the time limit and try again.",
        );
      } else {
        console.error("Submission error:", err);
        alert(
          "Something went wrong submitting your recording. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !challenge) {
    return (
      <div className="cd-loading">
        <p>Loading challenge...</p>
      </div>
    );
  }

  const isVocabulary = challenge.type === "weeklyVocabulary";
  const isSpecial = challenge.type === "special";
  const alreadySubmitted = attempt && !challenge.allowResubmission;

  // ---------- SPECIAL CHALLENGE LAYOUT ----------
  if (isSpecial) {
    return (
      <div className="cd-page">
        <header className="cd-header">
          <button
            className="cd-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={20} />
          </button>
          <p className="cd-logo">
            THE
            <br />
            ARTICULATE
            <br />
            CLUB
          </p>
          <div style={{ width: 20 }} />
        </header>

        <div className="cd-container">
          <div className="cd-special-banner">
            <span className="cd-special-badge">
              <Sparkles size={13} /> SPECIAL CHALLENGE
            </span>
            <h1 className="cd-special-title">{challenge.title}</h1>
            <p className="cd-special-sub">{challenge.description}</p>

            <div className="cd-special-stats">
              <div className="cd-special-stat">
                <Clock size={18} />
                <span>Quick to complete</span>
              </div>
              <div className="cd-special-stat">
                <Star size={18} />
                <span>Extra {challenge.points || 100} points</span>
              </div>
              <div className="cd-special-stat">
                <TrendingUp size={18} />
                <span>Real growth. Real impact.</span>
              </div>
            </div>
          </div>

          <p className="cd-details-label">CHALLENGE DETAILS</p>
          <div className="cd-special-details-card">
            <div className="cd-special-detail-row">
              <Clock size={18} />
              <span>Take your time to get it right</span>
            </div>
            <div className="cd-special-detail-row">
              <Star size={18} />
              <span>Earn {challenge.points || 100} points</span>
            </div>
            <div className="cd-special-detail-row">
              <Users size={18} />
              <span>
                Join {participantCount}+ Articulators who have already taken on
                the challenge.
              </span>
            </div>
          </div>

          <div className="cd-mission-box">
            <Target size={18} className="cd-mission-icon" />
            <div>
              <p className="cd-mission-label">YOUR MISSION</p>
              <p className="cd-mission-text">{challenge.description}</p>
            </div>
          </div>

          {alreadySubmitted ? (
            <div className="cd-already-submitted">
              <p>You've already taken on this challenge. Nice work! 🎉</p>
              <audio
                controls
                src={attempt.audioData}
                className="recorder-audio"
              />
            </div>
          ) : !accepted ? (
            <button className="cd-accept-btn" onClick={() => setAccepted(true)}>
              <Mic size={18} /> Accept the Challenge
            </button>
          ) : (
            <AudioRecorder
              onSubmit={handleSubmitRecording}
              submitting={submitting}
            />
          )}

          <div className="cd-closing-note">
            <p>Small changes. A bigger, clearer you.</p>
          </div>

          <button
            className="cd-back-link"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={15} /> Back to this week's challenges
          </button>
        </div>
      </div>
    );
  }

  // ---------- SPEAKING / VOCABULARY LAYOUT ----------
  return (
    <div className="cd-page">
      <header className="cd-header">
        <button className="cd-back-btn" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
        </button>
        <p className="cd-logo">
          THE
          <br />
          ARTICULATE
          <br />
          CLUB
        </p>
        <div style={{ width: 20 }} />
      </header>

      <div className="cd-container">
        <span className="cd-tag">
          {isVocabulary ? <BookOpen size={14} /> : <Mic size={14} />}
          {isVocabulary ? "VOCABULARY CHALLENGE" : "SPEAKING CHALLENGE"}
        </span>

        {isVocabulary ? (
          <>
            <p className="cd-word-label">Word of the week:</p>
            <h1 className="cd-word">{challenge.title}</h1>
            {challenge.description && (
              <div className="cd-meaning-box">
                <Volume2 size={18} className="cd-meaning-icon" />
                <div>
                  <p className="cd-meaning-label">MEANING</p>
                  <p className="cd-meaning-text">{challenge.description}</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="cd-title">{challenge.title}</h1>
            <p className="cd-description">{challenge.description}</p>
          </>
        )}

        <div className="cd-mission-box">
          <Target size={18} className="cd-mission-icon" />
          <div>
            <p className="cd-mission-label">YOUR MISSION</p>
            <p className="cd-mission-text">
              {isVocabulary
                ? "Learn the word, use it in a sentence, and record yourself using it."
                : "Record your answer and submit it. Keep it clear, thoughtful and authentic."}
            </p>
          </div>
        </div>

        <p className="cd-details-label">CHALLENGE DETAILS</p>
        <div className="cd-details-row">
          <div className="cd-detail-item">
            <Clock size={18} />
            <span>Take up to 2 minutes</span>
          </div>
          <div className="cd-detail-item">
            <Star size={18} />
            <span>Earn {challenge.points || 100} points</span>
          </div>
          <div className="cd-detail-item">
            <Trophy size={18} />
            <span>Build your communication skills</span>
          </div>
        </div>

        {alreadySubmitted ? (
          <div className="cd-already-submitted">
            <p>You've already submitted this challenge. Nice work! 🎉</p>
            <audio
              controls
              src={attempt.audioData}
              className="recorder-audio"
            />
          </div>
        ) : (
          <AudioRecorder
            onSubmit={handleSubmitRecording}
            submitting={submitting}
          />
        )}

        <button className="cd-back-link" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={15} /> Back to this week's challenges
        </button>
      </div>
    </div>
  );
}
