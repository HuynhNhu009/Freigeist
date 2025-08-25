import React, { useState, useEffect } from 'react';
import axios from '@/utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Spinner';

const NewEntry = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [images, setImages] = useState([]);
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]); // Chỉ chứa ID (số)
  const [availableTags, setAvailableTags] = useState([]); // [{id, tag_name}]
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Lấy danh sách tag từ backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get('/api/tags/');
        // Chuyển đổi id thành số nếu cần
        const tagsWithNumericIds = res.data.map(tag => ({
          ...tag,
          id: Number(tag.id) // Đảm bảo id là số
        }));
        setAvailableTags(tagsWithNumericIds);
      } catch (err) {
        console.error('Lỗi tải tag:', err);
      }
    };
    fetchTags();
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const selected = files.slice(0, 3 - images.length);
    setImages([...images, ...selected]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleTag = (id) => {
    const numericId = Number(id); // Đảm bảo id là số
    setSelectedTags((prev) =>
      prev.includes(numericId) ? prev.filter((t) => t !== numericId) : [...prev, numericId]
    );
    console.log('Selected Tags:', selectedTags); // Debug để kiểm tra
  };

  const handleCreate = async () => {
    const user = JSON.parse(localStorage.getItem('user_info'));
    const token = localStorage.getItem('access_token');

    if (!user || !token) {
      alert('Vui lòng đăng nhập lại!');
      return;
    }

    const payload = {
      de_title: title,
      de_content: content,
      de_date: date,
      tags: selectedTags, // Gửi mảng ID (số)
    };

    console.log('Payload:', payload); // Debug payload trước khi gửi

    setLoading(true);
    try {
      // 1️⃣ Tạo nhật ký
      const res = await axios.post('/api/diaries/', payload, { timeout: 30000 });
      const diaryId = res.data.id;

      // 2️⃣ Upload ảnh nếu có
      for (let i = 0; i < images.length; i++) {
        const formData = new FormData();
        formData.append('di_imageUrl', images[i]);
        formData.append('diary_entry', diaryId);

        await axios.post('/api/images/', formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
        });
      }

      alert('Tạo nhật ký thành công!');
      navigate('/diary');
      setTitle('');
      setContent('');
      setImages([]);
      setSelectedTags([]);
    } catch (error) {
      console.error('Lỗi tạo nhật ký:', error.response?.data || error);
      alert('Tạo nhật ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  // Map ID sang object tag
  const selectedTagObjects = availableTags.filter((tag) =>
    selectedTags.includes(tag.id)
  );
  const unselectedTags = availableTags.filter(
    (tag) => !selectedTags.includes(tag.id)
  );

  return loading ? (
    <Spinner sentence="Đang tạo nhật ký..." />
  ) : (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
      {/* Left */}
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

        {/* Ảnh */}
        <div className="flex items-center gap-2">
          <label htmlFor="imageInput">
            <div className="w-20 h-20 border-2 border-dashed rounded flex items-center justify-center text-3xl cursor-pointer hover:bg-gray-100">
              +
            </div>
          </label>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleImageUpload}
          />
          {images.map((file, index) => (
            <div key={index} className="relative w-20 h-20 border rounded overflow-hidden">
              <img
                src={URL.createObjectURL(file)}
                alt={`img-${index}`}
                className="w-full h-full object-cover"
              />
              <button
                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl"
                onClick={() => removeImage(index)}
              >
                ✖
              </button>
            </div>
          ))}
        </div>

        {/* Nội dung */}
        <textarea
          className="w-full border rounded p-3 min-h-[120px] text-sm h-[300px]"
          placeholder="Nội dung nhật ký ở đây nè"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Right */}
      <div className="space-y-4 bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col justify-between h-full">
        {/* Box gợi ý */}
        <div className="bg-blue-100 rounded-lg p-4 text-center shadow-md">
          <img src="./public/desk01.jpeg" alt="Illustration" className="w-32 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">
            Cứ thoải mái viết xuống những cảm nhận chân thật nhất của bản thân nhé!
          </p>
        </div>

        {/* Tag đã chọn */}
        <div>
          <h4 className="font-semibold mb-1">Thẻ (tag):</h4>
          <div className="flex flex-wrap gap-2">
            {selectedTagObjects.map((tag) => (
              <span
                key={tag.id}
                className="bg-blue-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                + {tag.tag_name}
                <button onClick={() => toggleTag(tag.id)} className="text-red-600 font-bold">
                  ✖
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Tag chưa chọn */}
        <div>
          <h4 className="font-semibold mb-1">Thêm thẻ:</h4>
          <div className="max-h-40 overflow-y-auto grid grid-cols-2 gap-2 text-sm px-1">
            {unselectedTags.map((tag) => (
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

        {/* Nút tạo */}
        <button
          onClick={handleCreate}
          className="w-full py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
        >
          Tạo
        </button>
      </div>
    </div>
  );
};

export default NewEntry;