import { useState, useEffect } from "react";
import EmissionCalculator from "../components/EmissionCalculator";
import { useAuth } from "../context/AuthContext";
import { getEmissionHistory } from "../services/emissionsService";

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<{ id: string; energyUsage: number; emissions: number; date: string }[]>([]);
  const [loading, setLoading] = useState(true);

  //Fetch emission history
  useEffect(() => {
    const fetchData = async () => {
      const data = await getEmissionHistory();
      console.log("Fetched data:", data);
      setHistory(data);
      setLoading(false);
    };

    fetchData();
  }
  , []);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Welcome, {user?.name} <span className="text-green-600">🌿</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-base mt-2 md:mt-0">
          Track & reduce your carbon footprint effectively
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-6 md:gap-10 md:grid-cols-2">
        {/* Left Section: CO₂ Calculator */}
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">CO₂ Emission Calculator</h2>
          <EmissionCalculator />
        </div>

        {/* Right Section: Emission Overview */}
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 flex flex-col justify-between">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Emissions Overview</h2>
          
          {loading ? (
            <p className="text-gray-500">Loading data...</p>
          ) : history.length === 0 ? (
            <p className="text-gray-500">No emissions data available.</p>
          ) : (
            <ul className="bg-gray-100 p-4 rounded-md max-h-60 overflow-y-auto">
              {history.map((entry) => (
                <li key={entry.id} className="mb-2 text-sm">
                  📅 {new Date(entry.date).toLocaleDateString()} - ⚡ {entry.energyUsage} kWh → 🌍 {entry.emissions.toFixed(2)} kg CO₂
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
