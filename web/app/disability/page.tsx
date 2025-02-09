'use client'

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash/debounce";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue in Next.js
const icon = L.icon({
    iconUrl: "/marker-icon.png",
    iconRetinaUrl: "/marker-icon-2x.png",
    shadowUrl: "/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface Place {
    name: string;
    address: string;
    location: {
        lat: number;
        lng: number;
    };
    rating?: number;
    user_ratings_total?: number;
    place_id: string;
}

export default function AccessiblePlacesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
    const [places, setPlaces] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAccessiblePlaces = async (lat: number, lng: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `http://localhost:5000/api/accessible-places?lat=${lat}&lng=${lng}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch accessible places');
            }

            const data = await response.json();
            if (data.status === 'success') {
                setPlaces(data.data);
                setSelectedLocation([lat, lng]);
            } else {
                throw new Error(data.message || 'Failed to fetch places');
            }
        } catch (error: any) {
            console.error('Error:', error);
            setError(error.message || 'An error occurred');
            setPlaces([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        try {
            // Use Nominatim to convert address to coordinates
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
            );
            const data = await response.json();

            if (data && data[0]) {
                await fetchAccessiblePlaces(parseFloat(data[0].lat), parseFloat(data[0].lon));
            } else {
                setError('Location not found');
            }
        } catch (error: any) {
            setError(error.message || 'Failed to search location');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-forest-800 mb-8 text-center">
                    Find Wheelchair Accessible Places
                </h1>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter a location..."
                            className="flex-1 px-4 py-2 rounded-lg border border-forest-200 focus:ring-forest-500 focus:border-forest-500"
                        />
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Searching...' : 'Search'}
                        </motion.button>
                    </div>
                </form>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Results List */}
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {places.map((place, index) => (
                            <motion.div
                                key={place.place_id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                <h2 className="text-xl font-semibold text-forest-800 mb-2">
                                    {place.name}
                                </h2>
                                <p className="text-forest-600 mb-4">{place.address}</p>

                                {place.rating && (
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-5 h-5 ${
                                                        i < Math.floor(place.rating)
                                                            ? "text-yellow-400"
                                                            : "text-gray-300"
                                                    }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-forest-600">
                                            ({place.user_ratings_total} reviews)
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {places.length === 0 && !isLoading && (
                            <div className="text-center text-forest-600 py-12">
                                No accessible places found in this area.
                            </div>
                        )}
                    </div>

                    {/* Map */}
                    <div className="h-[600px] rounded-xl overflow-hidden shadow-lg">
                        <MapContainer
                            center={selectedLocation || [20.5937, 78.9629]} // Default to India's center
                            zoom={selectedLocation ? 12 : 5}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />

                            {selectedLocation && places.map((place) => (
                                <Marker
                                    key={place.place_id}
                                    position={[place.location.lat, place.location.lng]}
                                    icon={icon}
                                >
                                    <Popup>
                                        <div>
                                            <h3 className="font-semibold">{place.name}</h3>
                                            <p>{place.address}</p>
                                            {place.rating && (
                                                <p>Rating: {place.rating} ⭐</p>
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
