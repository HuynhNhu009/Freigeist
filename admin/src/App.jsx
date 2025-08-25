import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import UserPage from './pages/UserPage'
import ReportPage from './pages/ReportPage'
import FeedbackPage from './pages/FeedbackPage'
import Login from './pages/Login'

// Layout cho các trang chính
function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen w-screen ">
      <div className="w-64 bg-white border-r">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 bg-gray-100 justify-between">
        {children}
        <Footer />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect "/" sang login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login riêng */}
        <Route path="/login" element={<Login />} />

        {/* Các trang chính dùng layout */}
        <Route
          path="/user"
          element={
            <MainLayout>
              <UserPage />
            </MainLayout>
          }
        />
        <Route
          path="/report"
          element={
            <MainLayout>
              <ReportPage />
            </MainLayout>
          }
        />
        <Route
          path="/feedback"
          element={
            <MainLayout>
              <FeedbackPage />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
