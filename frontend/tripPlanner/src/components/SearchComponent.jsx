import React, { useState, useEffect } from "react";
import { searchAirports, searchFlights, searchBuses } from "../services/apiService";
import SearchForm from "./SearchForm";
import ResultsDisplay from "./ResultsDisplay";

const SearchComponent = () => {
  // State management
  // Form state
  const [destination, setDestination] = useState("");
  const [location, setLocation] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tripType, setTripType] = useState("roundTrip");
  const [sortFilter, setSortFilter] = useState("");
  
  // Airport selection state
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showDestinationList, setShowDestinationList] = useState(false);
  const [showLocationList, setShowLocationList] = useState(false);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [isLoadingAirports, setIsLoadingAirports] = useState(false);
  
  // Search and results state
  const [isSearching, setIsSearching] = useState(false);
  const [flightSearchResults, setFlightSearchResults] = useState([]);
  const [busSearchResults, setBusSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
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
      const data = await searchAirports(query);
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
      // Search for buses
      const busParams = {
        from: selectedLocation.city,
        to: selectedDestination.city,
        date: fromDate,
      };
      
      const busResults = await searchBuses(busParams);
      
      if (busResults && busResults.journeys) {
        setBusSearchResults(busResults.journeys);
      } else {
        setBusSearchResults([]);
      }

      // Search for flights
      const flightParams = {
        origin: selectedLocation.iataCode,
        destination: selectedDestination.iataCode,
        date: fromDate,
      };
      
      // Add return date for round trips
      if (tripType === "roundTrip") {
        flightParams.returnDate = toDate;
      }
      
      const flightResults = await searchFlights(flightParams);
      setFlightSearchResults(flightResults.data);
    } catch (error) {
      console.error("Search error:", error);
      alert(`Search failed: ${error.message}`);
      setFlightSearchResults([]);
      setBusSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 py-8 px-4">
      <SearchForm
        location={location}
        destination={destination}
        fromDate={fromDate}
        toDate={toDate}
        tripType={tripType}
        selectedLocation={selectedLocation}
        selectedDestination={selectedDestination}
        showLocationList={showLocationList}
        showDestinationList={showDestinationList}
        filteredAirports={filteredAirports}
        isLoadingAirports={isLoadingAirports}
        isSearching={isSearching}
        sortFilter={sortFilter}
        setLocation={setLocation}
        setDestination={setDestination}
        setFromDate={setFromDate}
        setToDate={setToDate}
        setShowLocationList={setShowLocationList}
        setShowDestinationList={setShowDestinationList}
        debouncedFetchAirports={debouncedFetchAirports}
        handleSelectLocation={handleSelectLocation}
        handleSelectDestination={handleSelectDestination}
        toggleTripType={toggleTripType}
        setSortFilter={setSortFilter}
        handleSearch={handleSearch}
        renderAirportItem={renderAirportItem}
      />

      {/* Display search results */}
      {hasSearched && (
        <ResultsDisplay
          isSearching={isSearching}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          flightSearchResults={flightSearchResults}
          busSearchResults={busSearchResults}
          selectedLocation={selectedLocation}
          selectedDestination={selectedDestination}
          sortFilter={sortFilter}
          visibleFlights={visibleFlights}
          visibleOutboundFlights={visibleOutboundFlights}
          visibleReturnFlights={visibleReturnFlights}
          visibleBuses={visibleBuses}
          setVisibleFlights={setVisibleFlights}
          setVisibleOutboundFlights={setVisibleOutboundFlights}
          setVisibleReturnFlights={setVisibleReturnFlights}
          setVisibleBuses={setVisibleBuses}
        />
      )}
    </div>
  );
};

export default SearchComponent;
