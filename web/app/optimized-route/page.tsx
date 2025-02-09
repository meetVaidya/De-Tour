"use client";

import { useState } from "react";
import TravelForm, { TravelFormData } from "@/components/TravelForm";
import { generateOptimizedItinerary, OptimizedItinerary } from "@/lib/api";
import { OptimizedRoute } from "@/components/OptimizedRoute";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function OptimizedRoutePage() {
    const [optimizedItinerary, setOptimizedItinerary] = useState<OptimizedItinerary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: TravelFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const generated = await generateOptimizedItinerary(formData);
            setOptimizedItinerary(generated);
        } catch (err: any) {
            console.error("Error generating optimized route:", err);
            setError(
                err.message ||
                    "Failed to generate optimized route. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setOptimizedItinerary(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {!optimizedItinerary && (
                <div className="max-w-4xl mx-auto pt-8">
                    <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
                        Plan Your Sustainable Route
                    </h1>
                    <TravelForm onSubmit={handleSubmit} />
                </div>
            )}

            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
                        <p className="mt-4">Generating your optimized route...</p>
                    </div>
                </div>
            )}

            {error && (
                <Alert variant="destructive" className="max-w-4xl mx-auto mt-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {optimizedItinerary && !isLoading && (
                <OptimizedRoute
                    itinerary={optimizedItinerary}
                    onReset={handleReset}
                />
            )}
        </div>
    );
}
