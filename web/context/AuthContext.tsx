'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string | null;
  name?: string;
  role: 'user' | 'merchant' | null; // Role determined after onboarding
  // Add other common fields or role-specific fields if needed after fetch
  [key: string]: any; // Allow additional properties
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null; // Raw Firebase user object
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setError(null);
      if (user) {
        setFirebaseUser(user);
        // Attempt to fetch user profile from Firestore
        const userDocRef = doc(firestore, 'users', user.uid);
        const merchantDocRef = doc(firestore, 'merchants', user.uid);

        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserProfile({ ...userDocSnap.data(), uid: user.uid, email: user.email } as UserProfile);
          } else {
            const merchantDocSnap = await getDoc(merchantDocRef);
            if (merchantDocSnap.exists()) {
              setUserProfile({ ...merchantDocSnap.data(), uid: user.uid, email: user.email } as UserProfile);
            } else {
              // User exists in Auth but not in Firestore (likely mid-onboarding)
              setUserProfile({ uid: user.uid, email: user.email, role: null }); // Indicate onboarding needed
            }
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setError("Failed to load user profile.");
          setUserProfile({ uid: user.uid, email: user.email, role: null }); // Basic info on error
        }

      } else {
        setFirebaseUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user: userProfile, firebaseUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
