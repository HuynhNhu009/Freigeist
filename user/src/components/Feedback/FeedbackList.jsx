import { useState, useEffect } from "react";
import axios from "axios";

export default function FeedbackList({ onSelect, selected }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const res = await axios.get("http://127.0.0.1:8888/api/feedbacks/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFeedbacks(res.data);
      } catch (error) {
        console.error("Lỗi khi tải feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) return <div>Đang tải feedback...</div>;

  return (
    <div className="space-y-2">
      {feedbacks.length === 0 ? (
        <div>Chưa có feedback nào.</div>
      ) : (
        feedbacks.map((fb) => (
          <div
            key={fb.id}
            onClick={() => onSelect(fb)}
            className={`p-2 rounded cursor-pointer ${
              selected === fb.id ? "bg-blue-300" : "bg-blue-100"
            }`}
          >
            <div className="font-semibold">{fb.fe_title}</div>
            <div className="text-sm text-gray-700">
              Ngày gửi: {new Date(fb.fe_submitedAt).toLocaleString()}
            </div>
            <div className="text-xs italic text-gray-800">
              Trạng thái: {fb.fe_isResolve ? "Đã được phản hồi" : "Chưa xử lý"}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
