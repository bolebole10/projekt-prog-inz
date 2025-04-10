import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlaneDeparture, faPlaneArrival } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import './FlightCard.css'; 

const FlightCard = () => {
    // Hardcoded variables for now
    const departureTime = "13:00";
    const arrivalTime = "13:30";
    const departureCity = "Beograd";
    const arrivalCity = "Pula";
    const flightNumber = "XY123";

    return (
       <div className="flight-card">
            <div className="flight-card-s">
                <div className="flight-card-s-icon">
                    <FontAwesomeIcon icon={faPlaneDeparture} />
                </div>
                <div className="flight-card-s-text">
                    <h2>Polazak:</h2>
                    <p>{departureTime}</p>
                    <p>{departureCity}</p>
                </div>
            </div>
            <div className="flight-card-s">
                <h1>{flightNumber}</h1>
            </div>
            <div className="flight-card-s">
                <div className="flight-card-s-text">
                    <h2>Dolazak:</h2>
                    <p>{arrivalTime}</p>
                    <p>{arrivalCity}</p>
                </div>
                <div className="flight-card-s-icon">
                    <FontAwesomeIcon icon={faPlaneArrival} />
                </div>
            </div>
       </div>
    );
};

export default FlightCard;