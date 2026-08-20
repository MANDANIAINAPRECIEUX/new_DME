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

  const updatePatient=(id,patientData)=>{
    setPatients((prevPatients)=>
      prevPatients.map((patient)=>
        patient.id.toString()===id.toString()
          ? {...patient,...patientData}
          : patient
      )
    );
  };
  return(
    <PatientContext.Provider value={{patients,addPatient,updatePatient}}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients(){
  return useContext(PatientContext);
}