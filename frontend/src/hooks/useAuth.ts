import { useState, useEffect } from 'react';
import { auth } from '../api/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export interface UserSession {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export const useAuth = () => {
  const isDemoMode = import.meta.env.VITE_USE_DEMO_MODE !== 'false';
  
  const [user, setUser] = useState<UserSession | null>(
    isDemoMode ? { uid: 'demo-omega-01', displayName: 'Commander Claude', email: 'claude@nova.internal', photoURL: null } : null
  );
  const [loading, setLoading] = useState(!isDemoMode);

  useEffect(() => {
    if (isDemoMode) {
      setLoading(false);
      return;
    }

    if (!auth) {
      console.warn("Firebase Auth bypassed - No configuration. Switched to Demo environment.");
      setUser({ uid: 'demo-omega-01', displayName: 'Commander Claude', email: 'claude@nova.internal', photoURL: null });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  const logoutUser = async () => {
    if (isDemoMode) {
      setUser(null);
      return;
    }
    if (auth) await signOut(auth);
  };

  return { user, loading, isDemoMode, logoutUser };
};
