import requests

API_KEY = "AIzaSyC4SlUlOwZ-2aHhWYplqYJ6YoUE8U_8b6s"
location = "19.076000, 72.877700"  # Coordinates for mumbai
radius = 5000  # 5 km (maximum allowed radius)
url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location}&radius={radius}&type=tourist_attraction&keyword=wheelchair+accessible&key={API_KEY}"

response = requests.get(url)
data = response.json()

for place in data['results']:
    print(f"Name: {place['name']}, Address: {place['vicinity']}")