import React from "react";
import { TripItineraryComponent } from "@/components/TripItinerary";
import type { TripItinerary } from "@/types/itinerary";

const sampleItinerary: TripItinerary = {
    title: "Cape Town Adventure",
    startDate: "2024-03-15",
    endDate: "2024-03-17",
    accommodation: {
        name: "Hotel Southern Sun Cape Sun",
        address:
            "Strand Street, Cape Town City Centre, Cape Town, 8001, South Africa",
        phone: "+27 21 488 5100",
    },
    contacts: [
        {
            name: "John Smith",
            role: "Tour Guide",
            phone: "+27 123 456 789",
            email: "john@example.com",
        },
        {
            name: "Emergency Support",
            role: "24/7 Assistance",
            phone: "+27 987 654 321",
        },
    ],
    days: [
        {
            day: 1,
            date: "March 15, 2024",
            title: "Mumbai - Cape Town",
            activities: [
                {
                    time: "10:00",
                    title: "Departure from Mumbai",
                    location: "Chhatrapati Shivaji International Terminal",
                    description:
                        "Assemble at Mumbai's Chatrapati Shivaji international terminal to board your flight for Cape Town via Addis Ababa / Nairobi / Seychelles.",
                    type: "transport",
                },
                {
                    time: "20:00",
                    title: "Arrival & Hotel Transfer",
                    location: "Cape Town International Airport",
                    description:
                        "On arrival in Cape Town after clearing customs & immigrations formalities we shall proceed to board our coach for transfer to the hotel.",
                    type: "transport",
                },
                {
                    time: "21:30",
                    title: "Dinner",
                    location: "Hotel Restaurant",
                    description: "Welcome dinner at the hotel restaurant",
                    type: "meal",
                    included: true,
                },
            ],
        },
        {
            day: 2,
            date: "March 16, 2024",
            title: "Cape Town Exploration",
            activities: [
                {
                    time: "07:30",
                    title: "Breakfast",
                    location: "Hotel Restaurant",
                    description: "Breakfast at the hotel",
                    type: "meal",
                    included: true,
                },
                {
                    time: "09:00",
                    title: "Cape Town City Tour",
                    location: "Various Locations",
                    description:
                        "Tour including the Malay Quarter, Castle, and Table Bay to Millerton lighthouse",
                    type: "sightseeing",
                    included: true,
                },
                {
                    time: "13:00",
                    title: "Lunch",
                    location: "Local Restaurant",
                    description: "Lunch at a local restaurant",
                    type: "meal",
                    included: true,
                },
                {
                    time: "14:30",
                    title: "Table Mountain",
                    location: "Table Mountain",
                    description:
                        "Experience Table Mountain by Aerial Cable Car which trips you 1089 meters above Cape Town",
                    type: "sightseeing",
                    included: true,
                },
            ],
        },
        {
            day: 3,
            date: "March 17, 2024",
            title: "Cape Peninsula Tour",
            activities: [
                {
                    time: "08:00",
                    title: "Breakfast",
                    location: "Hotel Restaurant",
                    description: "Breakfast at the hotel",
                    type: "meal",
                    included: true,
                },
                {
                    time: "09:00",
                    title: "Peninsula Tour",
                    location: "Cape Peninsula",
                    description:
                        "Full day tour of the Cape Peninsula. Travel at a pace that allows you to explore the beauty of the Cape Peninsula.",
                    type: "sightseeing",
                    included: true,
                },
            ],
        },
    ],
    notes: "Please carry comfortable walking shoes and don't forget your camera! Weather can be unpredictable, so pack accordingly.",
};

export default function ItineraryPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <TripItineraryComponent itinerary={sampleItinerary} />
        </div>
    );
}
