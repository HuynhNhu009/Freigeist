import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval, addWeeks, subWeeks } from "date-fns";

const processMoodData = (rawData) => {
  const grouped = {};
  rawData.forEach((entry) => {
    const date = format(parseISO(entry.date), "yyyy-MM-dd");
    if (!grouped[date]) grouped[date] = { total: 0, count: 0 };
    grouped[date].total += entry.score;
    grouped[date].count += 1;
  });

  return Object.keys(grouped)
    .map((date) => ({
      date,
      score: parseFloat((grouped[date].total / grouped[date].count).toFixed(2)),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

const MoodLineChart = ({ data }) => {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const filteredData = processMoodData(data).filter((entry) =>
    isWithinInterval(parseISO(entry.date), {
      start: weekStart,
      end: endOfWeek(weekStart, { weekStartsOn: 1 }),
    })
  );

  return (
    <div className="space-y-4 ">
      <div className="flex justify-between items-center">
        <button onClick={() => setWeekStart(subWeeks(weekStart, 1))} className="text-blue-500 hover:underline">
          ← Tuần trước
        </button>
        <span className="font-semibold">
          {format(weekStart, "dd/MM")} - {format(endOfWeek(weekStart, { weekStartsOn: 1 }), "dd/MM")}
        </span>
        <button onClick={() => setWeekStart(addWeeks(weekStart, 1))} className="text-blue-500 hover:underline">
          Tuần sau →
        </button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(str) => format(parseISO(str), "dd/MM")}
          />
          <YAxis domain={[0, 100]} allowDecimals={false} />
          <Tooltip
            formatter={(value) => [`${value}/10`, "Cảm xúc"]}
            labelFormatter={(label) => `Ngày: ${format(parseISO(label), "dd/MM/yyyy")}`}
          />
          <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodLineChart;
