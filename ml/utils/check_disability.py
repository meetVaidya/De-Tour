from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

API_KEY = "AIzaSyC4SlUlOwZ-2aHhWYplqYJ6YoUE8U_8b6s"

@app.route('/api/wheelchair-accessible', methods=['POST'])
def get_wheelchair_accessible():
    try:
        data = request.json
        lat = data.get('lat')
        lon = data.get('lon')

        if not lat or not lon:
            return jsonify({
                'status': 'error',
                'message': 'Latitude and longitude are required'
            }), 400

        location = f"{lat}, {lon}"
        radius = 50000  # 50 km radius

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

        return jsonify({
            'status': 'success',
            'data': accessible_places
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
