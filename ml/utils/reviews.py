import os
import requests
import pandas as pd
from textblob import TextBlob
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')

# Function to fetch reviews from Google Places API
def fetch_reviews(place_id):
    url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=name,reviews&key={API_KEY}"
    response = requests.get(url)
    data = response.json()

    if "reviews" in data.get("result", {}):
        return [{"Location": data["result"]["name"], "Review": rev["text"]} for rev in data["result"]["reviews"]]
    return []

# Function to perform sentiment analysis
def get_sentiment(text):
    analysis = TextBlob(text)
    return analysis.sentiment.polarity

# Function to analyze reviews and flag locations
def analyze_reviews(places):
    reviews_data = []
    for place_id in places:
        reviews_data.extend(fetch_reviews(place_id))

    if not reviews_data:
        return {"message": "No reviews found"}

    df = pd.DataFrame(reviews_data)
    df["Sentiment Score"] = df["Review"].apply(get_sentiment)
    df["Flag"] = df["Sentiment Score"].apply(lambda x: "Green" if x > 0 else "Red")

    red_flagged_places = pd.Series(df[df["Flag"] == "Red"]["Location"]).value_counts()
    df["Recommended"] = df["Location"].apply(lambda x: "Not Recommended" if ((red_flagged_places.get(x) or 0) > 1) else "Recommended")

    return df.to_dict(orient="records")
