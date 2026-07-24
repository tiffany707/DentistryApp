const { createClient } = require("@google/maps");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const googleMapsClient = createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise,
});

/**
 * Converts a text address into a [longitude, latitude] GeoJSON array
 * @param {string} addressString - e.g., "123 4 Ave SW, Calgary, AB"
 * @returns {Promise<number[]>} - [longitude, latitude]
 */
async function getCoordinatesFromAddress(addressString) {
  try {
    const response = await googleMapsClient.geocode({
      key: process.env.GOOGLE_MAPS_API_KEY,
      address: addressString,
    }).asPromise();

    const results = response.json.results;
    
    if (!results || results.length === 0) {
      throw new Error("No location found for this address.");
    }

    const location = results[0].geometry.location;
    // Google returns { lat, lng }, but Mongoose GeoJSON requires [longitude, latitude]
    return [location.lng, location.lat];

  } catch (error) {
    console.error("Geocoding error:", error);
    throw error;
  }
}

module.exports = { getCoordinatesFromAddress };