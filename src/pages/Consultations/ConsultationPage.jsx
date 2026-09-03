import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaNotesMedical, FaTooth, FaPlus, FaTrash } from "react-icons/fa";
import { useAppointments } from "../../context/AppointmentContext";
import { usePatients } from "../../context/PatientContext";
import { useConsultations } from "../../context/ConsultationContext";
import { useTreatments } from "../../context/TreatmentContext";
import { useTypesSoins } from "../../context/TypeSoinContext";
import "./ConsultationPage.css";

function ConsultationPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const { appointments, updateAppointment } = useAppointments();
  const { patients } = usePatients();
  const { addConsultation } = useConsultations();
  const { treatments, addTreatment, updateTreatment } = useTreatments();
  const { typesSoins } = useTypesSoins(); 

  const appointment = appointments.find((a) => a.id.toString() === appointmentId);

  const patient = appointment
    ? patients.find((p) => p.id.toString() === appointment.patientId.toString())
    : null;

  const patientTreatments = patient
    ? treatments.filter((t) => t.patientId === patient.id && t.status === "ongoing")
    : [];

  const [formData, setFormData] = useState({
    reason: appointment?.reason || "",
    compteRendu: "",
    observation: "",
    treatmentId: "",
    isNewTreatment: false,
    newTreatmentLabel: "",
    markTreatmentCompleted: false,
    soins: [],
  });

  if (!appointment || !patient) {
    return (
      <div className="consultation-page">
        <div className="consultation-not-found">
          <h2>Rendez-vous introuvable</h2>
          <p>Le rendez-vous associé à cette consultation n'existe pas ou n'est plus disponible.</p>
          <button className="back-btn" onClick={() => navigate("/appointments")}>
            <FaArrowLeft />
            Retour aux rendez-vous
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTreatmentSelect = (e) => {
    const value = e.target.value;
    if (value === "new") {
      setFormData((prev) => ({ ...prev, treatmentId: "", isNewTreatment: true }));
    } else {
      setFormData((prev) => ({
        ...prev,
        treatmentId: value,
        isNewTreatment: false,
        newTreatmentLabel: "",
      }));
    }
  };

  const addSoin = () => {
    setFormData((prev) => ({
      ...prev,
      soins: [...prev.soins, { id: Date.now(), typeSoin: "", dents: [] }],
    }));
  };

  const updateSoin = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      soins: prev.soins.map((soin, i) => (i === index ? { ...soin, [field]: value } : soin)),
    }));
  };

  const updateSoinDents = (index, value) => {
    const dents = value.split(",").map((d) => d.trim()).filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      soins: prev.soins.map((soin, i) => (i === index ? { ...soin, dents } : soin)),
    }));
  };

  const removeSoin = (index) => {
    setFormData((prev) => ({ ...prev, soins: prev.soins.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let treatmentId = formData.treatmentId ? Number(formData.treatmentId) : null;

    // Création du traitement à la volée si le dentiste en a démarré un nouveau
    if (formData.isNewTreatment && formData.newTreatmentLabel.trim()) {
      const newTreatment = addTreatment({
        patientId: patient.id,
        label: formData.newTreatmentLabel.trim(),
      });
      treatmentId = newTreatment.id;
    }

    addConsultation({
      appointmentId: appointment.id,
      treatmentId,
      patientId: patient.id,
      doctorId: appointment.doctorId || null,
      reason: formData.reason,
      compteRendu: formData.compteRendu,
      observation: formData.observation,
      soins: formData.soins,
    });

    // Clôture du traitement si le dentiste l'a indiqué
    if (treatmentId && formData.markTreatmentCompleted) {
      updateTreatment(treatmentId, { status: "completed" });
    }

    updateAppointment(appointment.id, { status: "completed" });
    navigate(`/patients/${patient.id}`);
  };

  const hasTreatmentSelected = formData.treatmentId || formData.isNewTreatment;

  return (
    <div className="consultation-page">
      <div className="consultation-topbar">
        <button className="back-link" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Retour
        </button>
        <span>Consultation</span>
      </div>

      <div className="consultation-header">
        <div className="consultation-icon"><FaNotesMedical /></div>
        <div>
          <span>CONSULTATION</span>
          <h1>{patient.firstName} {patient.lastName}</h1>
          <p>{appointment.date} · {appointment.time}</p>
        </div>
      </div>

      <form className="consultation-form" onSubmit={handleSubmit}>

        <section className="consultation-section">
          <div className="section-title">
            <span>01</span>
            <div>
              <h2>Motif de consultation</h2>
              <p>Raison principale de la visite du patient.</p>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="reason">Motif</label>
            <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange}
              placeholder="Motif de la consultation..." rows="3" />
          </div>
        </section>

        <section className="consultation-section">
          <div className="section-title">
            <span>02</span>
            <div>
              <h2>Compte-rendu</h2>
              <p>Petit résumé de ce qui s'est passé pendant la consultation.</p>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="compteRendu">Compte-rendu</label>
            <textarea id="compteRendu" name="compteRendu" value={formData.compteRendu} onChange={handleChange}
              placeholder="Résumé de la consultation..." rows="4" />
          </div>
        </section>

        <section className="consultation-section">
          <div className="section-title">
            <span>03</span>
            <div>
              <h2>Observation</h2>
              <p>Observation du soin réalisé ou du traitement en cours.</p>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="observation">Observation</label>
            <textarea id="observation" name="observation" value={formData.observation} onChange={handleChange}
              placeholder="Observation sur le soin ou le traitement en cours..." rows="4" />
          </div>
        </section>

        <section className="consultation-section">
          <div className="section-title">
            <span>04</span>
            <div>
              <h2>Traitement</h2>
              <p>Rattacher cette consultation à un traitement existant, ou en démarrer un nouveau.</p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="treatmentId">Traitement</label>
            <select
              id="treatmentId"
              name="treatmentId"
              value={formData.isNewTreatment ? "new" : formData.treatmentId}
              onChange={handleTreatmentSelect}
            >
              <option value="">Aucun traitement sélectionné</option>
              {patientTreatments.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
              <option value="new">+ Démarrer un nouveau traitement</option>
            </select>
            {patientTreatments.length === 0 && !formData.isNewTreatment && (
              <span className="form-help">
                Aucun traitement en cours pour ce patient — vous pouvez en démarrer un.
              </span>
            )}
          </div>

          {formData.isNewTreatment && (
            <div className="form-group">
              <label htmlFor="newTreatmentLabel">Nom du nouveau traitement</label>
              <input
                type="text"
                id="newTreatmentLabel"
                placeholder="Ex : Traitement orthodontique"
                value={formData.newTreatmentLabel}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, newTreatmentLabel: e.target.value }))
                }
              />
            </div>
          )}

          {hasTreatmentSelected && (
            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={formData.markTreatmentCompleted}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, markTreatmentCompleted: e.target.checked }))
                }
              />
              Marquer ce traitement comme terminé après cette séance
            </label>
          )}
        </section>

        <section className="consultation-section">
          <div className="section-title">
            <span>05</span>
            <div>
              <h2>Soins réalisés</h2>
              <p>Enregistrer les soins réalisés et les dents concernées pendant cette consultation.</p>
            </div>
          </div>

          <div className="acts-header">
            <h3>Soins</h3>
            <button type="button" className="add-act-btn" onClick={addSoin}>
              <FaPlus />
              Ajouter un soin
            </button>
          </div>

          {formData.soins.length === 0 ? (
            <div className="acts-empty">
              <FaTooth />
              <p>Aucun soin ajouté à cette consultation.</p>
             </div>
          ) : (
            <div className="acts-list">
              {formData.soins.map((soin, index) => (
                <div className="act-row" key={soin.id}>
                  <div className="form-group">
                    <label>Type de soin</label>
                      <select
                        value={soin.typeSoinId}
                        onChange={(e) => updateSoin(index, "typeSoinId", e.target.value)}
                      >
                        <option value="">Sélectionner un type</option>
                        {typesSoins.map((type) => (
                        <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                  </div>

                  <div className="form-group">
                    <label>Dents concernées</label>
                      <input type="text" placeholder="Ex : 16, 17" value={soin.dents.join(", ")}
                      onChange={(e) => updateSoinDents(index, e.target.value)} />
                      <span className="form-help">Séparer les numéros de dents par une virgule.</span>
                  </div>

                  <button type="button" className="remove-act-btn" onClick={() => removeSoin(index)}
                  title="Supprimer le soin">
                    <FaTrash />
                    </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="consultation-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Annuler</button>
          <button type="submit" className="save-consultation-btn">Enregistrer la consultation</button>
        </div>
      </form>
    </div>
  );
}

export default ConsultationPage;