import { BACKEND_PORT } from "../config";
/**
 * Search for airports based on a query string
 * @param {string} query - The search query
 * @returns {Promise<Array>} - Array of matching airports
 */
export const searchAirports = async (query) => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `http://localhost:${BACKEND_PORT}/search-airports?query=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch airports");
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching airports:", error);
    throw error;
  }
};

/**
 * Format date for bus parameters (from YYYY-MM-DD to DD.MM.YYYY)
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} - Date in DD.MM.YYYY format
 */
export const formatDateForBus = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`; // Format as 13.04.2025
};

/**
 * Search for flights between two locations
 * @param {Object} params - Search parameters
 * @param {string} params.origin - Origin IATA code
 * @param {string} params.destination - Destination IATA code
 * @param {string} params.date - Departure date (YYYY-MM-DD)
 * @param {string} params.returnDate - Return date for round trips (YYYY-MM-DD)
 * @returns {Promise<Object>} - Flight search results
 */
export const searchFlights = async (params) => {
  try {
    console.log("Flight search params:", params);
    const queryParams = new URLSearchParams({
      origin: params.origin,
      destination: params.destination,
      date: params.date,
    });

    let response;

    if (params.returnDate) {
      queryParams.append("returnDate", params.returnDate);
      response = await fetch(
        `http://localhost:${BACKEND_PORT}/flights-return?${queryParams.toString()}`
      );
    } else {
      response = await fetch(
        `http://localhost:${BACKEND_PORT}/flights?${queryParams.toString()}`
      );
    }

    if (!response.ok) {
      throw new Error("Flight search failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching flights:", error);
    throw error;
  }
};

/**
 * Search for bus journeys between two cities
 * @param {Object} params - Search parameters
 * @param {string} params.from - Origin city
 * @param {string} params.to - Destination city
 * @param {string} params.date - Departure date (YYYY-MM-DD)
 * @param {string} params.returnDate - Return date for round trips (YYYY-MM-DD)
 * @returns {Promise<Object>} - Bus search results
 */
export const searchBuses = async (params) => {
  try {
    // Build query parameters with formatted dates
    const queryParams = new URLSearchParams({
      from: params.from,
      to: params.to,
      date: formatDateForBus(params.date),
    });

    // Add return date if provided
    if (params.returnDate) {
      queryParams.append("returnDate", formatDateForBus(params.returnDate));
    }

    const response = await fetch(
      `http://localhost:${BACKEND_PORT}/flixbus/trips-by-city?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Bus search failed");
    }

    const results = await response.json();
    return results;
  } catch (error) {
    console.error("Error searching buses:", error);
    throw error;
  }
};
