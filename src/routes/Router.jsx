import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Patients from "../pages/Patients/Patients";

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
      }
    ]
  }
]);

export default router;