import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomBarChart = ({ data, onBarClick }) => {
  return (
    <div className="chart-container">
      <h3>Total Clicks</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="featureName" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#2c5282"
            onClick={(data) => onBarClick(data.featureName)}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;