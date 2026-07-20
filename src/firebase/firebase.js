import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDyHf6dv4ASIp4zzOaBYuwktZg3acGs0zM",
  authDomain: "articulate-group.firebaseapp.com",
  projectId: "articulate-group",
  storageBucket: "articulate-group.firebasestorage.app",
  messagingSenderId: "529113337866",
  appId: "1:529113337866:web:f24749f12a623af8fbcff3",
  measurementId: "G-3LGLD9K5JT",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

export const analytics = getAnalytics(app);
