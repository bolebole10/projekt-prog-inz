import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faExchangeAlt, faArrowRight, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import './FlightCard.css'; 

const BusCard = ({ journey }) => {
    // Format the departure and arrival dates
    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return "N/A";
        
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
    
    // Calculate connection time between segments
    const calculateConnectionTime = (arrivalTime, departureTime) => {
        if (!arrivalTime || !departureTime) return "";
        
        try {
            const arrival = new Date(arrivalTime);
            const departure = new Date(departureTime);
            
            // Calculate difference in milliseconds
            const diffMs = departure - arrival;
            
            // Convert to hours and minutes
            const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            
            if (diffHrs > 0) {
                return `${diffHrs}h ${diffMins}m`;
            } else {
                return `${diffMins}m`;
            }
        } catch (e) {
            return "";
        }
    };

    // Check if journey data exists
    if (!journey) {
        return <div className="flight-card">No journey data available</div>;
    }

    // Extract values with fallbacks
    const departureDateTime = journey.dep_offset || "N/A";
    const arrivalDateTime = journey.arr_offset || "N/A";
    const departureCity = journey.dep_name || "Unknown";
    const arrivalCity = journey.arr_name || "Unknown";
    const duration = journey.duration || "N/A";
    const changeovers = journey.changeovers || 0;
    const segments = journey.segments || [];
    const deeplink = journey.deeplink || "#";
    const price = journey.fares && journey.fares.length > 0 
        ? `${journey.fares[0].currency} ${journey.fares[0].price}` 
        : "Price unavailable";
    
    const formattedDepartureTime = formatDateTime(departureDateTime);
    const formattedArrivalTime = formatDateTime(arrivalDateTime);

    return (
        <div className="flight-card-container">
            {/* Single Card Container */}
            <div className="flight-card" style={{ flexDirection: 'column' }}>
                {/* Main Trip Information */}
                <div className="p-4 flex flex-wrap justify-between items-center gap-4">
                    {/* Departure Information */}
                    <div className="flight-card-s">
                        <div className="flight-card-s-icon">
                            <FontAwesomeIcon icon={faBus} />
                        </div>
                        <div className="flight-card-s-text">
                            <h2>{departureCity}</h2>
                            <p>{formattedDepartureTime}</p>
                        </div>
                    </div>

                    {/* Middle Section - Duration, Changeovers */}
                    <div className="flight-card-s">
                        <div className="flight-duration">{duration}</div>
                        <div className="airline-name">
                            {changeovers === 0 ? (
                                <span>Direct</span>
                            ) : (
                                <span>
                                    <FontAwesomeIcon icon={faExchangeAlt} /> {changeovers} {changeovers === 1 ? 'change' : 'changes'}
                                </span>
                            )}
                        </div>
                        <div className="flight-number">
                            {segments.length > 0 && segments[0].product ? segments[0].product.toUpperCase() : 'FLIXBUS'}
                        </div>
                    </div>

                    {/* Arrival Information */}
                    <div className="flight-card-s">
                        <div className="flight-card-s-icon">
                            <FontAwesomeIcon icon={faArrowRight} />
                        </div>
                        <div className="flight-card-s-text">
                            <h2>{arrivalCity}</h2>
                            <p>{formattedArrivalTime}</p>
                        </div>
                    </div>

                    {/* Price and Book Button */}
                    <div className="flight-card-s">
                        <div className="flight-price">{price}</div>
                        <a 
                            href={deeplink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
                        >
                            Book <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </a>
                    </div>
                </div>
                
                {/* Journey Details Section - Part of the same card */}
                {segments.length > 1 && (
                    <div className="border-t border-gray-200">
                        <div className="p-4">
                            <div className="flex items-center mb-4">
                                <div className="text-teal-600 mr-2">
                                    <FontAwesomeIcon icon={faExchangeAlt} />
                                </div>
                                <h3 className="text-sm font-semibold text-teal-700">Journey Details</h3>
                            </div>
                            
                            <div className="space-y-4">
                                {segments.map((segment, index) => (
                                    <div key={index} className={`flex items-start ${index < segments.length - 1 ? 'pb-4 border-b border-gray-100' : ''}`}>
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-medium mr-3">
                                            {index + 1}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex flex-wrap items-center mb-2">
                                                <div className="font-medium text-gray-800 mr-1">{segment.dep_name}</div>
                                                <div className="mx-1 text-gray-400">
                                                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                                                </div>
                                                <div className="font-medium text-gray-800">{segment.arr_name}</div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                <div className="text-gray-600">
                                                    <span className="inline-block bg-gray-100 rounded-md px-2 py-1 mr-1">
                                                        {formatDateTime(segment.dep_offset)}
                                                    </span>
                                                    -
                                                    <span className="inline-block bg-gray-100 rounded-md px-2 py-1 ml-1">
                                                        {formatDateTime(segment.arr_offset)}
                                                    </span>
                                                </div>
                                                <div className="text-teal-600 capitalize font-medium flex items-center justify-start md:justify-end">
                                                    <FontAwesomeIcon icon={faBus} className="mr-2" />
                                                    {segment.product_type}: {segment.product}
                                                </div>
                                            </div>
                                            
                                            {index < segments.length - 1 && (
                                                <div className="mt-3 flex items-center">
                                                    <div className="text-xs text-amber-600 font-medium bg-amber-50 py-1 px-3 rounded-full border border-amber-100">
                                                        Connection time: {calculateConnectionTime(segment.arr_offset, segments[index + 1].dep_offset)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusCard;