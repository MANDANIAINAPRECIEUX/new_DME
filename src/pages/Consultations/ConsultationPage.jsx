import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaNotesMedical, FaTooth, FaPlus, FaTrash } from "react-icons/fa";
import { useAppointments } from "../../context/AppointmentContext";
import { usePatients } from "../../context/PatientContext";
import { useConsultations } from "../../context/ConsultationContext";
import "./ConsultationPage.css";

function ConsultationPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const { appointments, updateAppointment } = useAppointments();
  const { patients } = usePatients();
  const { addConsultation } = useConsultations();

  const appointment = appointments.find(
    (appointment) =>
      appointment.id.toString() === appointmentId
  );

  const patient = appointment
    ? patients.find(
        (patient) =>
          patient.id.toString() ===
          appointment.patientId.toString()
      )
    : null;

  const [formData, setFormData] = useState({
    reason: appointment?.reason || "",
    observations: "",
    diagnosis: "",
    notes: "",
    acts: [],
  });

  if (!appointment || !patient) {
    return (
      <div className="consultation-page">
        <div className="consultation-not-found">
          <h2>Rendez-vous introuvable</h2>
          <p>
            Le rendez-vous associé à cette consultation
            n'existe pas ou n'est plus disponible.
          </p>

          <button
            className="back-btn"
            onClick={() => navigate("/appointments")}
          >
            <FaArrowLeft />
            Retour aux rendez-vous
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addAct = () => {
    setFormData((prev) => ({
      ...prev,
      acts: [
        ...prev.acts,
        {
          tooth: "",
          act: "",
          treatment: "",
        },
      ],
    }));
  };

  const updateAct = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      acts: prev.acts.map((act, i) =>
        i === index
          ? {
              ...act,
              [field]: value,
            }
          : act
      ),
    }));
  };

  const removeAct = (index) => {
    setFormData((prev) => ({
      ...prev,
      acts: prev.acts.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

    addConsultation({
        appointmentId: appointment.id,
        patientId: patient.id,
        doctorId: appointment.doctorId || null,
        ...formData,
    });

    updateAppointment(appointment.id, {
        status: "completed",
    });

    navigate(`/patients/${patient.id}`);
  };
  
  return (
    <div className="consultation-page">

      <div className="consultation-topbar">

        <button
          className="back-link"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          Retour
        </button>

        <span>
          Consultation
        </span>

      </div>

      <div className="consultation-header">

        <div className="consultation-icon">
          <FaNotesMedical />
        </div>

        <div>
          <span>CONSULTATION</span>

          <h1>
            {patient.firstName} {patient.lastName}
          </h1>

          <p>
            {appointment.date} · {appointment.time}
          </p>
        </div>

      </div>

      <form
        className="consultation-form"
        onSubmit={handleSubmit}
      >

        <section className="consultation-section">

          <div className="section-title">
            <span>01</span>

            <div>
              <h2>Motif de consultation</h2>
              <p>
                Raison principale de la visite du patient.
              </p>
            </div>
          </div>

          <div className="form-group">

            <label htmlFor="reason">
              Motif
            </label>

            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Motif de la consultation..."
              rows="3"
            />

          </div>

        </section>

        <section className="consultation-section">

          <div className="section-title">
            <span>02</span>

            <div>
              <h2>Examen clinique</h2>
              <p>
                Observations effectuées lors de la consultation.
              </p>
            </div>
          </div>

          <div className="form-group">

            <label htmlFor="observations">
              Observations
            </label>

            <textarea
              id="observations"
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              placeholder="Observations cliniques..."
              rows="5"
            />

          </div>

        </section>

        <section className="consultation-section">

          <div className="section-title">
            <span>03</span>

            <div>
              <h2>Diagnostic</h2>
              <p>
                Diagnostic établi à l'issue de l'examen.
              </p>
            </div>
          </div>

          <div className="form-group">

            <label htmlFor="diagnosis">
              Diagnostic
            </label>

            <textarea
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              placeholder="Diagnostic..."
              rows="4"
            />

          </div>

        </section>

        <section className="consultation-section">

          <div className="section-title">
            <span>04</span>

            <div>
              <h2>Notes</h2>
              <p>
                Informations complémentaires concernant la consultation.
              </p>
            </div>
          </div>

          <div className="form-group">

            <label htmlFor="notes">
              Notes complémentaires
            </label>

            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Notes..."
              rows="4"
            />

          </div>

        </section>

        <section className="consultation-section">

          <div className="section-title">
            <span>05</span>

            <div>
              <h2>Actes et dents traitées</h2>

              <p>Enregistrer les soins réalisés sur les dents pendant cette consultation.</p>
            </div>

          </div>

          <div className="acts-header">
            <h3>Actes réalisés</h3>

            <button type="button" className="add-act-btn"
              onClick={addAct}
            >
              <FaPlus />
              Ajouter un acte
            </button>
          
          </div>

        {formData.acts.length === 0 ? (

          <div className="acts-empty">
            <FaTooth />
            <p> Aucun acte ajouté à cette consultation.</p>
          </div>

        ) : (

          <div className="acts-list">

        {formData.acts.map((act, index) => (

          <div className="act-row"
          key={index}
          >

          <div className="form-group">

            <label>
              Dent
            </label>

            <input
              type="text"
              placeholder="Ex : 16"
              value={act.tooth}
              onChange={(e) =>
                updateAct(
                  index,
                  "tooth",
                  e.target.value
                )
              }
            />

          </div>

          <div className="form-group">

            <label>
              Acte / soin
            </label>

            <input
              type="text"
              placeholder="Ex : Détartrage"
              value={act.act}
              onChange={(e) =>
                updateAct(
                  index,
                  "act",
                  e.target.value
                )
              }
            />

          </div>

          <div className="form-group">

            <label>
              Traitement
            </label>

            <input
              type="text"
              placeholder="Ex : Prévention"
              value={act.treatment}
              onChange={(e) =>
                updateAct(
                  index,
                  "treatment",
                  e.target.value
                )
              }
            />

          </div>

          <button
            type="button"
            className="remove-act-btn"
            onClick={() => removeAct(index)}
            title="Supprimer l'acte"
          >
            <FaTrash />
          </button>

        </div>

      ))}

    </div>

  )}

          </section>

        <div className="consultation-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            Annuler
          </button>

          <button
            type="submit"
            className="save-consultation-btn"
          >
            Enregistrer la consultation
          </button>

        </div>

      </form>

    </div>
  );
}

export default ConsultationPage;