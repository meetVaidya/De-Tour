// app/(auth)/sign-in/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase/auth';
import { useAuth } from '@/context/AuthContext'; // Use auth context

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth(); // Get user and loading state

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard'); // Or appropriate landing page
    }
  }, [user, authLoading, router]);


  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      // No need to manually redirect here, AuthProvider will detect change and redirect effect will run
      // router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false); // Keep loading false on error
    }
    // Don't setLoading(false) on success, let the redirect handle it
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      // No need to manually redirect here
      // router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false); // Keep loading false on error
    }
    // Don't setLoading(false) on success
  };

  // Don't render the form if the user is already known (avoids flash)
  if (authLoading || user) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <div style={styles.container}>
      <h2>Sign In</h2>
      <form onSubmit={handleEmailSignIn} style={styles.form}>
        {/* Email and Password Inputs (similar to sign-up) */}
        <div style={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Signing In...' : 'Sign In with Email'}
        </button>
      </form>
      <button onClick={handleGoogleSignIn} disabled={loading} style={{ ...styles.button, ...styles.googleButton }}>
        {loading ? 'Processing...' : 'Sign In with Google'}
      </button>
      <p>Need an account? <a href="/sign-up">Sign Up</a></p>
    </div>
  );
}

// Re-use or define styles similar to SignUpPage
const styles = {
  container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
  form: { display: 'flex', flexDirection: 'column' as 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column' as 'column', gap: '5px' },
  label: { fontWeight: 'bold' },
  input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px' },
  button: { padding: '10px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  googleButton: { backgroundColor: '#db4437', marginTop: '10px' },
  error: { color: 'red', marginTop: '10px' },
};
