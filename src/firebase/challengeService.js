import { db } from "./firebase";
import { ref as dbRef, get, set, update } from "firebase/database";

// ---------- helper: convert recorded audio blob to base64 ----------
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // data:audio/webm;base64,....
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ---------- fetch a single challenge ----------
export async function getChallenge(challengeId) {
  const snap = await get(dbRef(db, `challenges/${challengeId}`));
  return snap.exists() ? { id: challengeId, ...snap.val() } : null;
}

// ---------- check the member's existing attempt on this challenge ----------
export async function getMemberAttempt(challengeId, uid) {
  const snap = await get(dbRef(db, `submissions/${challengeId}/${uid}`));
  return snap.exists() ? snap.val() : null;
}

// ---------- submit a recording ----------
export async function submitRecording({
  challengeId,
  challenge,
  uid,
  memberName,
  audioBlob,
}) {
  // Keep recordings small — base64 in the database isn't meant for large files
  const MAX_SIZE_BYTES = 3 * 1024 * 1024; // ~3MB raw audio, safely under RTDB per-value limits after base64 inflation
  if (audioBlob.size > MAX_SIZE_BYTES) {
    throw new Error("recording-too-large");
  }

  const existing = await getMemberAttempt(challengeId, uid);
  const attemptCount = (existing?.attemptCount || 0) + 1;

  const maxAttempts = challenge.maxAttempts || 1;
  const allowed = challenge.allowResubmission || attemptCount <= maxAttempts;

  if (!allowed) {
    throw new Error("attempt-limit-reached");
  }

  const audioData = await blobToBase64(audioBlob);

  await set(dbRef(db, `submissions/${challengeId}/${uid}`), {
    memberUid: uid,
    memberName,
    challengeId,
    challengeTitle: challenge.title,
    challengeType: challenge.type,
    points: challenge.points || 0,
    audioData, // base64 data URI, playable directly in <audio src="">
    attemptCount,
    status: "pending",
    submittedAt: Date.now(),
  });

  return { attemptCount };
}

// ---------- admin: approve a submission (updates member stats) ----------
// ---------- admin: approve a submission (updates member stats) ----------
export async function approveSubmission(challengeId, uid) {
  const subSnap = await get(dbRef(db, `submissions/${challengeId}/${uid}`));
  if (!subSnap.exists()) return;
  const submission = subSnap.val();

  // Already approved — nothing to do, avoid double-crediting points
  if (submission.status === "approved") return;

  await update(dbRef(db, `submissions/${challengeId}/${uid}`), {
    status: "approved",
  });

  const memberSnap = await get(dbRef(db, `members/${uid}`));
  if (memberSnap.exists()) {
    const member = memberSnap.val();
    await update(dbRef(db, `members/${uid}`), {
      challengesCompleted: (member.challengesCompleted || 0) + 1,
      totalPoints: (member.totalPoints || 0) + (submission.points || 0),
    });
  }
}

// ---------- admin: reject a submission (reverses stats if it was previously approved) ----------
export async function rejectSubmission(challengeId, uid) {
  const subSnap = await get(dbRef(db, `submissions/${challengeId}/${uid}`));
  if (!subSnap.exists()) return;
  const submission = subSnap.val();

  const wasApproved = submission.status === "approved";

  await update(dbRef(db, `submissions/${challengeId}/${uid}`), {
    status: "rejected",
  });

  if (wasApproved) {
    const memberSnap = await get(dbRef(db, `members/${uid}`));
    if (memberSnap.exists()) {
      const member = memberSnap.val();
      await update(dbRef(db, `members/${uid}`), {
        challengesCompleted: Math.max(0, (member.challengesCompleted || 0) - 1),
        totalPoints: Math.max(
          0,
          (member.totalPoints || 0) - (submission.points || 0),
        ),
      });
    }
  }
}
// ---------- member: get their most recent submission for the dashboard ----------
export async function getMemberRecentSubmission(uid) {
  const snap = await get(dbRef(db, "submissions"));
  if (!snap.exists()) return null;

  const all = snap.val();
  let latest = null;

  Object.values(all).forEach((challengeSubs) => {
    const sub = challengeSubs[uid];
    if (sub && (!latest || sub.submittedAt > latest.submittedAt)) {
      latest = sub;
    }
  });

  return latest;
}
