import requests
from typing import List, Dict

OVERPASS_URL = "https://overpass-api.de/api/interpreter"


def build_query(lat: float, lon: float, radius: int = 3000) -> str:
    """
    Build Overpass QL query to fetch nearby safe locations.
    """
    return f"""
    [out:json];
    (
      node["amenity"="hospital"](around:{radius},{lat},{lon});
      node["amenity"="shelter"](around:{radius},{lat},{lon});
      node["shop"="mall"](around:{radius},{lat},{lon});
      node["building"](around:{radius},{lat},{lon})["parking"="underground"];
    );
    out body;
    """


def parse_results(elements: List[Dict]) -> List[Dict]:
    """
    Parse Overpass results into structured response.
    """
    locations = []

    for element in elements:
        tags = element.get("tags", {})
        location_type = "unknown"

        if tags.get("amenity") == "hospital":
            location_type = "hospital"
        elif tags.get("amenity") == "shelter":
            location_type = "bunker"
        elif tags.get("shop") == "mall":
            location_type = "mall"
        elif tags.get("parking") == "underground":
            location_type = "skyscraper_with_underground_parking"

        locations.append({
            "name": tags.get("name", "Unknown"),
            "type": location_type,
            "latitude": element.get("lat"),
            "longitude": element.get("lon")
        })

    return locations


def get_nearest_safe_locations(lat: float, lon: float) -> List[Dict]:
    """
    Fetch nearest safe locations from OpenStreetMap using Overpass API.
    """
    query = build_query(lat, lon)

    response = requests.post(OVERPASS_URL, data={"data": query})

    if response.status_code != 200:
        raise Exception("Failed to fetch data from OpenStreetMap")

    data = response.json()

    elements = data.get("elements", [])

    return parse_results(elements)