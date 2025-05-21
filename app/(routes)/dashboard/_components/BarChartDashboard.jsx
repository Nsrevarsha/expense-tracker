import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function BarChartDashboard({ budgetList }) {
  // Filter out empty budgets and format data
  const chartData = budgetList.filter(
    (budget) => budget.amount > 0 || budget.totalSpend > 0
  );

  // Calculate the maximum value for Y axis
  const maxValue = Math.max(
    ...chartData.map((budget) =>
      Math.max(Number(budget.amount), Number(budget.totalSpend))
    )
  );

  // Add 10% padding to the max value for better visualization
  const yAxisMax = Math.ceil(maxValue * 1.1);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <h2 className="text-sm font-semibold mb-3 text-gray-200">
        Spending Overview
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 25, left: 0, bottom: 5 }}
          barSize={24}
          maxBarSize={24}
        >
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            tickFormatter={(value) => `$${value}`}
            width={45}
            domain={[0, yAxisMax]} // Set dynamic domain
          />
          <Tooltip
            cursor={false}
            contentStyle={{
              backgroundColor: "#374151",
              border: "none",
              boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
              borderRadius: "6px",
              fontSize: "11px",
              padding: "8px",
              color: "#fff",
            }}
          />
          <Legend
            align="right"
            verticalAlign="top"
            height={36}
            iconSize={8}
            iconType="circle"
            wrapperStyle={{
              fontSize: "11px",
              paddingBottom: "12px",
              color: "#9CA3AF",
            }}
          />
          <Bar
            name="Budget"
            dataKey="amount"
            fill="#3B82F6"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            name="Spent"
            dataKey="totalSpend"
            fill="#60A5FA"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartDashboard;
