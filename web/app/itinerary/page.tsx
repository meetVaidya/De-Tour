"use client";

import { useState } from "react";
import TravelForm, { TravelFormData } from "@/components/TravelForm";
import { generateItinerary, TripItinerary } from "@/lib/api";
import { TripItineraryComponent } from "@/components/TripItinerary";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ItineraryPage() {
    const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: TravelFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const generated = await generateItinerary(formData);
            setItinerary(generated);
        } catch (err: any) {
            console.error("Error generating itinerary:", err);
            setError(
                err.message ||
                    "Failed to generate itinerary. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
            <div className="w-full max-w-4xl transform scale-105">
                {!itinerary && (
                    <>
                        <h1 className="text-3xl font-bold text-center mb-6 text-forest-500 ">
                            Plan Your Trip
                        </h1>
                        <TravelForm onSubmit={handleSubmit} />
                    </>
                )}

                {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-4 rounded-lg text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="mt-4">Generating your itinerary...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription>
                            {error}
                            <Button
                                variant="outline"
                                className="ml-4"
                                onClick={() => setError(null)}
                            >
                                Dismiss
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                {itinerary && !isLoading && (
                    <div className="mt-6">
                        <TripItineraryComponent itinerary={itinerary} />
                        <Button
                            className="mt-4"
                            onClick={() => {
                                setItinerary(null);
                                setError(null);
                            }}
                        >
                            Plan Another Trip
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
