import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// TEMPORARY DEBUG LOGGING — remove once the login issue is resolved.
// This only logs the projectId/authDomain (never the API key value itself
// isn't sensitive, but we still avoid dumping the whole object needlessly)
// so you can confirm the browser is actually using the project you expect.
if (typeof window !== "undefined") {
  console.log("🔥 Firebase Connected — runtime config check:", {
    projectId: firebaseConfig.projectId || "❌ EMPTY — env var not loaded",
    authDomain: firebaseConfig.authDomain || "❌ EMPTY — env var not loaded",
    apiKeyPresent: firebaseConfig.apiKey ? "✅ present" : "❌ EMPTY — env var not loaded",
    appId: firebaseConfig.appId || "❌ EMPTY — env var not loaded",
  });
}