import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Patients from "../pages/Patients/Patients";
import PatientFormPage from "../pages/Patients/PatientFormPage";
import Appointments from "../pages/Appointments/Appointments";
import AppointmentFormPage from "../pages/Appointments/AppointmentFormPage";

const router=createBrowserRouter([
  {
    path:"/",
    element:<MainLayout />,
    children:[
      {
        index:true,
        element:<Dashboard />
      },
      {
        path:"patients",
        element:<Patients />
      },
      {
        path: "patients/new",
        element: <PatientFormPage />
      },
      {
        path:"appointments",
        element:<Appointments />
      },
      {
        path:"appointments/new",
        element: <AppointmentFormPage />
      }
    ]
  }
]);

export default router;