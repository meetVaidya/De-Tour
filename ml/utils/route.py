import os
import openai
import json
import dotenv
import random
from pymongo import MongoClient
from utils.itinerary import generate_itinerary


dotenv.load_dotenv()

# OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client['TravelPlannerDB']
routes_collection = db['SustainableRoutes']

TRANSPORT_OPTIONS = {
    "solo": {"mode": "electric scooter or shared e-bike", "speed_kmh": 20},
    "couple": {"mode": "EV taxi or rickshaw", "speed_kmh": 40},
    "small_group": {"mode": "shared ride-hailing service (e.g., Uber Green)", "speed_kmh": 35},
    "large_group": {"mode": "electric minivan or public bus", "speed_kmh": 25}
}

def get_sustainable_transport(num_people):
    """Determines the most sustainable transport option based on group size."""
    if num_people == 1:
        return TRANSPORT_OPTIONS["solo"]
    elif num_people == 2:
        return TRANSPORT_OPTIONS["couple"]
    elif 3 <= num_people <= 5:
        return TRANSPORT_OPTIONS["small_group"]
    else:
        return TRANSPORT_OPTIONS["large_group"]

def estimate_travel_time(distance_km, speed_kmh):
    """Estimates travel time based on distance and vehicle speed."""
    return round(distance_km / speed_kmh * 60)  # Convert hours to minutes

def generate_routes(data):
    """Creates optimized travel routes based on an itinerary with sustainability in mind."""
    itinerary_response, status_code = generate_itinerary(data)
    if status_code != 200:
        return itinerary_response, status_code

    itinerary = itinerary_response["itinerary"]
    tourists = data["numberOfPeople"]
    transport_details = get_sustainable_transport(tourists)

    sustainable_routes = {}

    for day, schedule in itinerary.items():
        places = []
        for period in ["Morning", "Afternoon", "Evening"]:
            if period in schedule:
                places.extend(schedule[period])

        if len(places) < 2:
            continue  # Skip if there's only one place (no travel needed)

        route_details = []
        for i in range(len(places) - 1):
            start = places[i]
            end = places[i + 1]
            distance_km = random.uniform(2, 15)  # Simulated distance in km
            travel_time = estimate_travel_time(distance_km, transport_details["speed_kmh"])

            route_details.append({
                "from": start,
                "to": end,
                "transport_mode": transport_details["mode"],
                "estimated_time_min": travel_time
            })

        sustainable_routes[day] = {"route_plan": route_details}

    # Save routes to MongoDB
    route_data = {
        "name": data["name"],
        "numberOfPeople": tourists,
        "dateOfVisit": data["dateOfVisit"],
        "sustainable_routes": sustainable_routes
    }
    result = routes_collection.insert_one(route_data)
    route_data["_id"] = str(result.inserted_id)  # Convert ObjectId to string

    return {"message": "Route generated successfully", "data": route_data}, 200

# Example usage
if __name__ == "__main__":
    test_data = {
        "name": "Alex",
        "numberOfPeople": 4,
        "daysOfVisit": 3,
        "placesToVisit": "Paris",
        "dateOfVisit": "2025-03-10",
        "currentStay": "Hotel Le Grand"
    }
    print(generate_routes(test_data))
