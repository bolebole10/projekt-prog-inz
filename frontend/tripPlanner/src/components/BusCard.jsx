import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faExchangeAlt, faArrowRight, faExternalLinkAlt, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import './FlightCard.css'; 

const BusCard = ({ journey, returnJourney }) => {
    const [isExpanded, setIsExpanded] = useState(false);
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
                <div className="p-4 flex flex-wrap justify-between items-center gap-4" style={{ borderBottom: returnJourney ? '1px solid #e5e7eb' : 'none' }}>
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
                        <a href={deeplink} target="_blank" rel="noopener noreferrer" className="bg-teal-600 text-white py-2 px-4 rounded-md flex items-center hover:bg-teal-700 transition-colors">
                            <span>Book </span>
                            <span className="ml-2 font-semibold">{price}</span>
                            <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2" />
                        </a>
                    </div>
                </div>
                
                {/* Toggle Button for Journey Details */}
                {segments.length > 0 && (
                    <div 
                        className="p-2 border-t border-gray-200 bg-gray-50 flex justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <span className="text-sm font-medium text-gray-600 mr-2">
                            {isExpanded ? 'Hide' : 'Show'} journey details
                        </span>
                        <FontAwesomeIcon 
                            icon={isExpanded ? faAngleUp : faAngleDown} 
                            className="text-gray-600"
                        />
                    </div>
                )}
                
                {/* Return Trip Information */}
                {returnJourney && (
                    <div className="p-4 flex flex-wrap justify-between items-center gap-4 bg-blue-50">
                        {/* Departure Information */}
                        <div className="flight-card-s">
                            <div className="flight-card-s-icon" style={{ backgroundColor: '#dbeafe' }}>
                                <FontAwesomeIcon icon={faBus} style={{ color: '#3b82f6' }} />
                            </div>
                            <div className="flight-card-s-text">
                                <h2>{returnJourney.dep_name || "Unknown"}</h2>
                                <p>{formatDateTime(returnJourney.dep_offset || "N/A")}</p>
                            </div>
                        </div>

                        {/* Middle Section - Duration, Changeovers */}
                        <div className="flight-card-s">
                            <div className="flight-duration">{returnJourney.duration || "N/A"}</div>
                            <div className="airline-name">
                                {(returnJourney.changeovers || 0) === 0 ? (
                                    <span>Direct</span>
                                ) : (
                                    <span>
                                        <FontAwesomeIcon icon={faExchangeAlt} /> {returnJourney.changeovers} {returnJourney.changeovers === 1 ? 'change' : 'changes'}
                                    </span>
                                )}
                            </div>
                            <div className="flight-number">
                                <span className="text-blue-600 font-medium">RETURN</span>
                            </div>
                        </div>

                        {/* Arrival Information */}
                        <div className="flight-card-s">
                            <div className="flight-card-s-icon" style={{ backgroundColor: '#dbeafe' }}>
                                <FontAwesomeIcon icon={faBus} style={{ color: '#3b82f6' }} />
                            </div>
                            <div className="flight-card-s-text">
                                <h2>{returnJourney.arr_name || "Unknown"}</h2>
                                <p>{formatDateTime(returnJourney.arr_offset || "N/A")}</p>
                            </div>
                        </div>

                        {/* Price Information */}
                        <a 
                            href={returnJourney.deeplink || "#"} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-blue-600 text-white py-2 px-4 rounded-md flex items-center hover:bg-blue-700 transition-colors"
                        >
                            <span>Book </span>
                            <span className="ml-2 font-semibold">
                                {returnJourney.fares && returnJourney.fares.length > 0 
                                    ? `${returnJourney.fares[0].currency} ${returnJourney.fares[0].price}` 
                                    : "Price unavailable"}
                            </span>
                            <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2" />
                        </a>
                    </div>
                )}
                
                {/* Round Trip Summary */}
                {returnJourney && (
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                        <div className="flex flex-wrap justify-between items-center">
                            <div className="font-semibold text-gray-800">Round Trip Summary:</div>
                            <div className="text-lg font-bold text-purple-700">
                                {/* Calculate total price if both journeys have fares */}
                                {journey.fares && journey.fares.length > 0 && returnJourney.fares && returnJourney.fares.length > 0 ? (
                                    `${journey.fares[0].currency} ${(parseFloat(journey.fares[0].price) + parseFloat(returnJourney.fares[0].price)).toFixed(2)}`
                                ) : (
                                    "Total price varies"
                                )}
                            </div>
                        </div>
                    </div>
                )}

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
                
                {/* Return Journey Details if expanded */}
                {isExpanded && returnJourney && returnJourney.segments && returnJourney.segments.length > 0 && (
                    <div className="journey-details bg-blue-50">
                        <div className="p-4">
                            <div className="flex items-center mb-4">
                                <div className="text-blue-600 mr-2">
                                    <FontAwesomeIcon icon={faExchangeAlt} />
                                </div>
                                <h3 className="text-sm font-semibold text-blue-700">Return Journey Details</h3>
                            </div>
                            
                            <div className="space-y-4">
                                {returnJourney.segments.map((segment, index) => (
                                    <div key={index} className={`flex items-start ${index < returnJourney.segments.length - 1 ? 'pb-4 border-b border-blue-100' : ''}`}>
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3">
                                            {index + 1}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex flex-wrap items-center mb-2">
                                                <div className="font-medium text-gray-800 mr-1">{segment.dep_name}</div>
                                                <div className="mx-1 text-blue-400">
                                                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                                                </div>
                                                <div className="font-medium text-gray-800">{segment.arr_name}</div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                <div className="text-gray-600">
                                                    <span className="inline-block bg-blue-100 rounded-md px-2 py-1 mr-1">
                                                        {formatDateTime(segment.dep_offset)}
                                                    </span>
                                                    -
                                                    <span className="inline-block bg-blue-100 rounded-md px-2 py-1 ml-1">
                                                        {formatDateTime(segment.arr_offset)}
                                                    </span>
                                                </div>
                                                <div className="text-blue-600 capitalize font-medium flex items-center justify-start md:justify-end">
                                                    <FontAwesomeIcon icon={faBus} className="mr-2" />
                                                    {segment.product_type}: {segment.product}
                                                </div>
                                            </div>
                                            
                                            {index < returnJourney.segments.length - 1 && (
                                                <div className="mt-3 flex items-center">
                                                    <div className="text-xs text-blue-600 font-medium bg-blue-50 py-1 px-3 rounded-full border border-blue-100">
                                                        Connection time: {calculateConnectionTime(segment.arr_offset, returnJourney.segments[index + 1].dep_offset)}
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