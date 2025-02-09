"use client";

import React, { useState } from "react";
import {
    Share2,
    ChevronDown,
    ChevronUp,
    MapPin,
    Clock,
    Utensils,
    Landmark,
    Building2,
} from "lucide-react";
import type { TripItinerary, Activity, DaySchedule } from "@/types/itinerary";

// A helper component for rendering a timeslot’s activities (for morning/evening)
const ActivityList: React.FC<{
    title: string;
    slot: Exclude<
        NonNullable<TripItinerary["schedule"]["day_1"]["morning"]>,
        undefined
    >;
}> = ({ title, slot }) => (
    <div className="mb-4">
        <h4 className="font-semibold">
            {title} ({slot.time})
        </h4>
        {slot.activities &&
            slot.activities.map((act, i) => (
                <div key={i} className="flex items-start gap-2 mt-2">
                    {/* Choose an icon based on type */}
                    <div className="mt-1">
                        {act.type === "meal" ? (
                            <Utensils className="w-5 h-5 text-orange-500" />
                        ) : act.type === "sightseeing" ? (
                            <Landmark className="w-5 h-5 text-green-500" />
                        ) : null}
                    </div>
                    <div>
                        <p className="text-sm text-gray-700 font-medium">
                            {act.activity}
                        </p>
                        <p className="text-sm text-gray-600">{act.details}</p>
                        {act.place && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {act.place}
                            </p>
                        )}
                    </div>
                </div>
            ))}
    </div>
);

// A helper component for an afternoon “lunch” timeslot
const LunchCard: React.FC<{
    slot: Exclude<
        NonNullable<TripItinerary["schedule"]["day_1"]["afternoon"]>,
        undefined
    >;
}> = ({ slot }) => (
    <div className="mb-4">
        <h4 className="font-semibold">Afternoon Lunch ({slot.time})</h4>
        {slot.lunch && (
            <div className="flex items-start gap-2 mt-2">
                <Utensils className="w-5 h-5 text-orange-500" />
                <div>
                    <p className="text-sm text-gray-700 font-medium">
                        {slot.lunch.place}
                    </p>
                    <p className="text-sm text-gray-600">
                        {slot.lunch.details}
                    </p>
                </div>
            </div>
        )}
    </div>
);

interface DayCardProps {
    dayNumber: number;
    schedule: DaySchedule;
}

const DayCard: React.FC<DayCardProps> = ({ dayNumber, schedule }) => {
    // Allow collapse/expand per day.
    const [isExpanded, setIsExpanded] = useState(dayNumber === 1);

    return (
        <div className="relative">
            <div className="relative z-10 mb-8 border rounded-lg shadow-md overflow-hidden">
                <div
                    className="cursor-pointer bg-gradient-to-r from-blue-50 to-white p-4 flex justify-between items-center"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                            {dayNumber}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">
                                Day {dayNumber}
                            </h3>
                        </div>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                </div>

                {isExpanded && (
                    <div className="p-4 space-y-4">
                        {schedule.morning && (
                            <ActivityList
                                title="Morning"
                                slot={schedule.morning}
                            />
                        )}
                        {schedule.afternoon && schedule.afternoon.lunch && (
                            <LunchCard slot={schedule.afternoon} />
                        )}
                        {schedule.evening && (
                            <ActivityList
                                title="Evening"
                                slot={schedule.evening}
                            />
                        )}
                        {schedule.sidequests &&
                            schedule.sidequests.length > 0 && (
                                <div>
                                    <h4 className="font-semibold">
                                        Sidequests
                                    </h4>
                                    {schedule.sidequests.map((sq, i) => (
                                        <div
                                            key={i}
                                            className="mt-2 ml-6 text-sm text-gray-700"
                                        >
                                            <p className="font-medium">
                                                {sq.hidden_gem}
                                            </p>
                                            <p>{sq.details}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
};

interface TripItineraryProps {
    itinerary: TripItinerary;
}

export const TripItineraryComponent: React.FC<TripItineraryProps> = ({
    itinerary,
}) => {
    // For sharing or printing the itinerary
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: "Trip Itinerary",
                text: `Check out my trip itinerary for ${itinerary.location} from ${itinerary.dates}`,
                url: window.location.href,
            });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // Convert the schedule object into an array for iteration.
    const days = Object.entries(itinerary.schedule).map(([key, sched]) => {
        // Extract number from key (e.g., "day_1" becomes 1).
        const dayNumber = parseInt(key.split("_")[1], 10);
        return { dayNumber, schedule: sched };
    });

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Trip Itinerary</h1>
                    <p className="text-gray-600">
                        {itinerary.dates} – {itinerary.location}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleShare}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Print Itinerary
                    </button>
                </div>
            </div>

            {/* Accommodation Section */}
            <div className="mb-8 bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold mb-4">Accommodation</h2>
                <div className="flex items-start gap-4">
                    <Building2 className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                        <h3 className="font-medium">{itinerary.stay.hotel}</h3>
                        <p className="text-gray-600">
                            Check In: {itinerary.stay.check_in}
                        </p>
                        <p className="text-gray-600">
                            Check Out: {itinerary.stay.check_out}
                        </p>
                    </div>
                </div>
            </div>

            {/* Schedule Section */}
            <div className="space-y-4">
                {days.map(({ dayNumber, schedule }) => (
                    <DayCard
                        key={dayNumber}
                        dayNumber={dayNumber}
                        schedule={schedule}
                    />
                ))}
            </div>
        </div>
    );
};
