import { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = () => {
  const [filterType, setFilterType] = useState("day");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);

  // Gọi API lấy danh sách tag khi component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("http://localhost:8888/api/tags/");
        setTags(res.data);
      } catch (error) {
        console.error("Lỗi khi tải tag:", error);
      }
    };

    fetchTags();
  }, []);

  const toggleTag = (tagName) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleFilter = () => {
    // Gửi selectedDate / selectedMonth / selectedTags đến parent hoặc context
    console.log("Lọc theo:", {
      filterType,
      selectedDate,
      selectedMonth,
      selectedTags,
    });
  };

  return (
    <div className="w-64 p-4 border-r space-y-6 bg-white shadow-sm">
      {/* Lọc theo thời gian */}
      <div>
        <label className="font-semibold block mb-1">📆 Lọc theo:</label>
        <select
          className="w-full border rounded p-1"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="day">Ngày cụ thể</option>
          <option value="month">Tháng cụ thể</option>
        </select>

        {filterType === "day" && (
          <input
            type="date"
            className="w-full mt-2 border rounded p-1"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        )}

        {filterType === "month" && (
          <input
            type="month"
            className="w-full mt-2 border rounded p-1"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        )}
      </div>

      {/* Lọc theo Tag */}
      <div>
        <label className="font-semibold block mb-2">🏷️ Chọn tag:</label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto text-sm">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag.tag_name)}
                onChange={() => toggleTag(tag.tag_name)}
              />
              <span>{tag.tag_name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Nút lọc */}
      <button
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        onClick={handleFilter}
      >
        Áp dụng lọc
      </button>
    </div>
  );
};

export default Sidebar;
