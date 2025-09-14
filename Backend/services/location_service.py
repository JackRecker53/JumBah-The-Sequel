import httpx
import math
from typing import List, Dict, Optional, Tuple

class LocationService:
    def __init__(self):
        self.nominatim_url = "https://nominatim.openstreetmap.org"
        self.overpass_url = "https://overpass-api.de/api/interpreter"
        self.routing_url = "https://router.project-osrm.org/route/v1"
        self.headers = {
            "User-Agent": "JumBah-Travel-App/1.0"
        }
    
    async def search_locations(self, query: str, limit: int = 10) -> List[Dict]:
        """
        Search for locations using OpenStreetMap Nominatim API
        
        Args:
            query: Search query (location name, address, etc.)
            limit: Maximum number of results to return
        
        Returns:
            List of location dictionaries with name, address, and coordinates
        """
        async with httpx.AsyncClient() as client:
            params = {
                "q": query,
                "format": "json",
                "limit": limit,
                "addressdetails": 1,
                "extratags": 1
            }
            
            response = await client.get(
                f"{self.nominatim_url}/search",
                params=params,
                headers=self.headers
            )
            
            if response.status_code == 200:
                data = response.json()
                return [
                    {
                        "name": item.get("display_name", "").split(",")[0],
                        "address": item.get("display_name", ""),
                        "coordinates": [float(item["lat"]), float(item["lon"])],
                        "lat": float(item["lat"]),
                        "lon": float(item["lon"]),
                        "type": item.get("type", "unknown"),
                        "class": item.get("class", "unknown"),
                        "importance": item.get("importance", 0),
                        "place_id": item.get("place_id")
                    }
                    for item in data
                ]
            else:
                return []
    
    async def reverse_geocode(self, lat: float, lon: float) -> Optional[Dict]:
        """
        Reverse geocode coordinates to get address information
        
        Args:
            lat: Latitude
            lon: Longitude
        
        Returns:
            Address information dictionary
        """
        async with httpx.AsyncClient() as client:
            params = {
                "lat": lat,
                "lon": lon,
                "format": "json",
                "addressdetails": 1
            }
            
            response = await client.get(
                f"{self.nominatim_url}/reverse",
                params=params,
                headers=self.headers
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "address": data.get("display_name", ""),
                    "coordinates": [lat, lon],
                    "address_components": data.get("address", {}),
                    "type": data.get("type", "unknown"),
                    "place_id": data.get("place_id")
                }
            else:
                return None
    
    async def get_nearby_pois(self, lat: float, lon: float, radius: int = 1000, poi_types: Optional[List[str]] = None) -> List[Dict]:
        """
        Get nearby points of interest using Overpass API
        
        Args:
            lat: Latitude
            lon: Longitude
            radius: Search radius in meters (default: 1000m)
            poi_types: List of POI types to search for
        
        Returns:
            List of nearby POIs
        """
        if poi_types is None:
            poi_types = ["restaurant", "hotel", "tourist", "shop", "amenity"]
        
        # Build Overpass query
        query_parts = []
        for poi_type in poi_types:
            if poi_type == "restaurant":
                query_parts.append(f'node["amenity"="restaurant"](around:{radius},{lat},{lon});')
                query_parts.append(f'node["amenity"="cafe"](around:{radius},{lat},{lon});')
                query_parts.append(f'node["amenity"="fast_food"](around:{radius},{lat},{lon});')
            elif poi_type == "hotel":
                query_parts.append(f'node["tourism"="hotel"](around:{radius},{lat},{lon});')
                query_parts.append(f'node["tourism"="guest_house"](around:{radius},{lat},{lon});')
            elif poi_type == "tourist":
                query_parts.append(f'node["tourism"="attraction"](around:{radius},{lat},{lon});')
                query_parts.append(f'node["tourism"="museum"](around:{radius},{lat},{lon});')
                query_parts.append(f'node["historic"](around:{radius},{lat},{lon});')
            elif poi_type == "shop":
                query_parts.append(f'node["shop"](around:{radius},{lat},{lon});')
            elif poi_type == "amenity":
                query_parts.append(f'node["amenity"="bank"](around:{radius},{lat},{lon});')
                query_parts.append(f'node["amenity"="hospital"](around:{radius},{lat},{lon});')
                query_parts.append(f'node["amenity"="pharmacy"](around:{radius},{lat},{lon});')
        
        overpass_query = f"""
        [out:json][timeout:25];
        (
        {chr(10).join(query_parts)}
        );
        out geom;
        """
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(
                    self.overpass_url,
                    data=overpass_query,
                    headers={**self.headers, "Content-Type": "text/plain"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    pois = []
                    
                    for element in data.get("elements", []):
                        if element.get("type") == "node":
                            tags = element.get("tags", {})
                            poi = {
                                "id": element.get("id"),
                                "name": tags.get("name", "Unknown"),
                                "coordinates": [element.get("lat"), element.get("lon")],
                                "lat": element.get("lat"),
                                "lon": element.get("lon"),
                                "type": self._determine_poi_type(tags),
                                "category": tags.get("amenity") or tags.get("tourism") or tags.get("shop") or tags.get("historic", "unknown"),
                                "tags": tags,
                                "distance": self._calculate_distance(lat, lon, element.get("lat"), element.get("lon"))
                            }
                            pois.append(poi)
                    
                    # Sort by distance
                    pois.sort(key=lambda x: x["distance"])
                    return pois[:50]  # Limit to 50 results
                else:
                    return []
            except Exception as e:
                print(f"Error fetching POIs: {e}")
                return []
    
    async def get_route(self, start_coords: Tuple[float, float], end_coords: Tuple[float, float], profile: str = "driving") -> Optional[Dict]:
        """
        Get route between two points using OSRM routing service
        
        Args:
            start_coords: (longitude, latitude) of start point
            end_coords: (longitude, latitude) of end point
            profile: Routing profile (driving, walking, cycling)
        
        Returns:
            Route information with geometry, distance, and duration
        """
        start_lon, start_lat = start_coords
        end_lon, end_lat = end_coords
        
        url = f"{self.routing_url}/{profile}/{start_lon},{start_lat};{end_lon},{end_lat}"
        
        async with httpx.AsyncClient() as client:
            try:
                params = {
                    "overview": "full",
                    "geometries": "geojson",
                    "steps": "true"
                }
                
                response = await client.get(url, params=params, headers=self.headers)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    if data.get("routes"):
                        route = data["routes"][0]
                        return {
                            "distance": route.get("distance", 0),  # in meters
                            "duration": route.get("duration", 0),  # in seconds
                            "geometry": route.get("geometry"),
                            "steps": route.get("legs", [{}])[0].get("steps", []),
                            "start_coordinates": [start_lat, start_lon],
                            "end_coordinates": [end_lat, end_lon]
                        }
                return None
            except Exception as e:
                print(f"Error getting route: {e}")
                return None
    
    def _determine_poi_type(self, tags: Dict) -> str:
        """
        Determine POI type from OSM tags
        """
        if "amenity" in tags:
            amenity = tags["amenity"]
            if amenity in ["restaurant", "cafe", "fast_food", "bar", "pub"]:
                return "food_drink"
            elif amenity in ["bank", "atm", "post_office"]:
                return "finance"
            elif amenity in ["hospital", "pharmacy", "clinic"]:
                return "healthcare"
            else:
                return "amenity"
        elif "tourism" in tags:
            return "tourism"
        elif "shop" in tags:
            return "shopping"
        elif "historic" in tags:
            return "historic"
        else:
            return "other"
    
    def _calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculate distance between two points using Haversine formula
        
        Returns:
            Distance in meters
        """
        R = 6371000  # Earth's radius in meters
        
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        delta_lat = math.radians(lat2 - lat1)
        delta_lon = math.radians(lon2 - lon1)
        
        a = (math.sin(delta_lat / 2) ** 2 +
             math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        
        return R * c