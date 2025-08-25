import { useState, useEffect } from "react";
import FeedbackForm from "../components/Feedback/FeedbackForm";
import FeedbackList from "../components/Feedback/FeedbackList";
import FeedbackDetail from "../components/Feedback/FeedbackDetail";
import axios from "axios";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [types, setTypes] = useState([]);
  const [mode, setMode] = useState("view"); // view | add

  useEffect(() => {
    axios.get("/api/feedbacks").then((res) => setFeedbacks(res.data));
    axios.get("/api/feedback-types").then((res) => setTypes(res.data));
  }, []);

  const handleSelect = (fb) => {
    setSelected(fb);
    setMode("view");
  };

  const handleAddNew = () => {
    setSelected(null);
    setMode("add");
  };

  const handleSubmit = (data) => {
    axios.post("/api/feedbacks", data).then((res) => {
      setFeedbacks([res.data, ...feedbacks]);
      setSelected(res.data);
      setMode("view");
    });
  };

  return (
    <div className="flex min-h-screen p-4 bg-gray-300">
      <div className="w-2/3 p-4 bg-white rounded-xl mr-4 shadow">
        {mode === "add" ? (
          <FeedbackForm types={types} onSubmit={handleSubmit} />
        ) : (
          selected && <FeedbackDetail feedback={selected} />
        )}
      </div>

      <div className="w-1/3 bg-white p-4 rounded-xl shadow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-lg">History:</h2>
          <button
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
            onClick={handleAddNew}
          >
            + Add new
          </button>
        </div>
        <FeedbackList feedbacks={feedbacks} onSelect={handleSelect} selected={selected?.id} />
      </div>
    </div>
  );
}
