import { useEffect, useState } from "react";
import axios from "axios";
import { Menu, X } from "lucide-react"; // icon hamburger + close

const Sidebar = ({ onFilterChange }) => {
  const [filterType, setFilterType] = useState("day");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);

  const [isOpen, setIsOpen] = useState(false); // trạng thái mở/đóng menu

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
    const filters = {
      filterType,
      date: filterType === "day" ? selectedDate : selectedMonth,
      tags: selectedTags,
    };
    onFilterChange(filters);
    setIsOpen(false); // đóng sidebar sau khi bấm lọc (mobile)
  };

  const handleReset = () => {
    setFilterType("day");
    setSelectedDate("");
    setSelectedMonth("");
    setSelectedTags([]);
    onFilterChange({});
    setIsOpen(false);
  };

  return (
    <>
      {/* 🔥 Nút hamburger hiển thị trên mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full md:h-auto bg-gray-300 shadow-sm border-r border-gray-700 w-64 p-4 space-y-6 
        transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
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
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto text-sm">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center space-x-2">
                <input
                  className="accent-indigo-500"
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
        <div className="space-y-2">
          <button
            className="w-full bg-gray-400 text-white p-2 rounded hover:bg-gray-500 transition"
            onClick={handleReset}
          >
            Thiết lập lại
          </button>
          <button
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition"
            onClick={handleFilter}
          >
            Áp dụng lọc
          </button>
        </div>
      </div>

      {/* Overlay khi mở sidebar trên mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
