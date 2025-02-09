import type { TravelFormData } from "@/components/TravelForm";
import { supabase } from "./supabaseClient";

export interface TripItinerary {
    dates: string;
    location: string;
    stay: {
        hotel: string;
        check_in: string;
        check_out: string;
    };
    schedule: any;
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
        });

        if (error) {
            throw new Error(`Failed to save itinerary: ${error.message}`);
        }

        const response = await fetch(`${API_URL}/generate-itinerary`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Request failed");
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        // Handle network/SSL issues
        if (error instanceof TypeError) {
            throw new Error(
                "Cannot connect to the server. Check your network.",
            );
        }
        throw error;
    }
}
