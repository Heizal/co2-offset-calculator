import EmissionCalculator from "../components/EmissionCalculator";
import ResultsChart from "../components/ResultsChart";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <h1 className="text-3xl font-semibold text-gray-800 flex items-center space-x-2">
        Welcome, {user?.name} <span className="text-green-600">🌿</span>
      </h1>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* CO₂ Calculator */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">CO₂ Emission Calculator</h2>
          <EmissionCalculator />
        </div>

        {/* Results Section */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">Your Emissions Overview</h2>
          <ResultsChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
