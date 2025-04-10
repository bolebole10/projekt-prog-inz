import React, { useState } from "react";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const data = [
    "Jabuka",
    "Banana",
    "Kruška",
    "Narandža",
    "Grožđe",
    "Lubenica"
  ];

  const filteredData = data.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Pretraži voće..."
        className="w-full p-2 border border-gray-300 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="mt-4">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <li key={index} className="py-1 border-b">
              {item}
            </li>
          ))
        ) : (
          <li className="text-gray-500">Nema rezultata.</li>
        )}
      </ul>
    </div>
  );
};

export default SearchComponent;