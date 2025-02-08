import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Destructure the fields from the request body
        const {
            numberOfPeople,
            currentLocation,
            dateOfVisit,
            daysOfVisit,
            placesToVisit,
            currentStay,
        } = body;

        // Validate data as needed (for example, check if required fields are present)

        // Insert the travel details in the "travel_details" table
        const { data, error } = await supabase.from("travel_details").insert({
            number_of_people: Number(numberOfPeople),
            current_location: currentLocation,
            date_of_visit: dateOfVisit, // Ensure the column is of DATE type
            days_of_visit: Number(daysOfVisit),
            places_to_visit: placesToVisit,
            current_stay: currentStay,
        });

        if (error) {
            console.error("Supabase error: ", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 200 });
    } catch (err) {
        console.error("Request error: ", err);
        return NextResponse.json(
            { error: "Failed to insert data" },
            { status: 500 },
        );
    }
}
