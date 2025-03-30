import { auth, db } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

type MerchantData = {
  name: string;
  phoneNumber: string;
  businessName: string;
  businessAddress: string;
  businessDescription: string;
  businessLogo: string;
  businessCategory: string;
  businessWebsite: string;
};

type UserData = {
  name: string;
  phoneNumber: string;
  age: number;
  gender: string;
  disabled: boolean;
};

export const signUpMerchantWithEmail = async (
  email: string,
  password: string,
  merchantData: MerchantData,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;

    await setDoc(doc(db, "merchants", user.uid), {
      ...merchantData,
      email: user.email,
      uid: user.uid,
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const signUpUserWithEmail = async (
  email: string,
  password: string,
  userData: UserData,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;

    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      email: user.email,
      uid: user.uid,
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async (userType: "merchant" | "user") => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const { user } = result;

    // Check if user already exists in the respective collection
    const collection = userType === "merchant" ? "merchants" : "users";
    await setDoc(
      doc(db, collection, user.uid),
      {
        email: user.email,
        name: user.displayName,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return user;
  } catch (error) {
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};
