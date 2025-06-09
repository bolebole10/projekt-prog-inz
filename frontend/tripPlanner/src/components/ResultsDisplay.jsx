import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faBus, faCar, faRoute, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import FlightCard from "./FlightCard";
import BusCard from "./BusCard";
import CarCard from "./CarCard";
import NearbyAirports from "./NearbyAirports";
import AlgorithmCard from "./AlgorithmCard";

import { sortFlightResults, sortBusResults } from "../services/sortingService";

const ResultsDisplay = ({
  isSearching,
  activeTab,
  handleTabChange,
  flightSearchResults,
  busSearchResults,
  busSearchResultsReturn,
  carRouteResults,
  algorithmResults,
  algorithmReturnResults,
  selectedLocation,
  selectedDestination,
  sortFilter,
  visibleFlights,
  visibleOutboundFlights,
  visibleReturnFlights,
  visibleBuses,
  setVisibleFlights,
  setVisibleOutboundFlights,
  setVisibleReturnFlights,
  setVisibleBuses,
  setVisibleCars
}) => {
  // Helper function to determine the heading text
  const getHeadingText = () => {
    if (isSearching) {
      return `Searching for Cheapest Route...`;
    }
    
    if (activeTab === "flights") {
      return ((Array.isArray(flightSearchResults) && flightSearchResults.length > 0) || 
        flightSearchResults?.outboundFlights?.length > 0)
        ? "Available Flights"
        : "No flights found for your search criteria";
    } else if (activeTab === "buses") {
      return (Array.isArray(busSearchResults) && busSearchResults.length > 0)
        ? "Available Buses"
        : "No buses found for your search criteria";
    } else if (activeTab === "cars") {
      return carRouteResults 
        ? "Car Route Details"
        : "No car route information available";
    } else if (activeTab === "algoritam") {
      return algorithmResults
        ? "Cheapest Route"
        : "No cheapest route available";
    } 
  };

  return (
    <div className="max-w-5xl mx-auto mt-8" style={{ width: "85%" }}>
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-100 rounded-xl p-1.5 shadow-md">
          <button
            onClick={() => handleTabChange("algoritam")}
            className={`py-3 px-8 rounded-lg font-medium text-base transition-all duration-200 ${
              activeTab === "algoritam"
                ? "bg-white text-teal-600 shadow-sm transform scale-105"
                : "text-gray-600 hover:text-teal-500"
            }`}
          >
            <FontAwesomeIcon icon={faRoute} className="mr-2" /> Cheapest Route
          </button>
          <button
            onClick={() => handleTabChange("flights")}
            className={`py-3 px-8 rounded-lg font-medium text-base transition-all duration-200 ${
              activeTab === "flights"
                ? "bg-white text-teal-600 shadow-sm transform scale-105"
                : "text-gray-600 hover:text-teal-500"
            }`}
          >
            <FontAwesomeIcon icon={faPlane} className="mr-2" /> Flights
          </button>
          <button
            onClick={() => handleTabChange("buses")}
            className={`py-3 px-8 rounded-lg font-medium text-base transition-all duration-200 ${
              activeTab === "buses"
                ? "bg-white text-teal-600 shadow-sm transform scale-105"
                : "text-gray-600 hover:text-teal-500"
            }`}
          >
            <FontAwesomeIcon icon={faBus} className="mr-2" /> Buses
          </button>
          <button
            onClick={() => handleTabChange("cars")}
            className={`py-3 px-8 rounded-lg font-medium text-base transition-all duration-200 ${
              activeTab === "cars"
                ? "bg-white text-teal-600 shadow-sm transform scale-105"
                : "text-gray-600 hover:text-teal-500"
            }`}
          > 
            <FontAwesomeIcon icon={faCar} className="mr-2" /> Car
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold text-teal-700 mb-4">
        {getHeadingText()}
      </h2>

      {/* Display search results based on active tab */}
      {isSearching ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-teal-600"></div>
          <p className="mt-4 text-gray-500">Searching for the best options... This may take 10-20 seconds</p>
          <p className="text-sm text-gray-400">We're comparing multiple routes to find your optimal travel plan</p>
        </div>
      ) : (
        <div className="space-y-4">

          {/* Flight tab content */}
          {activeTab === "flights" && (
            <>
              {/* Handle array response format */}
              {Array.isArray(flightSearchResults) &&
                sortFlightResults(flightSearchResults, sortFilter).slice(0, visibleFlights).map((flight, index) => (
                  <FlightCard
                    key={index}
                    flight={flight}
                    originAirport={selectedLocation}
                    destinationAirport={selectedDestination}
                  />
                ))}
                
              {/* Load more button for array format */}
              {Array.isArray(flightSearchResults) && flightSearchResults.length > visibleFlights && (
                <div className="text-center mt-6">
                  <button 
                    onClick={() => setVisibleFlights(prev => prev + 10)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Load More Results
                  </button>
                </div>
              )}

              {/* Handle object with outbound/return flights format - combine them into a single card */}
              {flightSearchResults?.outboundFlights && flightSearchResults?.returnFlights && 
                sortFlightResults(flightSearchResults.outboundFlights, sortFilter)
                  .slice(0, visibleOutboundFlights)
                  .map((outboundFlight, index) => {
                    // Create a combined flight object with both outbound and return itineraries
                    const combinedFlight = {
                      ...outboundFlight,
                      itineraries: [
                        outboundFlight.itineraries[0],
                        flightSearchResults.returnFlights[Math.min(index, flightSearchResults.returnFlights.length - 1)].itineraries[0]
                      ]
                    };
                    
                    return (
                      <FlightCard
                        key={`combined-${index}`}
                        flight={combinedFlight}
                        originAirport={selectedLocation}
                        destinationAirport={selectedDestination}
                      />
                    );
                  })
              }
              
              {/* Load more button for combined flights */}
              {flightSearchResults?.outboundFlights?.length > visibleOutboundFlights && (
                <div className="text-center mt-6">
                  <button 
                    onClick={() => setVisibleOutboundFlights(prev => prev + 10)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Load More Flights
                  </button>
                </div>
              )}

              {/* If no flights found */}
              {!(Array.isArray(flightSearchResults) && flightSearchResults.length > 0) && 
               !(flightSearchResults?.outboundFlights) && (
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
                  <p className="text-gray-600">No flights found. Try adjusting your search criteria.</p>
                </div>
              )}
            </>
          )}

          {/* Bus tab content */}
          {activeTab === "buses" && (
            <div className="space-y-6">
              {busSearchResults && busSearchResults.length > 0 ? (
                <div>
                  {busSearchResults.slice(0, visibleBuses).map((journey, index) => (
                    <div key={index} className="mb-4">
                      <BusCard 
                        journey={journey} 
                        returnJourney={busSearchResultsReturn && busSearchResultsReturn.length > 0 && index < busSearchResultsReturn.length ? busSearchResultsReturn[index] : null} 
                      />
                    </div>
                  ))}
                  
                  {visibleBuses < busSearchResults.length && (
                    <div className="text-center mt-4">
                      <button
                        onClick={() => setVisibleBuses(prevCount => prevCount + 5)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Load More Buses
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
                  <p className="text-gray-600">No bus routes available for this search.</p>
                </div>
              )}
            </div>
          )}

          {/* Car tab content */}
          {activeTab === "cars" && (
            <div className="space-y-6">
              {carRouteResults ? (
                <>
                  <CarCard carRoute={carRouteResults} />
                  <NearbyAirports 
                    from={carRouteResults.from}
                    to={carRouteResults.to}
                    nearbyAirports={carRouteResults.nearbyAirports}
                  />
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
                  <p className="text-gray-600">No car route information available for this journey.</p>
                </div>
              )}
            </div>
          )}

          {/* Algoritam tab content */}
          {activeTab === "algoritam" && (
            <div className="space-y-6">
              {algorithmResults ? (
                <AlgorithmCard 
                  algorithmResult={algorithmResults} 
                  algorithmReturnResult={algorithmReturnResults}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
                  <p className="text-gray-600">No cheapest route available. Please run a search first.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;