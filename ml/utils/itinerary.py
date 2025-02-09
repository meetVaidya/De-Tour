import os
import openai
import re
import json
from pymongo import MongoClient
import dotenv
import httpx
import ssl

dotenv.load_dotenv()

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client['TravelPlannerDB']
collection = db['Itineraries']

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
    """Generates an optimized itinerary with hidden gems and stores it in MongoDB."""
    required_fields = ["name", "numberOfPeople", "daysOfVisit", "placesToVisit", "dateOfVisit", "currentStay"]

    if not all(field in data for field in required_fields):
        return {"error": "Missing required fields"}, 400

    user_name = data["name"]
    tourists = data["numberOfPeople"]
    days = data["daysOfVisit"]
    place = data["placesToVisit"]
    date = data["dateOfVisit"]
    hotel = data["currentStay"]

    prompt = f"""
    You are a highly advanced AI travel planner. Your task is to create a detailed, structured {days}-day itinerary for {place},
    starting from {date}, for {tourists} tourists staying at {hotel}. Your name is {user_name}.

    The itinerary must be well-organized, structured in JSON format, and divided into:
    - Morning: Sightseeing, activities, tours.
    - Afternoon: Lunch recommendations, local cuisine.
    - Evening: Cultural activities, entertainment, nightlife.
    - Sidequests: Include at least two unique 'Hidden Gems' for tourists to explore.

    Optimize visit timings to avoid peak crowd hours.
    Return ONLY valid JSON format without any additional text.
    You are an AI travel planner. Generate a detailed, structured {days}-day itinerary for {place},
    starting from {date}, for {tourists} tourists staying at {hotel}. Provide a well-structured and readable
    itinerary in plain text, avoiding JSON formatting.

    Each day should include:
    - Morning: Sightseeing, activities, tours
    - Afternoon: Lunch recommendations, local cuisine
    - Evening: Cultural activities, entertainment, nightlife

    Ensure readability with proper spacing and bullet points.
    """

    try:
        openai_client = openai.OpenAI()
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional AI itinerary planner with expertise in structured travel planning."},
                {"role": "user", "content": prompt}
            ]
        )

        raw_itinerary = response.choices[0].message.content
        print("RAW ITINERARY RESPONSE:", raw_itinerary)

        # Remove possible "json " prefix and clean up
        clean_response = raw_itinerary.strip()
        if clean_response.lower().startswith("json "):
            clean_response = clean_response[5:].strip()

        try:
            structured_itinerary = json.loads(clean_response)
        except json.JSONDecodeError:
            clean_response = clean_itinerary_output(clean_response)
            structured_itinerary = parse_itinerary(clean_response)

        # If the returned JSON has a top-level "itinerary" key, get its events
        if isinstance(structured_itinerary, dict) and "itinerary" in structured_itinerary:
            structured_itinerary = structured_itinerary["itinerary"].get("events", structured_itinerary["itinerary"])

        optimized_itinerary = optimize_itinerary(structured_itinerary)
        final_itinerary = add_hidden_gems(optimized_itinerary)

        itinerary_data = {
            "name": user_name,
            "numberOfPeople": tourists,
            "daysOfVisit": days,
            "placesToVisit": place,
            "dateOfVisit": date,
            "currentStay": hotel,
            "itinerary": final_itinerary
        }
        inserted_id = collection.insert_one(itinerary_data).inserted_id

        return {"id": str(inserted_id), "name": user_name, "itinerary": final_itinerary}, 200

    except Exception as e:
        return {"error": str(e)}, 500


# import os
# import openai
# import re
# import json
# from pymongo import MongoClient
# import dotenv
# import httpx
# import ssl
# from supabase import create_client

# dotenv.load_dotenv()

# # MongoDB Configuration
# MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
# client = MongoClient(MONGO_URI)
# db = client['TravelPlannerDB']
# collection = db['Itineraries']

# # OpenAI API Key
# openai.api_key = os.getenv("OPENAI_API_KEY")

# # Supabase Configuration
# SUPABASE_URL = os.getenv("SUPABASE_URL")
# SUPABASE_KEY = os.getenv("SUPABASE_KEY")


# supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


# def clean_itinerary_output(text):
#     """Removes markdown symbols and extra spacing."""
#     text = re.sub(r"[*_`#]", "", text)
#     text = text.replace("\n", "\n\n")
#     text = re.sub(r"\s+", " ", text).strip()
#     return text

# def parse_itinerary(text):
#     """Fallback parser to generate itinerary dict from text."""
#     itinerary_dict = {}
#     current_day = None
#     current_section = None

#     for line in text.split("\n"):
#         line = line.strip()
#         if not line:
#             continue

#         if "Day" in line and any(char.isdigit() for char in line):
#             current_day = line.strip()
#             itinerary_dict[current_day] = {}
#         elif line.startswith("🔹") and current_day:
#             current_section = line.replace("🔹", "").strip()
#             itinerary_dict[current_day][current_section] = []
#         elif current_section and current_day:
#             itinerary_dict[current_day][current_section].append(line)

#     return itinerary_dict

# def optimize_itinerary(itinerary):
#     """Optimizes itinerary by shifting times to avoid peak hours."""
#     for day, schedule in itinerary.items():
#         for period in ["Morning", "Afternoon", "Evening"]:
#             if period in schedule:
#                 for activity in schedule[period]:
#                     time_val = activity.get("time", "")
#                     if "10:00" in time_val:
#                         activity["time"] = "09:00"
#                     elif "14:30" in time_val:
#                         activity["time"] = "15:30"
#     return itinerary

