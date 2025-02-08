"use client";

import React, { useState } from "react";
import {
    Share2,
    ChevronDown,
    ChevronUp,
    MapPin,
    Clock,
    Utensils,
    Car,
    Building2,
    Landmark,
    Phone,
    Mail,
} from "lucide-react";
import type { TripItinerary, Activity } from "@/types/itinerary";

const ActivityIcon = ({ type }: { type: Activity["type"] }) => {
    switch (type) {
        case "meal":
            return <Utensils className="w-5 h-5 text-orange-500" />;
        case "transport":
            return <Car className="w-5 h-5 text-blue-500" />;
        case "accommodation":
            return <Building2 className="w-5 h-5 text-purple-500" />;
        case "sightseeing":
            return <Landmark className="w-5 h-5 text-green-500" />;
        default:
            return null;
    }
};

interface DayCardProps {
    day: number;
    date: string;
    title: string;
    activities: Activity[];
}

const DayCard: React.FC<DayCardProps> = ({ day, date, title, activities }) => {
    const [isExpanded, setIsExpanded] = useState(day === 1);

    return (
        <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200" />

            <div className="relative z-10 mb-8">
                <div
                    className="ml-12 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white">
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                {day}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">
                                    {title}
                                </h3>
                                <p className="text-sm text-gray-600">{date}</p>
                            </div>
                        </div>
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                    </div>

                    {isExpanded && (
                        <div className="p-4">
                            {activities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex gap-4 mb-4 last:mb-0"
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        <ActivityIcon type={activity.type} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span>{activity.time}</span>
                                        </div>
                                        <h4 className="font-medium">
                                            {activity.title}
                                        </h4>
                                        {activity.location && (
                                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{activity.location}</span>
                                            </div>
                                        )}
                                        <p className="text-gray-600 mt-1">
                                            {activity.description}
                                        </p>
                                        {activity.included && (
                                            <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                Included
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: itinerary.title,
                text: `Check out my trip itinerary: ${itinerary.title}`,
                url: window.location.href,
            });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{itinerary.title}</h1>
                    <p className="text-gray-600">
                        {itinerary.startDate} - {itinerary.endDate}
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

            <div className="mb-8 bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold mb-4">Accommodation</h2>
                <div className="flex items-start gap-4">
                    <Building2 className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                        <h3 className="font-medium">
                            {itinerary.accommodation.name}
                        </h3>
                        <p className="text-gray-600">
                            {itinerary.accommodation.address}
                        </p>
                        <p className="text-gray-600">
                            {itinerary.accommodation.phone}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Important Contacts
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {itinerary.contacts.map((contact, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md p-4"
                        >
                            <h3 className="font-medium">{contact.name}</h3>
                            <p className="text-sm text-gray-600">
                                {contact.role}
                            </p>
                            <div className="mt-2 space-y-1">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    <span>{contact.phone}</span>
                                </div>
                                {contact.email && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail className="w-4 h-4" />
                                        <span>{contact.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {itinerary.days.map((day) => (
                    <DayCard key={day.day} {...day} />
                ))}
            </div>

            {itinerary.notes && (
                <div className="mt-8 bg-yellow-50 rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">Notes</h2>
                    <p className="text-gray-700">{itinerary.notes}</p>
                </div>
            )}
        </div>
    );
};
