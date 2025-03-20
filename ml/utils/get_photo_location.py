from PIL import Image
import piexif
from geopy.geocoders import Nominatim
import requests
from io import BytesIO

geolocator = Nominatim(user_agent="LOC Project")

def get_image_gps_from_url(image_url):
    """Extracts GPS coordinates from an image's EXIF metadata using image URL."""
    try:
        # Download image from URL
        response = requests.get(image_url)
        response.raise_for_status()

        # Open image from bytes
        img = Image.open(BytesIO(response.content))

        # Load EXIF data
        exif_data = img.info.get("exif")
        if not exif_data:
            return None, None

        exif_dict = piexif.load(exif_data)
        gps_data = exif_dict.get("GPS")
        if not gps_data:
            return None, None

        def convert_to_degrees(value):
            d, m, s = value
            return d[0] / d[1] + (m[0] / m[1] / 60) + (s[0] / s[1] / 3600)

        lat = convert_to_degrees(gps_data[piexif.GPSIFD.GPSLatitude])
        lon = convert_to_degrees(gps_data[piexif.GPSIFD.GPSLongitude])

        if gps_data[piexif.GPSIFD.GPSLatitudeRef] == b'S':
            lat = -lat
        if gps_data[piexif.GPSIFD.GPSLongitudeRef] == b'W':
            lon = -lon

        return lat, lon

    except Exception as e:
        print(f"Error processing image: {e}")
        return None, None

def get_nearest_address(latitude, longitude):
    """Gets the nearest address from coordinates."""
    if latitude is None or longitude is None:
        return "No location data available"

    coordinates = f"{latitude}, {longitude}"
    try:
        location = geolocator.reverse(coordinates, exactly_one=True)

        if location:
            return location.address
        else:
            return "Address not found for these coordinates"
    except Exception as e:
        return f"Error: {e}"
