// src/components/admin/FeedbackList.jsx
import { useEffect, useState } from 'react'
import FeedbackItem from './FeedbackItem'
import FeedbackReplyModal from "./FeedbackReplyModal";
import axios from 'axios'

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([])
  const [selectedFeedback, setSelectedFeedback] = useState(null)

  const loadData = () => {
    const token = localStorage.getItem('access_token')
    axios.get('http://127.0.0.1:8888/api/admin/feedbacks/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setFeedbacks(res.data))
    .catch(err => console.error('Error fetching feedbacks:', err))
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between px-4 font-bold text-gray-700">
        <span>Type</span>
        <span>State</span>
      </div>

      {/* khung danh sách có scroll */}
      <div className="mt-2 flex-1 overflow-y-auto max-h-[630px] border rounded-md">
        {feedbacks.slice(0).reverse().map((fb) => (
          <div
            key={fb.id}
            onClick={() => setSelectedFeedback(fb)}
            className="cursor-pointer hover:bg-gray-100"
          >
            <FeedbackItem feedback={fb} />
          </div>
        ))}
      </div>

      {selectedFeedback && (
        <FeedbackReplyModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onSuccess={loadData}
        />
      )}
    </div>
  )
}