export interface Activity {
    time: string;
    title: string;
    location?: string;
    description: string;
    type: "meal" | "sightseeing" | "transport" | "accommodation" | "other";
    included?: boolean;
}

export interface DayItinerary {
    day: number;
    date: string;
    title: string;
    activities: Activity[];
}

export interface ContactInfo {
    name: string;
    role: string;
    phone: string;
    email?: string;
}

export interface TripItinerary {
    title: string;
    startDate: string;
    endDate: string;
    days: DayItinerary[];
    accommodation: {
        name: string;
        address: string;
        phone: string;
    };
    contacts: ContactInfo[];
    notes?: string;
}
