import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  deleteUser,
  User,
  reauthenticateWithCredential,
  EmailAuthProvider,
  reauthenticateWithPopup,
} from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();

export const signUpWithEmail = async (
  email: string,
  password: string,
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing up with email:", error);
    throw new Error(error.message || "Failed to sign up.");
  }
};

export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing in with email:", error);
    throw new Error(error.message || "Failed to sign in.");
  }
};

export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential?.accessToken;
    // The signed-in user info.
    const user = result.user;
    return user;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    // Handle specific errors (e.g., popup closed, account exists with different credential)
    throw new Error(error.message || "Failed to sign in with Google.");
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error signing out:", error);
    throw new Error(error.message || "Failed to sign out.");
  }
};

export const deleteCurrentUser = async (
  method: "email" | "google",
  credentials?: { email: string; password: string },
): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently signed in.");

    try {
      await deleteUser(user);
    } catch (error: any) {
      // If the error is due to requiring recent login
      if (error.code === "auth/requires-recent-login") {
        // Attempt to reauthenticate
        await reauthenticateUser(method, credentials);
        // Try deleting again after reauthentication
        await deleteUser(user);
      } else {
        throw error;
      }
    }
  } catch (error: any) {
    console.error("Error deleting current user:", error);
    throw new Error(error.message || "Failed to delete current user.");
  }
};

export const reauthenticateUser = async (
  method: "email" | "google",
  credentials?: { email: string; password: string },
): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently signed in.");

    if (method === "email") {
      if (!credentials?.email || !credentials?.password) {
        throw new Error(
          "Email and password are required for email reauthentication",
        );
      }
      const credential = EmailAuthProvider.credential(
        credentials.email,
        credentials.password,
      );
      await reauthenticateWithCredential(user, credential);
    } else if (method === "google") {
      await reauthenticateWithPopup(user, googleProvider);
    }
  } catch (error: any) {
    console.error("Error reauthenticating:", error);
    throw new Error(error.message || "Failed to reauthenticate.");
  }
};
