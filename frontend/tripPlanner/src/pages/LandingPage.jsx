import React from "react";
import DestinationCard from "../components/DestiationCard";
import SearchComponent from "../components/SearchComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faSearch, faShieldAlt, faGlobe, faEnvelope, faLink, faShareAlt } from "@fortawesome/free-solid-svg-icons";

const LandingPage = () => {
  return (
    <div className="landing-page bg-gradient-to-br from-blue-100 via-teal-100 to-yellow-50 min-h-screen">
      {/* Hero section
      <header className="bg-gradient-to-r from-teal-500 via-blue-500 to-blue-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-2">
            <FontAwesomeIcon icon={faPlane} className="text-4xl text-white mb-4 transform -rotate-45" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Find Your Perfect Flight
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto font-light">
            Discover amazing destinations and book your next adventure with our easy-to-use flight search tool.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-blue-100 opacity-30"></div>
      </header> */}

      {/* Search component section */}
      <section className="pb-16 pt-6">
        <div className="container mx-auto px-4 relative z-20 mt-20">
          <SearchComponent />
        </div>
      </section>

      {/* Popular destinations section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-teal-700">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Popular destination cards */}
            <DestinationCard
              city="Paris"
              country="France"
              image="/images/paris.jpg"
              description="Experience the city of love and its iconic Eiffel Tower"
            />
            <DestinationCard
              city="Tokyo"
              country="Japan"
              image="/images/tokyo.jpg"
              description="Explore the perfect blend of traditional culture and modern innovation"
            />
            <DestinationCard
              city="New York"
              country="United States"
              image="/images/newyork.jpg"
              description="Discover the city that never sleeps with its towering skyscrapers"
            />
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