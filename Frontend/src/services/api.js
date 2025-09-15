// API service for backend communication
const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Location Services
  async searchLocations(query, limit = 10) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=${limit}&addressdetails=1&extratags=1`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to search locations');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Location search error:', error);
      return { success: false, error: error.message };
    }
  }

  async geocodeLocation(address, limit = 1) {
    const params = new URLSearchParams({
      address,
      limit: limit.toString()
    });
    
    return this.request(`/locations/geocode?${params}`);
  }

  async reverseGeocode(lat, lon) {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString()
    });
    
    return this.request(`/locations/reverse-geocode?${params}`);
  }

  async getNearbyPOIs(lat, lon, radius = 1000, poiTypes = null) {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      radius: radius.toString()
    });
    
    if (poiTypes && poiTypes.length > 0) {
      params.append('poi_types', poiTypes.join(','));
    }
    
    return this.request(`/locations/nearby-pois?${params}`);
  }

  async getRoute(startLat, startLon, endLat, endLon, profile = 'driving') {
    const params = new URLSearchParams({
      start_lat: startLat.toString(),
      start_lon: startLon.toString(),
      end_lat: endLat.toString(),
      end_lon: endLon.toString(),
      profile
    });
    
    return this.request(`/locations/route?${params}`);
  }

  // AI Planner Services
  async generateTravelPlan(planRequest) {
    return this.request('/ai/generate-plan', {
      method: 'POST',
      body: JSON.stringify(planRequest)
    });
  }

  async chatWithAI(chatRequest) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(chatRequest)
    });
  }

  async getChatHistory(userId) {
    return this.request(`/ai/history/${userId}`);
  }

  async checkAIHealth() {
    return this.request('/ai/health');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for convenience
export const {
  searchLocations,
  geocodeLocation,
  reverseGeocode,
  getNearbyPOIs,
  getRoute,
  generateTravelPlan,
  chatWithAI,
  getChatHistory,
  checkAIHealth,
  healthCheck
} = apiService;