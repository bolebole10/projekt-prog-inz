import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";

// Trip Card Component for displaying popular trips
const TripCard = ({ origin, destination, originCountry, destinationCountry, image, price }) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white transition-all hover:shadow-xl">
      <div className="h-48 bg-gray-300 overflow-hidden relative">
        <img
          src={image}
          alt={`${origin} to ${destination}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "assets/images.jpeg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="text-sm font-medium">{price ? `From ${price}` : "Best Prices"}</div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold text-xl text-teal-700">{origin}</div>
          <div className="text-gray-400 px-3">
            <FontAwesomeIcon icon={faPlane} className="transform rotate-90" />
          </div>
          <div className="font-bold text-xl text-teal-700">{destination}</div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <div>{originCountry}</div>
          <div>{destinationCountry}</div>
        </div>
        
        <button
          className="w-full mt-2 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg transition"
          onClick={() => console.log(`Searching flights from ${origin} to ${destination}`)}
        >
          Find Flights
        </button>
      </div>
    </div>
  );
};

export default TripCard;
