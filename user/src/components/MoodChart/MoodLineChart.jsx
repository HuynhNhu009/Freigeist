import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { format, parseISO } from "date-fns";

const MoodLineChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(str) => {
            const date = parseISO(str);
            return format(date, "dd/MM");
          }}
        />
        <YAxis domain={[0, 10]} allowDecimals={false} />
        <Tooltip
          formatter={(value, name) => [`${value}/10`, "Cảm xúc"]}
          labelFormatter={(label) => `Ngày: ${format(parseISO(label), "dd/MM/yyyy")}`}
        />
        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MoodLineChart;
