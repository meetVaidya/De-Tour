import os
import openai
import re
import json
import dotenv
from flask import jsonify

dotenv.load_dotenv()

# OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")

def clean_itinerary_output(text):
    """Removes markdown symbols and extra spacing."""
    text = re.sub(r"[*_`#]", "", text)
    text = text.replace("\n", "\n\n")
    text = re.sub(r"\s+", " ", text).strip()
    return text

def parse_itinerary(text):
    """Fallback parser to generate itinerary dict from text."""
    itinerary_dict = {}
    current_day = None
    current_section = None

    for line in text.split("\n"):
        line = line.strip()
        if not line:
            continue

        if "Day" in line and any(char.isdigit() for char in line):
            current_day = line.strip()
            itinerary_dict[current_day] = {}
        elif line.startswith("🔹") and current_day:
            current_section = line.replace("🔹", "").strip()
            itinerary_dict[current_day][current_section] = []
        elif current_section and current_day:
            itinerary_dict[current_day][current_section].append(line)

    return itinerary_dict

def optimize_itinerary(itinerary):
    """Optimizes itinerary by shifting times to avoid peak hours."""
    # Expecting itinerary to be a dict with keys like "Day 1", "Day 2", etc.
    for day, schedule in itinerary.items():
        for period in ["Morning", "Afternoon", "Evening"]:
            if period in schedule:
                for activity in schedule[period]:
                    time_val = activity.get("time", "")
                    if "10:00" in time_val:
                        activity["time"] = "09:00"
                    elif "14:30" in time_val:
                        activity["time"] = "15:30"
    return itinerary

def add_hidden_gems(itinerary):
    """Adds sidequests containing hidden gems to each day."""
    hidden_gems = [
        {"hiddengem": "Secret Beach", "description": "A secluded paradise away from the crowds."},
        {"hiddengem": "Local Artisan Market", "description": "Authentic handcrafted souvenirs and street food."},
    ]
    # Iterating over each day in the itinerary
    for day, schedule in itinerary.items():
        schedule["Sidequests"] = hidden_gems
    return itinerary

def format_itinerary(itinerary_dict):
    """Formats the structured dictionary into a readable itinerary."""
    formatted_text = ""

    for day, details in itinerary_dict.items():
        formatted_text += f"\n📅 {day.replace('_', ' ').title()}\n"

        for time_of_day, info in details.items():
            formatted_text += f"\n🔹 {time_of_day.title()}:\n"

            for key, value in info.items():
                if isinstance(value, list):
                    formatted_text += f"   • {key.title()}: " + ", ".join(value) + "\n"
                else:
                    formatted_text += f"   • {key.title()}: {value}\n"

    return formatted_text.strip()

