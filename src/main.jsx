import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PatientProvider } from "./context/PatientContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <PatientProvider>
            <AppointmentProvider>
                <App />
            </AppointmentProvider>
        </PatientProvider>
    </React.StrictMode>
);