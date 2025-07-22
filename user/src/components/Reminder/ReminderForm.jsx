import React, { useState } from "react";
import axios from "@/utils/axiosInstance";

const ReminderForm = ({ selectedDate, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [time, setTime] = useState("08:00");
  const [priority, setPriority] = useState("medium");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/reminders/", {
        rm_title: title,
        rm_content: content,
        rm_date: selectedDate, // ✅ dùng ngày được truyền vào
        rm_time: time,
        rm_priority: priority,
      });

      // ✅ Gọi callback sau khi thêm thành công
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to add reminder", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">New Reminder</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border p-2 w-full"
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="border p-2 w-full"
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
        className="border p-2 w-full"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="border p-2 w-full"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </form>
  );
};

export default ReminderForm;
