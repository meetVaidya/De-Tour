// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userType: 'user' | 'merchant' | null; // Add userType
  profileComplete: boolean; // Add profile completion status
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userType: null,
  profileComplete: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'user' | 'merchant' | null>(null);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true); // Start loading when auth state might change
      if (firebaseUser) {
        setUser(firebaseUser);
        // Check if profile exists in Firestore to determine type and completion
        const userDocRef = doc(firestore, 'users', firebaseUser.uid);
        const merchantDocRef = doc(firestore, 'merchants', firebaseUser.uid);

        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserType('user');
            setProfileComplete(true); // Assume profile exists means complete for now
          } else {
            const merchantDocSnap = await getDoc(merchantDocRef);
            if (merchantDocSnap.exists()) {
              setUserType('merchant');
              setProfileComplete(true); // Assume profile exists means complete for now
            } else {
              // User is authenticated but profile doesn't exist yet
              setUserType(null);
              setProfileComplete(false);
            }
          }
        } catch (error) {
          console.error("Error checking user profile:", error);
          setUserType(null);
          setProfileComplete(false);
        }
      } else {
        setUser(null);
        setUserType(null);
        setProfileComplete(false);
      }
      setLoading(false); // Finish loading
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, userType, profileComplete }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
