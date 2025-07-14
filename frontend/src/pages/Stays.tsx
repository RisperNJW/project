import React, { useState } from "react";

const Stay = () => {
  const [search, setSearch] = useState("");

  const stays = [
    { name: "Diani Beach Resort", description: "Luxury stay by the beach in Kwale." },
    { name: "Mount Kenya Lodge", description: "Scenic mountain lodge with views." },
    { name: "Masai Mara Camp", description: "Tented camp for safari experiences." },
  ];

  const filteredStays = stays.filter(stay =>
    stay.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-emerald-600">Find Places to Stay</h1>

      <input
        type="text"
        placeholder="Search accommodations..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-6">
        {filteredStays.map((stay, index) => (
          <div key={index} className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-xl font-semibold text-emerald-700">{stay.name}</h2>
            <p className="text-gray-600 mt-2">{stay.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stay;
