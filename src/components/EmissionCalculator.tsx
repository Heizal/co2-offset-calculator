import { useState } from "react";
import { useEmission } from "../hooks/useEmissions";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";


const EmissionCalculator = () => {
  const { loading, error, emissions, getEmissions } = useEmission();
  const [energy, setEnergy] = useState(""); // ✅ Allow empty input
  const [period, setPeriod] = useState<"daily" | "monthly" | "annually">("daily");
  const [inputError, setInputError] = useState<string| null>(null);
  const navigate = useNavigate();


  const handleCalculate = async () => {
    if (!energy || isNaN(Number(energy)) || Number(energy) <= 0){
      setInputError("Please enter a valid positive number");
      return;  
    } // ✅ Prevent calculations on empty input
    setInputError(null); //Clear any previous errors

    
    await getEmissions(Number(energy), period); //Call with number only

    if (emissions !== null) {
      navigate("/results", { state: { emissions } }); // ✅ Redirect with data
    }
  };

  //Chart data
  const chartData = emissions? [
    { name: "Your Emissions", emissions: emissions }, // Dynamic emissions
    { name: "Avg Household (Annual)", emissions: 1286 }, // Static comparison
  ] : [];



  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-center text-gray-800">CO₂ Emission Calculator</h2>
      <p className="text-center text-gray-600 text-sm mt-2">Enter your energy usage (in kWh) to estimate your emissions.</p>

      {/* Energy Input */}
      <div className="mt-6">
        <label htmlFor="energyInput" className="block text-sm font-medium text-gray-700">
          Energy Usage (kWh):
        </label>
        <input
          id="energyInput"
          type="number"
          value={energy} // ✅ Allow clearing the field
          onChange={(e) => setEnergy(e.target.value)}
          placeholder="Enter energy usage"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        {inputError && <p className="text-red-500 text-sm mt-1">{inputError}</p>}
      </div>

      {/* Time Period Selection */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Select Time Period</label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as "daily" | "monthly" | "annually")}
          className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="annually">Annually</option>
        </select>
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={loading || !energy} // ✅ Disable if input is empty
        className={`w-full mt-6 py-3 text-white font-semibold rounded-md transition ${
          loading || !energy
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Calculating..." : "Calculate Emissions"}
      </button>

      {/* Results Display */}
      {emissions !== null &&(
        <motion.div 
          className="mt-6 p-4 bg-green-100 border border-green-400 rounded-lg text-center"
          initial={{ opacity: 0, scale: 0.9}}
          animate={{ opacity: 1, scale: 1}}
          transition={{ duration: 0.3}}
        >
          <h3 className="text-lg font-semibold">Your estimate Emissions</h3>
          <p className="text-2xl font-bold text-green-700 mt-2">{emissions} kg CO₂e</p>

          <h3 className="text-lg font-semibold">Your Estimated Emissions</h3>
          <p className="text-2xl font-bold text-green-700 mt-2">{emissions} kg CO₂e</p>

          {/* ✅ Horizontal Bar Chart */}
          <div className="mt-4">
            <h4 className="text-md font-semibold text-gray-700">Comparison</h4>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart layout="vertical" data={chartData}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="emissions" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Error Handling */}

      {error && (
        <motion.p
            className="mt-4 text-red-500 text-center"
            initial={{ opacity: 0}}
            animate= {{ opacity: 1}} 
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};
export default EmissionCalculator;