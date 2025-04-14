import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faBus } from "@fortawesome/free-solid-svg-icons";
import FlightCard from "./FlightCard";
import BusCard from "./BusCard";
import { sortFlightResults, sortBusResults } from "../services/sortingService";

const ResultsDisplay = ({
  isSearching,
  activeTab,
  handleTabChange,
  flightSearchResults,
  busSearchResults,
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
  setVisibleBuses
}) => {
  // Helper function to determine the heading text
  const getHeadingText = () => {
    if (isSearching) {
      return `Searching for ${activeTab}...`;
    }
    
    if (activeTab === "flights") {
      return ((Array.isArray(flightSearchResults) && flightSearchResults.length > 0) || 
        flightSearchResults?.outboundFlights?.length > 0)
        ? "Available Flights"
        : "No flights found for your search criteria";
    } else {
      return (Array.isArray(busSearchResults) && busSearchResults.length > 0)
        ? "Available Buses"
        : "No buses found for your search criteria";
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8" style={{ width: "85%" }}>
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-100 rounded-xl p-1.5 shadow-md">
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
        </div>
      </div>

      <h2 className="text-xl font-bold text-teal-700 mb-4">
        {getHeadingText()}
      </h2>

      {/* Display search results based on active tab */}
      {isSearching ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-teal-600"></div>
          <p className="mt-2 text-teal-600">
            Searching for the best {activeTab}...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
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
                    isReturn={false}
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

              {/* Handle object with outbound/return flights format */}
              {flightSearchResults?.outboundFlights && sortFlightResults(flightSearchResults.outboundFlights, sortFilter).slice(0, visibleOutboundFlights).map(
                (flight, index) => (
                  <FlightCard
                    key={`out-${index}`}
                    flight={flight}
                    originAirport={selectedLocation}
                    destinationAirport={selectedDestination}
                    isReturn={false}
                  />
                )
              )}
              
              {/* Load more button for outbound flights */}
              {flightSearchResults?.outboundFlights?.length > visibleOutboundFlights && (
                <div className="text-center mt-6">
                  <button 
                    onClick={() => setVisibleOutboundFlights(prev => prev + 10)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Load More Outbound Flights
                  </button>
                </div>
              )}

              {/* Show return flights header if there are any return flights */}
              {flightSearchResults?.returnFlights?.length > 0 && (
                <h3 className="text-lg font-bold text-teal-600 mt-8 mb-4">
                  Return Flights
                </h3>
              )}

              {/* Return flights */}
              {flightSearchResults?.returnFlights && sortFlightResults(flightSearchResults.returnFlights, sortFilter).slice(0, visibleReturnFlights).map((flight, index) => (
                <FlightCard
                  key={`ret-${index}`}
                  flight={flight}
                  originAirport={selectedDestination} // Note the reversed airports for return flights
                  destinationAirport={selectedLocation}
                  isReturn={true}
                />
              ))}
              
              {/* Load more button for return flights */}
              {flightSearchResults?.returnFlights?.length > visibleReturnFlights && (
                <div className="text-center mt-6">
                  <button 
                    onClick={() => setVisibleReturnFlights(prev => prev + 10)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Load More Return Flights
                  </button>
                </div>
              )}
            </>
          )}

          {/* Bus tab content */}
          {activeTab === "buses" && (
            <div className="space-y-6">
              {Array.isArray(busSearchResults) && busSearchResults.length > 0 ? (
                <>
                  {sortBusResults(busSearchResults, sortFilter).slice(0, visibleBuses).map((journey, index) => (
                    <BusCard
                      key={index}
                      journey={journey}
                    />
                  ))}
                  
                  {/* Load more button for buses */}
                  {busSearchResults.length > visibleBuses && (
                    <div className="text-center mt-6">
                      <button 
                        onClick={() => setVisibleBuses(prev => prev + 10)}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                      >
                        Load More Bus Routes
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
                  <p className="text-gray-600">No bus routes found for this journey.</p>
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
