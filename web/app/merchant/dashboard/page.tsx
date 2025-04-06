// app/merchant/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export default function MerchantDashboard() {
  const { user, loading, userType, profileComplete } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/signin'); // Not logged in
      } else if (!profileComplete) {
        router.push('/profile/complete'); // Profile incomplete
      } else if (userType !== 'merchant') {
        // Logged in, profile complete, but wrong type for this dashboard
        router.push('/user/dashboard'); // Or a generic access denied page
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

  if (loading || !user || !profileComplete || userType !== 'merchant') {
    // Show loading or wait for redirect
    return <div>Loading Merchant Dashboard...</div>;
  }

  // Render dashboard content only if user is authenticated, profile complete, and type is 'merchant'
  return (
    <div>
      <h1>Merchant Dashboard</h1>
      <p>Welcome, Merchant {user.displayName || user.email}!</p>
      <p>This is your protected merchant area.</p>
      {/* Add merchant-specific content here */}
      <button onClick={handleSignOut} style={{ marginTop: '20px', padding: '10px', cursor: 'pointer' }}>
        Sign Out
      </button>
    </div>
  );
}
