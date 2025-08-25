import React from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Spinner from "../components/Spinner"; // Assuming Spinner is in components folder

const LoginForm = () => {

  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 🔄 bắt đầu loading 

    try{
      const response = await axios.post("http://127.0.0.1:8888/api/login/", {
        user_email : email,
        password : password
      });

      const { access, refresh, user } = response.data;

      // ✅ Lưu token và thông tin user vào localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_info', JSON.stringify(user));

      alert("Đăng nhập thành công!");
      navigate('/user'); // Chuyển hướng đến trang user sau khi đăng nhập thành công
    }catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert("Email hoặc mật khẩu sai");
        } else {
          alert("Lỗi: " + (error.response.data?.detail || "Không xác định"));
        }
      } else {
        alert("Lỗi kết nối máy chủ!");
      }
      console.error("Lỗi gửi dữ liệu rồi ní ơi!", error);
    }
    finally {
      setLoading(false); // 🔄 kết thúc loading
    }
  }

  return (
    loading ? (
      <Spinner sentence="Đang đăng nhập..." />
    ) : (
      <div className="bg-gray-300 bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 w-96 shadow-lg border border-white/30">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Admin Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block font-semibold text-sm text-black mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border-none outline-none bg-white/70 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-semibold text-sm text-black mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border-none outline-none bg-white/70 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-md transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
    )
  );
};

export default LoginForm;
