import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { format, parseISO } from "date-fns";

const CustomLineChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    ...item,
    date: format(parseISO(item.date), "dd/MM/yy"),
  }));

  return (
    <div className="chart-container">
      <h3>Clicks Daily</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#2f855a"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;