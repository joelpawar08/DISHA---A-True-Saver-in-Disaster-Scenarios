# SOS/callpeeps.py

import os
import requests
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")


# -----------------------------------------
# 🔍 Get Top 3 Nearest Police Stations
# -----------------------------------------

def get_nearest_police_stations(lat: float, lon: float):
    overpass_url = "https://overpass-api.de/api/interpreter"

    query = f"""
    [out:json];
    (
      node["amenity"="police"](around:5000,{lat},{lon});
    );
    out body;
    """

    response = requests.post(overpass_url, data={"data": query})
    data = response.json()

    stations = []

    for element in data.get("elements", [])[:3]:
        station = {
            "name": element.get("tags", {}).get("name", "Unknown"),
            "latitude": element.get("lat"),
            "longitude": element.get("lon"),
            "contact": element.get("tags", {}).get("phone", "Not Available"),
        }
        stations.append(station)

    return stations


# -----------------------------------------
# 🚨 Send SOS SMS
# -----------------------------------------

def send_sos_alert(emergency_contact: str, lat: float, lon: float):

    police_stations = get_nearest_police_stations(lat, lon)

    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    location_link = f"https://www.google.com/maps?q={lat},{lon}"

    police_info = "\n".join([
        f"{p['name']} | {p['contact']} | {p['latitude']},{p['longitude']}"
        for p in police_stations
    ])

    message_body = f"""
🚨 SOS ALERT 🚨

I am NOT SAFE.

Live Location:
{location_link}

Nearest Police Stations:
{police_info}
"""

    message = client.messages.create(
        body=message_body,
        from_=TWILIO_PHONE_NUMBER,
        to=emergency_contact
    )

    return {
        "message_sid": message.sid,
        "police_stations": police_stations
    }