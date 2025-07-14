import React, { useState } from "react";

const Transport = () => {
  const [search, setSearch] = useState("");

  const options = [
    { type: "Matatu", description: "Colorful minibuses for urban transport." },
    { type: "Boda Boda", description: "Motorbike taxis for short rides." },
    { type: "Car Rental", description: "Private car hire for travel and tours." },
  ];

  const filteredOptions = options.filter(option =>
    option.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-emerald-600">Kenyan Transport Options</h1>

      <input
        type="text"
        placeholder="Search transport options..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-6">
        {filteredOptions.map((option, index) => (
          <div key={index} className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-xl font-semibold text-emerald-700">{option.type}</h2>
            <p className="text-gray-600 mt-2">{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transport;
