from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from services.location_service import LocationService

router = APIRouter()
location_service = LocationService()

@router.get("/search")
async def search_locations(
    query: str = Query(..., description="Location search query"),
    limit: int = Query(10, ge=1, le=50, description="Maximum number of results")
):
    """
    Search for locations using OpenStreetMap Nominatim API
    
    - **query**: The location name or address to search for
    - **limit**: Maximum number of results to return (1-50)
    """
    try:
        results = await location_service.search_locations(query, limit)
        return {
            "success": True,
            "data": results,
            "count": len(results)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error searching locations: {str(e)}"
        )

@router.get("/geocode")
async def geocode_location(
    address: str = Query(..., description="Address to geocode"),
    limit: int = Query(1, ge=1, le=10, description="Maximum number of results")
):
    """
    Geocode an address to get coordinates
    
    - **address**: The address to geocode
    - **limit**: Maximum number of results to return (1-10)
    """
    try:
        results = await location_service.search_locations(address, limit)
        if not results:
            raise HTTPException(
                status_code=404,
                detail="Location not found"
            )
        
        return {
            "success": True,
            "data": results[0] if results else None,
            "coordinates": {
                "lat": float(results[0]["lat"]) if results else None,
                "lon": float(results[0]["lon"]) if results else None
            } if results else None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error geocoding location: {str(e)}"
        )

@router.get("/reverse-geocode")
async def reverse_geocode(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude")
):
    """
    Reverse geocode coordinates to get address information
    
    - **lat**: Latitude coordinate
    - **lon**: Longitude coordinate
    """
    try:
        result = await location_service.reverse_geocode(lat, lon)
        if not result:
            raise HTTPException(
                status_code=404,
                detail="Address not found for the given coordinates"
            )
        
        return {
            "success": True,
            "data": result
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reverse geocoding: {str(e)}"
        )

@router.get("/nearby-pois")
async def get_nearby_pois(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    radius: int = Query(1000, ge=100, le=5000, description="Search radius in meters"),
    poi_types: Optional[str] = Query(None, description="Comma-separated POI types (restaurant,hotel,tourist,shop,amenity)")
):
    """
    Get nearby points of interest around a location
    
    - **lat**: Latitude coordinate
    - **lon**: Longitude coordinate
    - **radius**: Search radius in meters (100-5000)
    - **poi_types**: Comma-separated list of POI types to search for
    """
    try:
        poi_type_list = None
        if poi_types:
            poi_type_list = [t.strip() for t in poi_types.split(",")]
        
        results = await location_service.get_nearby_pois(lat, lon, radius, poi_type_list)
        
        return {
            "success": True,
            "data": results,
            "count": len(results),
            "search_params": {
                "center": [lat, lon],
                "radius": radius,
                "poi_types": poi_type_list
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching nearby POIs: {str(e)}"
        )

@router.get("/route")
async def get_route(
    start_lat: float = Query(..., description="Start latitude"),
    start_lon: float = Query(..., description="Start longitude"),
    end_lat: float = Query(..., description="End latitude"),
    end_lon: float = Query(..., description="End longitude"),
    profile: str = Query("driving", description="Routing profile (driving, walking, cycling)")
):
    """
    Get route between two points
    
    - **start_lat**: Starting point latitude
    - **start_lon**: Starting point longitude
    - **end_lat**: Destination latitude
    - **end_lon**: Destination longitude
    - **profile**: Transportation mode (driving, walking, cycling)
    """
    try:
        if profile not in ["driving", "walking", "cycling"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid profile. Must be one of: driving, walking, cycling"
            )
        
        route = await location_service.get_route(
            (start_lon, start_lat),
            (end_lon, end_lat),
            profile
        )
        
        if not route:
            raise HTTPException(
                status_code=404,
                detail="Route not found between the specified points"
            )
        
        return {
            "success": True,
            "data": route,
            "profile": profile
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating route: {str(e)}"
        )