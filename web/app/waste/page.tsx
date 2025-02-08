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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-4">Upload Waste Image</h1>

                <form
                    onSubmit={handleUpload}
                    className="bg-white p-6 rounded shadow-md"
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full mb-4"
                    />

                    {showMap && (
                        <div className="my-4 h-[400px]">
                            <p className="mb-2">
                                Please select the location on the map:
                            </p>
                            <MapContainer
                                center={[0, 0]}
                                zoom={2}
                                className="h-full w-full rounded"
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
                    )}

                    {location && (
                        <div className="my-4 p-4 bg-gray-50 rounded">
                            <h3 className="font-semibold">Location Details:</h3>
                            <p>Address: {location.address}</p>
                            <p>
                                Coordinates: {location.latitude},{" "}
                                {location.longitude}
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={uploading || !file}
                        className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </form>

                {message && (
                    <div className="mt-4 p-4 rounded bg-white shadow-md">
                        <p className="text-center">{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
