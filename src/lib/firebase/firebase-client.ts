import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;

function hasFirebaseConfig() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );
}

export function getFirebaseAuthClient(): Auth {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth is only available in the browser runtime.");
  }

  if (!hasFirebaseConfig()) {
    throw new Error("Missing Firebase public env vars. Check NEXT_PUBLIC_FIREBASE_* settings.");
  }

  if (!cachedApp) {
    cachedApp = initializeApp(firebaseConfig);
  }

  if (!cachedAuth) {
    cachedAuth = getAuth(cachedApp);
  }

  return cachedAuth;
}
