'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export default function UserDashboard() {
  const { user, loading, userType, profileComplete } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/signin');
      } else if (!profileComplete) {
        router.push('/profile/complete'); // Profile incomplete
      } else if (userType !== 'user') {
        // Logged in, profile complete, but wrong type for this dashboard
        router.push('/merchant/dashboard'); // Or a generic access denied page
      }
    }
  }, [user, loading, profileComplete, userType, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/auth/signin'); // Redirect after sign out
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading || !user || !profileComplete || userType !== 'user') {
    // Show loading or wait for redirect
    return <div>Loading User Dashboard...</div>;
  }

  // Render dashboard content only if user is authenticated, profile complete, and type is 'user'
  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, {user.displayName || user.email}!</p>
      <p>This is your protected user area.</p>
      {/* Add user-specific content here */}
      <button onClick={handleSignOut} style={{ marginTop: '20px', padding: '10px', cursor: 'pointer' }}>
        Sign Out
      </button>
    </div>
  );
}
