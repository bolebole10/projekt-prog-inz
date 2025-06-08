import React from "react";

// Destination Card Component
const DestinationCard = ({ city, country, image, imageAlt, description }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white transition-transform transform hover:-translate-y-1 hover:shadow-xl">
      <div className="h-48 bg-gray-300 overflow-hidden relative">
        <img
          src={image}
          alt={imageAlt || `${city}, ${country}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "assets/placeholder.png";
          }}
        />
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl text-teal-700 mb-2">
          {city}
        </h3>
        <p className="text-gray-600">{description}</p>
        <button
          className="mt-4 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg transition"
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

export default DestinationCard;
