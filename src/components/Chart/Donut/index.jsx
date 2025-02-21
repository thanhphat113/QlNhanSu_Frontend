"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, Sector, ResponsiveContainer  } from "recharts";



const COLORS = ["#4CAF50", "#F44336"]; // Xanh lá & Đỏ

// Tạo Component Highlight khi Hover
const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill
  } = props;

  return (
    <>
      {/* Phần Donut được phóng to */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5} // Phóng to khi hover
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </>
  );
};

export default function Donut({data}) {
  const [activeIndex, setActiveIndex] = useState(null);

  // Xử lý hover
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
	<ResponsiveContainer width="100%" height="100%">

    <PieChart width={320} height={320}>
      <Pie
        activeIndex={activeIndex}
        activeShape={renderActiveShape}
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={80}
        outerRadius={120}
        fill="#8884d8"
        dataKey="value"
        onMouseEnter={onPieEnter}
        onMouseLeave={onPieLeave}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
	</ResponsiveContainer>

  );
}
