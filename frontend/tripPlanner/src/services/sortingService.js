/**
 * Sort flight results based on the selected filter
 * @param {Array} flights - Array of flight objects
 * @param {String} sortFilter - Filter type: price, earliest, or duration
 * @returns {Array} - Sorted array of flights
 */
export const sortFlightResults = (flights, sortFilter) => {
  if (!flights || !Array.isArray(flights) || flights.length === 0 || !sortFilter) {
    return flights;
  }
  
  return [...flights].sort((a, b) => {
    if (sortFilter === "price") {
      // Sort by price (lowest first)
      const priceA = a.price?.total ? parseFloat(a.price.total) : Infinity;
      const priceB = b.price?.total ? parseFloat(b.price.total) : Infinity;
      return priceA - priceB;
    } 
    else if (sortFilter === "earliest") {
      // Sort by departure time (earliest first)
      const itineraryA = a.itineraries?.[0] || {};
      const itineraryB = b.itineraries?.[0] || {};
      const segmentA = itineraryA.segments?.[0] || {};
      const segmentB = itineraryB.segments?.[0] || {};
      
      const departureA = segmentA.departure?.at || a.departureTime || "";
      const departureB = segmentB.departure?.at || b.departureTime || "";
      
      return new Date(departureA) - new Date(departureB);
    } 
    else if (sortFilter === "duration") {
      // Sort by duration (shortest first)
      const itineraryA = a.itineraries?.[0] || {};
      const itineraryB = b.itineraries?.[0] || {};
      
      // Extract duration in minutes
      const getDurationMinutes = (durationStr) => {
        if (!durationStr) return Infinity;
        
        // Handle PT10H30M format
        if (durationStr.includes('PT')) {
          const hours = parseInt(durationStr.match(/(?<=PT)(\d+)(?=H)/) || [0], 10);
          const minutes = parseInt(durationStr.match(/(?<=H)(\d+)(?=M)/) || [0], 10);
          return hours * 60 + minutes;
        }
        
        // Handle 2h 30m format
        const hours = parseInt(durationStr.match(/(\d+)(?=h)/) || [0], 10);
        const minutes = parseInt(durationStr.match(/(\d+)(?=m)/) || [0], 10);
        return hours * 60 + minutes;
      };
      
      const durationA = getDurationMinutes(itineraryA.duration || a.duration || "");
      const durationB = getDurationMinutes(itineraryB.duration || b.duration || "");
      
      return durationA - durationB;
    }
    
    return 0;
  });
};

/**
 * Sort bus journey results based on the selected filter
 * @param {Array} journeys - Array of bus journey objects
 * @param {String} sortFilter - Filter type: price, earliest, or duration
 * @returns {Array} - Sorted array of bus journeys
 */
export const sortBusResults = (journeys, sortFilter) => {
  if (!journeys || !Array.isArray(journeys) || journeys.length === 0 || !sortFilter) {
    return journeys;
  }
  
  return [...journeys].sort((a, b) => {
    if (sortFilter === "price") {
      // Sort by price (lowest first)
      const priceA = a.fares && a.fares.length > 0 ? parseFloat(a.fares[0].price) : Infinity;
      const priceB = b.fares && b.fares.length > 0 ? parseFloat(b.fares[0].price) : Infinity;
      return priceA - priceB;
    } 
    else if (sortFilter === "earliest") {
      // Sort by departure time (earliest first)
      const departureA = a.dep_offset || "";
      const departureB = b.dep_offset || "";
      return new Date(departureA) - new Date(departureB);
    } 
    else if (sortFilter === "duration") {
      // Extract duration in minutes
      const getDurationMinutes = (durationStr) => {
        if (!durationStr) return Infinity;
        
        // Parse duration string (e.g., "5h 30m")
        const hours = parseInt(durationStr.match(/(\d+)(?=h)/) || [0], 10);
        const minutes = parseInt(durationStr.match(/(\d+)(?=m)/) || [0], 10);
        return hours * 60 + minutes;
      };
      
      const durationA = getDurationMinutes(a.duration || "");
      const durationB = getDurationMinutes(b.duration || "");
      
      return durationA - durationB;
    }
    
    return 0;
  });
};
