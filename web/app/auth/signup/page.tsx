'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithPopup, UserCredential, getAdditionalUserInfo } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Collect name during initial signup
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth(); // Get user and loading state

  // Redirect if user is already logged in and profile might be complete
  // Let AuthProvider handle the profile check and redirect from profile completion page if needed
  // useEffect(() => {
  //   if (!authLoading && user) {
  //     router.push('/profile/complete'); // Or dashboard if profile is complete
  //   }
  // }, [user, authLoading, router]);

  const handleSuccess = (userCredential: UserCredential) => {
    const isNewUser = getAdditionalUserInfo(userCredential)?.isNewUser;
    console.log('Sign up successful, isNewUser:', isNewUser);
    router.push('/profile/complete');
  };

  const handleSignUpEmailPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      setLoading(false);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // You could potentially update the Firebase Auth profile name here if needed
      // await updateProfile(userCredential.user, { displayName: name });
      handleSuccess(userCredential);
    } catch (err: any) {
      console.error("Email/Pass Sign Up Error:", err);
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      handleSuccess(userCredential);
    } catch (err: any) {
      console.error("Google Sign In Error:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Failed to sign in with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Basic loading state until auth context is resolved
  if (authLoading) {
    return <div>Loading...</div>;
  }
  // If user is already logged in (e.g., navigated back), redirect them appropriately
  if (user) {
    router.push('/profile/complete'); // Or dashboard if profile known complete
    return <div>Redirecting...</div>; // Avoid rendering form if logged in
  }


  return (
    <div style={styles.container}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUpEmailPassword} style={styles.form}>
        <input
          type="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          style={styles.input}
        />
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
          placeholder="Password (min 6 chars)"
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Signing Up...' : 'Sign Up with Email'}
        </button>
      </form>

      <p style={{ textAlign: 'center', margin: '1rem 0' }}>OR</p>

      <button onClick={handleGoogleSignIn} disabled={loading} style={{ ...styles.button, ...styles.googleButton }}>
        {loading ? 'Processing...' : 'Sign Up with Google'}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      <p style={{ marginTop: '1rem' }}>
        Already have an account? <a href="/auth/signin" style={styles.link}>Sign In</a>
      </p>
    </div>
  );
}

// Basic inline styles for demonstration
const styles = {
  container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px' },
  button: { padding: '10px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: 1 },
  googleButton: { backgroundColor: '#db4437' },
  error: { color: 'red', marginTop: '10px' },
  link: { color: '#0070f3', textDecoration: 'none' },
} as const; // Use 'as const' for better type inference with inline styles
