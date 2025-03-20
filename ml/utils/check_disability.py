import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')

def get_wheelchair_accessible(lat, lon, radius):
    try:
        if not lat or not lon:
            raise ValueError("Latitude and longitude are required")

        location = f"{lat}, {lon}"

        url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location}&radius={radius}&type=tourist_attraction&keyword=wheelchair+accessible&key={API_KEY}"

        response = requests.get(url)
        places_data = response.json()

        # Format the response
        accessible_places = [{
            'name': place['name'],
            'address': place['vicinity'],
            'location': place['geometry']['location'],
            'rating': place.get('rating'),
            'total_ratings': place.get('user_ratings_total')
        } for place in places_data.get('results', [])]

        return accessible_places

    except Exception as e:
        raise Exception(f"Error fetching wheelchair accessible places: {str(e)}")
