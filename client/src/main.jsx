import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3200,
        style: {
          background: "rgba(7, 15, 29, 0.96)",
          color: "#e5f3ff",
          border: "1px solid rgba(96, 165, 250, 0.16)",
          boxShadow: "0 24px 50px rgba(1, 8, 20, 0.55)",
          backdropFilter: "blur(14px)",
        },
      }}
    />
  </React.StrictMode>
);
