import { useState } from "react";
import { useEmission } from "../hooks/useEmissions";
import { saveEmissionData } from "../services/emissionsService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchEmissionFactor } from "../services/api";

const EmissionCalculator = () => {
  const { loading, error, emissions, getEmissions } = useEmission();
  const [energy, setEnergy] = useState(""); 
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [animateResult, setAnimateResult] = useState(false);

  const handleCalculate = async () => {
    if (!energy || isNaN(Number(energy)) || Number(energy) <= 0) {
      setInputError("Please enter a valid positive number");
      return;
    }

    if (!startDate || !endDate) {
      setInputError("Please select a date range");
      return;
    }

    setInputError(null);

    // ✅ Fetch the latest emission factor from the API
  const emissionFactorData = await fetchEmissionFactor(); // Replace with your actual function

  if (!emissionFactorData) {
    console.error("Failed to fetch emission factor data");
    return;
  }

  // ✅ Extract sector & region_name from API response
  const category = emissionFactorData.category || "Unknown"; 
  const region_name = emissionFactorData.region_name || "Unknown";

    const calculatedEmissions = await getEmissions(Number(energy), startDate, endDate);

    if (calculatedEmissions == null) {
      console.error("Emission calculation failed");
      return;
    }

    console.log("Emissions calculated:", calculatedEmissions);

    await saveEmissionData(Number(energy), calculatedEmissions, startDate, endDate, category, region_name);

    // ✅ Reset form inputs after calculation
    setEnergy("");  
    setStartDate(null); 
    setEndDate(null);  
    setAnimateResult(true); // Trigger animation
  };

  // Chart data
  const chartData = emissions
    ? [
        { name: "Your Emissions", emissions: emissions },
        { name: "Avg Household (Annual)", emissions: 1286 },
      ]
    : [];

  return (
    <motion.div 
      className="w-full max-w-3xl mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg mt-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800">CO₂ Emission Calculator</h2>
      <p className="text-center text-gray-600 text-sm mt-2">Enter your energy usage (in kWh) and select a date range.</p>

      {/* Energy Input */}
      <div className="mt-6">
        <label htmlFor="energyInput" className="block text-sm font-medium text-gray-700">
          Energy Usage (kWh):
        </label>
        <motion.input
          id="energyInput"
          type="number"
          value={energy}
          onChange={(e) => setEnergy(e.target.value)}
          placeholder="Enter energy usage"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition-all"
          whileFocus={{ scale: 1.02 }} // 🔥 Slight scaling effect on focus
        />
        {inputError && <p className="text-red-500 text-sm mt-1">{inputError}</p>}
      </div>

      {/* Date Range Selection */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Select Date Range</label>
        <div className="flex flex-col md:flex-row md:space-x-4 mt-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm transition-all focus:ring-green-500 focus:border-green-500"
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || undefined}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm transition-all focus:ring-green-500 focus:border-green-500 mt-2 md:mt-0"
            placeholderText="End Date"
          />
        </div>
      </div>

      {/* Calculate Button */}
      <motion.button
        onClick={handleCalculate}
        disabled={loading || !energy}
        className={`w-full mt-6 py-3 text-white font-semibold rounded-md transition ${
          loading || !energy
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 active:scale-95"
        }`}
        whileTap={{ scale: 0.95 }} // 🔥 Button shrink effect on click
      >
        {loading ? "Calculating..." : "Calculate Emissions"}
      </motion.button>

      {/* Results Display */}
      {emissions !== null && (
        <motion.div
          className="mt-6 p-4 bg-green-100 border border-green-400 rounded-lg text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={animateResult ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-lg font-semibold">Your Estimated Emissions</h3>
          <p className="text-2xl font-bold text-green-700 mt-2">{emissions.toFixed(2)} kg CO₂e</p>

          {/* 🔥 Improved Bar Chart */}
          <div className="mt-4">
            <h4 className="text-md font-semibold text-gray-700">Comparison</h4>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart layout="vertical" data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="emissions" fill="#4CAF50" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Error Handling */}
      {error && (
        <motion.p className="mt-4 text-red-500 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default EmissionCalculator;
