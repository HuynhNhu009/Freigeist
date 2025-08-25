import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8888/api/', // Cập nhật lại nếu cần
  withCredentials: true,
})

// ---------- User ----------
export const getAllUsers = async () => {
  const res = await API.get('/users/')
  return res.data
}

export const getUserDetail = async (id) => {
  const res = await API.get(`/users/${id}/`)
  return res.data
}

// ---------- Report ----------
export const getReportStats = async () => {
  const res = await API.get('/admin/users/')
  return res.data  
}

export const getAgeGroups = async () => {
  const res = await API.get('/admin/diaries/')
  return res.data  
}

// ---------- Feedback ----------
export const getAllFeedbacks = async () => {
  const res = await API.get('/feedbacks/')
  return res.data
}
