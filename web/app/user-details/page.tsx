"use client";

import { useState, useEffect, useCallback } from "react"; // Import useEffect and useCallback
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type React from "react";

interface NominatimResult {
    display_name: string;
    lat: string;
    lon: string;
}

export default function TravelForm() {
    const [formData, setFormData] = useState({
        name: "",
        numberOfPeople: "",
        currentLocation: "",
        dateOfVisit: undefined as Date | undefined,
        daysOfVisit: "",
        placesToVisit: "",
        currentStay: "",
    });

    const [locationSuggestions, setLocationSuggestions] = useState<
        NominatimResult[]
    >([]);
    const [placesToVisitSuggestions, setPlacesToVisitSuggestions] = useState<
        NominatimResult[]
    >([]);
    const [currentStaySuggestions, setCurrentStaySuggestions] = useState<
        NominatimResult[]
    >([]);

    // Debounce function to limit API calls
    const debounce = (func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    // Function to fetch location suggestions from Nominatim
    const fetchLocationSuggestions = useCallback(async (query: string) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`,
            );
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch location suggestions: ${response.status}`,
                );
            }
            const data: NominatimResult[] = await response.json();
            setLocationSuggestions(data);
        } catch (error: any) {
            console.error("Error fetching location suggestions:", error);
            setLocationSuggestions([]); // Clear suggestions on error
        }
    }, []);

    // Function to fetch places to visit suggestions from Nominatim based on lat/lon
    const fetchPlacesToVisitSuggestions = useCallback(
        async (lat: string, lon: string) => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=tourism&format=json&limit=5&lat=${lat}&lon=${lon}`,
                );
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch places to visit suggestions: ${response.status}`,
                    );
                }
                const data: NominatimResult[] = await response.json();
                setPlacesToVisitSuggestions(data);
            } catch (error: any) {
                console.error(
                    "Error fetching places to visit suggestions:",
                    error,
                );
                setPlacesToVisitSuggestions([]); // Clear suggestions on error
            }
        },
        [],
    );

    // Function to fetch current stay suggestions from Nominatim based on lat/lon
    const fetchCurrentStaySuggestions = useCallback(
        async (lat: string, lon: string) => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=hotel&format=json&limit=5&lat=${lat}&lon=${lon}`,
                );
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch current stay suggestions: ${response.status}`,
                    );
                }
                const data: NominatimResult[] = await response.json();
                setCurrentStaySuggestions(data);
            } catch (error: any) {
                console.error(
                    "Error fetching current stay suggestions:",
                    error,
                );
                setCurrentStaySuggestions([]); // Clear suggestions on error
            }
        },
        [],
    );

    // Debounced version of fetchLocationSuggestions
    const debouncedFetchLocationSuggestions = useCallback(
        debounce(fetchLocationSuggestions, 300),
        [fetchLocationSuggestions],
    );

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "currentLocation") {
            if (value.length > 2) {
                debouncedFetchLocationSuggestions(value);
            } else {
                setLocationSuggestions([]); // Clear suggestions if input is too short
            }
            setPlacesToVisitSuggestions([]);
            setCurrentStaySuggestions([]);
        }

        if (name === "placesToVisit") {
            setPlacesToVisitSuggestions([]);
        }

        if (name === "currentStay") {
            setCurrentStaySuggestions([]);
        }
    };

    const handleLocationSelect = (suggestion: NominatimResult) => {
        setFormData((prev) => ({
            ...prev,
            currentLocation: suggestion.display_name,
        }));
        setLocationSuggestions([]);
        fetchPlacesToVisitSuggestions(suggestion.lat, suggestion.lon);
        fetchCurrentStaySuggestions(suggestion.lat, suggestion.lon);
    };

    const handlePlacesToVisitSelect = (suggestion: NominatimResult) => {
        setFormData((prev) => ({
            ...prev,
            placesToVisit: suggestion.display_name,
        }));
        setPlacesToVisitSuggestions([]);
    };

    const handleCurrentStaySelect = (suggestion: NominatimResult) => {
        setFormData((prev) => ({
            ...prev,
            currentStay: suggestion.display_name,
        }));
        setCurrentStaySuggestions([]);
    };

    const handleDateChange = (date: Date | undefined) => {
        setFormData((prev) => ({ ...prev, dateOfVisit: date }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Form submitted:", formData);

        // Send the data to an API route that will insert it into the database
        const response = await fetch("/api/travel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            console.log("Travel data successfully inserted");
            // Optionally reset the form or navigate to another page
        } else {
            console.error("Failed to insert travel data");
            // Handle error here (show a message, etc.)
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow"
        >
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <Label htmlFor="numberOfPeople">
                    Number of People (including yourself)
                </Label>
                <Input
                    id="numberOfPeople"
                    name="numberOfPeople"
                    type="number"
                    min="1"
                    value={formData.numberOfPeople}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <Label htmlFor="currentLocation">Current Location</Label>
                <Input
                    id="currentLocation"
                    name="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                />
                {locationSuggestions.length > 0 && (
                    <ul className="border rounded mt-1 bg-white shadow-sm">
                        {locationSuggestions.map((suggestion) => (
                            <li
                                key={suggestion.display_name}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleLocationSelect(suggestion)}
                            >
                                {suggestion.display_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <Label htmlFor="dateOfVisit">Date of Visit</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.dateOfVisit &&
                                    "text-muted-foreground",
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.dateOfVisit ? (
                                format(formData.dateOfVisit, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={formData.dateOfVisit}
                            onSelect={handleDateChange}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div>
                <Label htmlFor="daysOfVisit">Days of Visit</Label>
                <Input
                    id="daysOfVisit"
                    name="daysOfVisit"
                    type="number"
                    min="1"
                    value={formData.daysOfVisit}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <Label htmlFor="placesToVisit">Places to Visit</Label>
                <Input
                    id="placesToVisit"
                    name="placesToVisit"
                    value={formData.placesToVisit}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                />
                {placesToVisitSuggestions.length > 0 && (
                    <ul className="border rounded mt-1 bg-white shadow-sm">
                        {placesToVisitSuggestions.map((suggestion) => (
                            <li
                                key={suggestion.display_name}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                    handlePlacesToVisitSelect(suggestion)
                                }
                            >
                                {suggestion.display_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <Label htmlFor="currentStay">Current Stay</Label>
                <Input
                    id="currentStay"
                    name="currentStay"
                    value={formData.currentStay}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                />
                {currentStaySuggestions.length > 0 && (
                    <ul className="border rounded mt-1 bg-white shadow-sm">
                        {currentStaySuggestions.map((suggestion) => (
                            <li
                                key={suggestion.display_name}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                    handleCurrentStaySelect(suggestion)
                                }
                            >
                                {suggestion.display_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <Button type="submit" className="w-full">
                Submit
            </Button>
        </form>
    );
}
