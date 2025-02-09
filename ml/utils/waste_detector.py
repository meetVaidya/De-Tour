# RAHAN/utils/waste_detector.py
import requests
from groq import Groq
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access the variables
api_key = os.getenv("API_KEY")
bot_token = os.getenv("BOT_TOKEN")
chat_id = os.getenv("CHAT_ID")

client = Groq(api_key=api_key)

def analyze_waste_from_url(image_url):
    """
    Analyze waste in an image from a URL using the Groq API
    """
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Analyze the image and identify any waste present. Classify it into one of these categories: "
                                "Plastic Waste, Organic Waste, Metal Waste, Glass Waste, Electronic Waste, Paper Waste, "
                                "Medical Waste, or Other. If multiple types of waste are detected, list them all. "
                                "List the objects that you think are waste."
                                "Output the detected waste types and their classifications."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_url,
                        },
                    },
                ],
            }
        ],
        model="llama-3.2-11b-vision-preview",
    )

    return chat_completion.choices[0].message.content

def send_telegram_message(bot_token, chat_id, message):
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    data = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "Markdown"
    }
    response = requests.post(url, data=data)
    return response.json()
