"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { motion } from "framer-motion";

interface Merchant {
    id: string;
    business_name: string;
    owner_name: string;
    email: string;
    phone: string;
    business_type: string;
    address: string;
    status: string;
    image_url?: string;
    likes: number;
    dislikes: number;
}

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function MerchantDetails() {
    const { id } = useParams();
    const [merchant, setMerchant] = useState<Merchant | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMerchantDetails = async () => {
        try {
            const { data, error } = await supabase
                .from("merchants")
                .select("*")
                .eq("id", id)
                .single();
            if (error) throw error;
            setMerchant(data);
        } catch (error) {
            console.error("Error fetching merchant details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchMerchantDetails();
    }, [id]);

    // Voting function (similar to the listing page)
    const vote = async (merchantId: string, type: "like" | "dislike") => {
        if (!merchant) return;
        // Optimistic update
        setMerchant({
            ...merchant,
            likes: type === "like" ? merchant.likes + 1 : merchant.likes,
            dislikes:
                type === "dislike" ? merchant.dislikes + 1 : merchant.dislikes,
        });

        const updateField = type === "like" ? "likes" : "dislikes";
        const { error } = await supabase.rpc("increment_vote", {
            merchant_id: merchantId,
            vote_type: updateField,
        });
        if (error) {
            console.error("Voting error:", error);
            fetchMerchantDetails();
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-forest-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!merchant) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100 flex items-center justify-center text-forest-800">
                Merchant not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100 relative">
            <div className="absolute inset-0 bg-[url('/leaf-pattern.png')] opacity-5" />

            <div className="relative container mx-auto px-6 pt-32 pb-16 max-w-2xl">
                <Link
                    href="/merchants"
                    className="inline-flex items-center space-x-2 text-forest-600 hover:text-forest-700 mb-6 group"
                >
                    <svg
                        className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    <span>Back to Merchants</span>
                </Link>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.5 }}
                    className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl p-8 md:p-12 border border-forest-200"
                >
                    {merchant.image_url ? (
                        <img
                            src={merchant.image_url}
                            alt={merchant.business_name}
                            className="w-full h-60 object-cover rounded-md mb-6"
                        />
                    ) : (
                        <div className="w-full h-60 bg-gray-200 flex items-center justify-center rounded-md mb-6">
                            No Image
                        </div>
                    )}

                    <h1 className="text-3xl font-bold text-forest-800 mb-6 group">
                        {merchant.business_name}
                        <span className="block h-1 w-20 bg-forest-500 mt-2 group-hover:w-32 transition-all duration-300" />
                    </h1>

                    <div className="mb-4">
                        <p className="font-medium text-forest-700">
                            Votes: {merchant.likes - merchant.dislikes}
                        </p>
                    </div>
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => vote(merchant.id, "like")}
                            className="px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                        >
                            Like
                        </button>
                        <button
                            onClick={() => vote(merchant.id, "dislike")}
                            className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                        >
                            Dislike
                        </button>
                    </div>

                    <div className="space-y-4 text-forest-600">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="font-medium text-forest-700">
                                    Owner
                                </p>
                                <p>{merchant.owner_name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium text-forest-700">
                                    Business Type
                                </p>
                                <p>{merchant.business_type}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium text-forest-700">
                                    Email
                                </p>
                                <p>{merchant.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium text-forest-700">
                                    Phone
                                </p>
                                <p>{merchant.phone}</p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <p className="font-medium text-forest-700">
                                Address
                            </p>
                            <p>{merchant.address}</p>
                        </div>

                        <div className="pt-4">
                            <p className="font-medium text-forest-700">
                                Status
                            </p>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium
                  ${
                      merchant.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : merchant.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                  }`}
                            >
                                {merchant.status.charAt(0).toUpperCase() +
                                    merchant.status.slice(1)}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
