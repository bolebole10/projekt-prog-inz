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

  // Calculate total minutes for display
  const totalMinutes = (duration_hours * 60) + duration_minutes;
  
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

  return (
    <div className="car-card-container">
      <div className="car-card">
        <div className="car-card-header">
          <span className="route-type">
            <FontAwesomeIcon icon={faCar} className="mr-2" /> Car Route
          </span>
        </div>

        <div className="car-card-row">
          <div className="car-card-locations">
            <div className="car-card-location">
              <h2>{from}</h2>
              <p>Starting point</p>
            </div>
            
            <div className="car-route-line">
              <div className="route-dash"></div>
              <div className="route-info">
                <span>{Math.round(distance_km)} km</span>
              </div>
              <div className="route-dash"></div>
            </div>
            
            <div className="car-card-location">
              <h2>{to}</h2>
              <p>Destination</p>
            </div>
          </div>
          
          <div className="car-card-details">
            <div className="detail-item">
              <FontAwesomeIcon icon={faClock} className="detail-icon" />
              <div>
                <h3>Duration</h3>
                <p>{formatDuration()}</p>
              </div>
            </div>
            
            <div className="detail-item">
              <FontAwesomeIcon icon={faRoad} className="detail-icon" />
              <div>
                <h3>Distance</h3>
                <p>{Math.round(distance_km)} km</p>
              </div>
            </div>
            
            <div className="detail-item">
              <FontAwesomeIcon icon={faGasPump} className="detail-icon" />
              <div>
                <h3>Fuel Prices</h3>
                <p>Super: €{gas_price_super.toFixed(2)} | Diesel: €{gas_price_diesel.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;