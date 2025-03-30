// app/(protected)/onboarding/page.tsx <- Use a route group (protected)
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createMerchantProfile, createUserProfile } from '@/lib/firebase/firestore';
import MerchantForm from '@/components/onboarding/MerchantForm'; // Create this component
import UserForm from '@/components/onboarding/UserForm';       // Create this component

// Wrapper component to access searchParams
function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { firebaseUser, loading: authLoading, user: userProfile } = useAuth(); // Use firebaseUser for UID/Email
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userType = searchParams.get('type'); // Get 'user' or 'merchant'

  useEffect(() => {
    // If auth is done loading and there's no firebaseUser, redirect to sign-in
    if (!authLoading && !firebaseUser) {
      router.replace('/sign-in');
    }
    // If user profile already exists (meaning onboarding is complete), redirect away
    if (!authLoading && userProfile?.role) {
      router.replace('/dashboard'); // Or profile page
    }
  }, [firebaseUser, authLoading, userProfile, router]);

  const handleMerchantSubmit = async (data: any) => {
    if (!firebaseUser) return;
    setLoading(true);
    setError(null);
    try {
      await createMerchantProfile(firebaseUser, data);
      router.push('/dashboard'); // Or merchant-specific dashboard
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (data: any) => {
    if (!firebaseUser) return;
    setLoading(true);
    setError(null);
    try {
      // Ensure age is a number
      const userData = { ...data, age: parseInt(data.age, 10) || 0 };
      await createUserProfile(firebaseUser, userData);
      router.push('/dashboard'); // Or user-specific dashboard
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !firebaseUser) {
    return <div>Loading authentication...</div>; // Or a spinner component
  }

  // If profile exists, show loading while redirecting
  if (userProfile?.role) {
    return <div>Loading dashboard...</div>;
  }

  if (!userType) {
    // This shouldn't happen if redirected correctly, but handle it
    return <div>Error: User type not specified. Please <a href="/sign-up">sign up</a> again.</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Complete Your Profile</h2>
      <p>Welcome, {firebaseUser.email}! Please provide some additional details.</p>

      {userType === 'merchant' && (
        <MerchantForm onSubmit={handleMerchantSubmit} loading={loading} />
      )}

      {userType === 'user' && (
        <UserForm onSubmit={handleUserSubmit} loading={loading} />
      )}

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}


// Main component using Suspense for searchParams
export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}


// Basic inline styles
const styles = {
  container: { maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
  error: { color: 'red', marginTop: '10px' },
};