# def add_hidden_gems(itinerary):
#     """Adds sidequests containing hidden gems to each day."""
#     hidden_gems = [
#         {"hiddengem": "Secret Beach", "description": "A secluded paradise away from the crowds."},
#         {"hiddengem": "Local Artisan Market", "description": "Authentic handcrafted souvenirs and street food."},
#     ]
#     for day, schedule in itinerary.items():
#         schedule["Sidequests"] = hidden_gems
#     return itinerary

# def format_itinerary(itinerary_dict):
#     """Formats the structured dictionary into a readable itinerary."""
#     formatted_text = ""

#     for day, details in itinerary_dict.items():
#         formatted_text += f"\n📅 {day.replace('_', ' ').title()}\n"

#         for time_of_day, info in details.items():
#             formatted_text += f"\n🔹 {time_of_day.title()}:\n"

#             for key, value in info.items():
#                 if isinstance(value, list):
#                     formatted_text += f"   • {key.title()}: " + ", ".join(value) + "\n"
#                 else:
#                     formatted_text += f"   • {key.title()}: {value}\n"

#     return formatted_text.strip()

# def get_budget_suggestion(hotel):
#     """Fetches hotel data from Supabase and suggests budget."""
#     try:
#         response = supabase.table('hotel_reviews').select('hotel', 'price_inr', 'review').eq('hotel', hotel).execute()
#         hotel_data = response.data

#         print(hotel_data)

#         if hotel_data:
#             price = hotel_data[0]['price']
#             review = hotel_data[0]['review']
#             suggested_budget = price

#             if review >= 7:
#                 suggested_budget += 0.2 * price  # Increase budget for highly rated hotels
#             elif review <= 3:
#                 suggested_budget -= 0.1 * price  # Decrease budget for poorly rated hotels

#             return round(suggested_budget, 2)
#         else:
#             return None
#     except Exception as e:
#         print(f"Error fetching hotel data: {e}")
#         return None

# def generate_itinerary(data):
#     """Generates an optimized itinerary with hidden gems and stores it in MongoDB."""
#     required_fields = ["name", "numberOfPeople", "daysOfVisit", "placesToVisit", "dateOfVisit", "currentStay"]

#     if not all(field in data for field in required_fields):
#         return {"error": "Missing required fields"}, 400

#     user_name = data["name"]
#     tourists = data["numberOfPeople"]
#     days = data["daysOfVisit"]
#     place = data["placesToVisit"]
#     date = data["dateOfVisit"]
#     hotel = data["currentStay"]

#     # Get budget suggestion based on hotel data
#     suggested_budget = get_budget_suggestion(hotel)

#     if suggested_budget is None:
#         return {"error": "Failed to fetch hotel data for budget suggestion."}, 500

#     prompt = f"""
#     You are a highly advanced AI travel planner. Your task is to create a detailed, structured {days}-day itinerary for {place},
#     starting from {date}, for {tourists} tourists staying at {hotel}. Your name is {user_name}.

#     The itinerary must be well-organized, structured in JSON format, and divided into:
#     - Morning: Sightseeing, activities, tours.
#     - Afternoon: Lunch recommendations, local cuisine.
#     - Evening: Cultural activities, entertainment, nightlife.
#     - Sidequests: Include at least two unique 'Hidden Gems' for tourists to explore.

#     Optimize visit timings to avoid peak crowd hours.
#     Return ONLY valid JSON format without any additional text.
#     You are an AI travel planner. Generate a detailed, structured {days}-day itinerary for {place},
#     starting from {date}, for {tourists} tourists staying at {hotel}. Provide a well-structured and readable
#     itinerary in plain text, avoiding JSON formatting.

#     Each day should include:
#     - Morning: Sightseeing, activities, tours
#     - Afternoon: Lunch recommendations, local cuisine
#     - Evening: Cultural activities, entertainment, nightlife

#     Ensure readability with proper spacing and bullet points.
#     """

#     try:
#         openai_client = openai.OpenAI()
#         response = openai_client.chat.completions.create(
#             model="gpt-4o-mini",
#             messages=[
#                 {"role": "system", "content": "You are a professional AI itinerary planner with expertise in structured travel planning."},
#                 {"role": "user", "content": prompt}
#             ]
#         )

#         raw_itinerary = response.choices[0].message.content
#         print("RAW ITINERARY RESPONSE:", raw_itinerary)

#         clean_response = raw_itinerary.strip()
#         if clean_response.lower().startswith("json "):
#             clean_response = clean_response[5:].strip()

#         try:
#             structured_itinerary = json.loads(clean_response)
#         except json.JSONDecodeError:
#             clean_response = clean_itinerary_output(clean_response)
#             structured_itinerary = parse_itinerary(clean_response)

#         if isinstance(structured_itinerary, dict) and "itinerary" in structured_itinerary:
#             structured_itinerary = structured_itinerary["itinerary"].get("events", structured_itinerary["itinerary"])

#         optimized_itinerary = optimize_itinerary(structured_itinerary)
#         final_itinerary = add_hidden_gems(optimized_itinerary)

#         itinerary_data = {
#             "name": user_name,
#             "numberOfPeople": tourists,
#             "daysOfVisit": days,
#             "placesToVisit": place,
#             "dateOfVisit": date,
#             "currentStay": hotel,
#             "budget": suggested_budget,  # Store the suggested budget
#             "itinerary": final_itinerary
#         }
#         inserted_id = collection.insert_one(itinerary_data).inserted_id

#         return {"id": str(inserted_id), "name": user_name, "itinerary": final_itinerary, "budget": suggested_budget}, 200

#     except Exception as e:
#         return {"error": str(e)}, 500
