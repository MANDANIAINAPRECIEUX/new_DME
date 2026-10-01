import { createContext, useContext, useState } from "react";
import { typesSoins as initialTypesSoins } from "../mock/typesSoins";

const TypeSoinContext = createContext();

export function TypeSoinProvider({ children }) {
  const [typesSoins, setTypesSoins] = useState(initialTypesSoins);

  const addTypeSoin = (label, tarif) => {
    const newType = {
      id: Date.now(),
      label: label.trim(),
      tarif: Number(tarif) >= 0 ? Number(tarif) : 0,
    };
    setTypesSoins((prev) => [...prev, newType]);
    return newType;
  };

  // RG10/RG13 : le tarif ne peut jamais être modifié après création, seul le libellé l'est
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