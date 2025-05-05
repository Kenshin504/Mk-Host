import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import "../styles/charts.css";

const BarCharts = ({ stockData }) => {
  return (
    <section className="chart-container">
      <h1 className="chart-title">Stocks Status</h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={stockData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <XAxis dataKey="name" />
          <YAxis domain={[0, "dataMax + 150"]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="stock" fill="#8884d8">
            <LabelList dataKey="stock" position="top" fill="#333" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
};

export default BarCharts;
