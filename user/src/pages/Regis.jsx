import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Spinner from "../components/Spinner"; // Assuming Spinner is in components folder


export default function Regis() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false); // Thêm state loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu loading

    if (!gender) {
      alert("Vui lòng chọn giới tính.");
      return;
    }

    if (!agree) {
      alert("Vui lòng đồng ý với các điều khoản của chúng tôi để tiếp tục.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp. Vui lòng thử lại.");
      return;
    }

    if(password.length < 8) {
      alert("Mật khẩu phải có ít nhất 8 ký tự. Vui lòng thử lại.");
      return; 
    }

    try{
      await axios.post("http://127.0.0.1:8888/api/register/",{
        user_fullname: name,
        user_email: email,
        user_gender: gender,
        password:password,
        user_dob: dob,
      })
      alert("Đăng ký thành công!");
      navigate('/login');

      setName("");
      setEmail("");
      setGender("");
      setPassword("");
      setConfirmPassword("");
      setDob("");
      setAgree(false);
      
    }catch (error) {
      alert("Lỗi kết nối máy chủ!");
      console.error("Lỗi gửi dữ liệu rồi ní ơi!", error);
    }
    finally {
      setLoading(false); // Kết thúc loading
    }
  }

  return (
    loading ? (
      <Spinner sentence="Đang tạo tài khoản..." />)
    : (
    <div className="bg-[url('/public/regis.jpg')]  h-screen w-screen bg-cover bg-center bg-no-repeat">

      {/* Form Container */}
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-10 shadow-lg w-[800px]">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Create new account</h2>
          <form className="grid grid-cols-2 gap-4 text-left text-sm" onSubmit={handleSubmit}>
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <label className="block mb- font-semibold">Your name</label>
                <input type="text" 
                      className="w-full p-2 rounded border-none outline-none bg-white/70 focus:ring-2 focus:ring-blue-400" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required/>
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
                <input type="email" 
                      id="email"
                      className="w-full p-2 rounded border-none outline-none bg-white/70 focus:ring-2 focus:ring-blue-400" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required/>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Gender</label>
                <div className="space-x-4" required>
                  <label><input type="radio" name="gender" value="male" onChange={(e) => setGender(e.target.value)} className="mr-1" /> Male</label>
                  <label><input type="radio" name="gender" value="female" onChange={(e) => setGender(e.target.value)} className="mr-1" /> Female</label>
                  <label><input type="radio" name="gender" value="others" onChange={(e) => setGender(e.target.value)} className="mr-1" /> Others</label>
                </div>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Password</label>
                <input type="password" 
                      className="w-full p-2 rounded border-none outline-none bg-white/70 focus:ring-2 focus:ring-blue-400" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required/>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Confirm password</label>
                <input type="password" 
                      className="w-full p-2 rounded border-none outline-none bg-white/70 focus:ring-2 focus:ring-blue-400" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required/>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">Date of birth</label>
                <div className="flex">
                  <input type="date" 
                        className="w-full p-2 rounded border-none outline-none bg-white/70 focus:ring-2 focus:ring-blue-400" 
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required/>
                </div>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Our terms</label>
                <textarea
                  rows="6"
                  className="w-full p-2 rounded border border-none outline-none bg-white/70 focus:ring-2 focus:ring-blue-400border-gray-300 resize-none"
                  defaultValue={`1. Do not jnekfjshbkcmxcmfuu\n2. Df fecyuhc4uhgmrmxoumtgrheuhmuhuu\n3. bhcbnvsdvajka\n4. b cbinecjmfgkdsflueowinchn\n5. deeececiykt`}
                />
              </div>
              <div className="flex items-center">
                <input type="checkbox" 
                  className="mr-2" 
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <label>I'm agree with all of terms</label>
              </div>
              <p className="text-sm text-black/80">
              Already have an account? <a href="/login" className="text-blue-700 font-medium">Login</a>
              </p>
            </div>

            {/* Submit button - full width */}
            <div className="col-span-2 mt-4">
              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    )
  );
}
