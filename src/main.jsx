import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { PatientProvider } from "./context/PatientContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import { ConsultationProvider } from "./context/ConsultationContext";
import { TreatmentProvider } from "./context/TreatmentContext";
import { TypeSoinProvider } from "./context/TypeSoinContext";
import "./styles/global.css";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error(
    "VITE_CLERK_PUBLISHABLE_KEY manquante — demande la clé publique au docteur (même application Clerk que le backend)."
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <AuthProvider>
        <PatientProvider>
          <AppointmentProvider>
            <TreatmentProvider>
              <ConsultationProvider>
                <TypeSoinProvider>
                  <App />
                </TypeSoinProvider>
              </ConsultationProvider>
            </TreatmentProvider>
          </AppointmentProvider>
        </PatientProvider>
      </AuthProvider>
    </ClerkProvider>
  </React.StrictMode>
);