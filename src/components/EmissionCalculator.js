import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [inputError, setInputError] = useState(null);
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
        const description = emissionFactorData.description || "No specific description";
        const calculatedEmissions = await getEmissions(Number(energy), startDate, endDate);
        if (calculatedEmissions == null) {
            console.error("Emission calculation failed");
            return;
        }
        console.log("Emissions calculated:", calculatedEmissions);
        await saveEmissionData(Number(energy), calculatedEmissions, startDate, endDate, category, region_name, description);
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
    return (_jsxs(motion.div, { className: "w-full max-w-3xl mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg mt-6", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 }, children: [_jsx("h2", { className: "text-2xl font-semibold text-center text-gray-800", children: "CO\u2082 Emission Calculator" }), _jsx("p", { className: "text-center text-gray-600 text-sm mt-2", children: "Enter your energy usage (in kWh) and select a date range." }), _jsxs("div", { className: "mt-6", children: [_jsx("label", { htmlFor: "energyInput", className: "block text-sm font-medium text-gray-700", children: "Energy Usage (kWh):" }), _jsx(motion.input, { id: "energyInput", type: "number", value: energy, onChange: (e) => setEnergy(e.target.value), placeholder: "Enter energy usage", className: "mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition-all", whileFocus: { scale: 1.02 } }), inputError && _jsx("p", { className: "text-red-500 text-sm mt-1", children: inputError })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Select Date Range" }), _jsxs("div", { className: "flex flex-col md:flex-row md:space-x-4 mt-2", children: [_jsx(DatePicker, { selected: startDate, onChange: (date) => setStartDate(date), selectsStart: true, startDate: startDate, endDate: endDate, className: "w-full p-3 border border-gray-300 rounded-md shadow-sm transition-all focus:ring-green-500 focus:border-green-500", placeholderText: "Start Date" }), _jsx(DatePicker, { selected: endDate, onChange: (date) => setEndDate(date), selectsEnd: true, startDate: startDate, endDate: endDate, minDate: startDate || undefined, className: "w-full p-3 border border-gray-300 rounded-md shadow-sm transition-all focus:ring-green-500 focus:border-green-500 mt-2 md:mt-0", placeholderText: "End Date" })] })] }), _jsx(motion.button, { onClick: handleCalculate, disabled: loading || !energy, className: `w-full mt-6 py-3 text-white font-semibold rounded-md transition ${loading || !energy
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 active:scale-95"}`, whileTap: { scale: 0.95 }, children: loading ? "Calculating..." : "Calculate Emissions" }), emissions !== null && (_jsxs(motion.div, { className: "mt-6 p-4 bg-green-100 border border-green-400 rounded-lg text-center", initial: { opacity: 0, scale: 0.9 }, animate: animateResult ? { opacity: 1, scale: 1 } : {}, transition: { duration: 0.4 }, children: [_jsx("h3", { className: "text-lg font-semibold", children: "Your Estimated Emissions" }), _jsxs("p", { className: "text-2xl font-bold text-green-700 mt-2", children: [emissions.toFixed(2), " kg CO\u2082e"] }), _jsxs("div", { className: "mt-4", children: [_jsx("h4", { className: "text-md font-semibold text-gray-700", children: "Comparison" }), _jsx(ResponsiveContainer, { width: "100%", height: 150, children: _jsxs(BarChart, { layout: "vertical", data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { type: "number" }), _jsx(YAxis, { dataKey: "name", type: "category", width: 120 }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "emissions", fill: "#4CAF50", radius: [8, 8, 0, 0] })] }) })] })] })), error && (_jsx(motion.p, { className: "mt-4 text-red-500 text-center", initial: { opacity: 0 }, animate: { opacity: 1 }, children: error }))] }));
};
export default EmissionCalculator;
