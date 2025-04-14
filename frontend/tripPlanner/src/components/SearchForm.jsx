import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AirportAutocomplete from "./AirportAutocomplete";

const SearchForm = ({
  location,
  destination,
  fromDate,
  toDate,
  tripType,
  selectedLocation,
  selectedDestination,
  showLocationList,
  showDestinationList,
  filteredAirports,
  isLoadingAirports,
  isSearching,
  sortFilter,
  setLocation,
  setDestination,
  setFromDate,
  setToDate,
  setShowLocationList,
  setShowDestinationList,
  debouncedFetchAirports,
  handleSelectLocation,
  handleSelectDestination,
  toggleTripType,
  setSortFilter,
  handleSearch,
  renderAirportItem
}) => {
  return (
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
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition`}
          >
            Round Trip
          </button>
          <button
            type="button"
            onClick={() => toggleTripType("oneWay")}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              tripType === "oneWay"
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition`}
          >
            One Way
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* From (Location) */}
        <div className="relative">
          <label className="block text-sm font-bold mb-2 text-teal-600">
            From
          </label>
          <AirportAutocomplete
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setShowLocationList(true);
              debouncedFetchAirports(e.target.value);
            }}
            onFocus={() => {
              setShowLocationList(true);
              if (location.length >= 2) debouncedFetchAirports(location);
            }}
            placeholder="City or Airport"
            showList={showLocationList}
            airports={filteredAirports}
            isLoading={isLoadingAirports}
            onSelect={handleSelectLocation}
            renderItem={renderAirportItem}
          />
        </div>

        {/* To (Destination) */}
        <div className="relative">
          <label className="block text-sm font-bold mb-2 text-teal-600">
            To
          </label>
          <AirportAutocomplete
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setShowDestinationList(true);
              debouncedFetchAirports(e.target.value);
            }}
            onFocus={() => {
              setShowDestinationList(true);
              if (destination.length >= 2) debouncedFetchAirports(destination);
            }}
            placeholder="City or Airport"
            showList={showDestinationList}
            airports={filteredAirports}
            isLoading={isLoadingAirports}
            onSelect={handleSelectDestination}
            renderItem={renderAirportItem}
          />
        </div>
      </div>

      <div className={`grid grid-cols-1 ${tripType === "roundTrip" ? "md:grid-cols-2" : ""} gap-6 mt-6`}>
        {/* Departure Date */}
        <div className={`relative ${tripType === "oneWay" ? "md:col-span-2" : ""}`}>
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

      <div className="mt-8 flex justify-between items-center">
        {/* Filter dropdown */}
        <div className="relative">
          <select
            className="bg-gray-200 hover:bg-gray-300 text-teal-700 px-5 py-2 rounded-lg font-medium transition cursor-pointer appearance-none pr-8"
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value)}
          >
            <option value="">Filter by</option>
            <option value="price">Price</option>
            <option value="earliest">Earliest</option>
            <option value="duration">Duration</option>
          </select>
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            {/*Icon for dropdown arrow*/}
            <svg
              className="w-4 h-4 text-teal-700"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Search button */}
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
  );
};

export default SearchForm;
