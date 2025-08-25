import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("user_info"));

  const [avatarUrl, setAvatarUrl] = useState(userInfo?.user_avatarUrl || "https://i.imgur.com/F2n7X0u.png");
  const [fullname, setFullname] = useState(userInfo?.user_fullname || "");
  const [dob, setDob] = useState(userInfo?.user_dob || "");
  const [gender, setGender] = useState(userInfo?.user_gender || "");
  const [interests, setInterests] = useState(userInfo?.user_interests || "");
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isEdited) {
        e.preventDefault();
        e.returnValue = "Bạn có thay đổi chưa lưu, chắc chắn muốn rời đi?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isEdited]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const res = await axios.post("http://127.0.0.1:8888/api/user/avatar/", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setAvatarUrl(res.data.avatarUrl);
        const updated = { ...userInfo, user_avatarUrl: res.data.avatarUrl };
        localStorage.setItem("user_info", JSON.stringify(updated));
      } catch (error) {
        console.error("Lỗi cập nhật avatar:", error);
        alert("Không thể cập nhật avatar.");
      }
    }
  };

  const handleSave = async () => {
    try {
      axios.patch(`http://127.0.0.1:8888/api/users/${userInfo.id}/`, {
        user_fullname: fullname,
        user_dob: dob,
        user_gender: gender,
        user_interests: interests,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });
      const updated = { ...userInfo, user_fullname: fullname, user_dob: dob, user_gender: gender, user_interests: interests };
      localStorage.setItem("user_info", JSON.stringify(updated));
      alert("Cập nhật thành công!");
      setIsEdited(false);
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);
      alert("Cập nhật thất bại!");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://127.0.0.1:8888/api/logout/");
    } catch (error) {
      console.warn("Đăng xuất lỗi, nhưng đã xoá local token.");
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_info");
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className="flex max-w-5xl mx-auto mt-8 p-6 bg-gray-50 rounded-lg shadow-md h-[480px]">
      {/* Left Panel */}
      <div className="w-1/3 flex flex-col items-center border-r border-gray-300 pr-6">
        <div className="relative">
          <img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover mb-4" />
          <label htmlFor="avatarUpload" className="absolute bottom-2 right-2 bg-white border rounded-full p-1 cursor-pointer shadow">
            ✏️
            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </label>
        </div>
        <h2 className="text-xl font-semibold">{userInfo?.user_fullname}</h2>
        <p className="text-gray-600">{userInfo?.user_email}</p>
        <p className="italic text-sm mt-2">“can we do it again?”</p>
      </div>

      {/* Right Panel */}
      <div className="w-2/3 pl-6">
        <h3 className="text-xl font-semibold mb-4">Account Info</h3>

        <div className="space-y-3">
          <div>
            <label className="block font-medium text-sm mb-1">Name</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => { setFullname(e.target.value); setIsEdited(true); }}
              className="w-full border rounded px-3 py-1"
            />
          </div>
          <div>
            <label className="block font-medium text-sm mb-1">Date of birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => { setDob(e.target.value); setIsEdited(true); }}
              className="w-full border rounded px-3 py-1"
            />
          </div>
          <div>
            <label className="block font-medium text-sm mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => { setGender(e.target.value); setIsEdited(true); }}
              className="w-full border rounded px-3 py-1"
            >
              <option value="">-- Select --</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div>
            <label className="block font-medium text-sm mb-1">Hobbies</label>
            <textarea
              value={interests}
              onChange={(e) => { setInterests(e.target.value); setIsEdited(true); }}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>
          <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleLogout}
            className="bg-orange-500 text-white font-bold py-2 px-6 rounded hover:bg-orange-600"
          >
            Log out
          </button>

          <button
            onClick={handleSave}
            disabled={!isEdited}
            className={`py-2 px-6 rounded font-bold ${isEdited ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-indigo-200 text-white cursor-not-allowed"}`}
          >
            Save
          </button>
        </div>
        </div>

        
      </div>
    </div>
  );
};

export default UserProfile;