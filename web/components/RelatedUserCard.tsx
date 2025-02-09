"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RelatedUsersCard() {
    const [itineraries, setItineraries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch itinerary records from Supabase and then get match result from your backend
    useEffect(() => {
        const fetchItineraries = async () => {
            // 1. Fetch data from Supabase "itinerary" table.
            const { data, error } = await supabase
                .from("itineraries")
                .select("*");
            console.log(data);
            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }

            // 2. For each itinerary record, transform it to the expected payload structure.
            // Your backend matching function requires: { name, placetovisit, currentstay, date, purposeofvisit }
            // We assume the itinerary record has fields like: user_name, places_to_visit, current_stay, date_of_visit.
            // If a purpose field is missing, we provide a default value.
            const itinerariesWithMatch = await Promise.all(
                data.map(async (record: any) => {
                    const payload = {
                        name: record.user_name,
                        placetovisit: Array.isArray(record.places_to_visit)
                            ? record.places_to_visit.join(", ")
                            : record.places_to_visit,
                        currentstay: record.current_stay,
                        date: record.date_of_visit,
                        purposeofvisit: record.purpose_of_visit || "general",
                    };

                    // 3. Send the payload to your backend matching endpoint
                    try {
                        const res = await fetch(
                            "http://localhost:5000/match-tourists",
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(payload),
                            },
                        );
                        const matchData = await res.json();
                        return { ...record, matchResult: matchData };
                    } catch (err: any) {
                        return {
                            ...record,
                            matchResult: { error: err.message },
                        };
                    }
                }),
            );

            setItineraries(itinerariesWithMatch);
            setLoading(false);
        };

        fetchItineraries();
    }, []);

    if (loading)
        return <div className="text-center py-8">Loading itineraries...</div>;
    if (error)
        return (
            <div className="text-red-500 text-center py-8">Error: {error}</div>
        );

    return (
        <div className="flex flex-wrap gap-8 justify-center p-4">
            {itineraries.length === 0 ? (
                <div>No itinerary records found.</div>
            ) : (
                itineraries
                    .filter((record: any) => record.matchResult?.score > 0.7)
                    .map((record: any) => (
                        <div
                            key={record.id}
                            className="border border-gray-300 p-4 rounded-lg shadow-md w-80 bg-white"
                        >
                            <h3 className="text-xl font-bold mb-2">
                                {record.user_name}
                            </h3>
                            <p>
                                <span className="font-semibold">
                                    Current Location:
                                </span>{" "}
                                {record.current_location}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Date of Visit:
                                </span>{" "}
                                {record.date_of_visit}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Days of Visit:
                                </span>{" "}
                                {record.days_of_visit}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Places to Visit:
                                </span>{" "}
                                {Array.isArray(record.places_to_visit)
                                    ? record.places_to_visit.join(", ")
                                    : record.places_to_visit}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Current Stay:
                                </span>{" "}
                                {record.current_stay}
                            </p>
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">
                                    Match Result:
                                </h4>
                                {record.matchResult ? (
                                    record.matchResult.best_match ? (
                                        <div>
                                            <p>
                                                <span className="font-semibold">
                                                    Best Match:
                                                </span>{" "}
                                                {record.matchResult.best_match
                                                    .name ||
                                                    record.matchResult
                                                        .best_match.user_name}
                                            </p>
                                            <p>
                                                <span className="font-semibold">
                                                    Similarity:
                                                </span>{" "}
                                                {
                                                    record.matchResult
                                                        .similarity_score
                                                }
                                            </p>
                                        </div>
                                    ) : (
                                        <p>
                                            {record.matchResult.message ||
                                                record.matchResult.error}
                                        </p>
                                    )
                                ) : (
                                    <p>No match data available.</p>
                                )}
                            </div>
                        </div>
                    ))
            )}
        </div>
    );
}
