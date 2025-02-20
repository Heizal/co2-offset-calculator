import { useState } from "react";
import { useEmission } from "../hooks/useEmissions";
import { useNavigate } from "react-router-dom";
import { saveEmissionData } from "../services/emissionsService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const EmissionCalculator = ({ refreshHistory}: {refreshHistory?: () => void }) => {
  const { loading, error, emissions, getEmissions } = useEmission();
  const [energy, setEnergy] = useState(""); // ✅ Allow empty input
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [inputError, setInputError] = useState<string| null>(null);


  const handleCalculate = async () => {
    if (!energy || isNaN(Number(energy)) || Number(energy) <= 0){
      setInputError("Please enter a valid positive number");
      return;  
    }

    if (!startDate || !endDate){
      setInputError("Please select a date range");
      return;
    }

    setInputError(null); //Clear any previous errors

    //Wait for the emissions to be calculated
    const calculatedEmissions = await getEmissions(Number(energy), startDate, endDate);

    if (calculatedEmissions == null) {
      console.error("Emission calculation failed");
      return
    }

    console.log("Emissions calculated:", calculatedEmissions);

    //Save the emission data
    await saveEmissionData(Number(energy), calculatedEmissions, startDate, endDate);

    // ✅ Reset form inputs after calculation
    setEnergy("");  // Reset energy input
    setStartDate(null); // Reset start date
    setEndDate(null);   // Reset end date
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
          value={energy}
          onChange={(e) => setEnergy(e.target.value)}
          placeholder="Enter energy usage"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        {inputError && <p className="text-red-500 text-sm mt-1">{inputError}</p>}
      </div>

      {/* Time Period Selection */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Select Date Range</label>
        <div className="flex space-x-4 mt-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="p-3 border border-gray-300 rounded-md shadow-sm"
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || undefined}
            className="p-3 border border-gray-300 rounded-md shadow-sm"
            placeholderText="End Date"
          />
        </div>
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