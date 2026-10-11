import { createContext, useContext, useEffect, useState } from "react";
import { useAuth as useClerkAuth, useClerk } from "@clerk/react";
import { useApi } from "../services/useApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { isLoaded: clerkLoaded, isSignedIn } = useClerkAuth();
  const { signOut } = useClerk();
  const api = useApi();

  const [doctor, setDoctor] = useState(null);
  // "loading" | "signed-out" | "not-authorized" | "error" | "authorized"
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clerkLoaded) return;

    if (!isSignedIn) {
      setDoctor(null);
      setStatus("signed-out");
      return;
    }

    let cancelled = false;

    const fetchDoctor = async () => {
      setStatus("loading");
      setError(null);

      try {
        const data = await api("/api/doctors/me");
        if (cancelled) return;

        setDoctor(data.doctor);
        setStatus("authorized");
      } catch (err) {
        if (cancelled) return;

        setDoctor(null);

        // Session Clerk valide, mais compte non lié à un docteur
        if (err.status === 403) {
          setStatus("not-authorized");
          return;
        }

        console.error("AuthContext — échec de la récupération du profil :", err);
        setError(err.message);
        setStatus("error");
      }
    };

    fetchDoctor();
    return () => {
      cancelled = true;
    };
  }, [clerkLoaded, isSignedIn, api]);

  const logout = () => signOut();

  return (
    <AuthContext.Provider value={{ user: doctor, status, error, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}