const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Match endpoints
  async getMatches() {
    return this.request('/matches');
  }

  async getLiveMatches() {
    return this.request('/matches/live');
  }

  async getMatch(matchId) {
    return this.request(`/matches/${matchId}`);
  }

  async createMatch(matchData) {
    return this.request('/matches', {
      method: 'POST',
      body: JSON.stringify(matchData),
    });
  }

  async updateMatch(matchId, matchData) {
    return this.request(`/matches/${matchId}`, {
      method: 'PUT',
      body: JSON.stringify(matchData),
    });
  }

  async deleteMatch(matchId) {
    return this.request(`/matches/${matchId}`, {
      method: 'DELETE',
    });
  }

  // Event endpoints
  async addEvent(matchId, event) {
    return this.request(`/matches/${matchId}/events`, {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  // Score endpoints
  async updateScores(matchId, scoreA, scoreB) {
    return this.request(`/matches/${matchId}/scores`, {
      method: 'PATCH',
      body: JSON.stringify({ scoreA, scoreB }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService(); 