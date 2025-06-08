import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

// Trip Card Component for displaying popular trips
const TripCard = ({ origin, destination, image, imageAlt }) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white transition-all hover:shadow-xl">
      <div className="h-48 bg-gray-300 overflow-hidden relative">
        <img
          src={image}
          alt={imageAlt || `${origin} to ${destination}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "assets/placeholder.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold text-xl text-teal-700">{origin}</div>
          <div className="text-gray-400 px-3">
            <FontAwesomeIcon icon={faArrowRight} className="text-gray-500" />
          </div>
          <div className="font-bold text-xl text-teal-700">{destination}</div>
        </div>
        
        <button
          className="w-full mt-2 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg transition"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }}
        >
         Explore
        </button>
      </div>
    </div>
  );
};

export default TripCard;
