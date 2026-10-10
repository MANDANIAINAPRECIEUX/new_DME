import { createContext, useContext } from "react";
import { useUser, useClerk } from "@clerk/react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const logout = async () => {
    localStorage.removeItem("dme_user");
    await signOut({ redirectUrl: "/login" });
  };

  const connectedUser =
    isLoaded && isSignedIn && user
      ? {
          id: user.id,
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          email: user.primaryEmailAddress?.emailAddress ?? "",
          photo: user.imageUrl,
        }
      : null;

  return (
    <AuthContext.Provider
      value={{
        user: connectedUser,
        logout,
        initializing: !isLoaded,
        loading: !isLoaded,
        error: null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }

  return context;
}