def generate_itinerary(data):
    """Generates an optimized itinerary with hidden gems."""
    required_fields = ["name", "numberOfPeople", "daysOfVisit", "placesToVisit", "dateOfVisit", "currentStay"]

    if not all(field in data for field in required_fields):
        return {"error": "Missing required fields"}, 400

    user_name = data["name"]
    tourists = data["numberOfPeople"]
    days = data["daysOfVisit"]
    place = data["placesToVisit"]
    date = data["dateOfVisit"]
    hotel = data["currentStay"]

    prompt = (
        f"You are a highly advanced AI travel planner. Your task is to create a detailed, structured {days}-day itinerary for {place}, "
        f"starting from {date}, for {tourists} tourists staying at {hotel}. Your name is {user_name}.\n\n"
        "The itinerary must be well-organized, structured in JSON format, and divided into:\n"
        "- Morning: Sightseeing, activities, tours.\n"
        "- Afternoon: Lunch recommendations, local cuisine.\n"
        "- Evening: Cultural activities, entertainment, nightlife.\n"
        "- Sidequests: Include at least two unique 'Hidden Gems' for tourists to explore.\n\n"
        "Optimize visit timings to avoid peak crowd hours.\n"
        "Return ONLY valid JSON format without any additional text.\n"
        "You are an AI travel planner. Generate a detailed, structured {days}-day itinerary for {place}, "
        "starting from {date}, for {tourists} tourists staying at {hotel}. Provide a well-structured and readable "
        "itinerary in plain text, avoiding JSON formatting.\n\n"
        "Each day should include:\n"
        "- Morning: Sightseeing, activities, tours\n"
        "- Afternoon: Lunch recommendations, local cuisine\n"
        "- Evening: Cultural activities, entertainment, nightlife.\n"
        "- Sidequests: Include at least two unique 'Hidden Gems' for tourists to explore.\n\n"
        "I want the response in a json format that looks like this:\n"
        "{\n"
        '    "title": "Cape Town Adventure",\n'
        '    "startDate": "2024-03-15",\n'
        '    "endDate": "2024-03-17",\n'
        '    "accommodation": {\n'
        '        "name": "Hotel Southern Sun Cape Sun",\n'
        '        "address": "Strand Street, Cape Town City Centre, Cape Town, 8001, South Africa",\n'
        '        "phone": "+27 21 488 5100"\n'
        "    },\n"
        '    "contacts": [\n'
        '        {\n'
        '            "name": "John Smith",\n'
        '            "role": "Tour Guide",\n'
        '            "phone": "+27 123 456 789",\n'
        '            "email": "john@example.com"\n'
        "        },\n"
        '        {\n'
        '            "name": "Emergency Support",\n'
        '            "role": "24/7 Assistance",\n'
        '            "phone": "+27 987 654 321"\n'
        "        }\n"
        "    ],\n"
        '    "days": [\n'
        '        {\n'
        '            "day": 1,\n'
        '            "date": "March 15, 2024",\n'
        '            "title": "Mumbai - Cape Town",\n'
        '            "activities": [\n'
        '                {\n'
        '                    "time": "10:00",\n'
        '                    "title": "Departure from Mumbai",\n'
        '                    "location": "Chhatrapati Shivaji International Terminal",\n'
        '                    "description": "Assemble at Mumbai\'s Chatrapati Shivaji international terminal to board your flight for Cape Town via Addis Ababa / Nairobi / Seychelles.",\n'
        '                    "type": "transport"\n'
        "                },\n"
        '                {\n'
        '                    "time": "20:00",\n'
        '                    "title": "Arrival & Hotel Transfer",\n'
        '                    "location": "Cape Town International Airport",\n'
        '                    "description": "On arrival in Cape Town after clearing customs & immigrations formalities we shall proceed to board our coach for transfer to the hotel.",\n'
        '                    "type": "transport"\n'
        "                },\n"
        '                {\n'
        '                    "time": "21:30",\n'
        '                    "title": "Dinner",\n'
        '                    "location": "Hotel Restaurant",\n'
        '                    "description": "Welcome dinner at the hotel restaurant",\n'
        '                    "type": "meal",\n'
        '                    "included": true\n'
        "                }\n"
        "            ]\n"
        "        },\n"
        '        {\n'
        '            "day": 2,\n'
        '            "date": "March 16, 2024",\n'
        '            "title": "Cape Town Exploration",\n'
        '            "activities": [\n'
        '                {\n'
        '                    "time": "07:30",\n'
        '                    "title": "Breakfast",\n'
        '                    "location": "Hotel Restaurant",\n'
        '                    "description": "Breakfast at the hotel",\n'
        '                    "type": "meal",\n'
        '                    "included": true\n'
        "                },\n"
        '                {\n'
        '                    "time": "09:00",\n'
        '                    "title": "Cape Town City Tour",\n'
        '                    "location": "Various Locations",\n'
        '                    "description": "Tour including the Malay Quarter, Castle, and Table Bay to Millerton lighthouse",\n'
        '                    "type": "sightseeing",\n'
        '                    "included": true\n'
        "                },\n"
        '                {\n'
        '                    "time": "13:00",\n'
        '                    "title": "Lunch",\n'
        '                    "location": "Local Restaurant",\n'
        '                    "description": "Lunch at a local restaurant",\n'
        '                    "type": "meal",\n'
        '                    "included": true\n'
        "                },\n"
        '                {\n'
        '                    "time": "14:30",\n'
        '                    "title": "Table Mountain",\n'
        '                    "location": "Table Mountain",\n'
        '                    "description": "Experience Table Mountain by Aerial Cable Car which trips you 1089 meters above Cape Town",\n'
        '                    "type": "sightseeing",\n'
        '                    "included": true\n'
        "                }\n"
        "            ]\n"
        "        },\n"
        '        {\n'
        '            "day": 3,\n'
        '            "date": "March 17, 2024",\n'
        '            "title": "Cape Peninsula Tour",\n'
        '            "activities": [\n'
        '                {\n'
        '                    "time": "08:00",\n'
        '                    "title": "Breakfast",\n'
        '                    "location": "Hotel Restaurant",\n'
        '                    "description": "Breakfast at the hotel",\n'
        '                    "type": "meal",\n'
        '                    "included": true\n'
        "                },\n"
        '                {\n'
        '                    "time": "09:00",\n'
        '                    "title": "Peninsula Tour",\n'
        '                    "location": "Cape Peninsula",\n'
        '                    "description": "Full day tour of the Cape Peninsula. Travel at a pace that allows you to explore the beauty of the Cape Peninsula.",\n'
        '                    "type": "sightseeing",\n'
        '                    "included": true\n'
        "                }\n"
        "            ]\n"
        "        }\n"
        "    ],\n"
        '    "notes": "Please carry comfortable walking shoes and don\'t forget your camera! Weather can be unpredictable, so pack accordingly."\n'
        "}\n\n"
        "Ensure readability with proper spacing and bullet points."
    )

    try:
        openai_client = openai.OpenAI()
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional AI itinerary planner with expertise in structured travel planning."},
                {"role": "user", "content": prompt}
            ]
        )

        raw_itinerary = response.choices[0].message.content
        print("RAW ITINERARY RESPONSE:", raw_itinerary)
        ressp = raw_itinerary.strip().split("```json")[1].split("```")[0]
        ressp_json = json.loads(ressp)
        return ressp_json, 200

    except Exception as e:
        return {"error": str(e)}, 500
