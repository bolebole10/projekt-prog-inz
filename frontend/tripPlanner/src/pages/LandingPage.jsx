import React, { useState, useEffect } from "react";
import DestinationCard from "../components/DestiationCard";
import TripCard from "../components/TripCard";
import SearchComponent from "../components/SearchComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faSearch, faGlobe, faEnvelope, faLink, faShareAlt, faMapMarkerAlt, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { getTopSearchedCities, getTopSearchedTrips } from "../services/apiService";

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState("destinations");
  const [popularCities, setPopularCities] = useState([]);
  const [popularTrips, setPopularTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPopularData = async () => {
      setLoading(true);
      try {
        const cities = await getTopSearchedCities(3);
        const trips = await getTopSearchedTrips(3);
        
        setPopularCities(cities);
        setPopularTrips(trips);
      } catch (error) {
        console.error('Error fetching popular data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPopularData();
  }, []);
  return (
    <div className="landing-page bg-gradient-to-br from-blue-100 via-teal-100 to-yellow-50 min-h-screen">
      <header className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-teal-300"></div>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-teal-400 rounded-full opacity-20"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-400 rounded-full opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm mr-4">
                <FontAwesomeIcon icon={faPlane} className="text-2xl text-white" />
              </div>
              <h1 className="text-3xl font-bold">Trip Planner</h1>
            </div>
            
            <p className="text-lg max-w-md text-center md:text-right text-teal-50">
              Find and compare the best flight and bus deals for your next trip
            </p>
          </div>
        </div>
      </header>

      {/* Search component section */}
      <section className="pb-16 pt-6">
        <div className="container mx-auto px-4 relative z-20 mt-20">
          <SearchComponent />
        </div>
      </section>

      {/* Popular destinations and trips section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-teal-700">Discover Travel Opportunities</h2>
          
          {/* Tabs Navigation */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-gray-100 rounded-xl p-1.5 shadow-md">
              <button
                onClick={() => setActiveTab("destinations")}
                className={`py-3 px-8 rounded-lg font-medium text-base transition-all duration-200 flex items-center ${
                  activeTab === "destinations"
                    ? "bg-white text-teal-600 shadow-sm transform scale-105"
                    : "text-gray-600 hover:text-teal-500"
                }`}
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> Popular Destinations
              </button>
              <button
                onClick={() => setActiveTab("trips")}
                className={`py-3 px-8 rounded-lg font-medium text-base transition-all duration-200 flex items-center ${
                  activeTab === "trips"
                    ? "bg-white text-teal-600 shadow-sm transform scale-105"
                    : "text-gray-600 hover:text-teal-500"
                }`}
              >
                <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" /> Popular Trips
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : activeTab === "destinations" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in">
              {/* Popular destination cards */}
              {popularCities.length > 0 ? (
                popularCities.map((city, index) => (
                  <DestinationCard
                    key={index}
                    city={city.name}
                    country={city.country || "Europe"}
                    image={`https://source.unsplash.com/featured/?${encodeURIComponent(city.name)},landmark`}
                    description={city.description || `Explore the beautiful city of ${city.name} with a popularity score of ${city.searchScore}`}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10 text-gray-500">
                  No popular destinations found
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in">
              {/* Popular trip cards */}
              {popularTrips.length > 0 ? (
                popularTrips.map((trip, index) => (
                  <TripCard
                    key={index}
                    origin={trip.fromCity}
                    destination={trip.toCity}
                    originCountry={trip.fromCountry || "Europe"}
                    destinationCountry={trip.toCountry || "Europe"}
                    image={trip.imageUrl || `https://source.unsplash.com/featured/?${encodeURIComponent(trip.fromCity)},${encodeURIComponent(trip.toCity)},travel`}
                    price={trip.price || "Best Price"}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10 text-gray-500">
                  No popular trips found
                </div>
              )}
            </div>
          )}
      
        </div>
      </section>

      {/* Features section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-teal-700">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl text-teal-500 mb-4">
                <FontAwesomeIcon icon={faPlane} />
              </div>
              <h3 className="text-xl font-bold mb-2">Best Flight Deals</h3>
              <p className="text-gray-600">Find the most competitive prices for flights worldwide</p>
            </div>
            <div className="p-6">
              <div className="text-5xl text-teal-500 mb-4">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Search</h3>
              <p className="text-gray-600">Simple and intuitive interface to find your perfect trip</p>
            </div>
            <div className="p-6">
              <div className="text-5xl text-teal-500 mb-4">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <h3 className="text-xl font-bold mb-2">Explore Top Destinations</h3>
              <p className="text-gray-600">Discover the most popular and highly rated travel destinations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-800 bg-opacity-90 text-white py-12 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Trip Planner</h4>
              <p className="text-teal-200">Your go-to platform for finding and booking flights to anywhere in the world.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-teal-200 hover:text-white">Home</a></li>
                <li><a href="#" className="text-teal-200 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-teal-200 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-teal-200 hover:text-white">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-teal-200 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-teal-200 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-teal-200 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-teal-200 hover:text-white text-2xl">
                  <FontAwesomeIcon icon={faGlobe} />
                </a>
                <a href="#" className="text-teal-200 hover:text-white text-2xl">
                  <FontAwesomeIcon icon={faEnvelope} />
                </a>
                <a href="#" className="text-teal-200 hover:text-white text-2xl">
                  <FontAwesomeIcon icon={faShareAlt} />
                </a>
                <a href="#" className="text-teal-200 hover:text-white text-2xl">
                  <FontAwesomeIcon icon={faLink} />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-teal-700 text-center text-teal-300">
            <p>© {new Date().getFullYear()} Trip Planner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;