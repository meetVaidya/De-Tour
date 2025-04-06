// app/auth/signin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, firestore } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc } from 'firebase/firestore'; // Import getDoc

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading, userType, profileComplete } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (profileComplete) {
        router.push(userType === 'merchant' ? '/merchant/dashboard' : '/user/dashboard');
      } else {
        // If logged in but profile not complete (edge case, e.g., closed tab during completion)
        router.push('/profile/complete');
      }
    }
  }, [user, authLoading, profileComplete, userType, router]);

  const handleSignInSuccess = async (userId: string) => {
    // Check Firestore immediately after login to see if profile exists
    const userDocRef = doc(firestore, 'users', userId);
    const merchantDocRef = doc(firestore, 'merchants', userId);
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        router.push('/user/dashboard');
        return;
      }
      const merchantDoc = await getDoc(merchantDocRef);
      if (merchantDoc.exists()) {
        router.push('/merchant/dashboard');
        return;
      }
      // If neither exists, profile needs completion
      router.push('/profile/complete');
    } catch (err) {
      console.error("Error checking profile post-login:", err);
      setError("Could not verify profile status. Please try again.");
      // Fallback redirect or stay on page? Redirecting to completion might be safest.
      router.push('/profile/complete');
    }
  };

  const handleSignInEmailPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleSignInSuccess(userCredential.user.uid);
    } catch (err: any) {
      console.error("Email/Pass Sign In Error:", err);
      setError(err.message || 'Failed to sign in. Check email/password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      await handleSignInSuccess(userCredential.user.uid);
    } catch (err: any) {
      console.error("Google Sign In Error:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Failed to sign in with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't render the form if auth is loading or user is already logged in
  if (authLoading || user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1>Sign In</h1>
      <form onSubmit={handleSignInEmailPassword} style={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Signing In...' : 'Sign In with Email'}
        </button>
      </form>

      <p style={{ textAlign: 'center', margin: '1rem 0' }}>OR</p>

      <button onClick={handleGoogleSignIn} disabled={loading} style={{ ...styles.button, ...styles.googleButton }}>
        {loading ? 'Processing...' : 'Sign In with Google'}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      <p style={{ marginTop: '1rem' }}>
        Don't have an account? <a href="/auth/signup" style={styles.link}>Sign Up</a>
      </p>
    </div>
  );
}

// Reusing styles from SignUp for consistency
const styles = {
  container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px' },
  button: { padding: '10px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: 1 },
  googleButton: { backgroundColor: '#db4437' },
  error: { color: 'red', marginTop: '10px' },
  link: { color: '#0070f3', textDecoration: 'none' },
} as const;
