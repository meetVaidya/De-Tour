"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/marker-icon-2x.png",
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
});

interface Location {
    latitude: number;
    longitude: number;
    address: string;
}

function LocationMarker({
    onLocationSelect,
}: {
    onLocationSelect: (lat: number, lng: number) => void;
}) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [location, setLocation] = useState<Location | null>(null);
    const [showMap, setShowMap] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<
        [number, number] | null
    >(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const res = await fetch("/api/decrypt-session");
                if (!res.ok) {
                    console.error("Not authenticated");
                    return;
                }
                const data = await res.json();
                if (data.userId) {
                    setUserId(data.userId);
                }
            } catch (error) {
                console.error("Error fetching session", error);
            }
        };

        fetchUserId();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setLocation(null);
            setShowMap(false);
        }
    };

    const handleLocationSelect = async (lat: number, lng: number) => {
        setSelectedPosition([lat, lng]);
        // Here you could make an API call to get the address for these coordinates
        setLocation({
            latitude: lat,
            longitude: lng,
            address: `Selected location (${lat.toFixed(6)}, ${lng.toFixed(6)})`,
        });
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setMessage("Please select a file to upload.");
            return;
        }
        if (!userId) {
            setMessage("You must be logged in to upload a file.");
            return;
        }

        setUploading(true);
        setMessage(null);

        try {
            // 1. Upload to Supabase storage
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random().toString(36).slice(2, 11)}.${fileExt}`;
            const filePath = fileName;

            const { error: storageError, data: storageData } =
                await supabase.storage
                    .from("waste-images")
                    .upload(filePath, file);

            if (storageError) {
                throw storageError;
            }

            // Get the public URL of the uploaded image
            const {
                data: { publicUrl },
            } = supabase.storage.from("waste-images").getPublicUrl(filePath);

            // 2. Get location data
            const locationResponse = await fetch("/api/location", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image_url: publicUrl }),
            });

            const locationData = await locationResponse.json();

            if (locationData.error) {
                setShowMap(true);
            } else {
                setLocation(locationData);
            }

            // 3. Analyze waste in the image
            const wasteResponse = await fetch("/api/waste-detection", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image_url: publicUrl }),
            });

            const wasteData = await wasteResponse.json();

            // 4. Save to database
            const { error: imageError } = await supabase.from("images").insert([
                {
                    owner_id: userId,
                    file_path: filePath,
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                    address: location?.address,
                    waste_info: wasteData.waste_info,
                },
            ]);

            if (imageError) {
                throw imageError;
            }

            setMessage("Upload successful!");
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-forest-50 to-forest-100 p-6">
            <div className="w-full max-w-3xl">
                <h1 className="text-3xl font-bold mb-6 text-forest-800 text-center">
                    <span className="inline-block transform hover:scale-105 transition-transform duration-200">
                        Waste Management Upload
                    </span>
                </h1>

                <form
                    onSubmit={handleUpload}
                    className="bg-white backdrop-blur-sm bg-opacity-95 p-8 rounded-xl shadow-xl border border-forest-200 transition-all duration-300 hover:shadow-2xl"
                >
                    {/* File Upload Section */}
                    <div className="mb-6">
                        <label className="block text-forest-700 font-medium mb-2">
                            Upload Image
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-forest-700
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-forest-500 file:text-white
                                    hover:file:bg-forest-600
                                    file:cursor-pointer file:transition-colors
                                    focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Map Section */}
                    {showMap && (
                        <div className="my-6">
                            <p className="text-forest-700 mb-3 font-medium">
                                Select Location on Map:
                            </p>
                            <div className="h-[400px] rounded-xl overflow-hidden border-2 border-forest-200 shadow-md">
                                <MapContainer
                                    center={[0, 0]}
                                    zoom={2}
                                    className="h-full w-full"
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <LocationMarker
                                        onLocationSelect={handleLocationSelect}
                                    />
                                    {selectedPosition && (
                                        <Marker position={selectedPosition} />
                                    )}
                                </MapContainer>
                            </div>
                        </div>
                    )}

                    {/* Location Details */}
                    {location && (
                        <div className="my-6 p-4 bg-forest-50 rounded-lg border border-forest-200">
                            <h3 className="font-semibold text-forest-800 mb-2">
                                Location Details
                            </h3>
                            <div className="space-y-2 text-forest-700">
                                <p className="flex items-center">
                                    <span className="font-medium mr-2">
                                        Address:
                                    </span>
                                    {location.address}
                                </p>
                                <p className="flex items-center">
                                    <span className="font-medium mr-2">
                                        Coordinates:
                                    </span>
                                    {location.latitude}, {location.longitude}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Upload Button */}
                    <button
                        type="submit"
                        disabled={uploading || !file}
                        className={`w-full mt-6 px-6 py-3 rounded-lg font-medium
                            transition-all duration-200
                            ${
                                uploading || !file
                                    ? "bg-forest-200 text-forest-500 cursor-not-allowed"
                                    : "bg-forest-600 text-white hover:bg-forest-700 active:bg-forest-800 shadow-md hover:shadow-lg"
                            }`}
                    >
                        {uploading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Uploading...
                            </span>
                        ) : (
                            "Upload Image"
                        )}
                    </button>
                </form>

                {/* Status Message */}
                {message && (
                    <div
                        className={`mt-6 p-4 rounded-lg shadow-md transition-all duration-300 ${
                            message.includes("Error")
                                ? "bg-red-50 border border-red-200 text-red-700"
                                : "bg-forest-50 border border-forest-200 text-forest-700"
                        }`}
                    >
                        <p className="text-center font-medium">{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
