import { useEffect, useState } from 'react';
import FilterBar from './FilterBar';
import FeedbackItem from './FeedbackItem';
import FeedbackReplyModal from './FeedbackReplyModal';
import axios from 'axios';

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    state: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = () => {
    const token = localStorage.getItem('access_token');
    setLoading(true);
    axios
      .get('/api/admin/feedbacks/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setFeedbacks(res.data);
        setFilteredFeedbacks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching feedbacks:', err);
        setError('Failed to fetch feedbacks');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const { type, state, startDate, endDate } = filters;
    let filtered = feedbacks;

    if (type) {
      const lowercasedType = type.toLowerCase();
      filtered = filtered.filter((fb) =>
        fb.feedback_type_name.toLowerCase().includes(lowercasedType)
      );
    }

    if (state) {
      filtered = filtered.filter((fb) =>
        state === 'resolved' ? fb.fe_isResolve : !fb.fe_isResolve
      );
    }

    if (startDate) {
      filtered = filtered.filter((fb) =>
        new Date(fb.fe_submitedAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter((fb) => {
        const endDateAdjusted = new Date(endDate);
        endDateAdjusted.setHours(23, 59, 59, 999);
        return new Date(fb.fe_submitedAt) <= endDateAdjusted;
      });
    }

    setFilteredFeedbacks(filtered);
  }, [filters, feedbacks]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div>
      <FilterBar setFilters={setFilters} />
      <div className="flex justify-between px-4 font-bold text-gray-700 mt-4">
        <span>Type</span>
        <span>State</span>
      </div>
      <div className="mt-2">
        {filteredFeedbacks.map((fb) => (
          <div key={fb.id} onClick={() => setSelectedFeedback(fb)}>
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
  );
}