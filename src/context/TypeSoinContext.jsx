import { createContext, useContext, useState } from "react";
import { typesSoins as initialTypesSoins } from "../mock/typesSoins";

const TypeSoinContext = createContext();

export function TypeSoinProvider({ children }) {
  const [typesSoins, setTypesSoins] = useState(initialTypesSoins);

  const addTypeSoin = (label) => {
    const newType = { id: Date.now(), label: label.trim() };
    setTypesSoins((prev) => [...prev, newType]);
    return newType;
  };

  const updateTypeSoin = (id, label) => {
    setTypesSoins((prev) =>
      prev.map((t) => (t.id === id ? { ...t, label: label.trim() } : t))
    );
  };

  const deleteTypeSoin = (id) => {
    setTypesSoins((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TypeSoinContext.Provider value={{ typesSoins, addTypeSoin, updateTypeSoin, deleteTypeSoin }}>
      {children}
    </TypeSoinContext.Provider>
  );
}

export function useTypesSoins() {
  return useContext(TypeSoinContext);
}