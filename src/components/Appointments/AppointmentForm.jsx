import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import { useAppointments } from "../../context/AppointmentContext";
import PatientSearchSelect from "../Patients/PatientSearchSelect";
import { hasAppointmentConflict } from "../../utils/appointmentUtils";
import "./AppointmentForm.css";

function AppointmentForm(){
  const navigate=useNavigate();
  const { id }=useParams();

  const { patients }=usePatients();
  const {
    appointments,
    addAppointment,
    updateAppointment
  }=useAppointments();

  const isEditMode=Boolean(id);

  const [formData,setFormData]=useState({
    patientId:"",
    date:"",
    time:"",
    reason:"",
  });

  const [errors,setErrors]=useState({});

  const appointmentToEdit=appointments.find(
    (appointment)=>
      appointment.id.toString()===id
  );

  useEffect(()=>{
    if(appointmentToEdit){
      setFormData({
        patientId:appointmentToEdit.patientId,
        date:appointmentToEdit.date,
        time:appointmentToEdit.time,
        reason:appointmentToEdit.reason||"",
      });
    }
  },[appointmentToEdit]);

  const validateForm=()=>{
    const newErrors={};

    if(!formData.patientId){
      newErrors.patientId="Veuillez sélectionner un patient.";
    }

    if(!formData.date){
      newErrors.date="Veuillez renseigner la date.";
    }

    if(!formData.time){
      newErrors.time="Veuillez renseigner l'heure.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length===0;
  };

  const handleChange=(e)=>{
    const { name,value }=e.target;

    setFormData((prev)=>({
      ...prev,
      [name]:value,
    }));

    setErrors((prev)=>({
      ...prev,
      [name]:"",
    }));
    };

  const handleSubmit=(e)=>{
    e.preventDefault();

    if(!validateForm()){
      return;
    }
    const conflict=hasAppointmentConflict(
    appointments,
    formData,
    isEditMode ? id : null
    );

    if(conflict){
      setErrors({
      time:"Ce créneau est déjà occupé. Veuillez choisir un autre horaire.",
      });
    return;
    }

    const appointmentData={
      ...formData,
      patientId:Number(formData.patientId),
    };

    if(isEditMode){
      updateAppointment(
        Number(id),
        appointmentData
      );
    }else{
      addAppointment({
        ...appointmentData,
        status:"pending",
      });
    }

    navigate("/appointments");
  };

  if(isEditMode&&!appointmentToEdit){
    return(
      <div className="appointment-form-card">
        <div className="appointment-form-header">
          <h2>Rendez-vous introuvable</h2>
          <p>
            Le rendez-vous demandé n'existe pas ou
            n'est plus disponible.
          </p>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={()=>navigate("/appointments")}
          >
            Retour aux rendez-vous
          </button>
        </div>
      </div>
    );
  }

  return(
    <div className="appointment-form-card">

      <div className="appointment-form-header">

        <h2>
          {isEditMode
            ? "Modifier le rendez-vous"
            : "Nouveau rendez-vous"}
        </h2>

        <p>
          {isEditMode
            ? "Modifier les informations du rendez-vous"
            : "Planifier un rendez-vous pour un patient"}
        </p>

        <span className="required-info">
          * Champs obligatoires
        </span>

      </div>

      <form
        className="appointment-form"
        onSubmit={handleSubmit}
      >

        <div className="form-section">

          <h3>Informations du rendez-vous</h3>

          <div className="form-group">

            <label htmlFor="patientId">
              Patient *
            </label>

            <PatientSearchSelect
              value={formData.patientId}
              onChange={(patientId)=>
                setFormData((prev)=>({
                  ...prev,
                  patientId,
                }))
              }
              error={errors.patientId}
            />

          </div>

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="date">
                Date *
              </label>

              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />

              {errors.date&&(
                <span className="form-error">
                  {errors.date}
                </span>
              )}

            </div>

            <div className="form-group">

              <label htmlFor="time">
                Heure *
              </label>

              <input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
              />

              {errors.time&&(
                <span className="form-error">
                  {errors.time}
                </span>
              )}

            </div>

          </div>

          <div className="form-group">

            <label htmlFor="reason">
              Motif
            </label>

            <input
              id="reason"
              name="reason"
              type="text"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Motif du rendez-vous"
            />

          </div>

        </div>

        <div className="form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={()=>navigate("/appointments")}
          >
            Annuler
          </button>

          <button
            type="submit"
            className="save-btn"
          >
            {isEditMode
              ? "Enregistrer les modifications"
              : "Enregistrer le rendez-vous"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default AppointmentForm;