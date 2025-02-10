"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/utils/authStore";
import { toast } from "sonner";
import RelatedUserCard from "@/components/RelatedUserCard";

interface UserStats {
    points: number;
    level: number;
    progressToNext: number;
}

const fadeInScale = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
};

export default function MainPage() {
    const [stats, setStats] = useState<UserStats>({
        points: 0,
        level: 0,
        progressToNext: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthStore();

    const fetchUserStats = async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from("user_points")
            .select("points")
            .eq("user_id", user.id)
            .single();

        if (error) {
            console.error("Error fetching stats:", error);
            return;
        }

        if (data) {
            const points = data.points;
            const level = Math.floor(points / 10);
            const progressToNext = (points % 10) * 10;
            setStats({ points, level, progressToNext });
        }
    };

    useEffect(() => {
        fetchUserStats();
    }, [user]);

    const awardPoints = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const pointsToAdd = Math.floor(Math.random() * 3) + 1;

            const { error } = await supabase
                .from("user_points")
                .update({ points: stats.points + pointsToAdd })
                .eq("user_id", user.id);

            if (error) throw error;

            toast.success(
                `✨ Your journey grows stronger! +${pointsToAdd} points!`,
            );
            await fetchUserStats();
        } catch (error) {
            toast.error("The stars didn't align this time. Try again!");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100 pt-24 px-4 pb-8">
            <div className="max-w-7xl mx-auto">
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[120px]">
                    {/* Welcome Card - Spans 2 columns, 2 rows */}
                    <motion.div
                        variants={fadeInScale}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3 }}
                        className="col-span-2 row-span-2 bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-forest-200 flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
                    >
                        <div>
                            <h1 className="text-3xl font-bold text-forest-800 mb-2">
                                Welcome Back, Explorer!
                            </h1>
                            <p className="text-forest-600">
                                Continue your journey through the magical
                                realm...
                            </p>
                        </div>
                        <div className="flex items-end justify-between">
                            <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                                {stats.level < 5
                                    ? "🌱"
                                    : stats.level < 10
                                      ? "🌿"
                                      : stats.level < 15
                                        ? "🌳"
                                        : "🎋"}
                            </div>
                            <span className="text-forest-500 text-sm">
                                Level {stats.level}
                            </span>
                        </div>
                    </motion.div>

                    {/* Points Display - Spans 2 columns */}
                    <motion.div
                        variants={fadeInScale}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="col-span-2 bg-gradient-to-br from-forest-500 to-forest-600 rounded-3xl p-6 shadow-lg text-white flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex justify-between items-start">
                            <h2 className="text-lg font-semibold">
                                Total Points
                            </h2>
                            <span className="text-2xl font-bold">
                                {stats.points}
                            </span>
                        </div>
                        <div className="mt-2">
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${stats.progressToNext}%`,
                                    }}
                                    transition={{ duration: 0.5 }}
                                    className="h-full bg-white/50"
                                />
                            </div>
                            <div className="text-sm mt-1 text-white/80">
                                {10 - (stats.points % 10)} points to next level
                            </div>
                        </div>
                    </motion.div>

                    {/* Daily Quest - Spans 2 columns, 2 rows */}
                    <motion.div
                        variants={fadeInScale}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="col-span-2 row-span-2 bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-forest-200 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
                    >
                        <div>
                            <h2 className="text-xl font-bold text-forest-800 mb-2">
                                🎯 Daily Quest
                            </h2>
                            <p className="text-forest-600 mb-4">
                                Complete your daily mission to earn rewards!
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={awardPoints}
                            disabled={isLoading}
                            className="w-full py-3 px-6 bg-gradient-to-r from-forest-600 to-forest-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Embarking...
                                </span>
                            ) : (
                                "Complete Quest (+1-3 points)"
                            )}
                        </motion.button>
                    </motion.div>

                    {/* Achievement Showcase */}
                    <motion.div
                        variants={fadeInScale}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="col-span-2 bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-forest-200 hover:shadow-xl transition-all duration-300"
                    >
                        <h2 className="text-lg font-bold text-forest-800 mb-2">
                            🏆 Recent Achievement
                        </h2>
                        <p className="text-forest-600 text-sm">
                            Reached Level {stats.level}!
                        </p>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        variants={fadeInScale}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="col-span-2 bg-forest-50 rounded-3xl p-6 shadow-lg border border-forest-200 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-forest-800">
                                    Quick Stats
                                </h3>
                                <p className="text-forest-600 text-sm">
                                    Your journey so far
                                </p>
                            </div>
                            <div className="text-4xl">📊</div>
                        </div>
                    </motion.div>

                    {/* Related Users */}
                    <motion.div
                        variants={fadeInScale}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="col-span-2 bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-forest-200 hover:shadow-xl transition-all duration-300"
                    >
                        <h2 className="text-lg font-bold text-forest-800 mb-2">
                            Related Users
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <RelatedUserCard />
                        </div>
                    </motion.div>

                    {/* Inspiration Quote */}
                    <motion.div
                        variants={fadeInScale}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="col-span-4 bg-gradient-to-r from-forest-100 to-sage-100 rounded-3xl p-6 shadow-lg border border-forest-200 text-center hover:shadow-xl transition-all duration-300"
                    >
                        <p className="text-forest-700 italic">
                            "Every grand adventure begins with a single step.
                            Your journey awaits!"
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
