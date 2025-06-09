import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faGasPump, faRoad, faClock } from "@fortawesome/free-solid-svg-icons";
import "./CarCard.css";

const CarCard = ({ carRoute }) => {
  const {
    from,
    to,
    distance_km,
    duration_hours,
    duration_minutes,
    gas_price_super,
    gas_price_diesel
  } = carRoute;

  // Format duration for display
  const formatDuration = () => {
    if (duration_hours === 0) {
      return `${duration_minutes}m`;
    } else if (duration_minutes === 0) {
      return `${duration_hours}h`;
    } else {
      return `${duration_hours}h ${duration_minutes}m`;
    }
  };

  // Check if we have return trip data
  const hasReturn = carRoute?.return && Object.keys(carRoute.return).length > 0;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-400 text-white px-6 py-4 flex items-center">
        <div className="rounded-full bg-white/20 p-2 mr-3">
          <FontAwesomeIcon icon={faCar} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Car Route {hasReturn ? '(Round Trip)' : ''}</h3>
          <p className="text-sm opacity-80">Driving directions and estimates</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 mb-6 lg:mb-0">
            <div className="flex items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{from}</h2>
                <p className="text-gray-500 text-sm">Starting point</p>
              </div>
              
              <div className="mx-4 flex-1 flex items-center justify-center">
                <div className="h-0.5 bg-teal-100 flex-1"></div>
                <span className="mx-2 bg-teal-50 text-teal-700 text-sm font-medium px-3 py-1 rounded-full border border-teal-200">
                  {Math.round(distance_km)} km
                </span>
                <div className="h-0.5 bg-teal-100 flex-1"></div>
              </div>
              
              <div className="text-right">
                <h2 className="text-xl font-bold text-gray-900">{to}</h2>
                <p className="text-gray-500 text-sm">Destination</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="flex items-start bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="rounded-full bg-teal-100 p-3 mr-3">
              <FontAwesomeIcon icon={faClock} className="text-teal-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Duration</h3>
              <p className="text-xl font-bold text-gray-900">{formatDuration()}</p>
            </div>
          </div>
          
          <div className="flex items-start bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="rounded-full bg-teal-100 p-3 mr-3">
              <FontAwesomeIcon icon={faRoad} className="text-teal-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Distance</h3>
              <p className="text-xl font-bold text-gray-900">{Math.round(distance_km)} km</p>
            </div>
          </div>
          
          <div className="flex items-start bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="rounded-full bg-teal-100 p-3 mr-3">
              <FontAwesomeIcon icon={faGasPump} className="text-teal-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Fuel Prices</h3>
              <div>
                <span className="font-semibold">Super:</span> €{gas_price_super.toFixed(2)}
              </div>
              <div>
                <span className="font-semibold">Diesel:</span> €{gas_price_diesel.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Return Trip Section */}
      {hasReturn && (
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Return Trip</h3>
            <p className="text-sm text-gray-600 mb-4">Return journey details from {carRoute.return.from} to {carRoute.return.to}</p>
          </div>
          
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 mb-6 lg:mb-0">
              <div className="flex items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{carRoute.return.from}</h2>
                  <p className="text-gray-500 text-sm">Starting point</p>
                </div>
                
                <div className="mx-4 flex-1 flex items-center justify-center">
                  <div className="h-0.5 bg-blue-100 flex-1"></div>
                  <span className="mx-2 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full border border-blue-200">
                    {Math.round(carRoute.return.distance_km)} km
                  </span>
                  <div className="h-0.5 bg-blue-100 flex-1"></div>
                </div>
                
                <div className="text-right">
                  <h2 className="text-xl font-bold text-gray-900">{carRoute.return.to}</h2>
                  <p className="text-gray-500 text-sm">Destination</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="flex items-start bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="rounded-full bg-blue-100 p-3 mr-3">
                <FontAwesomeIcon icon={faClock} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Duration</h3>
                <p className="text-xl font-bold text-gray-900">
                  {carRoute.return.duration_hours > 0 ? `${carRoute.return.duration_hours}h ` : ''}
                  {carRoute.return.duration_minutes}m
                </p>
              </div>
            </div>
            
            <div className="flex items-start bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="rounded-full bg-blue-100 p-3 mr-3">
                <FontAwesomeIcon icon={faRoad} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Distance</h3>
                <p className="text-xl font-bold text-gray-900">{Math.round(carRoute.return.distance_km)} km</p>
              </div>
            </div>
            
            <div className="flex items-start bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="rounded-full bg-blue-100 p-3 mr-3">
                <FontAwesomeIcon icon={faGasPump} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Fuel Prices</h3>
                <div>
                  <span className="font-semibold">Super:</span> €{carRoute.return.gas_price_super.toFixed(2)}
                </div>
                <div>
                  <span className="font-semibold">Diesel:</span> €{carRoute.return.gas_price_diesel.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Total Round Trip */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Total Round Trip</h3>
              <div>
                <p className="font-semibold text-gray-700">
                  Distance: {Math.round(Number(carRoute.distance_km) + Number(carRoute.return.distance_km))} km
                </p>
                <p className="font-semibold text-gray-700">
                  Duration: {Math.floor((carRoute.duration_hours + carRoute.return.duration_hours) + 
                  (carRoute.duration_minutes + carRoute.return.duration_minutes) / 60)}h {' '}
                  {(carRoute.duration_minutes + carRoute.return.duration_minutes) % 60}m
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarCard;