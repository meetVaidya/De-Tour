import React from 'react';
import { OptimizedItinerary, SustainableRoute } from '@/lib/api';
import { Card } from '@/components/ui/card';
import {
    ArrowRight,
    Clock,
    Bus,
    MapPin,
} from 'lucide-react';

interface OptimizedRouteProps {
    itinerary: OptimizedItinerary;
    onReset: () => void;
}

export const OptimizedRoute: React.FC<OptimizedRouteProps> = ({
    itinerary,
    onReset,
}) => {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-green-700">
                    Sustainable Travel Route
                </h2>
                <p className="text-gray-600">
                    Optimized itinerary for {itinerary.name} - Group of{' '}
                    {itinerary.numberOfPeople}
                </p>
            </div>

            {Object.entries(itinerary.sustainable_routes).map(([day, routes]) => (
                <Card key={day} className="mb-6 p-6">
                    <h3 className="text-xl font-semibold mb-4">
                        Day {day.split('_')[1]}
                    </h3>
                    <div className="space-y-4">
                        {routes.route_plan.map((route: SustainableRoute, index) => (
                            <div
                                key={index}
                                className="bg-green-50 rounded-lg p-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="text-green-600" />
                                            <span className="font-medium">
                                                {route.from}
                                            </span>
                                        </div>
                                        <div className="flex items-center my-2">
                                            <ArrowRight className="text-green-600" />
                                            <div className="flex items-center gap-2 ml-2">
                                                <Bus className="text-green-600" />
                                                <span className="text-sm text-green-700">
                                                    {route.transport_mode}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="text-green-600" />
                                            <span className="font-medium">
                                                {route.to}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm">
                                            {route.estimated_time_min} min
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            ))}

            <button
                onClick={onReset}
                className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
                Plan Another Route
            </button>
        </div>
    );
};
