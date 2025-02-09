export interface Activity {
    // “activity” and “details” mirror the sample itinerary’s keys
    activity: string;
    details: string;
    // When applicable, the “lunch” or dinner can include a “place”
    place?: string;
    // A limited list of types; you can adjust as needed
    type: "meal" | "sightseeing" | "other";
}

export interface TimeSlot {
    time: string;
    // For morning and evening, you can have an array of activities
    activities?: Activity[];
    // For the afternoon, the sample uses a “lunch” object
    lunch?: {
        place: string;
        details: string;
    };
}

export interface DaySchedule {
    morning?: TimeSlot;
    afternoon?: TimeSlot;
    evening?: TimeSlot;
    // Some days might have side attractions
    sidequests?: {
        hidden_gem: string;
        details: string;
    }[];
}

export interface TripItinerary {
    // “dates” is a single string (like “2025-01-10 to 2025-01-12”)
    dates: string;
    location: string;
    // “stay” now holds check in/out and hotel data
    stay: {
        hotel: string;
        check_in: string;
        check_out: string;
    };
    schedule: {
        day_1: DaySchedule;
        day_2: DaySchedule;
        day_3: DaySchedule;
    };
}
