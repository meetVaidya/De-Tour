import { NextResponse } from 'next/server';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get('lat');
        const lon = searchParams.get('lon');

        if (!lat || !lon) {
            return NextResponse.json(
                { error: 'Latitude and longitude are required' },
                { status: 400 }
            );
        }

        const location = `${lat},${lon}`;
        const radius = 50000; // 50 km
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=tourist_attraction&keyword=wheelchair+accessible&key=${API_KEY}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Google Places API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error in accessible places API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch accessible places' },
            { status: 500 }
        );
    }
}
