import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log("🟡 ID từ URL:", id); // ✅ kiểm tra xem có bị undefined không

  const [title, setTitle] = useState('');
  const [emotion, setEmotion] = useState('');
  const [score, setScore] = useState(0);
  const [advice, setAdvice] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 👈 để tránh render khi dữ liệu chưa sẵn sàng

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const [tagsRes, entryRes] = await Promise.all([
          axios.get("http://localhost:8888/api/tags/"),
          axios.get(`http://localhost:8888/api/diaries/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAvailableTags(tagsRes.data);
        const entry = entryRes.data;

        setTitle(entry.de_title || '');
        setEmotion(entry.de_emoState || '');
        setScore(entry.de_emoScore || 0);
        setAdvice(entry.de_advice || '');
        setDate(entry.de_date || '');
        setContent(entry.de_content || '');
        setSelectedTags(entry.tags || []); // 👈 tránh undefined
        setIsLoading(false);
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu:", err);
        alert("Không thể tải dữ liệu nhật ký.");
        navigate("/diary");
      }
    };

    if (id) {
      fetchData();
    } else {
      alert("Không tìm thấy ID nhật ký.");
      navigate("/diary");
    }
  }, [id, navigate]);

  const toggleTag = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleEdit = async () => {
    if (!title || !content) {
      return alert("Vui lòng nhập tiêu đề và nội dung!");
    }

    const token = localStorage.getItem("access_token");
    if (!token) return alert("Vui lòng đăng nhập.");

    setIsSaving(true);

    try {
      await axios.put(`http://localhost:8888/api/diaries/${id}/`, {
        de_title: title,
        de_content: content,
        de_date: date,
        de_emoState: emotion,
        de_emoScore: score,
        tags: selectedTags
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      alert("Cập nhật thành công!");
      navigate("/diary");
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err.response?.data || err);
      alert("Cập nhật thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center text-gray-600">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
      {/* Left Side */}
      <div className="lg:col-span-2 space-y-4 bg-white border border-gray-300 rounded-lg shadow-md p-4 h-[500px]">
        <div className="flex items-center justify-between">
          <input
            className="text-lg font-bold border w-full mr-4 rounded px-2 py-1"
            value={title}
            placeholder="Tiêu đề nhật ký"
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={date}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <input
          className="border rounded px-2 py-1 text-sm w-full"
          value={emotion}
          placeholder="Tâm trạng (tùy chọn)"
          onChange={(e) => setEmotion(e.target.value)}
        />

        <input
          type="number"
          min={0}
          max={10}
          className="border rounded px-2 py-1 text-sm w-full"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          placeholder="Mức độ cảm xúc (0-10)"
        />

        <textarea
          className="w-full border rounded p-3 min-h-[120px] text-sm h-[300px]"
          placeholder="Nội dung nhật ký ở đây nè"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Right Side */}
      <div className="space-y-4 bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col justify-between h-full">
        <div className="bg-blue-100 rounded-lg p-4 text-center shadow-md">
          <img src="/desk01.jpeg" alt="Illustration" className="w-32 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">
            {advice}
          </p>
        </div>

        {/* Selected Tags */}
        <div>
          <h4 className="font-semibold mb-1">Thẻ đã chọn:</h4>
          <div className="flex flex-wrap gap-2">
            {availableTags
              .filter(tag => selectedTags.includes(tag.id))
              .map(tag => (
                <span key={tag.id} className="bg-blue-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  + {tag.tag_name}
                  <button onClick={() => toggleTag(tag.id)} className="text-red-600 font-bold">✖</button>
                </span>
              ))}
          </div>
        </div>

        {/* Unselected Tags */}
        <div>
          <h4 className="font-semibold mb-1">Thêm thẻ:</h4>
          <div className="max-h-40 overflow-y-auto grid grid-cols-2 gap-2 text-sm px-1">
            {availableTags
              .filter(tag => !selectedTags.includes(tag.id))
              .map(tag => (
                <label key={tag.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => toggleTag(tag.id)}
                  />
                  {tag.tag_name}
                </label>
              ))}
          </div>
        </div>

        <button
          onClick={handleEdit}
          disabled={isSaving}
          className="w-full py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
};

export default EditEntry;
