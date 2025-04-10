import React, { useState, useEffect } from "react";

const SearchComponent = () => {
  const [destination, setDestination] = useState("");
  const [location, setLocation] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [showDestinationList, setShowDestinationList] = useState(false);
  const [showLocationList, setShowLocationList] = useState(false);

  const destinations = ["Paris", "Rome", "Barcelona", "Lisbon", "Athens"];
  const locations = [
    "Zagreb", "Split", "Rijeka", "Osijek", "Zadar",
    "Pula", "Dubrovnik", "Karlovac", "Šibenik", "Varaždin"
  ];

  const filteredDestinations = destinations.filter((item) =>
    item.toLowerCase().includes(destination.toLowerCase())
  );
  const filteredLocations = locations.filter((item) =>
    item.toLowerCase().includes(location.toLowerCase())
  );

  const handleSelectDestination = (value) => {
    setDestination(value);
    setShowDestinationList(false);
  };
  const handleSelectLocation = (value) => {
    setLocation(value);
    setShowLocationList(false);
  };

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

  return (
    <div className="py-20 h-screen bg-gradient-to-br from-blue-100 via-teal-100 to-yellow-50 px-4">
      <div className="max-w-3xl mx-auto rounded-xl shadow-xl bg-white/90 backdrop-blur-md p-6 search-component">
        <h2 className="text-2xl font-bold text-teal-700 mb-6 text-center">Plan Your Journey 🌍</h2>
        
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
                  setShowLocationList(true);
                }}
              />
              {showLocationList && location && filteredLocations.length > 0 && (
                <ul className="absolute z-10 top-full left-0 mt-1 w-full bg-white border rounded-md shadow-md">
                  {filteredLocations.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectLocation(item)}
                      className="px-3 py-2 border-b last:border-b-0 hover:bg-teal-100 cursor-pointer"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
                  setShowDestinationList(true);
                }}
              />
              {showDestinationList && destination && filteredDestinations.length > 0 && (
                <ul className="absolute z-10 top-full left-0 mt-1 w-full bg-white border rounded-md shadow-md">
                  {filteredDestinations.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectDestination(item)}
                      className="px-3 py-2 border-b last:border-b-0 hover:bg-teal-100 cursor-pointer"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <div className="relative w-full">
            <label className="block text-sm font-bold mb-2 text-teal-600">
              From
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

          <div className="relative w-full">
            <label className="block text-sm font-bold mb-2 text-teal-600">
              To
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
        </div>

        {/* Search Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() =>
              console.log("Search:", { location, destination, fromDate, toDate })
            }
            className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
