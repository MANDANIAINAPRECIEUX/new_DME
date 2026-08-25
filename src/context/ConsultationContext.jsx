import { createContext,useContext,useState } from "react";
import { consultations as initialConsultations } from "../mock/consultations";

const ConsultationContext=createContext();

export function ConsultationProvider({ children }){
  const [consultations, setConsultations] = useState(
  initialConsultations
  );

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

  const updateConsultation = (id, consultationData) => {

    setConsultations((prevConsultations) =>
      prevConsultations.map((consultation) =>
        consultation.id === id
          ? {
              ...consultation,
              ...consultationData,
            }
          : consultation
      )
    );
  };

  return(
    <ConsultationContext.Provider
      value={{
        consultations,
        addConsultation,
        updateConsultation,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
}

export function useConsultations(){
  return useContext(ConsultationContext);
}