import { createContext,useContext,useState } from "react";

const ConsultationContext=createContext();

export function ConsultationProvider({ children }){
  const [consultations,setConsultations]=useState([]);

  const addConsultation=(consultationData)=>{
    const newConsultation={
      id:Date.now(),
      ...consultationData,
      createdAt:new Date().toISOString(),
    };

    setConsultations((prevConsultations)=>[
      ...prevConsultations,
      newConsultation,
    ]);

    return newConsultation;
  };

  return(
    <ConsultationContext.Provider
      value={{
        consultations,
        addConsultation,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
}

export function useConsultations(){
  return useContext(ConsultationContext);
}