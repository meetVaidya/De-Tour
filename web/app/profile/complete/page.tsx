// app/profile/complete/page.tsx
'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import storage functions
import { firestore, storage } from '@/lib/firebase/config'; // Import storage

type UserType = 'user' | 'merchant';

export default function CompleteProfilePage() {
  const { user, loading: authLoading, userType: existingUserType, profileComplete } = useAuth();
  const router = useRouter();
  const [selectedUserType, setSelectedUserType] = useState<UserType | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Common Fields ---
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // --- User Specific Fields ---
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  // --- Merchant Specific Fields ---
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [businessLogo, setBusinessLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Redirect logic
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Not logged in, redirect to signin
        router.push('/auth/signin');
      } else if (profileComplete) {
        // Profile already exists, redirect to dashboard or appropriate page
        router.push(existingUserType === 'merchant' ? '/merchant/dashboard' : '/user/dashboard');
      } else {
        // Pre-fill name from auth if available (e.g., from Google Sign-In)
        setName(user.displayName || '');
      }
    }
  }, [user, authLoading, profileComplete, existingUserType, router]);

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBusinessLogo(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBusinessLogo(null);
      setLogoPreview(null);
    }
  };

  const uploadLogo = async (userId: string): Promise<string | null> => {
    if (!businessLogo) return null;
    const storageRef = ref(storage, `merchant_logos/${userId}/${businessLogo.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, businessLogo);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (uploadError) {
      console.error("Error uploading logo:", uploadError);
      setError("Failed to upload business logo.");
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !selectedUserType) {
      setError("User not authenticated or user type not selected.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userId = user.uid;
      const userEmail = user.email || ''; // Get email from auth user

      if (selectedUserType === 'user') {
        const userData = {
          uid: userId,
          name,
          email: userEmail,
          phoneNumber,
          age: age === '' ? null : age, // Store as null if empty
          gender,
          disabled: isDisabled,
          createdAt: serverTimestamp(),
          userType: 'user', // Explicitly store type
        };
        await setDoc(doc(firestore, 'users', userId), userData);
        console.log("User profile created successfully!");
        router.push('/user/dashboard'); // Redirect to user dashboard

      } else if (selectedUserType === 'merchant') {
        let logoUrl: string | null = null;
        if (businessLogo) {
          logoUrl = await uploadLogo(userId);
          if (!logoUrl) { // Stop if upload failed
            setIsLoading(false);
            return;
          }
        }

        const merchantData = {
          uid: userId,
          name,
          email: userEmail,
          phoneNumber,
          businessName,
          businessAddress,
          businessDescription,
          businessLogo: logoUrl, // Store the download URL
          businessCategory,
          businessWebsite,
          createdAt: serverTimestamp(),
          userType: 'merchant', // Explicitly store type
        };
        await setDoc(doc(firestore, 'merchants', userId), merchantData);
        console.log("Merchant profile created successfully!");
        router.push('/merchant/dashboard'); // Redirect to merchant dashboard
      }
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || (!user && !authLoading)) {
    // Show loading or wait for redirect effect
    return <div>Loading authentication state...</div>;
  }

  if (profileComplete) {
    // Should be redirected by useEffect, but render loading just in case
    return <div>Loading dashboard...</div>;
  }


  return (
    <div style={styles.container}>
      <h1>Complete Your Profile</h1>
      <p>Welcome, {user?.displayName || user?.email}! Please provide some additional details.</p>

      <form onSubmit={handleSubmit}>
        {/* User Type Selection */}
        <div style={styles.formGroup}>
          <label>I am a:</label>
          <div>
            <input
              type="radio"
              id="userTypeUser"
              name="userType"
              value="user"
              checked={selectedUserType === 'user'}
              onChange={() => setSelectedUserType('user')}
              required
            />
            <label htmlFor="userTypeUser" style={{ marginRight: '15px' }}> Regular User</label>
            <input
              type="radio"
              id="userTypeMerchant"
              name="userType"
              value="merchant"
              checked={selectedUserType === 'merchant'}
              onChange={() => setSelectedUserType('merchant')}
              required
            />
            <label htmlFor="userTypeMerchant"> Merchant</label>
          </div>
        </div>

        {/* Common Fields */}
        <div style={styles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required style={styles.input} />
        </div>

        {/* Conditional Fields */}
        {selectedUserType === 'user' && (
          <>
            <h2>User Details</h2>
            <div style={styles.formGroup}>
              <label htmlFor="age">Age:</label>
              <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value))} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="gender">Gender:</label>
              <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} style={styles.input}>
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label>
                <input type="checkbox" checked={isDisabled} onChange={(e) => setIsDisabled(e.target.checked)} />
                Disabled Account?
              </label>
            </div>
          </>
        )}

        {selectedUserType === 'merchant' && (
          <>
            <h2>Merchant Details</h2>
            <div style={styles.formGroup}>
              <label htmlFor="businessName">Business Name:</label>
              <input type="text" id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="businessAddress">Business Address:</label>
              <textarea id="businessAddress" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="businessDescription">Business Description:</label>
              <textarea id="businessDescription" value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="businessLogo">Business Logo:</label>
              <input type="file" id="businessLogo" accept="image/*" onChange={handleLogoChange} style={styles.input} />
              {logoPreview && <img src={logoPreview} alt="Logo Preview" style={{ maxWidth: '100px', marginTop: '10px' }} />}
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="businessCategory">Business Category:</label>
              <input type="text" id="businessCategory" value={businessCategory} onChange={(e) => setBusinessCategory(e.target.value)} required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="businessWebsite">Business Website (Optional):</label>
              <input type="url" id="businessWebsite" value={businessWebsite} onChange={(e) => setBusinessWebsite(e.target.value)} style={styles.input} />
            </div>
          </>
        )}

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={isLoading || !selectedUserType} style={styles.button}>
          {isLoading ? 'Saving...' : 'Complete Profile'}
        </button>
      </form>
    </div>
  );
}

// Basic inline styles
const styles = {
  container: { maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
  formGroup: { marginBottom: '15px' },
  input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
  button: { padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' },
  error: { color: 'red', marginTop: '10px' },
} as const; 
