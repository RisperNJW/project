import React, { useState } from "react";

const Meals = () => {
  const [search, setSearch] = useState("");

  const meals = [
    { name: "Nyama Choma", description: "Grilled meat served with ugali and kachumbari." },
    { name: "Pilau", description: "Spiced rice with beef or chicken." },
    { name: "Chapati Beans", description: "Flatbread with spicy stewed beans." },
  ];

  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-emerald-600">Explore Local Meals</h1>

      <input
        type="text"
        placeholder="Search for a meal..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-6">
        {filteredMeals.map((meal, index) => (
          <div key={index} className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-xl font-semibold text-emerald-700">{meal.name}</h2>
            <p className="text-gray-600 mt-2">{meal.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meals;
