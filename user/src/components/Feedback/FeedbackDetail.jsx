import { useEffect, useState } from "react";
import axios from "axios";

export default function FeedbackDetail({ feedback }) {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!feedback?.id || !token) return;

    const controller = new AbortController();
    setLoading(true);

    axios
      .get(`http://127.0.0.1:8888/api/responses/?feedback_id=${feedback.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      })
      .then((res) => {
        // Trường hợp API trả object hoặc list
        if (Array.isArray(res.data)) {
          setResponse(res.data[0]?.response || "");
        } else {
          setResponse(res.data?.response || "");
        }
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.error("Lỗi khi tải phản hồi:", err);
          setResponse("");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [feedback, token]);

  if (!feedback) {
    return <div className="italic text-gray-500">Chọn một feedback để xem chi tiết.</div>;
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Tiêu đề: {feedback.fe_title}</h2>
      <div className="text-sm italic text-gray-600">
        Loại góp ý: {feedback.feedback_type_name || "Không rõ"} –{" "}
        {new Date(feedback.fe_submitedAt).toLocaleString()}
      </div>

      <div>
        <h3 className="font-semibold">Nội dung:</h3>
        <p className="whitespace-pre-wrap">{feedback.fe_content}</p>
      </div>

      <div>
        <h3 className="font-semibold">Phản hồi từ hệ thống:</h3>
        {loading ? (
          <p className="text-gray-500 italic">Đang tải phản hồi...</p>
        ) : (
          <p className="whitespace-pre-wrap text-gray-800">
            {response || "(Chưa có phản hồi)"}
          </p>
        )}
      </div>
    </div>
  );
}
