import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, useNavigate } from "react-router-dom";
const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const emissions = location.state?.emissions; // ✅ Get emissions data from state
    return (_jsxs("div", { className: "max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 text-center", children: [_jsx("h2", { className: "text-2xl font-semibold text-gray-800", children: "CO\u2082 Emission Results" }), emissions !== null ? (_jsxs("p", { className: "mt-4 text-lg font-semibold text-gray-900", children: ["Estimated Emissions: ", _jsxs("span", { className: "text-blue-600", children: [emissions, " kg CO\u2082e"] })] })) : (_jsx("p", { className: "mt-4 text-gray-600", children: "No results found. Please perform a calculation." })), _jsx("button", { onClick: () => navigate("/dashboard"), className: "mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition", children: "Back to Dashboard" })] }));
};
export default Results;
