import requests
from dotenv import load_dotenv
import os

load_dotenv()

# Access the variables
api_key = os.getenv("API_KEY")
bot_token = os.getenv("BOT_TOKEN")
chat_id = os.getenv("CHAT_ID")
# Format message for Telegram
message = f"🚨 *Waste Alert!* 🚨\n\nDetected waste:\n{waste_info}\n\nPlease take immediate action to clean the area. Thank you for keeping our surroundings clean! 🌿"

# Send message to Telegram
def send_telegram_message(bot_token, chat_id, message):
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    data = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "Markdown"
    }
    response = requests.post(url, data=data)
    return response.json()

# Execute sending the message
response = send_telegram_message(bot_token, chat_id, message)
print(response)