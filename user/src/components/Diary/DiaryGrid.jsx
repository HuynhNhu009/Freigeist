import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

function DiaryGrid({ filters }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), "yyyy-MM-dd");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://127.0.0.1:8888/api/diaries/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const transformed = res.data.map((entry) => ({
          id: entry.id,
          date: entry.de_date,
          title: entry.de_title,
          content: entry.de_content,
          emotionScore: entry.de_emoScore,
          tags: entry.tags || [], // 🔥 giả sử API trả tags cho mỗi entry
          imageUrl:
            Array.isArray(entry.images) && entry.images.length > 0
              ? typeof entry.images[0] === "string"
                ? entry.images[0]
                : entry.images[0]?.di_imageUrl?.startsWith("http")
                ? entry.images[0].di_imageUrl
                : `http://127.0.0.1:8888${entry.images[0]?.di_imageUrl}`
              : null,
        }));

        // sắp xếp mới nhất lên trước
        const sorted = transformed.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setEntries(sorted);
      } catch (err) {
        console.error("Lỗi khi lấy nhật ký:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // Function to handle deleting an entry
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa nhật ký này?")) return;
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://127.0.0.1:8888/api/diaries/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa nhật ký:", err);
      alert("Xóa nhật ký thất bại!");
    }
  };

  // 📌 Lọc dựa vào filters
  const filteredEntries = entries.filter((entry) => {
    if (!filters) return true;

    // Lọc theo ngày
    if (filters.filterType === "day" && filters.date) {
      if (entry.date !== filters.date) return false;
    }

    // Lọc theo tháng
    if (filters.filterType === "month" && filters.date) {
      const entryMonth = entry.date.slice(0, 7); // yyyy-MM
      if (entryMonth !== filters.date) return false;
    }

    // Lọc theo tags
    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some((t) => entry.tags?.includes(t));
      if (!hasTag) return false;
    }

    return true;
  });

  return loading ? (
    <Spinner sentence="Đang tải dữ liệu..." />
  ) : (
    <div className="grid grid-cols-1 h-[100vh] overflow-y-auto md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full bg-cover bg-center bg-fixed bg-gray-800 gap-4 p-4">
      {/* Ô tạo mới */}
      <div
        className="border-2 border-dashed border-gray-400 rounded-2xl flex items-center justify-center bg-gray-50 text-gray-500 text-5xl hover:text-6xl cursor-pointer max-h-[260px] hover:bg-gray-100"
        onClick={() => navigate("/new-entry")}
        title="Tạo nhật ký mới"
      >
        +
      </div>

      {/* Các entry đã lọc */}
      {filteredEntries.map((entry, index) => (
        <div
          key={entry.id}
          className="relative border rounded-xl overflow-hidden bg-white/80 max-h-[260px] shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01] min-h-[250px] flex flex-col"
        >
          {/* Nút xoá */}
          <button
            onClick={() => handleDelete(entry.id)}
            className="absolute top-1 right-1 z-10 text-red-500 hover:text-red-700 text-xl bg-white/80 rounded-full p-1"
            title="Xóa nhật ký"
          >
            ❌
          </button>

          {/* Ảnh */}
          <div
            className="h-40 w-full overflow-hidden cursor-pointer"
            onClick={() => navigate(`/edit-entry/${entry.id}`)}
          >
            <img
              src={entry.imageUrl || "/regis03.jpg"}
              alt={`Image ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Nội dung */}
          <div
            className="p-4 relative cursor-pointer"
            onClick={() => navigate(`/edit-entry/${entry.id}`)}
          >
            {entry.date === today && (
              <div
                className="absolute top-2 right-2 text-blue-600 text-lg"
                title="Chỉnh sửa nhật ký hôm nay"
              >
                ✏️
              </div>
            )}
            <div className="text-sm text-gray-500 mb-1">
              📅 {format(new Date(entry.date), "dd/MM/yyyy")}
            </div>
            <div className="text-gray-900 line-clamp-4 whitespace-pre-wrap">
              {entry.title}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Điểm cảm xúc:{" "}
              {entry.emotionScore
                ? `${entry.emotionScore}/100`
                : "Chưa đánh giá"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default DiaryGrid;
