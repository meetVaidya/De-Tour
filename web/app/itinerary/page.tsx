"use client";

import { useState } from "react";
import TravelForm, { TravelFormData } from "@/components/TravelForm";
import { TripItineraryComponent } from "@/components/TripItinerary";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define type for your itinerary (adjust the interface as needed)
export interface TripItinerary {
    accommodation: {
        address: string;
        name: string;
        phone: string;
    };
    contacts: {
        email?: string;
        name: string;
        phone: string;
        role: string;
    }[];
    days: {
        activities: {
            description: string;
            location: string;
            time: string;
            title: string;
            type: string;
            included?: boolean;
        }[];
        date: string;
        day: number;
        title: string;
    }[];
    endDate: string;
    notes: string;
    startDate: string;
    title: string;
    dates: string;
    location: string;
    stay: {
        hotel: string;
        check_in: string;
        check_out: string;
    };
    schedule: any;
}

export default function ItineraryPage() {
    const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Transform the fetched data to include the missing properties expected by TripItineraryComponent.
    const transformItinerary = (data: any): TripItinerary => {
        return {
            accommodation: data.accommodation,
            contacts: data.contacts,
            days: data.days,
            endDate: data.endDate,
            notes: data.notes,
            startDate: data.startDate,
            title: data.title,
            dates: `${data.startDate} – ${data.endDate}`,
            location: data.accommodation.address,
            stay: {
                hotel: data.accommodation.name,
                check_in: data.startDate,
                check_out: data.endDate,
            },
            schedule: Array.isArray(data.days)
                ? data.days.reduce((acc: any, day: any) => {
                      if (day && day.day !== undefined) {
                          acc[`day_${day.day}`] = {
                              // Ensure activities is an array to avoid "list index out of range" errors.
                              activities: Array.isArray(day.activities)
                                  ? day.activities
                                  : [],
                          };
                      }
                      return acc;
                  }, {})
                : {},
        } as unknown as TripItinerary;
    };

    const handleSubmit = async (formData: TravelFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                "http://localhost:5000/generate-itinerary",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message ||
                        "Failed to generate itinerary. Please try again.",
                );
            }

            const data = await response.json();
            const transformedData = transformItinerary(data);
            setItinerary(transformedData);
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
                        <h1 className="text-3xl font-bold text-center mb-6 text-forest-500">
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
