import { BrowserRouter } from "react-router-dom";
import { SignIn, UserButton, useAuth } from "@clerk/react";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <p>Chargement…</p>;
  }

  // Afficher le formulaire si l’utilisateur n’est pas connecté.
  if (!isSignedIn) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <SignIn routing="hash" />
      </main>
    );
  }

  // Afficher l’interface après connexion.
  return (
    <BrowserRouter>
      <Sidebar />

      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <UserButton />
      </div>
    </BrowserRouter>
  );
}

export default App;