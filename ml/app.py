from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from utils.itinerary import generate_itinerary
from utils.reviews import analyze_reviews
from utils.route import get_sustainable_transport
import logging
from utils.likeminds import match_tourists
from utils.get_photo_location import get_image_gps_from_url, get_nearest_address
from utils.chatbot_text import get_chat_response
from utils.waste_detector import analyze_waste_from_url  # We'll create this new function
import os
from dotenv import load_dotenv
import requests
import time
import json
from supabase import create_client, Client
from werkzeug.utils import secure_filename
from utils.pdf_parsing_itinerary import process_cv


# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

from utils.route import generate_routes
import logging
from utils.likeminds import match_tourists
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/process-itinerary', methods=['POST'])
def process_itinerary():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Process the file and get JSON output
            result = process_cv(filepath)
            
            # Clean up the uploaded file
            os.remove(filepath)
            
            if result is None:
                return jsonify({'error': 'Failed to process itinerary'}), 500
                
            return jsonify(result)
        except Exception as e:
            # Clean up the uploaded file in case of error
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200




@app.route("/generate-itinerary", methods=["POST"])
def generate_travel_itinerary():
    """Endpoint to generate and store an itinerary based on user input."""
    
    data = request.get_json()

    # Validate required fields
    required_fields = ["name", "numberOfPeople", "daysOfVisit", "placesToVisit", "dateOfVisit", "currentStay"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Call the itinerary generation logic
    response, status_code = generate_itinerary(data)
    
    return jsonify(response), status_code

# @app.route('/analyze-reviews', methods=['POST'])
# @cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
# @app.route('/analyze-reviews', methods=['POST'])
# @cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
# def analyze_reviews_endpoint():
#     """API endpoint to analyze reviews for given places."""
#     try:
#         data = request.json
#         if not data:
#             return jsonify({"error": "Invalid request: No JSON data received"}), 400

#         places = data.get("places", [])
#         if not places:
#             return jsonify({"error": "No place IDs provided"}), 400

#         result = analyze_reviews(places)
#         return jsonify(result)

#     except Exception as e:
#         logger.error(f"Error in review analysis: {str(e)}")
#         return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

@app.route('/match-tourists', methods=['POST'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def match_tourists_endpoint():
    """API endpoint for matching tourists based on travel preferences."""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid request: No JSON data received"}), 400

        response, status = match_tourists(data)
        return jsonify(response), status

    except Exception as e:
        logger.error(f"Error in tourist matching: {str(e)}")
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

@app.route('/generate_routes', methods=['POST'])
def generate_routes():
    data = request.get_json()
    num_people = data["numberOfPeople"]
    # Dummy sustainable route generation
    sustainable_routes = [
        {
            "from": "Eiffel Tower",
            "to": "Louvre Museum",
            "transport_mode": get_sustainable_transport(num_people),
            "estimated_time_min": 18,
            "tips": "Electric transport reduces carbon footprint significantly."
        },
        {
            "from": "Louvre Museum",
            "to": "Notre-Dame Cathedral",
            "transport_mode": get_sustainable_transport(num_people),
            "estimated_time_min": 12,
            "tips": "Public transport is cost-effective and sustainable."
        }
    ]
    response = {
        "message": "Route generated successfully",
        "data": {
            "name": data["name"],
            "numberOfPeople": num_people,
            "dateOfVisit": data["dateOfVisit"],
            "sustainable_routes": sustainable_routes
        }
    }
    return jsonify(response), 200

@app.route("/get_location/", methods=["POST"])
def get_location():
    input_data = request.get_json()
    image_url = input_data.get("image_url")

    if not image_url:
        return jsonify({"error": "Image URL is required."})

    try:
        latitude, longitude = get_image_gps_from_url(image_url)

        if latitude is None or longitude is None:
            return jsonify({"error": "No GPS data found in the image."})


        # Add a delay to respect rate limits
        time.sleep(1)
        address = get_nearest_address(latitude, longitude)

        return jsonify({
            "latitude": latitude,
            "longitude": longitude,
            "address": address
        })

        result, status = generate_routes(data)
        return jsonify(result), status


    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/chat/", methods=["POST"])
def chat():
    input_data = request.get_json()
    user_input = input_data.get("user_input", "")
    if not user_input:
        return jsonify({"error": "User input is required."})

    response = get_chat_response(user_input)
    return jsonify(json.loads(response))

@app.route("/detect_waste/", methods=["POST"])
def detect_waste():
    input_data = request.get_json()
    image_url = input_data.get("image_url")

    if not image_url:
        return jsonify({"error": "Image URL is required."})

    try:
        waste_info = analyze_waste_from_url(image_url)

        # Format message for Telegram
        bot_token = os.getenv("BOT_TOKEN")
        chat_id = os.getenv("CHAT_ID")
        message = f"🚨 Waste Alert! 🚨\n\nDetected waste in an image provided by a tourist:\n{waste_info}\n\nPlease take immediate action."

        def send_telegram_message(bot_token, chat_id, message):
            url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
            data = {"chat_id": chat_id, "text": message, "parse_mode": "Markdown"}
            response = requests.post(url, data=data)
            return response.json()

        response = send_telegram_message(bot_token, chat_id, message)
        return jsonify({"waste_info": waste_info, "telegram_response": response})

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run(debug=True)
