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
} from "lucide-react";
import {
  getChallenge,
  getMemberAttempt,
  submitRecording,
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const uid = getLocalSession();
    if (!uid) {
      navigate("/login");
      return;
    }

    (async () => {
      const c = await getChallenge(id);

      if (!c || c.type === "special") {
        // Special challenges aren't handled yet — send them back
        navigate("/dashboard");
        return;
      }

      const memberProfile = await getMemberProfile(uid);
      const existingAttempt = await getMemberAttempt(id, uid);

      setChallenge(c);
      setProfile(memberProfile);
      setAttempt(existingAttempt);
      setLoading(false);
    })();
  }, [id, navigate]);

  const handleSubmitRecording = async (audioBlob) => {
    const uid = getLocalSession();
    setSubmitting(true);

    try {
      await submitRecording({
        challengeId: id,
        challenge,
        uid,
        memberName: profile.name,
        audioBlob,
      });

      alert("Your recording has been submitted for review!");
      navigate("/dashboard");
    } catch (err) {
      if (err.message === "attempt-limit-reached") {
        alert(
          "You've reached the maximum number of attempts for this challenge.",
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
  const alreadySubmitted =
    attempt && attempt.status !== "rejected" && !challenge.allowResubmission;

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
            <p>
              You've already submitted this challenge —{" "}
              <strong>
                {attempt.status === "approved" ? "approved ✅" : "under review"}
              </strong>
              .
            </p>
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
