import React, { useState, useEffect } from "react";
import { BACKEND_PORT } from "../config";

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

  // Function to handle the search submission
  const handleSearch = async () => {
    if (
      !selectedLocation ||
      !selectedDestination ||
      !fromDate ||
      (tripType === "roundTrip" && !toDate)
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSearching(true);

    try {
      // Build query parameters
      const params = new URLSearchParams({
        origin: selectedLocation.iataCode,
        destination: selectedDestination.iataCode,
        date: fromDate,
      });

      // Add return date only for round trips
      if (tripType === "roundTrip") {
        params.append("returnDate", toDate);
      }

      const response = await fetch(
        `http://localhost:${BACKEND_PORT}/flights?${params.toString()}`
      );

      if (!response.ok) throw new Error("Search failed");

      const searchResults = await response.json();

      //here you can handle the search results

      console.log("Search results:", searchResults);
    } catch (error) {
      console.error("Error performing search:", error);
      alert("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="py-20 h-screen bg-gradient-to-br from-blue-100 via-teal-100 to-yellow-50 px-4">
      <div className="max-w-3xl mx-auto rounded-xl shadow-xl bg-white/90 backdrop-blur-md p-6 search-component">
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
                <ul className="absolute z-10 top-full left-0 mt-1 w-full bg-white border rounded-md shadow-md">
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
                <ul className="absolute z-10 top-full left-0 mt-1 w-full bg-white border rounded-md shadow-md">
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
    </div>
  );
};

export default SearchComponent;
