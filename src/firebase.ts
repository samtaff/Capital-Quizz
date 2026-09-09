import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Validate connection to Firestore on boot
async function testConnection() {
  try {
    const { doc, getDocFromServer } = await import('firebase/firestore');
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export async function ensureAnonymousAuth(): Promise<string> {
  try {
    if (auth.currentUser) {
      return auth.currentUser.uid;
    }
    const userCredential = await signInAnonymously(auth);
    return userCredential.user.uid;
  } catch (err: any) {
    console.warn(
      'Firebase signInAnonymously unavailable or restricted by project settings:',
      err?.code || err?.message
    );
    // Seamless fallback to persistent device ID so testing and playing works immediately
    let guestId = localStorage.getItem('capitals_player_uid');
    if (!guestId) {
      guestId = 'player_' + Math.random().toString(36).substring(2, 12);
      localStorage.setItem('capitals_player_uid', guestId);
    }
    return guestId;
  }
}
