import { createContext,useContext,useState } from "react";
import { appointments as initialAppointments } from "../mock/appointments";

const AppointmentContext=createContext();

export function AppointmentProvider({ children }){
  const [appointments,setAppointments]=useState(initialAppointments);

  const addAppointment=(appointmentData)=>{
    const newAppointment={
      id:Date.now(),
      ...appointmentData,
    };

    setAppointments((prevAppointments)=>[
      ...prevAppointments,
      newAppointment,
    ]);

    return newAppointment;
  };

  const updateAppointment=(id,appointmentData)=>{
    setAppointments((prevAppointments)=>
      prevAppointments.map((appointment)=>
        appointment.id===id
          ? {...appointment,...appointmentData}
          : appointment
      )
    );
  };

  const deleteAppointment=(id)=>{
    setAppointments((prevAppointments)=>
      prevAppointments.filter(
        (appointment)=>appointment.id!==id
      )
    );
  };

  return(
    <AppointmentContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments(){
  return useContext(AppointmentContext);
}