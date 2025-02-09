import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";

export async function POST(request: Request) {
    try {
        // Parse the submitted JSON from the client.
        const body = await request.json();

        // Retrieve the session cookie.
        const sessionCookie = (await cookies()).get("session")?.value;
        if (!sessionCookie) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 },
            );
        }

        // Decrypt/verify the session cookie to get the payload.
        const sessionPayload = await decrypt(sessionCookie);
        if (!sessionPayload || !sessionPayload.userId) {
            return NextResponse.json(
                { error: "Invalid session" },
                { status: 401 },
            );
        }

        // Get the user_id from the session – this is the currently logged in user.
        const userId = sessionPayload.userId;

        // Destructure the rest of the fields from the request body.
        const {
            numberOfPeople,
            currentLocation,
            dateOfVisit,
            daysOfVisit,
            placesToVisit, // expected to be an array of strings
            currentStay,
        } = body;

        // Insert the travel details along with the user_id into the travel_details table.
        const { data, error } = await supabase.from("travel_details").insert({
            user_id: userId, // Pass the logged-in user's ID here.
            number_of_people: Number(numberOfPeople),
            current_location: currentLocation,
            date_of_visit: dateOfVisit,
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
