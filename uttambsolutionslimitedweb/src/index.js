import React from "react";
import ReactDOM from "react-dom/client"; // Use 'react-dom/client' for React 18
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

// Create the root using createRoot and then render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);