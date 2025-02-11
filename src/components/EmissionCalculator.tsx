import { useState } from "react";
import { useEmission } from "../hooks/useEmissions";
import { useNavigate } from "react-router-dom";

const EmissionCalculator = () => {
  const { loading, error, emissions, getEmissions } = useEmission();
  const [energy, setEnergy] = useState(""); // ✅ Allow empty input
  const navigate = useNavigate();

  const handleCalculate = async () => {
    if (!energy) return; // ✅ Prevent calculations on empty input

    await getEmissions("electricity-supply_grid-source_production_mix", {
      energy: Number(energy), // ✅ Convert to number safely
      energy_unit: "kWh",
    });

    if (emissions !== null) {
      navigate("/results", { state: { emissions } }); // ✅ Redirect with data
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-center text-gray-800">CO₂ Emission Calculator</h2>

      <div className="mt-4">
        <label htmlFor="energyInput" className="block text-sm font-medium text-gray-700">
          Energy Usage (kWh):
        </label>
        <input
          id="energyInput"
          type="number"
          value={energy} // ✅ Allow clearing the field
          onChange={(e) => setEnergy(e.target.value)}
          placeholder="Enter energy usage"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        onClick={handleCalculate}
        disabled={loading || !energy} // ✅ Disable if input is empty
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
      >
        {loading ? "Calculating..." : "Calculate Emissions"}
      </button>

      {error && <p className="mt-2 text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default EmissionCalculator;
