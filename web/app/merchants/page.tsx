"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { motion } from "framer-motion";
import debounce from "lodash/debounce"; // You might need to install lodash

interface Merchant {
    id: string;
    business_name: string;
    owner_name: string;
    email: string;
    phone: string;
    business_type: string;
    address: string;
    image_url?: string;
    likes: number;
    dislikes: number;
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

    // Fetch all merchants initially
    const fetchMerchants = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("merchants")
                .select("*")
                .order("business_name");

            if (error) throw error;

            setOriginalMerchants(data || []);
            setMerchants(data || []);
        } catch (error) {
            console.error("Error fetching merchants:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMerchants();
    }, []);

    // Filter and sort merchants whenever filter/sort criteria change
    useEffect(() => {
        let filteredResults = [...originalMerchants];

        // Apply address filter
        if (filterAddress.trim()) {
            filteredResults = filteredResults.filter((merchant) =>
                merchant.address
                    .toLowerCase()
                    .includes(filterAddress.toLowerCase()),
            );
        }

        // Apply sorting
        if (sortByVotes) {
            filteredResults.sort((a, b) => {
                const aVotes = a.likes - a.dislikes;
                const bVotes = b.likes - b.dislikes;
                return bVotes - aVotes; // Sort by net votes (descending)
            });
        } else {
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

    // Voting function
    const vote = async (merchantId: string, type: "like" | "dislike") => {
        // Optimistic update
        setMerchants((prev) =>
            prev.map((m) =>
                m.id === merchantId
                    ? {
                          ...m,
                          likes: type === "like" ? m.likes + 1 : m.likes,
                          dislikes:
                              type === "dislike" ? m.dislikes + 1 : m.dislikes,
                      }
                    : m,
            ),
        );

        setOriginalMerchants((prev) =>
            prev.map((m) =>
                m.id === merchantId
                    ? {
                          ...m,
                          likes: type === "like" ? m.likes + 1 : m.likes,
                          dislikes:
                              type === "dislike" ? m.dislikes + 1 : m.dislikes,
                      }
                    : m,
            ),
        );

        const { error } = await supabase.rpc("increment_vote", {
            merchant_id: merchantId,
            vote_type: type === "like" ? "likes" : "dislikes",
        });

        if (error) {
            console.error("Voting error:", error);
            // Revert on error
            fetchMerchants();
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-forest-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100">
            <div className="absolute inset-0 bg-[url('/leaf-pattern.png')] opacity-5" />

            <div className="relative container mx-auto px-4 pt-32 pb-16 py-12">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.5 }}
                    className="space-y-6 mb-12"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-forest-800 group">
                        Our Merchant Community
                        <span className="block h-1 w-20 bg-forest-500 mt-4 group-hover:w-32 transition-all duration-300" />
                    </h1>
                    <p className="text-forest-600 text-lg leading-relaxed">
                        Discover our network of registered businesses
                    </p>
                </motion.div>

                {/* Filter and Sort Controls */}
                <div className="mb-8 flex flex-wrap gap-4 items-center bg-white/80 p-4 rounded-lg shadow-sm">
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Filter by address..."
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="w-full px-4 py-2 border border-forest-200 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-forest-500
                       focus:border-transparent transition-all duration-200"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="sortByVotes"
                            checked={sortByVotes}
                            onChange={(e) => setSortByVotes(e.target.checked)}
                            className="w-4 h-4 text-forest-600 border-forest-300 rounded
                       focus:ring-forest-500"
                        />
                        <label
                            htmlFor="sortByVotes"
                            className="text-forest-700"
                        >
                            Sort by Votes
                        </label>
                    </div>

                    {/* Results count */}
                    <div className="text-forest-600 text-sm">
                        Showing {merchants.length} results
                    </div>
                </div>

                {/* No results message */}
                {merchants.length === 0 && (
                    <div className="text-center py-8 text-forest-600">
                        No merchants found matching your criteria
                    </div>
                )}

                {/* Merchants Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {merchants.map((merchant, index) => (
                        <motion.div
                            key={merchant.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="backdrop-blur-sm bg-white/90 rounded-xl shadow-lg p-8
                       border border-forest-200 hover:shadow-xl transition-all duration-300"
                        >
                            {merchant.image_url ? (
                                <img
                                    src={merchant.image_url}
                                    alt={merchant.business_name}
                                    className="w-full h-40 object-cover rounded-md mb-4"
                                />
                            ) : (
                                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-4">
                                    No Image
                                </div>
                            )}

                            <h2 className="text-xl font-semibold text-forest-800 mb-4">
                                {merchant.business_name}
                            </h2>

                            <div className="space-y-3 text-forest-600 mb-6">
                                <p>
                                    <span className="font-medium">Owner:</span>{" "}
                                    {merchant.owner_name}
                                </p>
                                <p>
                                    <span className="font-medium">Type:</span>{" "}
                                    {merchant.business_type}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Address:
                                    </span>{" "}
                                    {merchant.address}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Net Votes:
                                    </span>{" "}
                                    {merchant.likes - merchant.dislikes}
                                </p>
                            </div>

                            {/* Voting Buttons */}
                            <div className="flex justify-between mb-4">
                                <button
                                    onClick={() => vote(merchant.id, "like")}
                                    className="px-4 py-2 bg-green-100 text-green-800 rounded-md
                           hover:bg-green-200 transition-colors duration-200"
                                >
                                    👍 {merchant.likes}
                                </button>
                                <button
                                    onClick={() => vote(merchant.id, "dislike")}
                                    className="px-4 py-2 bg-red-100 text-red-800 rounded-md
                           hover:bg-red-200 transition-colors duration-200"
                                >
                                    👎 {merchant.dislikes}
                                </button>
                            </div>

                            <Link
                                href={`/merchants/${merchant.id}`}
                                className="inline-flex items-center space-x-3 px-6 py-3 w-full
                         bg-gradient-to-r from-forest-600 to-forest-500
                         hover:from-forest-700 hover:to-forest-600
                         text-white rounded-lg transition-all duration-200
                         justify-center group"
                            >
                                <span>View Details</span>
                                <svg
                                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                </svg>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
