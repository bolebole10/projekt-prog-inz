import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlaneDeparture, faPlaneArrival, faCoins, faClock, faRoute } from '@fortawesome/free-solid-svg-icons';

const AlgorithmCard = ({ algorithmResult, algorithmReturnResult }) => {
  // Format the date and time
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleString('en-US', {
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateTimeStr;
    }
  };

  // Format duration
  const formatDuration = (durationStr) => {
    if (!durationStr || durationStr === "N/A") return "N/A";
    
    // Extract hours and minutes if in PT10H30M format
    if (durationStr.includes('PT')) {
      const hours = durationStr.match(/(\d+)H/)?.[1] || "0";
      const minutes = durationStr.match(/(\d+)M/)?.[1] || "0";
      return `${hours}h ${minutes}m`;
    }
    
    return durationStr;
  };

  if (!algorithmResult) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
        <p className="text-gray-600">No algorithm results available.</p>
      </div>
    );
  }

  const { 
    fromCity, 
    toCity, 
    date, 
    cheapestFlight, 
    departureAirport, 
    arrivalAirport,
    costBreakdown,
    summary
  } = algorithmResult;

  const formattedDepartureTime = formatDateTime(summary?.departureTime);
  const formattedArrivalTime = formatDateTime(summary?.arrivalTime);
  const formattedDuration = formatDuration(summary?.duration);

  // Check if we have a return trip to display
  const hasReturn = algorithmReturnResult && Object.keys(algorithmReturnResult).length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition hover:shadow-lg">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-5">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 md:mb-0">
            {fromCity} to {toCity} {hasReturn ? '(Round trip)' : ''}
          </h2>
          <div className="bg-teal-50 text-teal-700 font-semibold px-4 py-2 rounded-full">
            <FontAwesomeIcon icon={faCoins} className="mr-2" />
            Total: €{costBreakdown?.totalCost?.toFixed(2)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-5">
          {/* Left side - Departure */}
          <div className="flex items-start">
            <div className="mr-3 text-teal-600">
              <FontAwesomeIcon icon={faPlaneDeparture} size="lg" />
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Departure</h3>
              <p className="text-lg font-semibold">{formattedDepartureTime}</p>
              <p>{departureAirport?.airportName}</p>
              <p className="text-sm text-gray-600">({departureAirport?.iata})</p>
            </div>
          </div>

          {/* Middle - Flight Info */}
          <div className="flex flex-col items-center justify-center border-l border-r border-gray-200 px-4">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faClock} className="text-gray-500 mr-2" />
              <span className="font-medium">{formattedDuration}</span>
            </div>
            <div className="w-full py-2">
              <div className="relative h-0.5 bg-gray-300 w-full">
                <div className="absolute left-0 top-0 transform -translate-y-1/2">
                  <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
                </div>
                <div className="absolute right-0 top-0 transform -translate-y-1/2">
                  <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="text-sm text-center text-gray-600 mt-2">
              <p>Airline: {cheapestFlight?.carrierCode || "N/A"}</p>
              <div className="flex items-center justify-center mt-2">
                <FontAwesomeIcon icon={faRoute} className="text-gray-500 mr-2" />
                <span>{summary?.connections?.join(", ") || "Direct"}</span>
              </div>
            </div>
          </div>

          {/* Right side - Arrival */}
          <div className="flex items-start">
            <div className="mr-3 text-teal-600">
              <FontAwesomeIcon icon={faPlaneArrival} size="lg" />
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Arrival</h3>
              <p className="text-lg font-semibold">{formattedArrivalTime}</p>
              <p>{arrivalAirport?.airportName}</p>
              <p className="text-sm text-gray-600">({arrivalAirport?.iata})</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Cost Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">Flight</p>
              <p className="font-semibold">€{costBreakdown?.flightPrice?.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">To Airport (driving)</p>
              <p className="font-semibold">€{costBreakdown?.drivingToDeparture?.toFixed(2)}</p>
              <p className="text-sm text-gray-600">{departureAirport?.distanceKm} km</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">From Airport (driving)</p>
              <p className="font-semibold">€{costBreakdown?.drivingFromArrival?.toFixed(2)}</p>
              <p className="text-sm text-gray-600">{arrivalAirport?.distanceKm} km</p>
            </div>
          </div>
        </div>

        {/* Return Trip Section */}
        {hasReturn && (
          <>
            <div className="border-t border-dashed border-gray-300 my-6"></div>
            <div className="bg-blue-50 px-4 py-2 mb-5 rounded-md">
              <h3 className="text-lg font-semibold text-blue-800">Return Trip</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-5">
              {/* Left side - Departure */}
              <div className="flex items-start">
                <div className="mr-3 text-blue-600">
                  <FontAwesomeIcon icon={faPlaneDeparture} size="lg" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Departure</h3>
                  <p className="text-lg font-semibold">{formatDateTime(algorithmReturnResult?.summary?.departureTime)}</p>
                  <p>{algorithmReturnResult?.departureAirport?.airportName}</p>
                  <p className="text-sm text-gray-600">({algorithmReturnResult?.departureAirport?.iata})</p>
                </div>
              </div>

              {/* Middle - Flight Info */}
              <div className="flex flex-col items-center justify-center border-l border-r border-gray-200 px-4">
                <div className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faClock} className="text-gray-500 mr-2" />
                  <span className="font-medium">{formatDuration(algorithmReturnResult?.summary?.duration)}</span>
                </div>
                <div className="w-full py-2">
                  <div className="relative h-0.5 bg-gray-300 w-full">
                    <div className="absolute left-0 top-0 transform -translate-y-1/2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="absolute right-0 top-0 transform -translate-y-1/2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-center text-gray-600 mt-2">
                  <p>Airline: {algorithmReturnResult?.cheapestFlight?.carrierCode || "N/A"}</p>
                  <div className="flex items-center justify-center mt-2">
                    <FontAwesomeIcon icon={faRoute} className="text-gray-500 mr-2" />
                    <span>{algorithmReturnResult?.summary?.connections?.join(", ") || "Direct"}</span>
                  </div>
                </div>
              </div>

              {/* Right side - Arrival */}
              <div className="flex items-start">
                <div className="mr-3 text-blue-600">
                  <FontAwesomeIcon icon={faPlaneArrival} size="lg" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Arrival</h3>
                  <p className="text-lg font-semibold">{formatDateTime(algorithmReturnResult?.summary?.arrivalTime)}</p>
                  <p>{algorithmReturnResult?.arrivalAirport?.airportName}</p>
                  <p className="text-sm text-gray-600">({algorithmReturnResult?.arrivalAirport?.iata})</p>
                </div>
              </div>
            </div>

            {/* Return Cost Breakdown */}
            <div className="mt-6 pt-5 border-t border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3">Return Trip Cost Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Flight</p>
                  <p className="font-semibold">€{algorithmReturnResult?.costBreakdown?.flightPrice?.toFixed(2)}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-600">To Airport (driving)</p>
                  <p className="font-semibold">€{algorithmReturnResult?.costBreakdown?.drivingToDeparture?.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{algorithmReturnResult?.departureAirport?.distanceKm} km</p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-600">From Airport (driving)</p>
                  <p className="font-semibold">€{algorithmReturnResult?.costBreakdown?.drivingFromArrival?.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{algorithmReturnResult?.arrivalAirport?.distanceKm} km</p>
                </div>
              </div>
            </div>

            {/* Total Cost for Round Trip */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Total Round Trip Cost</h3>
                <div className="bg-teal-100 text-teal-800 font-semibold px-4 py-2 rounded-full">
                  <FontAwesomeIcon icon={faCoins} className="mr-2" />
                  €{(costBreakdown?.totalCost + algorithmReturnResult?.costBreakdown?.totalCost).toFixed(2)}
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default AlgorithmCard;
