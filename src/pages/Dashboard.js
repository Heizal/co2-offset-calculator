import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import EmissionCalculator from "../components/EmissionCalculator";
import { useAuth } from "../context/AuthContext";
import { listenToEmissions, clearEmissionHistory } from "../services/emissionsService";
const Dashboard = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
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
        if (!confirmDelete)
            return;
        setClearing(true); // Show loading state while clearing
        await clearEmissionHistory();
        setClearing(false);
    };
    // ✅ Get latest emission data
    const latestEntry = history.length > 0
        ? history.reduce((latest, entry) => new Date(entry.createdAt) > new Date(latest.createdAt) ? entry : latest, history[0])
        : null;
    return (_jsxs("div", { className: "p-6 md:p-8 max-w-6xl mx-auto", children: [_jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between mb-8", children: [_jsxs("h1", { className: "text-3xl font-semibold text-gray-800", children: ["Welcome, ", user?.name, " ", _jsx("span", { className: "text-green-600", children: "\uD83C\uDF3F" })] }), _jsx("p", { className: "text-gray-500 text-sm md:text-base mt-2 md:mt-0", children: "Track & reduce your carbon footprint effectively" })] }), _jsxs("div", { className: "grid gap-6 md:gap-10 md:grid-cols-2", children: [_jsx("div", { className: "bg-white shadow-lg rounded-lg p-6 md:p-8", children: _jsx(EmissionCalculator, {}) }), _jsxs("div", { className: "bg-[#121212] text-white shadow-lg rounded-lg p-6 md:p-8", children: [_jsx("h2", { className: "text-2xl font-semibold mb-2", children: "Your Emissions Overview" }), latestEntry?.category && (_jsx("p", { className: "text-lg font-semibold", children: latestEntry.category })), latestEntry?.description && (_jsx("p", { className: "text-gray-400 text-sm italic mb-4", children: latestEntry.description })), loading ? (_jsx("p", { className: "text-gray-500 mt-4", children: "Loading data..." })) : !latestEntry ? (_jsx("p", { className: "text-gray-500 mt-4", children: "No emissions data available." })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mt-6 grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-[#1E1E1E] p-4 rounded-lg", children: [_jsx("h4", { className: "text-sm text-gray-400", children: "Total CO\u2082 Emitted" }), _jsxs("p", { className: `text-2xl font-bold ${latestEntry.emissions > 500 ? "text-red-400" : "text-green-400"}`, children: [latestEntry.emissions.toFixed(2), " kg CO\u2082"] })] }), _jsxs("div", { className: "bg-[#1E1E1E] p-4 rounded-lg", children: [_jsx("h4", { className: "text-sm text-gray-400", children: "Time Period" }), _jsxs("p", { className: "text-lg font-semibold", children: [new Date(latestEntry.startDate).toLocaleDateString(), " \u2192 ", new Date(latestEntry.endDate).toLocaleDateString()] })] }), _jsxs("div", { className: "bg-[#1E1E1E] p-4 rounded-lg", children: [_jsx("h4", { className: "text-sm text-gray-400", children: "Emission Category" }), _jsx("p", { className: "text-lg font-semibold", children: latestEntry.category })] }), _jsxs("div", { className: "bg-[#1E1E1E] p-4 rounded-lg", children: [_jsx("h4", { className: "text-sm text-gray-400", children: "Region" }), _jsx("p", { className: "text-lg font-semibold", children: latestEntry.region_name })] })] }), _jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Past Emissions" }), _jsx("div", { className: "bg-[#1E1E1E] rounded-lg p-4 max-h-60 overflow-y-auto", children: history.length > 1 ? (history.slice(1).map((entry) => (_jsxs("div", { className: "flex justify-between items-center border-b border-gray-700 py-2", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-sm text-gray-400", children: ["\uD83D\uDCC5 ", new Date(entry.startDate).toLocaleDateString(), " \u2192 ", new Date(entry.endDate).toLocaleDateString()] }), _jsxs("p", { className: "text-sm text-gray-300", children: ["\u26A1 ", entry.energyUsage, " kWh \u2192 \uD83C\uDF0D ", entry.emissions.toFixed(2), " kg CO\u2082"] })] }), _jsx("span", { className: "text-sm text-gray-500", children: entry.region_name })] }, entry.id)))) : (_jsx("p", { className: "text-gray-500 text-sm", children: "No past emissions data." })) })] })] })), _jsx("button", { onClick: handleClearHistory, disabled: clearing, className: `mt-6 w-full px-4 py-2 font-semibold text-white rounded-md ${clearing ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`, children: clearing ? "Clearing..." : "Clear History" })] })] })] }));
};
export default Dashboard;
