import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/charts.css";

const AreaCharts = ({ stockData }) => {
  return (
    <section className="chart-container">
      <h1 className="chart-title">Stock Movement Over Time</h1>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={stockData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="stock"
            stroke="#8884d8"
            fill="rgba(136, 132, 216, 0.5)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
};

export default AreaCharts;
