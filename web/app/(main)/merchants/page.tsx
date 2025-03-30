"use client";

import { useEffect, useState } from "react";
// --- Firebase Imports ---
import { db } from "@/config/firebase"; // Assuming db is exported from your config
import {
  collection,
  getDocs,
  query,
  orderBy as firestoreOrderBy, // Alias to avoid conflict with potential sort functions
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
// --- End Firebase Imports ---

import Link from "next/link";
import { motion } from "framer-motion";
import debounce from "lodash/debounce"; // Ensure lodash is installed:

// Interface should match your Firestore document structure
interface Merchant {
  id: string; // Firestore document ID
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  business_type: string;
  address: string;
  image_url?: string; // Optional image URL
  likes: number; // Assume these exist and are numbers in Firestore
  dislikes: number; // Assume these exist and are numbers in Firestore
  // Add any other fields from your Firestore documents
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MerchantListing() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterAddress, setFilterAddress] = useState("");
  const [sortByVotes, setSortByVotes] = useState(false);
  const [originalMerchants, setOriginalMerchants] = useState<Merchant[]>([]); // Store original list for client-side filtering

  // Fetch all merchants initially from Firestore
  const fetchMerchants = async () => {
    setIsLoading(true);
    try {
      const merchantsCollectionRef = collection(db, "merchants");
      // Initial query ordered by business name (Firestore requires an index for complex queries)
      const q = query(
        merchantsCollectionRef,
        firestoreOrderBy("business_name"),
      );
      const querySnapshot = await getDocs(q);

      const fetchedMerchants = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Get the document ID
        ...(doc.data() as Omit<Merchant, "id">), // Spread the document data
      })) as Merchant[]; // Type assertion

      // Ensure likes/dislikes are numbers, default to 0 if missing
      const sanitizedMerchants = fetchedMerchants.map((m) => ({
        ...m,
        likes: typeof m.likes === "number" ? m.likes : 0,
        dislikes: typeof m.dislikes === "number" ? m.dislikes : 0,
      }));

      setOriginalMerchants(sanitizedMerchants);
      setMerchants(sanitizedMerchants); // Apply initial sorting/filtering below
    } catch (error) {
      console.error("Error fetching merchants:", error);
      // Handle error display to user if needed
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch only on initial mount

  // Filter and sort merchants whenever filter/sort criteria change (Client-side)
  useEffect(() => {
    let filteredResults = [...originalMerchants];

    // Apply address filter
    if (filterAddress.trim()) {
      filteredResults = filteredResults.filter(
        (merchant) =>
          // Ensure address exists before calling toLowerCase
          merchant.address &&
          merchant.address.toLowerCase().includes(filterAddress.toLowerCase()),
      );
    }

    // Apply sorting
    if (sortByVotes) {
      filteredResults.sort((a, b) => {
        const aVotes = (a.likes || 0) - (a.dislikes || 0);
        const bVotes = (b.likes || 0) - (b.dislikes || 0);
        return bVotes - aVotes; // Sort by net votes (descending)
      });
    } else {
      // Default sort by business name
      filteredResults.sort((a, b) =>
        a.business_name.localeCompare(b.business_name),
      );
    }

    setMerchants(filteredResults);
  }, [filterAddress, sortByVotes, originalMerchants]);

  // Debounced filter handler
  const handleFilterChange = debounce((value: string) => {
    setFilterAddress(value);
  }, 300);

  // Voting function using Firestore
  const vote = async (merchantId: string, type: "like" | "dislike") => {
    // --- Optimistic Update (Kept from original code) ---
    const updateState = (prev: Merchant[]) =>
      prev.map((m) =>
        m.id === merchantId
          ? {
              ...m,
              likes: type === "like" ? (m.likes || 0) + 1 : m.likes || 0,
              dislikes:
                type === "dislike" ? (m.dislikes || 0) + 1 : m.dislikes || 0,
            }
          : m,
      );
    setMerchants(updateState);
    setOriginalMerchants(updateState);
    // --- End Optimistic Update ---

    try {
      const merchantDocRef = doc(db, "merchants", merchantId);
      const fieldToIncrement = type === "like" ? "likes" : "dislikes";

      // Atomically increment the vote count in Firestore
      await updateDoc(merchantDocRef, {
        [fieldToIncrement]: increment(1),
      });

      // Optional: If sorting is by votes, re-trigger the sort effect slightly delayed
      // This is needed because the optimistic update doesn't wait for the actual sort logic
      if (sortByVotes) {
        setTimeout(() => {
          setOriginalMerchants((prev) => [...prev]); // Trigger effect by creating new array instance
        }, 50); // Small delay
      }
    } catch (error) {
      console.error("Voting error:", error);
      // Revert on error by refetching (simple approach)
      // A more refined approach would be to revert the specific optimistic update
      alert("Failed to record vote. Please try again."); // Inform user
      fetchMerchants(); // Refetch to get the correct state
    }
  };

  // --- JSX (Mostly unchanged, check field names) ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100 flex items-center justify-center">
        {/* Using Tailwind colors from original example - adjust if needed */}
        <div className="animate-spin h-8 w-8 border-4 border-forest-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100">
      {/* Background pattern - ensure '/leaf-pattern.png' is in your /public folder */}
      <div className="absolute inset-0 bg-[url('/leaf-pattern.png')] opacity-5 pointer-events-none" />

      <div className="relative container mx-auto px-4 pt-32 pb-16 py-12">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="space-y-6 mb-12"
        >
          {/* Using Tailwind colors from original example - adjust if needed */}
          <h1 className="text-3xl md:text-4xl font-bold text-forest-800 group">
            Our Merchant Community
            <span className="block h-1 w-20 bg-forest-500 mt-4 group-hover:w-32 transition-all duration-300" />
          </h1>
          <p className="text-forest-600 text-lg leading-relaxed">
            Discover our network of registered businesses
          </p>
        </motion.div>

        {/* Filter and Sort Controls */}
        <div className="mb-8 flex flex-wrap gap-4 items-center bg-white/80 p-4 rounded-lg shadow-sm backdrop-blur-sm">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Filter by address..."
              // Use defaultValue if you want it uncontrolled initially, or manage with state
              onChange={(e) => handleFilterChange(e.target.value)}
              className="w-full px-4 py-2 border border-forest-200 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sortByVotes"
              checked={sortByVotes}
              onChange={(e) => setSortByVotes(e.target.checked)}
              className="w-4 h-4 text-forest-600 border-forest-300 rounded focus:ring-forest-500"
            />
            <label
              htmlFor="sortByVotes"
              className="text-sm font-medium text-forest-700"
            >
              Sort by Votes
            </label>
          </div>

          <div className="text-forest-600 text-sm ml-auto">
            Showing {merchants.length} result{merchants.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* No results message */}
        {merchants.length === 0 && !isLoading && (
          <div className="text-center py-12 text-forest-600 text-lg">
            No merchants found matching your criteria.
          </div>
        )}

        {/* Merchants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {merchants.map((merchant, index) => (
            <motion.div
              key={merchant.id}
              initial="hidden" // Use variant names
              animate="visible" // Use variant names
              variants={fadeIn} // Pass variants object
              transition={{ delay: index * 0.08, duration: 0.4 }} // Adjust timing
              className="backdrop-blur-sm bg-white/90 rounded-xl shadow-lg p-6 md:p-8 border border-forest-100 hover:shadow-xl transition-all duration-300 flex flex-col" // Use flex-col for layout
            >
              {/* Image Placeholder */}
              {merchant.image_url ? (
                <img
                  src={merchant.image_url}
                  alt={merchant.business_name}
                  className="w-full h-40 object-cover rounded-md mb-4 border border-forest-100"
                  loading="lazy" // Add lazy loading
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-forest-50 to-sage-100 flex items-center justify-center rounded-md mb-4 text-forest-400 text-sm">
                  {/* Placeholder Icon or Text */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {/* Merchant Info */}
              <div className="flex-grow">
                {" "}
                {/* Allow text content to grow */}
                <h2
                  className="text-xl font-semibold text-forest-800 mb-2 truncate"
                  title={merchant.business_name}
                >
                  {merchant.business_name}
                </h2>
                <div className="space-y-1 text-sm text-forest-600 mb-4">
                  {/* Check if owner_name exists */}
                  {merchant.owner_name && (
                    <p>
                      <span className="font-medium">Owner:</span>{" "}
                      {merchant.owner_name}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {merchant.business_type}
                  </p>
                  {/* Check if address exists */}
                  {merchant.address && (
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {merchant.address}
                    </p>
                  )}
                  {/* Display Net Votes */}
                  <p>
                    <span className="font-medium">Net Votes:</span>{" "}
                    {(merchant.likes || 0) - (merchant.dislikes || 0)}
                  </p>
                </div>
              </div>

              {/* Voting Buttons */}
              <div className="flex justify-between items-center mt-4 mb-4 border-t border-forest-100 pt-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    vote(merchant.id, "like");
                  }}
                  aria-label={`Like ${merchant.business_name}`}
                  className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors duration-200 text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a2 2 0 00-.8 1.4z" />
                  </svg>
                  {merchant.likes || 0}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    vote(merchant.id, "dislike");
                  }}
                  aria-label={`Dislike ${merchant.business_name}`}
                  className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors duration-200 text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.641a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.2-1.867a2 2 0 00.8-1.4z" />
                  </svg>
                  {merchant.dislikes || 0}
                </button>
              </div>

              {/* Link to Details */}
              <Link
                href={`/merchants/${merchant.id}`}
                className="block text-center mt-auto px-4 py-2 bg-gradient-to-r from-forest-600 to-forest-500 hover:from-forest-700 hover:to-forest-600 text-white rounded-lg transition-all duration-200 text-sm font-medium"
              >
                View Details
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
