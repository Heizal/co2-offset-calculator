import { useState, useEffect, use } from "react";
import EmissionCalculator from "../components/EmissionCalculator";
import { useAuth } from "../context/AuthContext";
import { listenToEmissions, clearEmissionHistory } from "../services/emissionsService";

interface EmissionHistory {
  id: string;
  energyUsage: number;
  emissions: number;
  startDate: string;
  endDate: string;
  region_name: string;
  category: string;
  createdAt: string;
  description: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<EmissionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    console.log("Listening for real-time updates...");
    const unsubscribe = listenToEmissions((data) => {
      const formattedData = data.map(item => ({
        ...item,
        region_name: item.region_name || "Unknown",
        sector: item.sector || "Unknown"
      }));
      formattedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHistory(formattedData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  //Handle clear History button click
  const handleClearHistory = async () => {
    const confirmDelete = window.confirm("Are you sure you want to clear all emission history?");
    if (!confirmDelete) return;

    setClearing(true); // Show loading state while clearing
    await clearEmissionHistory();
    setClearing(false);
  };

  // ✅ Get latest emission data
  const latestEntry = history.length > 0 
  ? history.reduce((latest, entry) =>
      new Date(entry.createdAt) > new Date(latest.createdAt) ? entry : latest, history[0])
  : null;


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
          <EmissionCalculator />
        </div>

        {/* Right Section: Emission Overview */}
        <div className="bg-[#121212] text-white shadow-lg rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-2">Your Emissions Overview</h2>

          {/* ✅ DISPLAY Category */}
          {latestEntry?.category && (
            <p className="text-lg font-semibold">
              {latestEntry.category}
            </p>
          )}
          {/* ✅ DISPLAY Description */}
          {latestEntry?.description && (
            <p className="text-gray-400 text-sm italic mb-4">
              {latestEntry.description}
            </p>
          )}

          {/* If no data available */}
          {loading ? (
            <p className="text-gray-500 mt-4">Loading data...</p>
          ) : !latestEntry ? (
            <p className="text-gray-500 mt-4">No emissions data available.</p>
          ) : (
            <>
              {/* 🔥 Latest Calculation Cards */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1E1E1E] p-4 rounded-lg">
                  <h4 className="text-sm text-gray-400">Total CO₂ Emitted</h4>
                  <p className={`text-2xl font-bold ${latestEntry.emissions > 500 ? "text-red-400" : "text-green-400"}`}>
                    {latestEntry.emissions.toFixed(2)} kg CO₂
                  </p>
                </div>
                <div className="bg-[#1E1E1E] p-4 rounded-lg">
                  <h4 className="text-sm text-gray-400">Time Period</h4>
                  <p className="text-lg font-semibold">
                    {new Date(latestEntry.startDate).toLocaleDateString()} → {new Date(latestEntry.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-[#1E1E1E] p-4 rounded-lg">
                  <h4 className="text-sm text-gray-400">Emission Category</h4>
                  <p className="text-lg font-semibold">{latestEntry.category}</p>
                </div>
                <div className="bg-[#1E1E1E] p-4 rounded-lg">
                  <h4 className="text-sm text-gray-400">Region</h4>
                  <p className="text-lg font-semibold">{latestEntry.region_name}</p>
                </div>
              </div>

              {/* 📜 Past Emissions History */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Past Emissions</h3>
                <div className="bg-[#1E1E1E] rounded-lg p-4 max-h-60 overflow-y-auto">
                  {history.length > 1 ? (
                    history.slice(1).map((entry) => (
                      <div key={entry.id} className="flex justify-between items-center border-b border-gray-700 py-2">
                        <div>
                          <p className="text-sm text-gray-400">
                            📅 {new Date(entry.startDate).toLocaleDateString()} → {new Date(entry.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-300">
                            ⚡ {entry.energyUsage} kWh → 🌍 {entry.emissions.toFixed(2)} kg CO₂
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">{entry.region_name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No past emissions data.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Clear History Button */}
          <button
            onClick={handleClearHistory}
            disabled={clearing}
            className={`mt-6 w-full px-4 py-2 font-semibold text-white rounded-md ${
              clearing ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {clearing ? "Clearing..." : "Clear History"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;