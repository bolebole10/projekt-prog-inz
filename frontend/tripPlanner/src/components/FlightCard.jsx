import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlaneDeparture, faPlaneArrival } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import './FlightCard.css'; 

const FlightCard = ({ flight, originAirport, destinationAirport }) => {
    // Format duration
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
            const hours = durationStr.match(/(\d+)\s*H/i)?.[1] || "0";
            const minutes = durationStr.match(/(\d+)\s*M/i)?.[1] || "0";
            return `${hours}h ${minutes}m`;
        }
        
        return durationStr;
    };
    // Extract flight details for outbound flight (itinerary 0)
    const outboundItinerary = flight?.itineraries?.[0] || {};
    const outboundSegments = outboundItinerary?.segments || [];
    const outboundFirstSegment = outboundSegments[0] || {};
    const outboundLastSegment = outboundSegments[outboundSegments.length - 1] || outboundFirstSegment;
    
    // Extract values for outbound flight with fallbacks
    const outboundDepartureDateTime = outboundFirstSegment?.departure?.at || "N/A";
    const outboundArrivalDateTime = outboundLastSegment?.arrival?.at || "N/A";
    const outboundDepartureAirport = outboundFirstSegment?.departure?.iataCode || "N/A";
    const outboundArrivalAirport = outboundLastSegment?.arrival?.iataCode || "N/A";
    const outboundDepartureTerminal = outboundFirstSegment?.departure?.terminal || "";
    const outboundArrivalTerminal = outboundLastSegment?.arrival?.terminal || "";
    const outboundFlightNumber = outboundFirstSegment?.number || "N/A";
    const outboundAirline = outboundFirstSegment?.carrierCode || "Unknown Airline";
    const outboundNumberOfStops = outboundSegments.length - 1;
    const outboundDuration = extractDurationNumbers(outboundItinerary?.duration || "N/A");
    
    // Extract flight details for return flight (itinerary 1)
    const returnItinerary = flight?.itineraries?.[1] || {};
    const returnSegments = returnItinerary?.segments || [];
    const returnFirstSegment = returnSegments[0] || {};
    const returnLastSegment = returnSegments[returnSegments.length - 1] || returnFirstSegment;
    
    // Extract values for return flight with fallbacks
    const returnDepartureDateTime = returnFirstSegment?.departure?.at || "N/A";
    const returnArrivalDateTime = returnLastSegment?.arrival?.at || "N/A";
    const returnDepartureAirport = returnFirstSegment?.departure?.iataCode || "N/A";
    const returnArrivalAirport = returnLastSegment?.arrival?.iataCode || "N/A";
    const returnDepartureTerminal = returnFirstSegment?.departure?.terminal || "";
    const returnArrivalTerminal = returnLastSegment?.arrival?.terminal || "";
    const returnFlightNumber = returnFirstSegment?.number || "N/A";
    const returnAirline = returnFirstSegment?.carrierCode || "Unknown Airline";
    const returnNumberOfStops = returnSegments.length - 1;
    const returnDuration = extractDurationNumbers(returnItinerary?.duration || "N/A");
    
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
    
    // Format times for outbound flight
    const formattedOutboundDepartureTime = formatDateTime(outboundDepartureDateTime);
    const formattedOutboundArrivalTime = formatDateTime(outboundArrivalDateTime);
    
    // Format times for return flight
    const formattedReturnDepartureTime = formatDateTime(returnDepartureDateTime);
    const formattedReturnArrivalTime = formatDateTime(returnArrivalDateTime);
    
    // Get city names from airports for outbound flight
    const outboundDepartureCity = originAirport?.city || "Unknown";
    const outboundArrivalCity = destinationAirport?.city || "Unknown";
    
    // Get city names from airports for return flight (reversed)
    const returnDepartureCity = destinationAirport?.city || "Unknown";
    const returnArrivalCity = originAirport?.city || "Unknown";
    
    // Get price information
    const price = flight?.price?.total 
        ? `${flight.price.currency} ${flight.price.total}` 
        : "Price unavailable";
    
    return (
        <div className="flight-card-container">
            {/* Outbound Flight */}
            <div className="flight-card outbound-flight">
                <div className="flight-card-header">
                    <h2 className="flight-direction">Outbound Flight</h2>
                </div>
                
                <div className="flight-card-row">
                    <div className="flight-card-s">
                        <div className="flight-card-s-icon">
                            <FontAwesomeIcon icon={faPlaneDeparture} />
                        </div>
                        <div className="flight-card-s-text">
                            <h2>Departure:</h2>
                            <p>{formattedOutboundDepartureTime}</p>
                            <p>{outboundDepartureCity} ({outboundDepartureAirport}){outboundDepartureTerminal && ` Terminal ${outboundDepartureTerminal}`}</p>
                        </div>
                    </div>
                    
                    <div className="flight-card-middle">
                        <div className="flight-details">
                            <h1 className="flight-number">{outboundFlightNumber}</h1>
                            <p className="airline-name">{outboundAirline}</p>
                            {outboundDuration && <p className="flight-duration">Duration: {outboundDuration}</p>}
                            {outboundNumberOfStops > 0 && <p className="connection-info">{outboundNumberOfStops} {outboundNumberOfStops === 1 ? 'connection' : 'connections'}</p>}
                        </div>
                        <div className="flight-price-container">
                            <p className="flight-price">{price}</p>
                        </div>
                    </div>
                    
                    <div className="flight-card-s">
                        <div className="flight-card-s-text">
                            <h2>Arrival:</h2>
                            <p>{formattedOutboundArrivalTime}</p>
                            <p>{outboundArrivalCity} ({outboundArrivalAirport}){outboundArrivalTerminal && ` Terminal ${outboundArrivalTerminal}`}</p>
                        </div>
                        <div className="flight-card-s-icon">
                            <FontAwesomeIcon icon={faPlaneArrival} />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Return Flight */}
            {returnSegments.length > 0 && (
                <div className="flight-card return-flight">
                    <div className="flight-card-header">
                        <h2 className="flight-direction">Return Flight</h2>
                    </div>
                    
                    <div className="flight-card-row">
                        <div className="flight-card-s">
                            <div className="flight-card-s-icon">
                                <FontAwesomeIcon icon={faPlaneDeparture} />
                            </div>
                            <div className="flight-card-s-text">
                                <h2>Departure:</h2>
                                <p>{formattedReturnDepartureTime}</p>
                                <p>{returnDepartureCity} ({returnDepartureAirport}){returnDepartureTerminal && ` Terminal ${returnDepartureTerminal}`}</p>
                            </div>
                        </div>
                        
                        <div className="flight-card-middle">
                            <div className="flight-details">
                                <h1 className="flight-number">{returnFlightNumber}</h1>
                                <p className="airline-name">{returnAirline}</p>
                                {returnDuration && <p className="flight-duration">Duration: {returnDuration}</p>}
                                {returnNumberOfStops > 0 && <p className="connection-info">{returnNumberOfStops} {returnNumberOfStops === 1 ? 'connection' : 'connections'}</p>}
                            </div>
                        </div>
                        
                        <div className="flight-card-s">
                            <div className="flight-card-s-text">
                                <h2>Arrival:</h2>
                                <p>{formattedReturnArrivalTime}</p>
                                <p>{returnArrivalCity} ({returnArrivalAirport}){returnArrivalTerminal && ` Terminal ${returnArrivalTerminal}`}</p>
                            </div>
                            <div className="flight-card-s-icon">
                                <FontAwesomeIcon icon={faPlaneArrival} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlightCard;