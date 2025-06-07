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

/**
 * Get car route information between two cities
 * @param {Object} params - Search parameters
 * @param {string} params.from - Origin city
 * @param {string} params.to - Destination city
 * @returns {Promise<Object>} - Car route information
 */
export const getCarRoute = async (params) => {
  try {
    const queryParams = new URLSearchParams({
      from: params.from,
      to: params.to
    });

    const response = await fetch(
      `http://localhost:${BACKEND_PORT}/carroute?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Car route search failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error finding car route:", error);
    throw error;
  }
};

/**
 * Get nearest airport to a city
 * @param {string} city - City name
 * @returns {Promise<Object>} - Nearest airport information
 */
export const getNearestAirport = async (city) => {
  try {
    const response = await fetch(
      `http://localhost:${BACKEND_PORT}/airports/nearest?city=${encodeURIComponent(city)}`
    );

    if (!response.ok) {
      throw new Error("Nearest airport search failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error finding nearest airport:", error);
    throw error;
  }
};

/**
 * Get airports within a radius of a city
 * @param {string} city - City name
 * @param {number} radius - Search radius in km
 * @returns {Promise<Array>} - List of airports in radius
 */
export const getAirportsInRadius = async (city, radius) => {
  try {
    const response = await fetch(
      `http://localhost:${BACKEND_PORT}/airports/in-radius?city=${encodeURIComponent(city)}&radius=${radius}`
    );

    if (!response.ok) {
      throw new Error("Airports in radius search failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error finding airports in radius:", error);
    throw error;
  }
};

export const incrementCityScore = async (city) => {
  try {
    const response = await fetch(
      `http://localhost:${BACKEND_PORT}/increment-city-score?city=${encodeURIComponent(city)}`
    );

    if (!response.ok) {
      throw new Error("City score increment failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error incrementing city score:", error);
    throw error;
  }
};

export const IncrementTripScoreAsync = async (from, to) => {
  try {
    const response = await fetch(
      `http://localhost:${BACKEND_PORT}/increment-trip-score?fromCity=${encodeURIComponent(from)}&toCity=${encodeURIComponent(to)}`
    );

    if (!response.ok) {
      throw new Error("Trip score increment failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error incrementing trip score:", error);
    throw error;
  }
};

/**
 * Get top searched cities
 * @param {number} limit - Maximum number of cities to return (default: 3)
 * @returns {Promise<Array>} - List of popular cities with their scores
 */
// Export as a named export
export const getTopSearchedCities = async (limit = 3) => {
  try {
    const response = await fetch(
      `http://localhost:${BACKEND_PORT}/popular/cities?limit=${limit}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch popular cities");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching popular cities:", error);
    throw error;
  }
};

/**
 * Get top searched trips
 * @param {number} limit - Maximum number of trips to return (default: 3)
 * @returns {Promise<Array>} - List of popular trips with their scores
 */
// Export as a named export
export const getTopSearchedTrips = async (limit = 3) => {
  try {
    const response = await fetch(
      `http://localhost:${BACKEND_PORT}/popular/trips?limit=${limit}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch popular trips");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching popular trips:", error);
    throw error;
  }
};

//POZIV ZA ALGORITAM API
export const getAlgorithmResult = async (city1, city2, date) => {
  try {
    const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : date;
    const queryParams = new URLSearchParams({
      city1: city1,
      city2: city2,
      date: formattedDate
    });
    const response = await fetch(`http://localhost:${BACKEND_PORT}/algoritam?${queryParams.toString()}`);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching algorithm routes:', errorData);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getAlgorithmRoutes:", error);
    throw error;
  }
};


//POZIV ZA API OPTIMAL TRIP
export const getOptimalTrip = async (from, to, departureAfter, optimizeFor) => {
  try {
    const formattedDepartureAfter = departureAfter instanceof Date ? departureAfter.toISOString() : departureAfter;
    const queryParams = new URLSearchParams({
      from: from,
      to: to,
      departureAfter: formattedDepartureAfter,
      optimizeFor: optimizeFor
    });
    const response = await fetch(`http://localhost:${BACKEND_PORT}/api/optimal-trip?${queryParams.toString()}`);
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.title || JSON.stringify(errorData) || errorMessage;
      } catch (e) {
        errorMessage = `${errorMessage}, ${response.statusText}`;
      }
      console.error('Error fetching optimal trip:', errorMessage);
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getOptimalTrip:", error.message);
    throw error;
  }
};