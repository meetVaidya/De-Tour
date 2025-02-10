"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface CityCoordinates {
    name: string;
    lat: string;
    lon: string;
    display_name: string;
}

interface AccessiblePlace {
    name: string;
    address: string;
    location: {
        lat: number;
        lng: number;
    };
    rating?: number;
    total_ratings?: number;
}

export default function CoordinatesPage() {
    const [city, setCity] = useState("");
    const [coordinates, setCoordinates] = useState<CityCoordinates | null>(
        null,
    );
    const [accessiblePlaces, setAccessiblePlaces] = useState<AccessiblePlace[]>(
        [],
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAccessiblePlaces = async (lat: string, lon: string) => {
        try {
            const response = await fetch(
                "http://localhost:5001/api/wheelchair-accessible",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ lat, lon }),
                },
            );

            if (!response.ok) {
                throw new Error("Failed to fetch accessible places");
            }

            const data = await response.json();
            if (data.status === "success") {
                setAccessiblePlaces(data.data);
            } else {
                throw new Error(data.message || "Failed to fetch places");
            }
        } catch (error: any) {
            setError(error.message || "Failed to fetch accessible places");
            setAccessiblePlaces([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!city.trim()) return;

        setIsLoading(true);
        setError(null);
        setCoordinates(null);
        setAccessiblePlaces([]);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`,
            );

            if (!response.ok) {
                throw new Error("Failed to fetch coordinates");
            }

            const data = await response.json();

            if (data && data[0]) {
                const coords = {
                    name: city,
                    lat: data[0].lat,
                    lon: data[0].lon,
                    display_name: data[0].display_name,
                };
                setCoordinates(coords);
                await fetchAccessiblePlaces(coords.lat, coords.lon);
            } else {
                setError("City not found");
            }
        } catch (error: any) {
            setError(error.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100 p-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-6 space-y-6 mb-6"
                >
                    <h1 className="text-2xl font-bold text-forest-800 text-center">
                        Find Wheelchair Accessible Places
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="city"
                                className="block text-sm font-medium text-forest-700 mb-1"
                            >
                                Enter City Name
                            </label>
                            <input
                                id="city"
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g., Mumbai"
                                className="w-full px-4 py-2 rounded-lg border border-forest-200 focus:ring-forest-500 focus:border-forest-500"
                            />
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            className={`
                                w-full py-2 px-4 bg-forest-600 text-white rounded-lg
                                hover:bg-forest-700 transition-colors
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            {isLoading ? "Searching..." : "Search"}
                        </motion.button>
                    </form>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-50 text-red-600 p-4 rounded-lg text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {coordinates && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-forest-50 rounded-lg p-4 space-y-2"
                        >
                            <h2 className="font-semibold text-forest-800">
                                Selected Location: {coordinates.name}
                            </h2>
                            <div className="text-sm text-forest-600">
                                <p>
                                    Coordinates: {coordinates.lat},{" "}
                                    {coordinates.lon}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Accessible Places Results */}
                {accessiblePlaces.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {accessiblePlaces.map((place, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                <h3 className="text-lg font-semibold text-forest-800 mb-2">
                                    {place.name}
                                </h3>
                                <p className="text-forest-600 mb-2">
                                    {place.address}
                                </p>
                                {place.rating && (
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-5 h-5 ${
                                                        i <
                                                        Math.floor(place.rating || 0)
                                                            ? "text-yellow-400"
                                                            : "text-gray-300"
                                                    }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-forest-600">
                                            ({place.total_ratings} reviews)
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600"></div>
                    </div>
                )}
            </div>
        </div>
    );
}
