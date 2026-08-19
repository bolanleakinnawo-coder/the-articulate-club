import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { ref, set, get, query, orderByChild, equalTo } from "firebase/database";

// ---------- REGISTER ----------
export async function registerMember(email, password, name) {
  const cleanEmail = email.trim().toLowerCase();
  const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
  const uid = cred.user.uid;

  await set(ref(db, `members/${uid}`), {
    name,
    email: cleanEmail,
    joinedAt: Date.now(),
    streak: 0,
    challengesCompleted: 0,
    totalPoints: 0,
  });

  // No real session needed after register — they go straight to login
  await signOut(auth);
  return uid;
}

// ---------- LOGIN (email lookup only, no password check) ----------
export async function loginWithEmail(email) {
  const cleanEmail = email.trim().toLowerCase();

  const membersRef = ref(db, "members");
  const emailQuery = query(
    membersRef,
    orderByChild("email"),
    equalTo(cleanEmail),
  );
  const snapshot = await get(emailQuery);

  if (!snapshot.exists()) {
    return { success: false, error: "not-registered" };
  }

  const data = snapshot.val();
  const uid = Object.keys(data)[0];
  const profile = data[uid];

  // Simple local session — no Firebase Auth sign-in happens here
  window.localStorage.setItem("articulateClubUid", uid);

  return { success: true, uid, profile };
}

// ---------- session helpers ----------
export function getLocalSession() {
  return window.localStorage.getItem("articulateClubUid");
}

export function logoutLocal() {
  window.localStorage.removeItem("articulateClubUid");
}

// ---------- fetch member profile for dashboard ----------
export async function getMemberProfile(uid) {
  const snap = await get(ref(db, `members/${uid}`));
  return snap.exists() ? snap.val() : null;
}
