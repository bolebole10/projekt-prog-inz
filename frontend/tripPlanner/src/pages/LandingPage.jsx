import React, { useState } from "react";
import DestinationCard from "../components/DestiationCard";
import TripCard from "../components/TripCard";
import SearchComponent from "../components/SearchComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faSearch, faShieldAlt, faGlobe, faEnvelope, faLink, faShareAlt, faMapMarkerAlt, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState("destinations");
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
          {activeTab === "destinations" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in">
              {/* Popular destination cards */}
              <DestinationCard
                city="Barcelona"
                country="Spain"
                image="https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                description="Experience the unique architecture and vibrant culture of Catalonia"
              />
              <DestinationCard
                city="Amsterdam"
                country="Netherlands"
                image="https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                description="Explore the beautiful canals and rich history of this charming city"
              />
              <DestinationCard
                city="Prague"
                country="Czech Republic"
                image="https://images.unsplash.com/photo-1541849546-216549ae216d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                description="Discover the fairy-tale architecture and vibrant nightlife"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 fade-in">
              {/* Popular trip cards */}
              <TripCard
                origin="Zagreb"
                destination="Barcelona"
                originCountry="Croatia"
                destinationCountry="Spain"
                image="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                price="€120"
              />
              <TripCard
                origin="Madrid"
                destination="London"
                originCountry="Spain"
                destinationCountry="United Kingdom"
                image="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                price="€95"
              />
            </div>
          )}
          
          {/* View all link */}
          <div className="text-center mt-10">
            <a href="#" className="inline-block text-teal-600 hover:text-teal-800 font-medium transition-colors">
              View all {activeTab === "destinations" ? "destinations" : "trips"} →
            </a>
          </div>
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
              <p className="text-gray-600">Simple and intuitive interface to find your perfect flight</p>
            </div>
            <div className="p-6">
              <div className="text-5xl text-teal-500 mb-4">
                <FontAwesomeIcon icon={faShieldAlt} />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Booking</h3>
              <p className="text-gray-600">Safe and secure payment processing for your peace of mind</p>
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