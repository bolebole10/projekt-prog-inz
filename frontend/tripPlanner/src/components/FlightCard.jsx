import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlaneDeparture, faPlaneArrival } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import './FlightCard.css'; 

const FlightCard = ({ flight, originAirport, destinationAirport, isReturn }) => {
    // Extract flight details from the flight data structure
    const itinerary = flight?.itineraries?.[isReturn ? 1 : 0] || {};
    const segment = itinerary?.segments?.[0] || {};
    
    // Extract values with fallbacks
    const departureDateTime = segment?.departure?.at || flight?.departureTime || "N/A";
    const arrivalDateTime = segment?.arrival?.at || flight?.arrivalTime || "N/A";
    
    // Format the departure and arrival dates
    const formatDateTime = (dateTimeStr) => {
        if (dateTimeStr === "N/A") return "N/A";
        
        try {
            const date = new Date(dateTimeStr);
            return date.toLocaleString('en-US', {
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateTimeStr;
        }
    };
    
    const formattedDepartureTime = formatDateTime(departureDateTime);
    const formattedArrivalTime = formatDateTime(arrivalDateTime);
        
    const departureCity = originAirport?.city || "Unknown";
    const arrivalCity = destinationAirport?.city || "Unknown";
    const flightNumber = segment?.number || flight?.flightNumber || "N/A";
    const airline = segment?.carrierCode || flight?.airline || "Unknown Airline";
    
    
    const price = flight?.price?.total 
        ? `${flight.price.currency} ${flight.price.total}` 
        : "Price unavailable";
    
   
    const extractDurationNumbers = (durationStr) => {
        if (!durationStr || durationStr === "N/A") return "N/A";
        
        // Extract hours and minutes if in PT10H30M format
        if (durationStr.includes('PT')) {
            const hours = durationStr.match(/(\d+)H/)?.[1] || "0";
            const minutes = durationStr.match(/(\d+)M/)?.[1] || "0";
            return `${hours}h ${minutes}m`;
        }
        
        // Extract numbers if in format like "2H 30M"
        if (durationStr.includes('H') || durationStr.includes('M')) {
            const hours = durationStr.match(/(\d+)H/i)?.[1] || "0";
            const minutes = durationStr.match(/(\d+)M/i)?.[1] || "0";
            return `${hours}h ${minutes}m`;
        }
        
       
        return durationStr;
    };
    
    const durationValue = extractDurationNumbers(itinerary?.duration || flight?.duration || "N/A");

    return (
        <div className="flight-card-container">
            <div className={`flight-card ${isReturn ? 'return-flight' : ''}`}>
                <div className="flight-card-s">
                    <div className="flight-card-s-icon">
                        <FontAwesomeIcon icon={faPlaneDeparture} />
                    </div>
                    <div className="flight-card-s-text">
                        <h2>Departure:</h2>
                        <p>{formattedDepartureTime}</p>
                        <p>{departureCity} ({originAirport?.iataCode})</p>
                    </div>
                </div>
                
                <div className="flight-card-s">
                    <h1 className="flight-number">{flightNumber}</h1>
                    <p className="airline-name">{airline}</p>
                    <p className="flight-price">{price}</p>
                    {durationValue && <p className="flight-duration">Duration: {durationValue}</p>}
                    {isReturn && <p className="return-badge">Return Flight</p>}
                </div>
                
                <div className="flight-card-s">
                    <div className="flight-card-s-text">
                        <h2>Arrival:</h2>
                        <p>{formattedArrivalTime}</p>
                        <p>{arrivalCity} ({destinationAirport?.iataCode})</p>
                    </div>
                    <div className="flight-card-s-icon">
                        <FontAwesomeIcon icon={faPlaneArrival} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightCard;