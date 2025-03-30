// app/(auth)/sign-up/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase/auth';
import { checkUserProfileExists } from '@/lib/firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';

type UserType = 'user' | 'merchant';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('user'); // Default to 'user'
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // This function now handles the logic after ANY successful sign-up/sign-in attempt on this page
  const handleAuthenticationSuccess = async (user: FirebaseUser, selectedUserType: UserType) => {
    setLoading(true); // Keep loading indicator active during checks/redirect
    setError(null);
    try {
      console.log(`Handling success for user ${user.uid}. Checking profile existence.`);
      const profileExists = await checkUserProfileExists(user.uid);

      if (profileExists) {
        console.log("Profile exists. Redirecting to dashboard.");
        router.push('/dashboard'); // User already exists and onboarded
      } else {
        // Profile doesn't exist, proceed to onboarding
        console.log(`Profile does not exist. Redirecting to onboarding with type: ${selectedUserType}`);

        // CRITICAL CHECK: Ensure userType is valid before redirecting
        if (!selectedUserType) {
          console.error("Error: selectedUserType is missing before onboarding redirect!");
          setError("An internal error occurred (user type missing). Please try signing up again.");
          setLoading(false); // Stop loading on error
          return; // Prevent redirect
        }

        const redirectUrl = `/onboarding?type=${selectedUserType}`;
        router.push(redirectUrl); // Redirect to onboarding with the type
      }
    } catch (err: any) {
      console.error("Error during post-authentication check:", err);
      setError("Failed to check user profile or redirect. Please try again.");
      setLoading(false); // Stop loading on error
    }
    // setLoading(false) is handled within the try/catch or by the page navigation
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (!userType) { // Should not happen with default, but good check
      setError("Please select an account type.");
      setLoading(false);
      return;
    }
    try {
      const user = await signUpWithEmail(email, password);
      // Pass the currently selected userType to the success handler
      await handleAuthenticationSuccess(user, userType);
    } catch (err: any) {
      setError(err.message);
      setLoading(false); // Stop loading only if auth itself failed
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);

    // Ensure a user type is selected *before* initiating Google Sign In
    if (!userType) {
      setError("Please select an account type (User or Merchant) before signing in with Google.");
      return; // Don't proceed
    }

    setLoading(true);
    const currentSelectedType = userType; // Capture the type before the async call
    console.log(`Initiating Google Sign-In with selected type: ${currentSelectedType}`);

    try {
      const user = await signInWithGoogle();
      // Pass the captured userType to the success handler
      await handleAuthenticationSuccess(user, currentSelectedType);
    } catch (err: any) {
      // Handle errors like popup closed by user, network error, etc.
      console.error("Google Sign-In Error:", err);
      // Provide more specific feedback if possible
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Google Sign-In cancelled.");
      } else {
        setError(err.message || "Failed to sign in with Google.");
      }
      setLoading(false); // Stop loading if Google auth failed
    }
  };

  return (
    <div style={styles.container}>
      <h2>Sign Up</h2>
      <form onSubmit={handleEmailSignUp} style={styles.form}>
        <div style={styles.inputGroup}>
          <label>Account Type:</label>
          <select
            value={userType}
            // Ensure state is updated immediately
            onChange={(e) => {
              setError(null); // Clear error when type changes
              setUserType(e.target.value as UserType);
            }}
            required
            style={styles.input}
            disabled={loading} // Disable while loading
          >
            <option value="user">User</option>
            <option value="merchant">Merchant</option>
          </select>
        </div>
        {/* Email Input */}
        <div style={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email" id="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            required style={styles.input} disabled={loading}
          />
        </div>
        {/* Password Input */}
        <div style={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password" id="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            required minLength={6} style={styles.input} disabled={loading}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Processing...' : 'Sign Up with Email'}
        </button>
      </form>
      <button onClick={handleGoogleSignUp} disabled={loading} style={{ ...styles.button, ...styles.googleButton }}>
        {loading ? 'Processing...' : 'Sign Up with Google'}
      </button>
      <p style={{ marginTop: '15px' }}>Already have an account? <a href="/sign-in">Sign In</a></p>
    </div>
  );
}

// Add or reuse styles object
const styles = {
  container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' as 'center' },
  form: { display: 'flex', flexDirection: 'column' as 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column' as 'column', gap: '5px', textAlign: 'left' as 'left' },
  label: { fontWeight: 'bold' },
  input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px' },
  button: { padding: '10px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: 1 },
  googleButton: { backgroundColor: '#db4437', marginTop: '10px' },
  error: { color: 'red', marginTop: '10px', fontWeight: 'bold' },
  // Style for disabled elements
  button_disabled: { opacity: 0.6, cursor: 'not-allowed' },
  input_disabled: { backgroundColor: '#eee' },
};

// Apply disabled styles dynamically (example for button)
// <button type="submit" disabled={loading} style={{...styles.button, ...(loading ? styles.button_disabled : {})}}>
// You might prefer CSS classes for this.
