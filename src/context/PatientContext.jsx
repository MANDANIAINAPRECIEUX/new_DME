import { createContext,useContext,useState } from "react";
import { patients as initialPatients } from "../mock/patients";

const PatientContext=createContext();

export function PatientProvider({ children }){
  const [patients,setPatients]=useState(initialPatients);

  const addPatient=(patientData)=>{
    const newPatient={
      id:Date.now(),
      ...patientData,
    };

    setPatients((prevPatients)=>[
      ...prevPatients,
      newPatient,
    ]);

    return newPatient;
  };

  return(
    <PatientContext.Provider value={{patients,addPatient}}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients(){
  return useContext(PatientContext);
}