import React from "react";

// Destination Card Component
const DestinationCard = ({ city, country, image, description }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white transition-transform transform hover:-translate-y-1 hover:shadow-xl">
      <div className="h-48 bg-gray-300 overflow-hidden">
        <img
          src={image}
          alt={`${city}, ${country}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "assets/images.jpeg";
          }}
        />
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl text-teal-700 mb-2">
          {city}, <span className="text-gray-600">{country}</span>
        </h3>
        <p className="text-gray-600">{description}</p>
        <button
          className="mt-4 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg transition"
          onClick={() => console.log(`Exploring flights to ${city}`)}
        >
          Explore Flights
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;
