import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getMessaging, isSupported } from 'firebase/messaging';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Get or initialize the Firebase client app.
 * Used client-side for:
 * - Real-time database (presence, typing indicators)
 * - FCM push notifications
 * - Authentication
 */
export function getFirebaseApp() {
  if (getApps().length > 0) return getApp();
  return initializeApp(firebaseConfig);
}

/**
 * Get the Firebase Realtime Database instance
 */
export function getFirebaseRealtimeDb() {
  const app = getFirebaseApp();
  return getDatabase(app);
}

/**
 * Get the Firebase Cloud Messaging instance
 */
export async function getFirebaseMessagingInstance() {
  const supported = await isSupported();
  if (!supported) return null;
  const app = getFirebaseApp();
  return getMessaging(app);
}

/**
 * Get the Firebase Auth instance
 */
export function getFirebaseAuth() {
  const app = getFirebaseApp();
  return getAuth(app);
}

/**
 * Get the Firebase Storage instance
 */
export function getFirebaseStorageInstance() {
  const app = getFirebaseApp();
  return getStorage(app);
}

// FCM VAPID key for push notifications
export const FCM_VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY || '';
