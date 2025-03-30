// lib/firebase/firestore.ts
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { firestore } from './config';
import { User as FirebaseUser } from 'firebase/auth'; // Use FirebaseUser type

// Interface for Merchant Data (excluding uid, email, role - added automatically)
interface MerchantFormData {
  name: string;
  phoneNumber: string;
  businessName: string;
  businessAddress: string;
  businessDescription: string;
  businessLogoUrl?: string; // Optional initially, can be updated later
  businessCategory: string;
  businessWebsite?: string;
}

// Interface for User Data (excluding uid, email, role - added automatically)
interface UserFormData {
  name: string;
  phoneNumber: string;
  age: number;
  gender: string;
  isDisabled: boolean;
}

// Function to check if a user profile exists
export const checkUserProfileExists = async (uid: string): Promise<boolean> => {
  const userDocRef = doc(firestore, 'users', uid);
  const merchantDocRef = doc(firestore, 'merchants', uid);
  const userDocSnap = await getDoc(userDocRef);
  const merchantDocSnap = await getDoc(merchantDocRef);
  return userDocSnap.exists() || merchantDocSnap.exists();
}

// Function to create Merchant Profile
export const createMerchantProfile = async (user: FirebaseUser, data: MerchantFormData): Promise<void> => {
  if (!user) throw new Error("User not authenticated.");

  const merchantDocRef = doc(firestore, 'merchants', user.uid);

  try {
    await setDoc(merchantDocRef, {
      uid: user.uid,
      email: user.email,
      role: 'merchant',
      createdAt: serverTimestamp(),
      ...data, // Spread the rest of the form data
    });
    console.log("Merchant profile created successfully!");
  } catch (error) {
    console.error("Error creating merchant profile: ", error);
    throw new Error("Failed to create merchant profile.");
  }
};

// Function to create User Profile
export const createUserProfile = async (user: FirebaseUser, data: UserFormData): Promise<void> => {
  if (!user) throw new Error("User not authenticated.");

  const userDocRef = doc(firestore, 'users', user.uid);

  try {
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      role: 'user',
      createdAt: serverTimestamp(),
      ...data, // Spread the rest of the form data
    });
    console.log("User profile created successfully!");
  } catch (error) {
    console.error("Error creating user profile: ", error);
    throw new Error("Failed to create user profile.");
  }
};
