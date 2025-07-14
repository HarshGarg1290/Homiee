// Frontend API for saved flats functionality

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Generate a unique flat ID based on flat details (same as backend)
export function generateFlatId(flatData) {
  const { City, 'Sub region': subregion, BHK, Budget, Gender } = flatData;
  return `${City}-${subregion}-${BHK}-${Budget}-${Gender}`.replace(/\s+/g, '-').toLowerCase();
}

// Save a flat
export async function saveFlat(userId, flatData) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/saved-flats/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        flatData
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      // If it's a 409 conflict (already saved), include that info in the error
      if (response.status === 409) {
        const error = new Error(data.error || 'Flat is already saved');
        error.status = 409;
        error.isSaved = data.isSaved;
        throw error;
      }
      throw new Error(data.error || 'Failed to save flat');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Remove a saved flat
export async function unsaveFlat(userId, flatId) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/saved-flats/unsave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        flatId
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to unsave flat');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Get all saved flats for a user
export async function getSavedFlats(userId) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/saved-flats/${userId}`);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get saved flats');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Check if a flat is saved
export async function checkFlatSaved(userId, flatId) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/saved-flats/check?userId=${userId}&flatId=${flatId}`);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to check if flat is saved');
    }

    return data.isSaved;
  } catch (error) {
    return false; // Default to not saved if error
  }
}
