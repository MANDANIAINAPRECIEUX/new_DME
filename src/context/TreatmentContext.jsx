import { createContext, useContext, useState } from "react";
import { treatments as initialTreatments } from "../mock/treatments";

const TreatmentContext = createContext();

export function TreatmentProvider({ children }) {
  const [treatments, setTreatments] = useState(initialTreatments);

  const addTreatment = (treatmentData) => {
    const newTreatment = {
      id: Date.now(),
      status: "ongoing",
      startDate: new Date().toISOString().split("T")[0],
      ...treatmentData,
    };

    setTreatments((prev) => [...prev, newTreatment]);
    return newTreatment;
  };

  const updateTreatment = (id, treatmentData) => {
    setTreatments((prev) =>
      prev.map((treatment) =>
        treatment.id === id ? { ...treatment, ...treatmentData } : treatment
      )
    );
  };

  return (
    <TreatmentContext.Provider value={{ treatments, addTreatment, updateTreatment }}>
      {children}
    </TreatmentContext.Provider>
  );
}

export function useTreatments() {
  return useContext(TreatmentContext);
}