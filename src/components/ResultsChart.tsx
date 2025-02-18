import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#4CAF50", "#FF9800", "#03A9F4", "#E91E63"];

const sampleData = [
  { name: "Transportation", value: 40 },
  { name: "Energy Usage", value: 30 },
  { name: "Food Consumption", value: 20 },
  { name: "Others", value: 10 },
];

const ResultsChart = () => {
  return (
    <div className="flex flex-col items-center">
      <PieChart width={300} height={300}>
        <Pie data={sampleData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
          {sampleData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default ResultsChart;
