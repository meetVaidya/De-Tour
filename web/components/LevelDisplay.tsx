"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/utils/authStore";

export function LevelDisplay() {
    const [points, setPoints] = useState<number>(0);
    const [user, setUser] = useState<any>(null);
    const { isLoggedIn } = useAuthStore();

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    useEffect(() => {
        const fetchPoints = async () => {
            if (!isLoggedIn || !user) return;

            const { data, error } = await supabase
                .from("user_points")
                .select("points")
                .eq("user_id", user.id)
                .single();

            if (error) {
                console.error("Error fetching points:", error);
                return;
            }

            if (data) {
                setPoints(data.points);
            }
        };

        fetchPoints();
    }, [isLoggedIn, user]);

    const level = Math.floor(points / 10);
    const progress = (points % 10) * 10; // Percentage to next level

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 bg-forest-100 rounded-full px-6 py-3"
        >
            <div className="relative">
                <div className="text-forest-800 font-bold">Lvl {level}</div>
                <div className="w-24 h-1 bg-forest-200 rounded-full mt-1">
                    <div
                        className="h-full bg-forest-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
            <div className="text-forest-600 text-sm">{points} pts</div>
        </motion.div>
    );
}
