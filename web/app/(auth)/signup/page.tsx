"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
// Import necessary Firebase auth types and functions
import {
  User,
  GoogleAuthProvider, // <--- Import
  signInWithPopup, // <--- Import
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
// Import Firebase config instances
import { db, auth } from "@/config/firebase"; // Need db for post-Google signup check/update
import { useAuth } from "@/context/AuthContext";
import { signUpMerchantWithEmail, signUpUserWithEmail } from "@/services/auth";
import Link from "next/link"; // <-- Import Link
import { LandmarkIcon, UserIcon } from "lucide-react";

// Define types directly in the component or import if shared
type MerchantData = {
  name: string;
  phoneNumber: string;
  businessName: string;
  businessAddress: string;
  businessDescription: string;
  businessLogo: string; // Assuming URL for now
  businessCategory: string;
  businessWebsite: string;
};

// Match the expected type in signUpUserWithEmail
type UserData = {
  name: string;
  phoneNumber: string;
  age: number; // <--- Ensure this is number
  gender: string;
  disabled: boolean;
};

export default function SignupPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();

  // Step management
  const [step, setStep] = useState<"selectType" | "details">("selectType");
  const [userType, setUserType] = useState<"user" | "merchant" | null>(null);

  // Common fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // User specific fields
  const [userName, setUserName] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [age, setAge] = useState<string>(""); // Use string for input
  const [gender, setGender] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  // Merchant specific fields
  const [merchantName, setMerchantName] = useState("");
  const [merchantPhoneNumber, setMerchantPhoneNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessLogo, setBusinessLogo] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google Sign-In specific state
  const [pendingGoogleUser, setPendingGoogleUser] = useState<User | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && authUser) {
      router.push("/dashboard");
    }
  }, [authUser, authLoading, router]);

  // --- Handlers ---

  const handleSelectUserType = (type: "user" | "merchant") => {
    setUserType(type);
    setStep("details");
    setError(null); // Clear previous errors
  };

  const handleBack = () => {
    setStep("selectType");
    setUserType(null);
    setPendingGoogleUser(null); // Clear pending Google user if going back
    setError(null);
    // Optionally clear form fields
  };

  const handleEmailSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!userType) {
      setError("Please select an account type."); // Should not happen if step logic is correct
      return;
    }

    setLoading(true);

    try {
      if (userType === "user") {
        const parsedAge = parseInt(age, 10); // Parse age here
        if (isNaN(parsedAge)) {
          throw new Error("Please enter a valid age.");
        }
        const userData: UserData = {
          // Build the object matching the expected type
          name: userName,
          phoneNumber: userPhoneNumber,
          age: parsedAge, // <--- Use the parsed number
          gender,
          disabled: isDisabled,
        };
        // Basic validation (add more as needed)
        if (!userName || !userPhoneNumber || !age || !gender) {
          throw new Error("Please fill in all user details.");
        }
        // Now the type matches
        await signUpUserWithEmail(email, password, userData as UserData);
        router.push("/dashboard");
      } else if (userType === "merchant") {
        const merchantData: MerchantData = {
          name: merchantName,
          phoneNumber: merchantPhoneNumber,
          businessName,
          businessAddress,
          businessDescription,
          businessLogo,
          businessCategory,
          businessWebsite,
        };
        // Basic validation (add more as needed)
        if (
          !merchantName ||
          !merchantPhoneNumber ||
          !businessName ||
          !businessAddress ||
          !businessCategory
        ) {
          throw new Error("Please fill in all required merchant details.");
        }
        await signUpMerchantWithEmail(email, password, merchantData);
        router.push("/merchant-dashboard");
      }
    } catch (err: any) {
      console.error("Signup failed:", err);
      setError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (type: "user" | "merchant") => {
    setError(null);
    setLoading(true);
    setUserType(type); // Set user type for potential detail collection

    try {
      // Use the existing signInWithGoogle but handle the post-login flow
      // NOTE: The provided signInWithGoogle *already* creates a basic Firestore doc.
      // We need to check if *full* details are needed.

      const provider = new GoogleAuthProvider(); // <--- Correctly referenced
      const result = await signInWithPopup(auth, provider); // <--- Correctly referenced
      const googleUser = result.user;

      // Check if user profile exists and is complete in Firestore
      const collectionName = type === "merchant" ? "merchants" : "users";
      const userDocRef = doc(db, collectionName, googleUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      let requiresDetails = true;
      let isMerchant = false;
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        // Add checks based on required fields for each type
        if (
          type === "user" &&
          data.name &&
          data.phoneNumber &&
          data.age !== undefined &&
          data.gender
        ) {
          requiresDetails = false;
        } else if (
          type === "merchant" &&
          data.name &&
          data.phoneNumber &&
          data.businessName &&
          data.businessAddress &&
          data.businessCategory
        ) {
          requiresDetails = false;
          isMerchant = true;
        }
      }
      console.log("merchant hai ya nahi", isMerchant);
      if (requiresDetails) {
        // Need to collect details
        setPendingGoogleUser(googleUser);
        setEmail(googleUser.email || ""); // Pre-fill email
        // Pre-fill name if available
        if (type === "user") setUserName(googleUser.displayName || "");
        if (type === "merchant") setMerchantName(googleUser.displayName || "");

        setStep("details"); // Go to details step
        setLoading(false); // Stop loading, user needs to input data
      } else {
        if (isMerchant) {
          router.push("/merchant-dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      console.error("Google Signup failed:", err);
      // Handle specific errors like 'popup-closed-by-user' gracefully
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Google Sign up failed. Please try again.");
      }
      setLoading(false);
      setUserType(null); // Reset type if Google sign in failed before selection
    }
  };

  // Handles submitting details AFTER Google sign-in
  const handleGoogleDetailsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!pendingGoogleUser || !userType) {
      setError("An error occurred. Please try signing in again.");
      return;
    }

    setLoading(true);
    try {
      const collectionName = userType === "merchant" ? "merchants" : "users";
      // Define base structure matching Firestore document
      let dataToSave: any = {
        email: pendingGoogleUser.email,
        uid: pendingGoogleUser.uid,
        name: userType === "user" ? userName : merchantName,
        phoneNumber:
          userType === "user" ? userPhoneNumber : merchantPhoneNumber,
        createdAt: new Date().toISOString(), // Or use server timestamp
      };

      if (userType === "user") {
        const parsedAge = parseInt(age, 10); // Parse age
        if (isNaN(parsedAge)) {
          throw new Error("Please enter a valid age.");
        }
        // Define the User specific part matching the UserData type
        const userDataDetails: Omit<UserData, "name" | "phoneNumber"> = {
          age: parsedAge,
          gender,
          disabled: isDisabled,
        };
        // Basic validation
        if (!userName || !userPhoneNumber || !age || !gender) {
          throw new Error("Please fill in all user details.");
        }
        dataToSave = { ...dataToSave, ...userDataDetails };
        await setDoc(
          doc(db, collectionName, pendingGoogleUser.uid),
          dataToSave,
          {
            merge: true,
          },
        );
        router.push("/dashboard");
      } else {
        // merchant
        // Define the Merchant specific part matching the MerchantData type
        const merchantDataDetails: Omit<MerchantData, "name" | "phoneNumber"> =
          {
            businessName,
            businessAddress,
            businessDescription,
            businessLogo,
            businessCategory,
            businessWebsite,
          };
        // Basic validation
        if (
          !merchantName ||
          !merchantPhoneNumber ||
          !businessName ||
          !businessAddress ||
          !businessCategory
        ) {
          throw new Error("Please fill in all required merchant details.");
        }
        dataToSave = { ...dataToSave, ...merchantDataDetails };
        await setDoc(
          doc(db, collectionName, pendingGoogleUser.uid),
          dataToSave,
          {
            merge: true,
          },
        );
        router.push("/merchant-dashboard");
      }
    } catch (err: any) {
      console.error("Failed to save Google user details:", err);
      setError(err.message || "Failed to save details. Please try again.");
      setLoading(false);
    }
  };

  // --- Render Logic ---
  // (Keep the render logic as it was, it seems fine)
  // ... rest of the component's return statement ...

  // --- Render Logic ---

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }
  if (authUser) {
    // Should have been redirected by useEffect, but added as safety
    return (
      <div className="flex justify-center items-center min-h-screen">
        Redirecting...
      </div>
    );
  }

  // Render Step 1: Select User Type
  if (step === "selectType") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Join Us!
          </h2>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <p className="text-center text-gray-600">
            How would you like to sign up?
          </p>
          <div className="space-y-4">
            <button
              onClick={() => handleSelectUserType("user")}
              disabled={loading}
              className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Sign up as a User
            </button>
            <button
              onClick={() => handleSelectUserType("merchant")}
              disabled={loading}
              className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Sign up as a Merchant
            </button>
          </div>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or sign up with Google
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="text-center text-sm text-gray-600">
              Sign up with Google as:
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleGoogleSignup("user")}
                disabled={loading}
                className="px-4 cursor-pointer py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
              >
                <UserIcon className="h-4 w-4" />
                User
              </button>
              <button
                onClick={() => handleGoogleSignup("merchant")}
                disabled={loading}
                className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
              >
                <LandmarkIcon className="h-4 w-4" />
                Merchant
              </button>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-black">
          Already have an account?{" "}
          <Link // <-- Use Link component
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  // Render Step 2: Enter Details
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-10 px-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <button
          onClick={handleBack}
          className="text-sm text-indigo-600 hover:text-indigo-500 mb-4"
        >
          &larr; Back to account type selection
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Sign Up as {userType === "user" ? "a User" : "a Merchant"}
          {pendingGoogleUser ? " (Complete Profile)" : ""}
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form
          onSubmit={
            pendingGoogleUser ? handleGoogleDetailsSubmit : handleEmailSignup
          }
          className="space-y-4"
        >
          {/* Common Fields (Email/Password only needed for email signup) */}
          {!pendingGoogleUser && (
            <>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </>
          )}
          {pendingGoogleUser && email && (
            <p className="text-sm text-gray-600">
              Signing up with Google account: <strong>{email}</strong>
            </p>
          )}

          {/* User Specific Fields */}
          {userType === "user" && (
            <>
              <hr className="my-4" />
              <h3 className="text-lg font-medium text-gray-800">
                User Details
              </h3>
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name *
                </label>
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="userPhoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number *
                </label>
                <input
                  id="userPhoneNumber"
                  name="userPhoneNumber"
                  type="tel"
                  required
                  value={userPhoneNumber}
                  onChange={(e) => setUserPhoneNumber(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700"
                >
                  Age *
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  min="0"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  id="isDisabled"
                  name="isDisabled"
                  type="checkbox"
                  checked={isDisabled}
                  onChange={(e) => setIsDisabled(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="isDisabled"
                  className="ml-2 block text-sm text-gray-900"
                >
                  I require disability assistance
                </label>
              </div>
            </>
          )}

          {/* Merchant Specific Fields */}
          {userType === "merchant" && (
            <>
              <hr className="my-4" />
              <h3 className="text-lg font-medium text-gray-800">
                Merchant & Business Details
              </h3>
              <div>
                <label
                  htmlFor="merchantName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Full Name *
                </label>
                <input
                  id="merchantName"
                  name="merchantName"
                  type="text"
                  required
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="merchantPhoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Phone Number *
                </label>
                <input
                  id="merchantPhoneNumber"
                  name="merchantPhoneNumber"
                  type="tel"
                  required
                  value={merchantPhoneNumber}
                  onChange={(e) => setMerchantPhoneNumber(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Name *
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="businessAddress"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Address *
                </label>
                <input
                  id="businessAddress"
                  name="businessAddress"
                  type="text"
                  required
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="businessCategory"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Category *
                </label>
                <input
                  id="businessCategory"
                  name="businessCategory"
                  type="text"
                  required
                  placeholder="e.g., Restaurant, Retail, Service"
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="businessDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Description
                </label>
                <textarea
                  id="businessDescription"
                  name="businessDescription"
                  rows={3}
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="businessWebsite"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Website (Optional)
                </label>
                <input
                  id="businessWebsite"
                  name="businessWebsite"
                  type="url"
                  placeholder="https://example.com"
                  value={businessWebsite}
                  onChange={(e) => setBusinessWebsite(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="businessLogo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Logo URL (Optional)
                </label>
                <input
                  id="businessLogo"
                  name="businessLogo"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={businessLogo}
                  onChange={(e) => setBusinessLogo(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <p className="text-xs text-gray-500 mt-4">* Required fields</p>
            </>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || !userType}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : pendingGoogleUser
                  ? "Save Details & Continue"
                  : "Sign Up"}
            </button>
          </div>
        </form>
        <div className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link // <-- Use Link component
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
