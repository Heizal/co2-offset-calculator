import { useLocation, useNavigate } from "react-router-dom";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emissions = location.state?.emissions; // ✅ Get emissions data from state

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 text-center">
      <h2 className="text-2xl font-semibold text-gray-800">CO₂ Emission Results</h2>

      {emissions !== null ? (
        <p className="mt-4 text-lg font-semibold text-gray-900">
          Estimated Emissions: <span className="text-blue-600">{emissions} kg CO₂e</span>
        </p>
      ) : (
        <p className="mt-4 text-gray-600">No results found. Please perform a calculation.</p>
      )}

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Results;

  