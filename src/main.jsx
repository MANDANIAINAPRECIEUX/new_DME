import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { PatientProvider } from "./context/PatientContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import { ConsultationProvider } from "./context/ConsultationContext";
import { TreatmentProvider } from "./context/TreatmentContext";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <PatientProvider>
                <AppointmentProvider>
                    <TreatmentProvider>
                        <ConsultationProvider>
                            <App />
                        </ConsultationProvider>
                    </TreatmentProvider>
                </AppointmentProvider>
            </PatientProvider>
        </AuthProvider>
    </React.StrictMode>
);