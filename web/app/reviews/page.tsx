
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SentimentResult {
    place: string;
    sentiment: "GREEN" | "RED";
}

interface PlaceStats {
    [key: string]: {
        positive: number;
        negative: number;
        total: number;
        ratio: number;
    };
}

export default function ReviewsPage() {
    const [placeStats, setPlaceStats] = useState<PlaceStats>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSentimentResults();
    }, []);

    const fetchSentimentResults = async () => {
        try {
            const response = await fetch('http://localhost:5000/get_sentiment_results');
            const data = await response.json();

            if (data.status === 'success') {
                const stats: PlaceStats = {};

                // Process the results
                data.data.forEach((result: SentimentResult) => {
                    if (!stats[result.place]) {
                        stats[result.place] = {
                            positive: 0,
                            negative: 0,
                            total: 0,
                            ratio: 0
                        };
                    }

                    stats[result.place].total++;
                    if (result.sentiment === "GREEN") {
                        stats[result.place].positive++;
                    } else {
                        stats[result.place].negative++;
                    }
                });

                // Calculate ratios
                Object.keys(stats).forEach(place => {
                    stats[place].ratio = (stats[place].positive / stats[place].total) * 100;
                });

                setPlaceStats(stats);
            }
        } catch (err) {
            setError('Failed to fetch sentiment results');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100 p-8">
            <h1 className="text-3xl font-bold text-forest-800 mb-8 text-center">
                Place Reviews Analysis
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(placeStats).map(([place, stats]) => (
                    <PlaceCard key={place} place={place} stats={stats} />
                ))}
            </div>
        </div>
    );
}

interface PlaceCardProps {
    place: string;
    stats: {
        positive: number;
        negative: number;
        total: number;
        ratio: number;
    };
}

function PlaceCard({ place, stats }: PlaceCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
            <h2 className="text-xl font-semibold text-forest-800 mb-4">{place}</h2>

            {/* Custom Speedometer */}
            <div className="relative w-48 h-24 mx-auto mb-6">
                {/* Speedometer Background */}
                <div className="absolute inset-0 bg-gray-200 rounded-t-full"></div>

                {/* Speedometer Fill */}
                <motion.div
                    initial={{ rotate: -90 }}
                    animate={{ rotate: (stats.ratio * 1.8) - 90 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute bottom-0 left-1/2 w-1 h-24 bg-forest-600 origin-bottom"
                    style={{
                        transformOrigin: "bottom center",
                    }}
                />

                {/* Percentage Display */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-4 text-lg font-bold text-forest-800">
                    {Math.round(stats.ratio)}%
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-100 rounded-lg p-3">
                    <div className="text-green-600 font-semibold">Positive</div>
                    <div className="text-2xl font-bold text-green-700">
                        {stats.positive}
                    </div>
                </div>
                <div className="bg-red-100 rounded-lg p-3">
                    <div className="text-red-600 font-semibold">Negative</div>
                    <div className="text-2xl font-bold text-red-700">
                        {stats.negative}
                    </div>
                </div>
            </div>

            <div className="mt-4 text-center text-forest-600">
                Total Reviews: {stats.total}
            </div>
        </motion.div>
    );
}
