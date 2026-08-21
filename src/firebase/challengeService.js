import { db } from "./firebase";
import { ref as dbRef, get, set, update } from "firebase/database";

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function getWeekKey(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

export async function getChallenge(challengeId) {
  const snap = await get(dbRef(db, `challenges/${challengeId}`));
  return snap.exists() ? { id: challengeId, ...snap.val() } : null;
}

export async function getMemberAttempt(challengeId, uid) {
  const snap = await get(dbRef(db, `submissions/${challengeId}/${uid}`));
  return snap.exists() ? snap.val() : null;
}

export async function getSubmissionCount(challengeId) {
  const snap = await get(dbRef(db, `submissions/${challengeId}`));
  return snap.exists() ? Object.keys(snap.val()).length : 0;
}

// ---------- get ALL of a member's submissions across every challenge, newest first ----------
export async function getMemberAllSubmissions(uid) {
  const snap = await get(dbRef(db, "submissions"));
  if (!snap.exists()) return [];

  const all = snap.val();
  const list = [];

  Object.values(all).forEach((byUid) => {
    const sub = byUid[uid];
    if (sub) list.push(sub);
  });

  list.sort((a, b) => b.submittedAt - a.submittedAt);
  return list;
}

// ---------- streak: based on when the member actually submitted, not the challenge deadline ----------
async function checkAndUpdateStreak(uid) {
  const memberSubs = await getMemberAllSubmissions(uid);
  const weekKey = getWeekKey(Date.now());

  const thisWeekSubs = memberSubs.filter(
    (s) =>
      s.challengeType !== "special" && getWeekKey(s.submittedAt) === weekKey,
  );

  const hasSpeaking = thisWeekSubs.some(
    (s) => s.challengeType === "weeklySpeaking",
  );
  const hasVocabulary = thisWeekSubs.some(
    (s) => s.challengeType === "weeklyVocabulary",
  );

  if (!hasSpeaking || !hasVocabulary) return;

  const memberSnap = await get(dbRef(db, `members/${uid}`));
  if (!memberSnap.exists()) return;
  const member = memberSnap.val();

  const lastStreakWeek = member.lastStreakWeek || null;
  if (lastStreakWeek === weekKey) return; // already counted this week

  let newStreak;

  if (!lastStreakWeek) {
    newStreak = 1;
  } else {
    const lastDate = new Date(lastStreakWeek);
    const expectedNext = new Date(lastDate);
    expectedNext.setDate(lastDate.getDate() + 7);
    const expectedNextKey = expectedNext.toISOString().slice(0, 10);
    newStreak = weekKey === expectedNextKey ? (member.streak || 0) + 1 : 1;
  }

  await update(dbRef(db, `members/${uid}`), {
    streak: newStreak,
    lastStreakWeek: weekKey,
  });
}

export async function submitRecording({
  challengeId,
  challenge,
  uid,
  memberName,
  audioBlob,
  durationSeconds,
}) {
  const MAX_SIZE_BYTES = 3 * 1024 * 1024;
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
  const submittedAt = Date.now();

  await set(dbRef(db, `submissions/${challengeId}/${uid}`), {
    memberUid: uid,
    memberName,
    challengeId,
    challengeTitle: challenge.title,
    challengeType: challenge.type,
    points: challenge.points || 0,
    audioData,
    durationSeconds: durationSeconds || 0,
    attemptCount,
    submittedAt,
  });

  if (!existing) {
    const memberSnap = await get(dbRef(db, `members/${uid}`));
    if (memberSnap.exists()) {
      const member = memberSnap.val();
      await update(dbRef(db, `members/${uid}`), {
        challengesCompleted: (member.challengesCompleted || 0) + 1,
        totalPoints: (member.totalPoints || 0) + (challenge.points || 0),
      });
    }
  }

  if (challenge.type !== "special") {
    await checkAndUpdateStreak(uid);
  }

  return { attemptCount };
}

export async function getMemberRecentSubmission(uid) {
  const all = await getMemberAllSubmissions(uid);
  return all.length > 0 ? all[0] : null;
}
