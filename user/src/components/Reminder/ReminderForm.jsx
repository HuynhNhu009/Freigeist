import React, { useState } from "react";
import axios from "@/utils/axiosInstance";

const ReminderForm = ({ selectedDate, onSuccess, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("pending");


  const handleSubmit = async (e) => {
  e.preventDefault();

  const formatDateVN = (date) => {
  const tzOffset = -date.getTimezoneOffset(); // phút chênh lệch với UTC
  const localDate = new Date(date.getTime() + tzOffset * 60000);
  return localDate.toISOString().split("T")[0];
};

  const formattedDate = formatDateVN(selectedDate);


  const formattedTime = time.length === 5 ? time + ":00" : time;

  const data = {
    rm_title: title,
    rm_content: content,
    rm_date: formattedDate,
    rm_time: formattedTime,
    rm_priority: priority,
    rm_status: status,
  };

  console.log("Sending reminder data:", data); 
  

  try {
    await axios.post("/api/reminders/", data);

    if (onSuccess) onSuccess();

    alert("Reminder added successfully!");
    window.location.reload()

  } catch (error) {
    console.error("Failed to add reminder", error);
    onClose(); // Close the form on error
  }
};


  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3 ">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Add new</h2>
        <button type="button" className="text-gray-700 font-bold text-3xl" onClick={onClose}>×</button>
      </div>

      {/* Time & Priority */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-1">Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border w-full p-2 rounded"
            placeholder="// ô chọn giờ"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-1">Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border w-full p-2 rounded"
            required
          >
            <option value="">// ô chọn độ ưu tiên</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-semibold mb-1">Status:</label>
        <select
         value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border w-full p-2 rounded"
        required
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
     </select>
    </div>

      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />

      {/* Content */}
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 w-full h-[100px] rounded resize-none"
        required
      />

      {/* Button */}
      <button
        type="submit"
        className="bg-[#001F5B] text-white w-full py-2 rounded font-semibold hover:bg-[#002a73]"
      >
        Add
      </button>
    </form>
  );
};

export default ReminderForm;
