/**
 * Haversine formula to calculate distance between two points (in km)
 */
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find nearest salon to a given lat/lon
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @param {Array} salons - Array of salon objects (must have lat, lon)
 * @returns {Object} Nearest salon with distance, or null
 */
export function findNearestSalon(userLat, userLon, salons) {
  if (!userLat || !userLon || !Array.isArray(salons) || salons.length === 0) {
    return null;
  }

  let nearest = null;
  let minDistance = Infinity;

  for (const salon of salons) {
    if (salon.lat && salon.lon) {
      const distance = haversine(userLat, userLon, salon.lat, salon.lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = { ...salon, distance: Math.round(distance) };
      }
    }
  }

  return nearest;
}

/**
 * Get user's location via IP geolocation (no browser permission needed)
 * @returns {Promise<Object>} Object with latitude, longitude, city, region
 */
export async function getUserLocationFromIP() {
  try {
    // Try Netlify function first (works on production)
    try {
      const response = await fetch('/.netlify/functions/whoami', { timeout: 3000 });
      if (response.ok) {
        const data = await response.json();
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city,
          region: data.region,
          country: data.country,
        };
      }
    } catch (netlifyError) {
      // Fallback: use ipapi.co directly (works everywhere)
      console.log('Netlify function not available, using fallback API');
    }

    // Fallback to direct API call
    const response = await fetch('https://ipapi.co/json/', {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      region: data.region,
      country: data.country_name,
    };
  } catch (error) {
    console.error('Error fetching user location:', error);
    return null;
  }
}
