import type { TravelFormData } from "@/components/TravelForm";
import { supabase } from "./supabaseClient";

export interface TripItinerary {
    title: string;
    startDate: string;
    endDate: string;
    notes: string;
    accommodation: {
        address: string;
        name: string;
        phone: string;
    };
    contacts: Array<{
        name: string;
        phone: string;
        email?: string;
        role: string;
    }>;
    days: Array<{
        day: number;
        date: string;
        title: string;
        activities: Array<{
            title: string;
            description: string;
            location: string;
            time: string;
            type: string;
            included?: boolean;
        }>;
    }>;
}

export interface SustainableRoute {
    from: string;
    to: string;
    transport_mode: string;
    estimated_time_min: number;
}

export interface DayRoute {
    route_plan: SustainableRoute[];
}

export interface OptimizedItinerary {
    _id: string;
    name: string;
    numberOfPeople: number;
    dateOfVisit: string;
    sustainable_routes: {
        [key: string]: DayRoute;
    };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function generateItinerary(
    formData: TravelFormData,
): Promise<TripItinerary> {
    try {
        // Save the form data to Supabase
        const { error } = await supabase.from("itineraries").insert({
            user_name: formData.name,
            number_of_people: parseInt(formData.numberOfPeople),
            current_location: formData.currentLocation,
            date_of_visit: formData.dateOfVisit,
            days_of_visit: parseInt(formData.daysOfVisit),
            places_to_visit: formData.placesToVisit,
            current_stay: formData.currentStay,
            budget: formData.budget,
        });

        if (error) {
            throw new Error(`Failed to save itinerary: ${error.message}`);
        }

        // Call the external itinerary generation API
        const response = await fetch(`${API_URL}/generate-itinerary`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        console.log("Response:", response);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                throw new Error("Request failed");
            }

            // Map the "list index out of range" error to a more user-friendly message
            if (errorData?.error === "list index out of range") {
                throw new Error(
                    "Itinerary generation failed due to an internal error. Please review your inputs or try again.",
                );
            }

            throw new Error(errorData?.error || "Request failed");
        }

        return await response.json();
    } catch (error: any) {
        console.error("API Error:", error);
        if (error instanceof TypeError) {
            throw new Error(
                "Cannot connect to the server. Check your network.",
            );
        }
        throw error;
    }
}

export async function generateOptimizedItinerary(
    formData: TravelFormData,
): Promise<OptimizedItinerary> {
    const response = await fetch(`${API_URL}/generate-itinerary`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        let error;
        try {
            error = await response.json();
        } catch {
            throw new Error("Failed to generate optimized itinerary");
        }

        // Map the "list index out of range" error to a more user-friendly message
        if (error?.error === "list index out of range") {
            throw new Error(
                "Itinerary generation failed due to an internal error. Please review your inputs or try again.",
            );
        }

        throw new Error(
            error?.message || "Failed to generate optimized itinerary",
        );
    }

    const result = await response.json();
    return result.data.data;
}
