const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function getPersonalizedRecommendations(token) {
  const response = await fetch(`${BACKEND_URL}/api/neighborhood/recommendations`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to get recommendations');
  }

  return data;
}

export async function searchNeighborhood(token, searchParams) {
  const queryParams = new URLSearchParams(searchParams);
  const response = await fetch(`${BACKEND_URL}/api/neighborhood/search?${queryParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Search failed');
  }

  return data;
}

export async function getPlacesByCategory(token, category, city, locality) {
  const queryParams = new URLSearchParams({
    category,
    ...(city && { city }),
    ...(locality && { locality })
  });
  
  const response = await fetch(`${BACKEND_URL}/api/neighborhood/places?${queryParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to get places');
  }

  return data;
}

export const getFilteredContent = async (token, type, filters = {}) => {
  if (!token) {
    throw new Error('Authentication token required');
  }
  
  const params = new URLSearchParams({ type, ...filters });
  const url = `${BACKEND_URL}/api/neighborhood/filter?${params}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    throw new Error(data.message || 'Failed to get filtered content');
  }

  return data;
}

export const getAllContent = async (token, filters = {}) => {
  if (!token) {
    throw new Error('Authentication token required');
  }
  
  const params = new URLSearchParams(filters);
  const url = `${BACKEND_URL}/api/neighborhood/all?${params}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    throw new Error(data.message || 'Failed to get all content');
  }

  return data;
};
