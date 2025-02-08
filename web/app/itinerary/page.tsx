import React from "react";
import { TripItineraryComponent } from "@/components/TripItinerary";
import type { TripItinerary } from "@/types/itinerary";

const sampleItinerary: TripItinerary = {
    dates: "2025-01-10 to 2025-01-12",
    location: "Sanjay Gandhi National Park, Mumbai",
    stay: {
        hotel: "JW Marriott",
        check_in: "2025-01-10",
        check_out: "2025-01-12",
    },
    schedule: {
        day_1: {
            morning: {
                time: "07:30 - 09:30",
                activities: [
                    {
                        activity: "Visit Kanheri Caves",
                        details:
                            "Explore ancient rock-cut Buddhist caves. Start early to avoid crowds.",
                    },
                ],
            },
            afternoon: {
                time: "12:00 - 14:00",
                lunch: {
                    place: "Soup & Salad",
                    details:
                        "Enjoy fresh, healthy options with a view of nature.",
                },
            },
            evening: {
                time: "17:00 - 20:00",
                activities: [
                    {
                        activity: "Nature Walk",
                        details:
                            "Take a guided walk in the park during sunset.",
                    },
                    {
                        activity: "Dinner",
                        place: "Masala Library",
                        details: "Experience modern Indian cuisine.",
                    },
                ],
            },
            sidequests: [
                {
                    hidden_gem: "Banyan Tree",
                    details:
                        "A hidden spot perfect for relaxation and meditation.",
                },
                {
                    hidden_gem: "Lion Safari",
                    details:
                        "Take a small safari and see the Asiatic lions up close.",
                },
            ],
        },
        day_2: {
            morning: {
                time: "08:00 - 10:00",
                activities: [
                    {
                        activity: "Visit the Butterfly Garden",
                        details:
                            "Admire various butterfly species; arrive early for tranquility.",
                    },
                ],
            },
            afternoon: {
                time: "12:30 - 14:30",
                lunch: {
                    place: "Café Madras",
                    details: "Savor traditional South Indian dishes.",
                },
            },
            evening: {
                time: "18:00 - 21:00",
                activities: [
                    {
                        activity: "Cultural Performance",
                        details:
                            "Attend a local dance or music event scheduled at a nearby venue.",
                    },
                    {
                        activity: "Dinner",
                        place: "The Bombay Canteen",
                        details:
                            "Enjoy a vibrant atmosphere and innovative Indian cuisine.",
                    },
                ],
            },
        },
        day_3: {
            morning: {
                time: "08:00 - 10:00",
                activities: [
                    {
                        activity: "Visit Tulsi Lake",
                        details:
                            "Enjoy a peaceful morning by the lake with birdwatching.",
                    },
                ],
            },
            afternoon: {
                time: "12:00 - 14:00",
                lunch: {
                    place: "The Great Indian Diner",
                    details:
                        "Savor North Indian specialties in a cozy setting.",
                },
            },
            evening: {
                time: "17:00 - 20:00",
                activities: [
                    {
                        activity: "Visit the Aarey Milk Colony",
                        details:
                            "Explore this green oasis for a relaxing evening.",
                    },
                    {
                        activity: "Dinner",
                        place: "Barbeque Nation",
                        details:
                            "Enjoy a lively dinner with a grill-your-own-concept.",
                    },
                ],
            },
        },
    },
};

export default function ItineraryPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <TripItineraryComponent itinerary={sampleItinerary} />
        </div>
    );
}
