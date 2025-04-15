import React from "react";

const AirportAutocomplete = ({
  value,
  onChange,
  onFocus,
  placeholder,
  showList,
  airports,
  isLoading,
  onSelect,
  renderItem
}) => {
  return (
    <div className="relative">
      <input
        type="text"
        className="bg-teal-50 h-10 w-full px-3 rounded-lg border border-teal-300 focus:ring-2 focus:ring-teal-400 outline-none transition"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
      />
      
      {/* Dropdown list */}
      {showList && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 text-center text-gray-500">Loading...</div>
          ) : airports.length > 0 ? (
            airports.map((airport, index) => (
              <div
                key={index}
                className="p-3 hover:bg-teal-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => onSelect(airport)}
              >
                {renderItem(airport)}
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-gray-500">
              No airports found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AirportAutocomplete;
