import React, { useState, useEffect } from "react";
import { 
  searchAirports, 
  searchFlights, 
  searchBuses, 
  getCarRoute, 
  getAirportsInRadius, 
  getNearestAirport,
  incrementCityScore,
  IncrementTripScoreAsync,
  getAlgorithmResult,
} from "../services/apiService";
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
  const [busSearchResultsReturn, setBusSearchResultsReturn] = useState([]);
  const [carRouteResults, setCarRouteResults] = useState(null);
  const [algorithmResults, setAlgorithmResults] = useState(null);
  const [algorithmReturnResults, setAlgorithmReturnResults] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState("algoritam");
  
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
    setToDate("");
    setFromDate("");
    resetPagination();
    setAlgorithmResults(null);
    setAlgorithmReturnResults(null);
    setFlightSearchResults([]);
    setBusSearchResults([]);
    setBusSearchResultsReturn([]);
    setCarRouteResults(null);
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
    console.log(fromDate, toDate);
    // Validate that we have all required fields
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
      // Call algorithm endpoint
      try {
        const algorithmData = await getAlgorithmResult(
          selectedLocation.city, 
          selectedDestination.city, 
          fromDate
        );
        setAlgorithmResults(algorithmData);

        if(tripType === "roundTrip") {
          const algorithmDataReturn = await getAlgorithmResult(
            selectedDestination.city, 
            selectedLocation.city, 
            toDate
          );
          setAlgorithmReturnResults(algorithmDataReturn);
        }
        // console.log(algorithmData); 
      } catch (error) {
        console.error("Algorithm search error:", error);
        setAlgorithmResults(null);
        setAlgorithmReturnResults(null);
      }

      // Search for buses
      const busParams = {
        from: selectedLocation.city,
        to: selectedDestination.city,
        date: fromDate,
      };
      
      // const busResults = await searchBuses(busParams);
      const busResults = [];
      
      if (busResults && busResults.journeys) {
        setBusSearchResults(busResults.journeys);
      } else {
        setBusSearchResults([]);
      }

      if(tripType === "roundTrip") {
        const busParamsReturn = {
          from: selectedDestination.city,
          to: selectedLocation.city,
          date: toDate,
        };
        
        // const busResultsReturn = await searchBuses(busParamsReturn);
        const busResultsReturn = [];
        
        if (busResultsReturn && busResultsReturn.journeys) {
          setBusSearchResultsReturn(busResultsReturn.journeys);
        } else {
          setBusSearchResultsReturn([]);
        }
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

      // Search for car route
      try {
        const carParams = {
          from: selectedLocation.city,
          to: selectedDestination.city
        };
        const carRouteData = await getCarRoute(carParams);

        let carParamsReturn = null;
        let carRouteDataReturn = null;
        if(tripType === "roundTrip") {
          carParamsReturn = {
            from: selectedDestination.city,
            to: selectedLocation.city
          }; 
          carRouteDataReturn = await getCarRoute(carParamsReturn);
        }
        
        // Find nearby airports for origin
        const originAirports = await getAirportsInRadius(selectedLocation.city, 200);
        
        // Find nearby airports for destination
        const destinationAirports = await getAirportsInRadius(selectedDestination.city, 200);
        
        // Combine all car data
        const combinedCarData = {
          ...carRouteData,
          ...(carRouteDataReturn ? { return: carRouteDataReturn } : {}),
          nearbyAirports: {
            origin: originAirports,
            destination: destinationAirports
          }
        };

        setCarRouteResults(combinedCarData);
      } catch (error) {
        console.error("Car route search error:", error);
        setCarRouteResults(null);
      }


      await incrementCityScore(selectedDestination.city); 
      await IncrementTripScoreAsync(selectedLocation.city, selectedDestination.city);
      

    } catch (error) {
      console.error("Search error:", error);
      alert(`Search failed: ${error.message}`);
      setAlgorithmResults(null);
      setAlgorithmReturnResults(null);
      setFlightSearchResults([]);
      setBusSearchResults([]);
      setBusSearchResultsReturn([]);
      setCarRouteResults(null);
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
          busSearchResultsReturn={busSearchResultsReturn}
          carRouteResults={carRouteResults}
          algorithmResults={algorithmResults}
          algorithmReturnResults={algorithmReturnResults}
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
