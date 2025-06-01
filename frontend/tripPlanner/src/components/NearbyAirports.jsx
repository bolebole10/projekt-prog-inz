import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";

const NearbyAirports = ({ from, to, nearbyAirports }) => {
  const [activeTab, setActiveTab] = useState("origin");
  const [showAllAirports, setShowAllAirports] = useState(false);
  
  // Get limited list of airports
  const getDisplayedAirports = (airportsList) => {
    if (!airportsList) return [];
    return showAllAirports ? airportsList : airportsList.slice(0, 6);
  };
  
  // Get origin airports to display
  const originAirports = nearbyAirports?.origin ? getDisplayedAirports(nearbyAirports.origin) : [];
  
  // Get destination airports to display
  const destinationAirports = nearbyAirports?.destination ? getDisplayedAirports(nearbyAirports.destination) : [];
  
  // Check if there are more airports than what's displayed
  const hasMoreOriginAirports = nearbyAirports?.origin && nearbyAirports.origin.length > 6 && !showAllAirports;
  const hasMoreDestinationAirports = nearbyAirports?.destination && nearbyAirports.destination.length > 6 && !showAllAirports;

  if (!nearbyAirports || (!nearbyAirports.origin && !nearbyAirports.destination)) {
    return null;
  }

  return (
    <div className="nearby-airports-card bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mt-6">
      <div className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-6 py-4">
        <h3 className="text-lg font-semibold">Nearby Airports</h3>
        <p className="text-sm opacity-80">Find airports near your origin and destination</p>
      </div>
      
      {/* Tabs for Origin/Destination airports */}
      <div className="flex border-b px-6">
        <button
          onClick={() => setActiveTab("origin")}
          className={`py-3 px-5 font-medium transition-all duration-200 relative ${
            activeTab === "origin" 
              ? "text-teal-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {from} Airports
          {activeTab === "origin" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("destination")}
          className={`py-3 px-5 font-medium transition-all duration-200 relative ${
            activeTab === "destination" 
              ? "text-teal-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {to} Airports
          {activeTab === "destination" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500"></span>
          )}
        </button>
      </div>
      
      {/* Display airports based on active tab */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === "origin" && originAirports.map((airport, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-50 p-3 mr-3">
                  <FontAwesomeIcon icon={faPlane} className="text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{airport.airportName}</h4>
                  <p className="text-sm text-gray-600">Distance: {airport.distanceKm.toFixed(2)} km</p>
                  <div className="mt-1 inline-block bg-gray-100 text-xs font-medium text-gray-800 px-2 py-0.5 rounded">
                    {airport.iata}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {activeTab === "destination" && destinationAirports.map((airport, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-50 p-3 mr-3">
                  <FontAwesomeIcon icon={faPlane} className="text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{airport.airportName}</h4>
                  <p className="text-sm text-gray-600">Distance: {airport.distanceKm.toFixed(2)} km</p>
                  <div className="mt-1 inline-block bg-gray-100 text-xs font-medium text-gray-800 px-2 py-0.5 rounded">
                    {airport.iata}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* No airports message */}
          {activeTab === "origin" && originAirports.length === 0 && (
            <div className="col-span-3 text-center p-8 bg-gray-50 rounded-lg">
              <FontAwesomeIcon icon={faPlane} className="text-gray-300 text-4xl mb-2" />
              <p className="text-gray-500">No airports found near {from}</p>
            </div>
          )}
          
          {activeTab === "destination" && destinationAirports.length === 0 && (
            <div className="col-span-3 text-center p-8 bg-gray-50 rounded-lg">
              <FontAwesomeIcon icon={faPlane} className="text-gray-300 text-4xl mb-2" />
              <p className="text-gray-500">No airports found near {to}</p>
            </div>
          )}
        </div>
        
        {/* Show more/less button */}
        {(activeTab === "origin" && hasMoreOriginAirports) || 
         (activeTab === "destination" && hasMoreDestinationAirports) ? (
          <div className="text-center mt-6">
            <button 
              onClick={() => setShowAllAirports(true)}
              className="bg-teal-50 text-teal-600 hover:bg-teal-100 px-6 py-2 rounded-full text-sm font-medium border border-teal-200 transition-colors"
            >
              Show All Airports
            </button>
          </div>
        ) : (
          showAllAirports && (
            <div className="text-center mt-6">
              <button 
                onClick={() => setShowAllAirports(false)}
                className="bg-teal-50 text-teal-600 hover:bg-teal-100 px-6 py-2 rounded-full text-sm font-medium border border-teal-200 transition-colors"
              >
                Show Less
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default NearbyAirports;