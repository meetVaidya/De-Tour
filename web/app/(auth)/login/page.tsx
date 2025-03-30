"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { signInWithEmail, signInWithGoogle } from "@/services/auth";

export default function LoginPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleUserType, setGoogleUserType] = useState<
    "user" | "merchant" | null
  >(null);
  const [showGoogleTypeSelector, setShowGoogleTypeSelector] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && authUser) {
      router.push("/dashboard");
    }
  }, [authUser, authLoading, router]);

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      // Auth state change will trigger redirect via useEffect
      // router.push("/dashboard"); // Or redirect immediately
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Failed to log in. Check email and password.");
      setLoading(false);
    }
    // No finally setLoading(false) because redirect happens on success
  };

  const handleGoogleLoginAttempt = () => {
    // Ask user for their type *before* calling the service function,
    // as the provided service function requires it.
    setShowGoogleTypeSelector(true);
    setError(null); // Clear previous errors
  };

  const handleGoogleLogin = async (type: "user" | "merchant") => {
    setError(null);
    setLoading(true);
    setShowGoogleTypeSelector(false); // Hide selector once type is chosen

    try {
      // NOTE: A more robust implementation might sign in first, *then* check
      // Firestore to determine type or redirect to complete profile if needed.
      // This implementation uses the provided service function structure.
      await signInWithGoogle(type);
      // Auth state change will trigger redirect via useEffect
      // router.push("/dashboard"); // Or redirect immediately
    } catch (err: any) {
      console.error("Google Login failed:", err);
      // Handle specific errors like 'popup-closed-by-user' gracefully
      if (err.code === "auth/popup-closed-by-user") {
        setError("Google Sign in cancelled.");
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setError(
          "An account already exists with the same email address but different sign-in credentials. Try signing in using the original method.",
        );
      }
      // Check if the error indicates the user might exist in the *other* collection
      else if (
        err.message?.includes("document") &&
        err.message?.includes("not found")
      ) {
        // This specific error handling depends heavily on how signInWithGoogle reports errors
        // For now, using a generic message.
        setError(
          `Could not verify account type as '${type}'. Did you sign up as a different type?`,
        );
      } else {
        setError(err.message || "Google Login failed. Please try again.");
      }
      setLoading(false);
    }
    // No finally setLoading(false) because redirect happens on success
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }
  // This check prevents flicker if already logged in
  if (authUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Log in to your Account
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Email/Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
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
              disabled={loading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50"
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading || showGoogleTypeSelector}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading && !showGoogleTypeSelector ? "Logging in..." : "Log in"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login */}
        <div>
          {!showGoogleTypeSelector ? (
            <button
              onClick={handleGoogleLoginAttempt}
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"></path>
              </svg>
              Sign in with Google
            </button>
          ) : (
            <div className="space-y-3 text-center">
              <p className="text-sm text-gray-600">Log in with Google as:</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleGoogleLogin("user")}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  {loading && googleUserType === "user"
                    ? "Processing..."
                    : "User"}
                </button>
                <button
                  onClick={() => handleGoogleLogin("merchant")}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  {loading && googleUserType === "merchant"
                    ? "Processing..."
                    : "Merchant"}
                </button>
              </div>
              <button
                onClick={() => {
                  setShowGoogleTypeSelector(false);
                  setError(null);
                }}
                disabled={loading}
                className="text-xs text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
              >
                Cancel Google Login
              </button>
            </div>
          )}
        </div>

        {/* Link to Signup */}
        <div className="text-center text-sm mt-6 text-black">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
