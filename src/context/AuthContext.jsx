import { createContext, useContext, useState, useEffect } from "react";
import { doctor } from "../mock/doctor";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("dme_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setInitializing(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (email === doctor.email && password === doctor.password) {
        const { password: _password, ...connectedUser } = doctor;
        setUser(connectedUser);
        localStorage.setItem("dme_user", JSON.stringify(connectedUser));
        setLoading(false);
        return true;
      }

      throw new Error("Email ou mot de passe incorrect");
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dme_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error, initializing }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}