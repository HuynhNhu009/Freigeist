import { useState } from "react";

export default function SearchBar({ setSearchTerm }) {
  const [input, setInput] = useState("");

  const handleSearch = () => {
    setSearchTerm(input);
  };

  return (
    <div className="flex justify-between p-3 bg-gray-200">
      <input
        type="text"
        placeholder="Search..."
        className="w-2/3 px-4 py-1 rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-1 rounded"
        onClick={handleSearch}
      >
        Find
      </button>
    </div>
  );
}