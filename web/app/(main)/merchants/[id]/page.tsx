"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useParams and useRouter
import Link from "next/link";
import { motion } from "framer-motion";

// --- Firebase Imports ---
import { db } from "@/config/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  DocumentData, // Type for Firestore document data
  Timestamp, // Type for Firestore timestamp (if you use it)
} from "firebase/firestore";
// --- End Firebase Imports ---

// Interface should match your Firestore document structure
interface Merchant {
  id: string; // Firestore document ID
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  business_type: string;
  address: string;
  image_url?: string;
  likes: number;
  dislikes: number;
  business_description?: string; // Added description
  business_website?: string; // Added website
  createdAt?: Timestamp | string; // Optional timestamp
  // Add any other fields from your Firestore documents
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function MerchantDetailPage() {
  const params = useParams(); // Get route parameters { id: '...' }
  const router = useRouter(); // For navigation if needed
  const merchantId = params?.id as string; // Extract the id, assert as string

  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the specific merchant data from Firestore
  useEffect(() => {
    const fetchMerchant = async () => {
      if (!merchantId) {
        setError("Merchant ID not found in URL.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null); // Clear previous errors

      try {
        const merchantDocRef = doc(db, "merchants", merchantId);
        const docSnap = await getDoc(merchantDocRef);

        if (docSnap.exists()) {
          // Combine ID and data, ensure types
          const data = docSnap.data() as DocumentData;
          const fetchedMerchant: Merchant = {
            id: docSnap.id,
            business_name: data.business_name || "N/A",
            owner_name: data.owner_name || "N/A",
            email: data.email || "N/A",
            phone: data.phone || "N/A",
            business_type: data.business_type || "N/A",
            address: data.address || "N/A",
            likes: typeof data.likes === "number" ? data.likes : 0,
            dislikes: typeof data.dislikes === "number" ? data.dislikes : 0,
            image_url: data.image_url || undefined,
            business_description: data.business_description || undefined,
            business_website: data.business_website || undefined,
            createdAt: data.createdAt || undefined, // Keep as Timestamp or convert if needed
          };
          setMerchant(fetchedMerchant);
        } else {
          setError("Merchant not found."); // Handle not found case
        }
      } catch (err) {
        console.error("Error fetching merchant details:", err);
        setError("Failed to load merchant details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchant();
  }, [merchantId]); // Re-fetch if merchantId changes

  // Voting function (similar to listing page, but updates local state too)
  const vote = async (type: "like" | "dislike") => {
    if (!merchant) return;

    // --- Optimistic Update for this specific merchant ---
    setMerchant((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        likes: type === "like" ? (prev.likes || 0) + 1 : prev.likes || 0,
        dislikes:
          type === "dislike" ? (prev.dislikes || 0) + 1 : prev.dislikes || 0,
      };
    });
    // --- End Optimistic Update ---

    try {
      const merchantDocRef = doc(db, "merchants", merchant.id);
      const fieldToIncrement = type === "like" ? "likes" : "dislikes";

      await updateDoc(merchantDocRef, {
        [fieldToIncrement]: increment(1),
      });
      // No need to refetch state here as optimistic update handles it
    } catch (error) {
      console.error("Voting error:", error);
      alert("Failed to record vote. Please try again.");
      // Revert optimistic update on error
      // Refetching the single document is simpler than complex state reversal
      const merchantDocRef = doc(db, "merchants", merchant.id);
      const docSnap = await getDoc(merchantDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as DocumentData;
        setMerchant((prev) =>
          prev
            ? {
                ...prev, // Keep existing structure
                likes: typeof data.likes === "number" ? data.likes : 0,
                dislikes: typeof data.dislikes === "number" ? data.dislikes : 0,
              }
            : null,
        );
      }
    }
  };

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-forest-500 border-t-transparent rounded-full" />
        <p className="ml-4 text-forest-700">Loading Merchant...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100 flex flex-col items-center justify-center text-center px-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-2xl font-semibold text-red-700 mb-2">Error</h2>
        <p className="text-forest-600 mb-6">{error}</p>
        <Link
          href="/merchants"
          className="px-6 py-2 bg-forest-600 text-white rounded-md hover:bg-forest-700 transition-colors"
        >
          Back to Merchant List
        </Link>
      </div>
    );
  }

  if (!merchant) {
    // This case might be covered by the error state, but good to have
    return (
      <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-forest-700 mb-6">
          Merchant Not Found
        </h2>
        <Link
          href="/merchants"
          className="px-6 py-2 bg-forest-600 text-white rounded-md hover:bg-forest-700 transition-colors"
        >
          Back to Merchant List
        </Link>
      </div>
    );
  }

  // --- Render Merchant Details ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100 py-24 px-4">
      {/* Optional background pattern */}
      <div className="absolute inset-0 bg-[url('/leaf-pattern.png')] opacity-5 pointer-events-none" />

      <div className="relative container mx-auto max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-8"
        >
          <Link
            href="/merchants"
            className="inline-flex items-center text-forest-600 hover:text-forest-800 transition-colors group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Merchant List
          </Link>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-forest-100"
        >
          {/* Image Header */}
          {merchant.image_url ? (
            <motion.img
              variants={fadeIn}
              src={merchant.image_url}
              alt={merchant.business_name}
              className="w-full h-48 md:h-64 object-cover"
            />
          ) : (
            <motion.div
              variants={fadeIn}
              className="w-full h-48 md:h-64 bg-gradient-to-br from-forest-100 to-sage-200 flex items-center justify-center text-forest-400"
            >
              {/* Placeholder Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </motion.div>
          )}

          <div className="p-6 md:p-10">
            {/* Business Name & Type */}
            <motion.div variants={fadeIn} className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-forest-800 mb-2">
                {merchant.business_name}
              </h1>
              <p className="text-lg text-forest-500">
                {merchant.business_type}
              </p>
            </motion.div>

            {/* Description */}
            {merchant.business_description && (
              <motion.div
                variants={fadeIn}
                className="mb-6 prose prose-forest max-w-none"
              >
                <h2 className="text-xl font-semibold text-forest-700 mb-2">
                  About Us
                </h2>
                <p>{merchant.business_description}</p>
              </motion.div>
            )}

            {/* Details Section */}
            <motion.div
              variants={fadeIn}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8 text-forest-700"
            >
              <div>
                <span className="font-semibold">Owner:</span>{" "}
                {merchant.owner_name}
              </div>
              <div>
                <span className="font-semibold">Contact Email:</span>{" "}
                <a
                  href={`mailto:${merchant.email}`}
                  className="text-indigo-600 hover:underline"
                >
                  {merchant.email}
                </a>
              </div>
              <div>
                <span className="font-semibold">Phone:</span> {merchant.phone}
              </div>
              <div>
                <span className="font-semibold">Address:</span>{" "}
                {merchant.address}
              </div>
              {merchant.business_website && (
                <div className="md:col-span-2">
                  <span className="font-semibold">Website:</span>{" "}
                  <a
                    href={merchant.business_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    {merchant.business_website}
                  </a>
                </div>
              )}
            </motion.div>

            {/* Voting Area */}
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-forest-100 pt-6 mt-6"
            >
              <p className="font-medium text-forest-700">Rate this Merchant:</p>
              <div className="flex gap-3">
                <button
                  onClick={() => vote("like")}
                  aria-label={`Like ${merchant.business_name}`}
                  className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a2 2 0 00-.8 1.4z" />
                  </svg>
                  Like ({merchant.likes || 0})
                </button>
                <button
                  onClick={() => vote("dislike")}
                  aria-label={`Dislike ${merchant.business_name}`}
                  className="flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.641a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.2-1.867a2 2 0 00.8-1.4z" />
                  </svg>
                  Dislike ({merchant.dislikes || 0})
                </button>
              </div>
              <p className="text-sm text-forest-600 mt-2 sm:mt-0 sm:ml-4">
                Net Score: {(merchant.likes || 0) - (merchant.dislikes || 0)}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
