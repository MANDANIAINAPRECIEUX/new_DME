import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/Auth/LoginPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import Patients from "../pages/Patients/Patients";
import PatientFormPage from "../pages/Patients/PatientFormPage";
import Appointments from "../pages/Appointments/Appointments";
import AppointmentFormPage from "../pages/Appointments/AppointmentFormPage";
import PatientRecordPage from "../pages/Patients/PatientRecordPage";
import ConsultationPage from "../pages/Consultations/ConsultationPage";
import Settings from "../pages/Settings/Settings";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "patients", element: <Patients /> },
      { path: "patients/new", element: <PatientFormPage /> },
      { path: "patients/:id/edit", element: <PatientFormPage /> },
      { path: "appointments", element: <Appointments /> },
      { path: "appointments/new", element: <AppointmentFormPage /> },
      { path: "appointments/:id/edit", element: <AppointmentFormPage /> },
      { path: "patients/:id", element: <PatientRecordPage /> },
      { path: "consultations/:appointmentId", element: <ConsultationPage /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

export default router;