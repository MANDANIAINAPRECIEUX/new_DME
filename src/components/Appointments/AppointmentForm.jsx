import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import { useAppointments } from "../../context/AppointmentContext";
import PatientSearchSelect from "../Patients/PatientSearchSelect";
import "./AppointmentForm.css";

function AppointmentForm(){
  const navigate=useNavigate();
  const { patients }=usePatients();
  const { addAppointment }=useAppointments();

  const [formData,setFormData]=useState({
    patientId:"",
    date:"",
    time:"",
    reason:"",
  });

  const [errors,setErrors]=useState({});

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
  };

  const handleSubmit=(e)=>{
    e.preventDefault();

    if(!validateForm()){
      return;
    }

    addAppointment({
      ...formData,
      patientId:Number(formData.patientId),
      status:"pending",
    });

    navigate("/appointments");
  };

  return(
    <div className="appointment-form-card">
      <div className="appointment-form-header">
        <h2>Nouveau rendez-vous</h2>
        <p>Planifier un rendez-vous pour un patient</p>
        <span className="required-info">* Champs obligatoires</span>
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
                onChange={(patientId) =>
                 setFormData((prev) => ({
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
            Enregistrer le rendez-vous
          </button>
        </div>
      </form>
    </div>
  );
}

export default AppointmentForm;