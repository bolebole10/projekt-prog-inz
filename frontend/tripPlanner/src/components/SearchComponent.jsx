import React, { useState, useEffect } from "react";
import { BACKEND_PORT } from "../config";
import FlightCard from "./FlightCard"; 
import BusCard from "./BusCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faBus } from "@fortawesome/free-solid-svg-icons";

const SearchComponent = () => {
  // Input field displayed values
  const [destination, setDestination] = useState("");
  const [location, setLocation] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tripType, setTripType] = useState("roundTrip"); // "roundTrip" or "oneWay"

  // Store the full airport objects for IATA codes
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [showDestinationList, setShowDestinationList] = useState(false);
  const [showLocationList, setShowLocationList] = useState(false);

  const [filteredAirports, setFilteredAirports] = useState([]);
  const [isLoadingAirports, setIsLoadingAirports] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Add new state for search results
  const [flightSearchResults, setFlightSearchResults] = useState([]);
  const [busSearchResults, setBusSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // State for active tab (flights or buses)
  const [activeTab, setActiveTab] = useState("flights");
  
  // Pagination state
  const [visibleFlights, setVisibleFlights] = useState(10);
  const [visibleOutboundFlights, setVisibleOutboundFlights] = useState(10);
  const [visibleReturnFlights, setVisibleReturnFlights] = useState(10);
  const [visibleBuses, setVisibleBuses] = useState(10);

  // Function to fetch airport suggestions for both fields
  const fetchAirports = async (query) => {
    if (!query || query.length < 2) {
      setFilteredAirports([]);
      return;
    }

    setIsLoadingAirports(true);
    try {
      const response = await fetch(
        `http://localhost:${BACKEND_PORT}/search-airports?query=${encodeURIComponent(
          query
        )}`
      );
      if (!response.ok) throw new Error("Failed to fetch airports");

      const data = await response.json();
      setFilteredAirports(data || []);
    } catch (error) {
      console.error("Error fetching airports:", error);
      setFilteredAirports([]);
    } finally {
      setIsLoadingAirports(false);
    }
  };

  // Debounce function to prevent too many API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Create debounced version of fetch function
  const debouncedFetchAirports = debounce(fetchAirports, 300);

  // Handle selection for destination
  const handleSelectDestination = (airport) => {
    setDestination(airport.name);
    setSelectedDestination(airport);
    setShowDestinationList(false);
  };

  // Handle selection for location
  const handleSelectLocation = (airport) => {
    setLocation(airport.name);
    setSelectedLocation(airport);
    setShowLocationList(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const closeListOnClickOutside = (e) => {
      if (e.target.closest(".search-component") === null) {
        setShowDestinationList(false);
        setShowLocationList(false);
      }
    };
    document.addEventListener("click", closeListOnClickOutside);
    return () => {
      document.removeEventListener("click", closeListOnClickOutside);
    };
  }, []);

  // Function to render airport item
  const renderAirportItem = (airport) => (
    <div>
      <div className="font-medium">{airport.name}</div>
      <div className="text-sm text-gray-500">
        {airport.city} ({airport.iataCode})
      </div>
    </div>
  );

  // Toggle trip type function
  const toggleTripType = (type) => {
    setTripType(type);
    if (type === "oneWay") {
      setToDate("");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetPagination();
  };

  // Reset pagination when changing tabs or performing new search
  const resetPagination = () => {
    setVisibleFlights(10);
    setVisibleOutboundFlights(10);
    setVisibleReturnFlights(10);
    setVisibleBuses(10);
  };

  // Format date for bus parameters (from YYYY-MM-DD to DD.M.YYYY)
  const formatDateForBus = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`; //always like 13.04.2025
  };
  
  // Function to handle the search submission
  const handleSearch = async () => {
    if (!selectedLocation || !selectedDestination || !fromDate) {
      alert("Please fill in all required fields");
      return;
    }

    if (tripType === "roundTrip" && !toDate) {
      alert("Please select a return date");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    resetPagination();

    try {
      // Build query parameters
      const params = new URLSearchParams({
        origin: selectedLocation.iataCode,
        destination: selectedDestination.iataCode,
        date: fromDate,
      });

      // Create bus parameters with formatted date
      const busParams = new URLSearchParams({
        from: selectedLocation.city,
        to: selectedDestination.city,
        date: formatDateForBus(fromDate),
      });

      // Fetch bus data
      const busResponse = await fetch(
        `http://localhost:${BACKEND_PORT}/flixbus/trips-by-city?${busParams.toString()}`
      );
      
      if (!busResponse.ok) throw new Error("Bus search failed");
      const busResults = await busResponse.json();
      

      if (busResults && busResults.journeys) {
        setBusSearchResults(busResults.journeys);
      } else {
        console.log("No bus data found in the response");
        setBusSearchResults([]);
      }

      // Add return date only for round trips
      if (tripType === "roundTrip") {
        params.append("returnDate", toDate);
      }

      const flightResponse = await fetch(
        `http://localhost:${BACKEND_PORT}/flights?${params.toString()}`
      );

      if (!flightResponse.ok) throw new Error("Search failed");

      const flightResults = await flightResponse.json();

      if (flightResults && flightResults.data) {
        setFlightSearchResults(flightResults.data);
        setHasSearched(true);
      } else {
        console.log("No flight data found in the response");
        setFlightSearchResults([]);
      }
    } catch (error) {
      console.error("Error performing search:", error);
      alert("Search failed. Please try again.");
      setFlightSearchResults([]);
      setBusSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 py-8 px-4">
      <div
        className="max-w-4xl mx-auto rounded-xl shadow-xl bg-white/90 backdrop-blur-md p-8 search-component"
        style={{ width: "80%" }}
      >
        <h2 className="text-2xl font-bold text-teal-700 mb-6 text-center">
          Plan Your Journey 🌍
        </h2>

        {/* Trip Type Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => toggleTripType("roundTrip")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                tripType === "roundTrip"
                  ? "bg-teal-600 text-white"
                  : "bg-teal-100 text-teal-900 hover:bg-teal-200"
              }`}
            >
              Round Trip
            </button>
            <button
              type="button"
              onClick={() => toggleTripType("oneWay")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                tripType === "oneWay"
                  ? "bg-teal-600 text-white"
                  : "bg-teal-100 text-teal-900 hover:bg-teal-200"
              }`}
            >
              One Way
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Location */}
          <div className="relative w-full">
            <label className="block text-sm font-bold mb-2 text-teal-600">
              Location
            </label>
            <div className="relative">
              <i className="absolute left-3 top-2.5 text-teal-500 fa fa-map-marker-alt"></i>
              <input
                type="text"
                placeholder="Enter location..."
                className="bg-teal-50 h-10 w-full pl-10 pr-3 rounded-lg border border-teal-300 focus:ring-2 focus:ring-teal-400 outline-none transition"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setSelectedLocation(null); // Reset selected airport when input changes
                  setShowLocationList(true);
                  debouncedFetchAirports(e.target.value);
                }}
              />
              {showLocationList && (
                <ul className="absolute z-50 top-full left-0 mt-1 w-full bg-white border rounded-md shadow-md">
                  {isLoadingAirports ? (
                    <li className="px-3 py-2 text-gray-500">Loading...</li>
                  ) : filteredAirports.length > 0 ? (
                    filteredAirports.map((airport, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectLocation(airport)}
                        className="px-3 py-2 border-b last:border-b-0 hover:bg-teal-100 cursor-pointer"
                      >
                        {renderAirportItem(airport)}
                      </li>
                    ))
                  ) : location.length >= 2 ? (
                    <li className="px-3 py-2 text-gray-500">
                      No results found
                    </li>
                  ) : null}
                </ul>
              )}
            </div>
            {selectedLocation && (
              <div className="mt-1 text-xs text-teal-600">
                Selected: {selectedLocation.city} ({selectedLocation.iataCode})
              </div>
            )}
          </div>

          {/* Destination */}
          <div className="relative w-full">
            <label className="block text-sm font-bold mb-2 text-teal-600">
              Destination
            </label>
            <div className="relative">
              <i className="absolute left-3 top-2.5 text-teal-500 fa fa-plane-departure"></i>
              <input
                type="text"
                placeholder="Enter destination..."
                className="bg-teal-50 h-10 w-full pl-10 pr-3 rounded-lg border border-teal-300 focus:ring-2 focus:ring-teal-400 outline-none transition"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setSelectedDestination(null); // Reset selected airport when input changes
                  setShowDestinationList(true);
                  debouncedFetchAirports(e.target.value);
                }}
              />
              {showDestinationList && (
                <ul className="absolute z-50 top-full left-0 mt-1 w-full bg-white border rounded-md shadow-md">
                  {isLoadingAirports ? (
                    <li className="px-3 py-2 text-gray-500">Loading...</li>
                  ) : filteredAirports.length > 0 ? (
                    filteredAirports.map((airport, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectDestination(airport)}
                        className="px-3 py-2 border-b last:border-b-0 hover:bg-teal-100 cursor-pointer"
                      >
                        {renderAirportItem(airport)}
                      </li>
                    ))
                  ) : destination.length >= 2 ? (
                    <li className="px-3 py-2 text-gray-500">
                      No results found
                    </li>
                  ) : null}
                </ul>
              )}
            </div>
            {selectedDestination && (
              <div className="mt-1 text-xs text-teal-600">
                Selected: {selectedDestination.city} (
                {selectedDestination.iataCode})
              </div>
            )}
          </div>
        </div>

        {/* Date Range */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <div className="relative w-full">
            <label className="block text-sm font-bold mb-2 text-teal-600">
              Departure Date
            </label>
            <div className="relative">
              <input
                type="date"
                className="bg-teal-50 h-10 w-full px-3 rounded-lg border border-teal-300 focus:ring-2 focus:ring-teal-400 outline-none transition"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
          </div>

          {tripType === "roundTrip" && (
            <div className="relative w-full">
              <label className="block text-sm font-bold mb-2 text-teal-600">
                Return Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="bg-teal-50 h-10 w-full px-3 rounded-lg border border-teal-300 focus:ring-2 focus:ring-teal-400 outline-none transition"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className={`${
              isSearching ? "bg-teal-400" : "bg-teal-600 hover:bg-teal-700"
            } text-white px-6 py-2 rounded-lg font-semibold transition`}
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* Display search results */}
      {hasSearched && (
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
            {isSearching
              ? `Searching for ${activeTab}...`
              : activeTab === "flights"
              ? (Array.isArray(flightSearchResults) &&
                  flightSearchResults.length > 0) ||
                flightSearchResults?.outboundFlights?.length > 0
                ? "Available Flights"
                : "No flights found for your search criteria"
              : (Array.isArray(busSearchResults) &&
                  busSearchResults.length > 0)
                ? "Available Buses"
                : "No buses found for your search criteria"}
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
                    flightSearchResults.slice(0, visibleFlights).map((flight, index) => (
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
                  {flightSearchResults?.outboundFlights?.slice(0, visibleOutboundFlights).map(
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
                  {flightSearchResults?.returnFlights?.slice(0, visibleReturnFlights).map((flight, index) => (
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
                      {busSearchResults.slice(0, visibleBuses).map((journey, index) => (
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
      )}
    </div>
  );
};

export default SearchComponent;
