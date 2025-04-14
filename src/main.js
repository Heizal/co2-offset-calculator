import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Import the main App component
import "./index.css"; // Import global styles (if using Tailwind or custom CSS)
import { AuthProvider } from "./context/AuthContext"; // Import Auth Context
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsxs(AuthProvider, { children: [" ", _jsx(App, {})] }) }));
