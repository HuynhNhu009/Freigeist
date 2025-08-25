import { useState } from "react";
import axios from "axios";
import { a } from "framer-motion/client";

export default function FeedbackForm({ types }) {
  const [title, setTitle] = useState("");
  const [typeId, setTypeId] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!title || !typeId || !content) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setLoading(true);
      

      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Bạn chưa đăng nhập!");
        return;
      }

      const payload = {
        feedback_type: parseInt(typeId),
        fe_title: title,
        fe_content: content,
      };

      const res = await axios.post(
        "http://127.0.0.1:8888/api/feedbacks/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Gửi feedback thành công!");
      setTitle("");
      setTypeId("");
      setContent("");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi gửi feedback. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <input
        type="text"
        placeholder="Tiêu đề"
        className="border p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className="border p-2 rounded"
        value={typeId}
        onChange={(e) => setTypeId(e.target.value)}
      >
        <option value="">Loại report (combo box)</option>
        {types.map((t) => (
          <option key={t.id} value={t.id}>
            {t.ft_name}
          </option>
        ))}
      </select>
      <textarea
        rows={5}
        placeholder="Nội dung chi tiết"
        className="border p-2 rounded h-64"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? "Đang gửi..." : "Send"}
      </button>
      
    </div>
  );
}
