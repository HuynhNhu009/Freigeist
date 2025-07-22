import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import axios from '@/utils/axiosInstance';



const NewEntry = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [images, setImages] = useState([]);
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // ✅ Tải tag từ backend khi load trang
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("/api/tags/");
        setAvailableTags(res.data); // giữ nguyên cấu trúc { id, tag_name }
        if (res.data.length > 0) {
          setSelectedTags([res.data[0].id]); // chọn tag đầu tiên mặc định
        }
      } catch (err) {
        console.error("Lỗi tải tag:", err);
      }
    };
    fetchTags();
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const selected = files.slice(0, 3 - images.length); // giới hạn 3 ảnh
    setImages([...images, ...selected]);
  };

  const removeImage = (index) => {
    const newImgs = [...images];
    newImgs.splice(index, 1);
    setImages(newImgs);
  };

  const toggleTag = (id) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
   const user = JSON.parse(localStorage.getItem("user_info"));
   const token = localStorage.getItem("access_token");

    if (!user || !token) {
     alert("Vui lòng đăng nhập lại!");
      return;
    }

    const payload = {
      de_title: title,
      de_content: content,
      de_date: date,
      tags: selectedTags,
    };

   try {
    // 1️⃣ Tạo nhật ký trước
      // const res = await axios.post("http://127.0.0.1:8888/api/diaries/", payload, {
      //   headers: {
      //    Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/json",
      //   },
      // });
      const res = await axios.post("/api/diaries/", payload);

      const diaryId = res.data.id;

      // 2️⃣ Upload ảnh nếu có
      for (let i = 0; i < images.length; i++) {
        const formData = new FormData();
        formData.append("image", images[i]);
        formData.append("diary_entry", diaryId);

      //   await axios.post("http://127.0.0.1:8888/api/images/", formData, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "multipart/form-data",
      //    },
      // });
      await axios.post("/api/images/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      }

      alert("Tạo nhật ký thành công!");
    // ✅ Reset state nếu muốn
      setTitle('');
      setContent('');
      setImages([]);
      setSelectedTags([]);
    } catch (error) {
      console.error("Lỗi tạo nhật ký:", error.response?.data || error);
      alert("Tạo nhật ký thất bại!");
    }
  };

  
  const selectedTagObjects = availableTags.filter((tag) =>
    selectedTags.includes(tag.id)
  );
  const unselectedTags = availableTags.filter(
    (tag) => !selectedTags.includes(tag.id)
  );

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
            <div
              key={index}
              className="relative w-20 h-20 border rounded overflow-hidden"
            >
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

      {/* Right Side */}
      <div className="space-y-4 bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col justify-between h-full">
        {/* Hộp khuyến khích */}
        <div className="bg-blue-100 rounded-lg p-4 text-center shadow-md">
          <img
            src="./public/desk01.jpeg"
            alt="Illustration"
            className="w-32 mx-auto mb-2"
          />
          <p className="text-sm font-medium text-gray-700">
            Cứ thoải mái viết xuống những cảm nhận chân thật nhất của bản thân
            nhé!
          </p>
        </div>

        {/* Selected Tags */}
        <div>
          <h4 className="font-semibold mb-1">Thẻ (tag):</h4>
          <div className="flex flex-wrap gap-2">
            {selectedTagObjects.map((tag) => (
              <span
                key={tag.id}
                className="bg-blue-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                + {tag.tag_name}
                <button
                  onClick={() => toggleTag(tag.id)}
                  className="text-red-600 font-bold"
                >
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
                  checked={false}
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
