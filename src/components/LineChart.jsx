import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import "../styles/charts.css";

const LineCharts = ({ stockData }) => {
  return (
    <section className="chart-container">
      <h1 className="chart-title">Stock Trend</h1>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={stockData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="stock"
            stroke="#8884d8"
            strokeWidth={2}
          >
            <Label dataKey="stock" position="top" fill="#333" />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
};

export default LineCharts;
