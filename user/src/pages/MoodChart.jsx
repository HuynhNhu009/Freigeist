import React, { useEffect, useState } from "react";
import axios from "axios";
import MoodLineChart from "../components/MoodChart/MoodLineChart";

const MoodChart = () => {
  const [diaryData, setDiaryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMoodData = async () => {
      const token = localStorage.getItem("access_token");

      try {
        const res = await axios.get("http://localhost:8888/api/diaries/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const transformed = res.data.map(entry => ({
          date: entry.de_date,
          score: entry.de_emoScore || 0,
          mood: entry.de_emoState || "",
        }));

        // Sort by date ascending
        const sorted = transformed.sort((a, b) => new Date(a.date) - new Date(b.date));
        setDiaryData(sorted);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu mood:", err);
        alert("Không thể tải dữ liệu biểu đồ.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-sans h-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
        Biểu đồ Cảm Xúc Cá Nhân
      </h2>

      {isLoading ? (
        <p className="text-center">Đang tải dữ liệu...</p>
      ) : (
        <MoodLineChart data={diaryData} />
      )}
    </div>
  );
};

export default MoodChart;
