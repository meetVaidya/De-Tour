"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Setup leaflet icons here as well (inside useEffect if preferred)
// Or you can use the method above to wrap in a useEffect.
if (typeof window !== "undefined") {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/marker-icon-2x.png",
        iconUrl: "/marker-icon.png",
        shadowUrl: "/marker-shadow.png",
    });
}

interface WasteMapProps {
    selectedPosition: [number, number] | null;
    onLocationSelect: (lat: number, lng: number) => void;
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

export default function WasteMap({
    selectedPosition,
    onLocationSelect,
}: WasteMapProps) {
    return (
        <MapContainer center={[0, 0]} zoom={2} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker onLocationSelect={onLocationSelect} />
            {selectedPosition && <Marker position={selectedPosition} />}
        </MapContainer>
    );
}
