import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import { useUser } from "@clerk/react";

function App() {
  const { isLoaded, isSignedIn, user } = useUser();

  console.log("Clerk chargé :", isLoaded);
  console.log("Utilisateur connecté :", isSignedIn);
  console.log("Clerk User ID :", user?.id);
  
  return (
    <RouterProvider router={router} />
  );
}

export default App;