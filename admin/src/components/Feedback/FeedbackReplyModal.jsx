import { useState } from "react";
import axios from "axios";

export default function FeedbackReplyModal({ feedback, onClose, onSuccess }) {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  if (!feedback) return null; // chưa chọn feedback thì không render

  const handleSend = async () => {
    if (!reply.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        "/api/admin/responses/",
        {
          feedback: feedback.id,
          re_content: reply,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setReply("");
      if (onSuccess) onSuccess(); // refresh list
      onClose();
    } catch (err) {
      console.error("Gửi phản hồi lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded shadow-lg p-4 w-[500px] relative">
        <button
          className="absolute top-2 right-3 text-red-500 font-bold"
          onClick={onClose}
        >
          X
        </button>

        <div className="mb-3">
          <p className="font-semibold">From: {feedback.user_email}</p>
          <p>Type: {feedback.feedback_type_name}</p>
          <p className="text-sm text-gray-500">
            Date: {new Date(feedback.fe_submitedAt).toLocaleDateString()}
          </p>
          <div className="mt-2 p-2 border rounded bg-gray-50 whitespace-pre-wrap">
            {feedback.fe_content}
          </div>
        </div>

        <label className="font-semibold">Reply:</label>
        <textarea
          className="w-full border rounded p-2 mt-1"
          rows={4}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />

        <button
          className="mt-3 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
