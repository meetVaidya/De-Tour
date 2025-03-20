from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

# Access the variables
api_key = os.getenv("GROQ_API_KEY")

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
