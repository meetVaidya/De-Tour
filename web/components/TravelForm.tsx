"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface TravelFormData {
    name: string;
    numberOfPeople: string;
    currentLocation: string;
    dateOfVisit?: Date;
    daysOfVisit: string;
    placesToVisit: string[];
    currentStay: string;
}

interface NominatimResult {
    description: string;
    type: string;
    display_name: string;
    lat: string;
    lon: string;
}

interface OverpassResult {
    id: number;
    tags: {
        name?: string;
        tourism?: string;
        historic?: string;
        amenity?: string;
        description?: string;
    };
    lat: number;
    lon: number;
}

interface TravelFormProps {
    onSubmit: (data: TravelFormData) => Promise<void>;
}

export default function TravelForm({ onSubmit }: TravelFormProps) {
    const [formData, setFormData] = useState<TravelFormData>({
        name: "",
        numberOfPeople: "",
        currentLocation: "",
        dateOfVisit: undefined,
        daysOfVisit: "",
        placesToVisit: [],
        currentStay: "",
    });
    const [placesInput, setPlacesInput] = useState("");
    const [locationSuggestions, setLocationSuggestions] = useState<
        NominatimResult[]
    >([]);
    const [placesToVisitSuggestions, setPlacesToVisitSuggestions] = useState<
        NominatimResult[]
    >([]);
    const [currentStaySuggestions, setCurrentStaySuggestions] = useState<
        NominatimResult[]
    >([]);
    const [currentLocationCoords, setCurrentLocationCoords] = useState<{
        lat: string;
        lon: string;
    } | null>(null);
    const [isPlacesDropdownOpen, setIsPlacesDropdownOpen] = useState(false);
    const placesDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                placesDropdownRef.current &&
                !placesDropdownRef.current.contains(event.target as Node)
            ) {
                setIsPlacesDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const debounce = (func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

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
            setLocationSuggestions([]);
        }
    }, []);

    const debouncedFetchLocationSuggestions = useCallback(
        debounce(fetchLocationSuggestions, 300),
        [fetchLocationSuggestions],
    );

    const fetchPlacesToVisitSuggestions = useCallback(
        async (lat: string, lon: string) => {
            try {
                const radius = 5000;
                const query = `
          [out:json][timeout:25];
          (
            node["tourism"~"attraction|museum|viewpoint|artwork|theme_park|gallery|zoo"]
              (around:${radius},${lat},${lon});
            node["historic"~"monument|castle|ruins|archaeological_site|memorial"]
              (around:${radius},${lat},${lon});
            way["tourism"~"attraction|museum|viewpoint|artwork|theme_park|gallery|zoo"]
              (around:${radius},${lat},${lon});
            way["historic"~"monument|castle|ruins|archaeological_site|memorial"]
              (around:${radius},${lat},${lon});
          );
          out body;
          >;
          out skel qt;
        `;

                const response = await fetch(
                    "https://overpass-api.de/api/interpreter",
                    {
                        method: "POST",
                        body: query,
                    },
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch places to visit suggestions: ${response.status}`,
                    );
                }

                const data = await response.json();
                const places = data.elements
                    .filter(
                        (element: OverpassResult) =>
                            element.tags?.name &&
                            element.lat != null &&
                            element.lon != null,
                    )
                    .map((element: OverpassResult) => ({
                        display_name: element.tags.name,
                        lat: element.lat.toString(),
                        lon: element.lon.toString(),
                        description: element.tags.description || "",
                        type:
                            element.tags.tourism ||
                            element.tags.historic ||
                            element.tags.amenity,
                    }))
                    .slice(0, 10);

                setPlacesToVisitSuggestions(places);
            } catch (error) {
                console.error(
                    "Error fetching places to visit suggestions:",
                    error,
                );
                setPlacesToVisitSuggestions([]);
            }
        },
        [],
    );

    const fetchCurrentStaySuggestions = useCallback(
        async (lat: string, lon: string) => {
            try {
                const radius = 5000;
                const query = `
          [out:json][timeout:25];
          (
            node["tourism"~"hotel|hostel|guest_house|apartment|resort"]
              (around:${radius},${lat},${lon});
            way["tourism"~"hotel|hostel|guest_house|apartment|resort"]
              (around:${radius},${lat},${lon});
          );
          out body;
          >;
          out skel qt;
        `;

                const response = await fetch(
                    "https://overpass-api.de/api/interpreter",
                    {
                        method: "POST",
                        body: query,
                    },
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch accommodation suggestions: ${response.status}`,
                    );
                }

                const data = await response.json();
                const accommodations = data.elements
                    .filter(
                        (element: OverpassResult) =>
                            element.tags?.name &&
                            element.lat != null &&
                            element.lon != null,
                    )
                    .map((element: OverpassResult) => ({
                        display_name: element.tags.name,
                        lat: element.lat.toString(),
                        lon: element.lon.toString(),
                        type: element.tags.tourism,
                    }))
                    .slice(0, 10);

                setCurrentStaySuggestions(accommodations);
            } catch (error) {
                console.error(
                    "Error fetching accommodation suggestions:",
                    error,
                );
                setCurrentStaySuggestions([]);
            }
        },
        [],
    );

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;

        if (name === "currentLocation") {
            setFormData((prev) => ({ ...prev, [name]: value }));
            if (value.length > 2) {
                debouncedFetchLocationSuggestions(value);
            } else {
                setLocationSuggestions([]);
            }
            setPlacesToVisitSuggestions([]);
            setCurrentStaySuggestions([]);
        } else if (name === "placesInput") {
            setPlacesInput(value);
            setIsPlacesDropdownOpen(true);
            if (currentLocationCoords) {
                fetchPlacesToVisitSuggestions(
                    currentLocationCoords.lat,
                    currentLocationCoords.lon,
                );
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleLocationSelect = (suggestion: NominatimResult) => {
        setFormData((prev) => ({
            ...prev,
            currentLocation: suggestion.display_name,
        }));
        setLocationSuggestions([]);
        setCurrentLocationCoords({ lat: suggestion.lat, lon: suggestion.lon });
        fetchPlacesToVisitSuggestions(suggestion.lat, suggestion.lon);
        fetchCurrentStaySuggestions(suggestion.lat, suggestion.lon);
    };

    useEffect(() => {
        if (currentLocationCoords) {
            fetchPlacesToVisitSuggestions(
                currentLocationCoords.lat,
                currentLocationCoords.lon,
            );
            fetchCurrentStaySuggestions(
                currentLocationCoords.lat,
                currentLocationCoords.lon,
            );
        }
    }, [
        currentLocationCoords,
        fetchPlacesToVisitSuggestions,
        fetchCurrentStaySuggestions,
    ]);

    const handlePlacesToVisitSelect = (suggestion: NominatimResult) => {
        setFormData((prev) => {
            if (prev.placesToVisit.includes(suggestion.display_name)) {
                return prev;
            }
            return {
                ...prev,
                placesToVisit: [...prev.placesToVisit, suggestion.display_name],
            };
        });
        setPlacesInput("");
    };

    const handleRemovePlace = (placeToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            placesToVisit: prev.placesToVisit.filter(
                (place) => place !== placeToRemove,
            ),
        }));
    };

    const getUniqueKey = (suggestion: NominatimResult, index: number) => {
        return `${suggestion.display_name}-${suggestion.lat}-${suggestion.lon}-${index}`;
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

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Pass the form data to the parent component
        await onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleFormSubmit}
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
                        {locationSuggestions.map((suggestion, index) => (
                            <li
                                key={getUniqueKey(suggestion, index)}
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

            <div ref={placesDropdownRef}>
                <Label>Places to Visit</Label>
                <Input
                    id="placesInput"
                    name="placesInput"
                    value={placesInput}
                    onChange={handleInputChange}
                    onFocus={() => setIsPlacesDropdownOpen(true)}
                    placeholder="Search places..."
                    autoComplete="off"
                />
                {isPlacesDropdownOpen &&
                    placesToVisitSuggestions.length > 0 && (
                        <ul className="border rounded mt-1 bg-white shadow-sm max-h-60 overflow-y-auto">
                            {placesToVisitSuggestions.map(
                                (suggestion, index) => (
                                    <li
                                        key={getUniqueKey(suggestion, index)}
                                        className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                                        onClick={() =>
                                            handlePlacesToVisitSelect(
                                                suggestion,
                                            )
                                        }
                                    >
                                        <div className="font-medium">
                                            {suggestion.display_name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {suggestion.type && (
                                                <span className="capitalize">
                                                    Type:{" "}
                                                    {suggestion.type.replace(
                                                        /_/g,
                                                        " ",
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        {suggestion.description && (
                                            <div className="text-sm text-gray-600 mt-1">
                                                {suggestion.description}
                                            </div>
                                        )}
                                    </li>
                                ),
                            )}
                        </ul>
                    )}
                {formData.placesToVisit.length > 0 && (
                    <div className="mt-2">
                        <Label className="block text-sm font-medium text-gray-700">
                            Selected Places:
                        </Label>
                        <ul className="space-y-2">
                            {formData.placesToVisit.map((place, index) => (
                                <li
                                    key={`selected-${place}-${index}`}
                                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                                >
                                    <span>{place}</span>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleRemovePlace(place)}
                                        className="ml-2"
                                    >
                                        Remove
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
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
                    <ul className="border rounded mt-1 bg-white shadow-sm max-h-60 overflow-y-auto">
                        {currentStaySuggestions.map((suggestion, index) => (
                            <li
                                key={getUniqueKey(suggestion, index)}
                                className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                                onClick={() =>
                                    handleCurrentStaySelect(suggestion)
                                }
                            >
                                <div className="font-medium">
                                    {suggestion.display_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {suggestion.type && (
                                        <span className="capitalize">
                                            Type:{" "}
                                            {suggestion.type.replace(/_/g, " ")}
                                        </span>
                                    )}
                                </div>
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
