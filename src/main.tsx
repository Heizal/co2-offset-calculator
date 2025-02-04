import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Import the main App component
import "./index.css"; // Import global styles (if using Tailwind or custom CSS)
import { AuthProvider } from "./context/AuthContext"; // Import Auth Context

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap App with authentication provider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
