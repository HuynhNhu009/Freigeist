import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { title } from "framer-motion/client";

function DiaryGrid() {
  const [entries, setEntries] = useState([]);
  const today = format(new Date(), "yyyy-MM-dd");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://127.0.0.1:8888/api/diaries/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const transformed = res.data.map((entry) => ({
          id: entry.id,
          date: entry.de_date,
          title: entry.de_title,
          content: entry.de_content,
          emotionScore: entry.de_emoScore,
          imageUrl: entry.images?.[0]?.di_imageUrl || null,
        }));

        const sorted = transformed.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setEntries(sorted);
      } catch (err) {
        console.error("Lỗi khi lấy nhật ký:", err);
      }
    };

    fetchEntries();
  }, []);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full bg-cover bg-center bg-fixed gap-4 p-4"
      style={{ backgroundImage: "url('/desk01.jpeg')" }} // ✅ ảnh trong public folder
    >
      {/* Ô tạo mới */}
      <div
        className="border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center bg-gray-100 text-gray-500 text-3xl cursor-pointer max-h-[260px] hover:bg-gray-50"
        onClick={() => navigate("/new-entry")}
      >
        +
      </div>

      {/* Các entry */}
      {entries.map((entry) => (
        <div
          key={entry.id}
          onClick={() => navigate(`/edit-entry/${entry.id}`)}
          className="relative border rounded-xl overflow-hidden bg-white/80 max-h-[260px] shadow hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer"
        >
          {/* Ảnh */}
          <div className="h-40 w-full overflow-hidden">
            <img
              src={
                entry.imageUrl ||
                "/public/diary_cover.jpg"
              }
              alt="Ảnh nhật ký"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Nội dung */}
          <div className="p-4 relative">
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
            <div className="text-gray-800 line-clamp-4 whitespace-pre-wrap">
              {entry.title}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              😊 Cảm xúc:{" "}
              {entry.emotionScore ? `${entry.emotionScore}/100` : "Chưa đánh giá"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DiaryGrid;
