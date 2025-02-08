"use client";

import { useState } from "react";
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

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
                />
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
                <Textarea
                    id="placesToVisit"
                    name="placesToVisit"
                    value={formData.placesToVisit}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <Label htmlFor="currentStay">Current Stay</Label>
                <Input
                    id="currentStay"
                    name="currentStay"
                    value={formData.currentStay}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <Button type="submit" className="w-full">
                Submit
            </Button>
        </form>
    );
}
