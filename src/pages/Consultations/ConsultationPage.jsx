import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaNotesMedical, FaTooth, FaPlus, FaTrash, FaCreditCard } from "react-icons/fa";
import { useAppointments } from "../../context/AppointmentContext";
import { usePatients } from "../../context/PatientContext";
import { useConsultations } from "../../context/ConsultationContext";
import { useTreatments } from "../../context/TreatmentContext";
import { useTypesSoins } from "../../context/TypeSoinContext";
import { useAuth } from "../../context/AuthContext";
import { getTotalDu, getTotalPaye, formatMontant } from "../../utils/billingUtils";
import "./ConsultationPage.css";

function ConsultationPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const { appointments, updateAppointment } = useAppointments();
  const { patients } = usePatients();
  const { addConsultation } = useConsultations();
  const { treatments, addTreatment, updateTreatment } = useTreatments();
  const { typesSoins } = useTypesSoins();
  const { user } = useAuth();

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
    paiements: [],
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
      setFormData((prev) => ({ ...prev, treatmentId: value, isNewTreatment: false, newTreatmentLabel: "" }));
    }
  };

  // --- Soins ---

  const addSoin = () => {
    setFormData((prev) => ({
      ...prev,
      soins: [...prev.soins, { id: Date.now(), typeSoinId: "", dents: [] }],
    }));
  };

  // RG11 : toute modification des soins doit garder le total dû >= total déjà payé
  const applySoinsChange = (newSoins) => {
    const newTotalDu = getTotalDu(newSoins, typesSoins);
    const totalPaye = getTotalPaye(formData.paiements);

    if (newTotalDu < totalPaye) {
      alert(
        `Impossible : le total dû (${formatMontant(newTotalDu)}) deviendrait inférieur au total déjà payé (${formatMontant(totalPaye)}).`
      );
      return;
    }

    setFormData((prev) => ({ ...prev, soins: newSoins }));
  };

  const updateSoin = (index, field, value) => {
    const newSoins = formData.soins.map((soin, i) => (i === index ? { ...soin, [field]: value } : soin));
    applySoinsChange(newSoins);
  };

  const updateSoinDents = (index, value) => {
    const dents = [...new Set(value.split(",").map((d) => d.trim()).filter(Boolean))];
    const newSoins = formData.soins.map((soin, i) => (i === index ? { ...soin, dents } : soin));
    applySoinsChange(newSoins);
  };

  const removeSoin = (index) => {
    const newSoins = formData.soins.filter((_, i) => i !== index);
    applySoinsChange(newSoins);
  };

  // --- Paiements ---

  const totalDu = getTotalDu(formData.soins, typesSoins);
  const totalPaye = getTotalPaye(formData.paiements);
  const solde = totalDu - totalPaye;

  const addPaiement = () => {
    setFormData((prev) => ({
      ...prev,
      paiements: [
        ...prev.paiements,
        { id: Date.now(), amount: "", date: new Date().toISOString().split("T")[0], method: "" },
      ],
    }));
  };

  const updatePaiement = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      paiements: prev.paiements.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    }));
  };

  const removePaiement = (index) => {
    setFormData((prev) => ({ ...prev, paiements: prev.paiements.filter((_, i) => i !== index) }));
  };

  // RG10 : montant strictement positif — RG11 : ne peut dépasser le solde restant
  const getPaiementError = (index) => {
    const paiement = formData.paiements[index];
    if (paiement.amount === "") return null;

    const amount = Number(paiement.amount);
    if (amount <= 0) return "Le montant doit être strictement positif.";

    const totalAutres = getTotalPaye(formData.paiements.filter((_, i) => i !== index));
    const soldeDisponible = totalDu - totalAutres;

    if (amount > soldeDisponible) {
      return `Dépasse le solde restant (${formatMontant(soldeDisponible)}).`;
    }

    return null;
  };

  // --- Submit ---

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasInvalidPaiement = formData.paiements.some(
      (p, i) => !p.amount || getPaiementError(i)
    );

    if (hasInvalidPaiement) {
      alert("Veuillez corriger les paiements saisis avant d'enregistrer.");
      return;
    }

    let treatmentId = formData.treatmentId ? Number(formData.treatmentId) : null;
    let treatmentLabel = null;

    if (formData.isNewTreatment && formData.newTreatmentLabel.trim()) {
      const newTreatment = addTreatment({
        patientId: patient.id,
        label: formData.newTreatmentLabel.trim(),
      });
      treatmentId = newTreatment.id;
      treatmentLabel = newTreatment.label;
    } else if (treatmentId) {
      treatmentLabel = patientTreatments.find((t) => t.id === treatmentId)?.label;
    }

    addConsultation({
      appointmentId: appointment.id,
      treatmentId,
      patientId: patient.id,
      doctorId: user?.id ?? null,
      reason: formData.reason,
      compteRendu: formData.compteRendu,
      observation: formData.observation,
      soins: formData.soins.map((soin) => ({
        ...soin,
        typeSoinId: soin.typeSoinId ? Number(soin.typeSoinId) : null,
      })),
      paiements: formData.paiements.map((p) => ({ ...p, amount: Number(p.amount) })),
    });

    if (treatmentId && formData.markTreatmentCompleted) {
      updateTreatment(treatmentId, { status: "completed" });
    }

    updateAppointment(appointment.id, { status: "completed" });

    const shouldSuggestNextAppointment = treatmentId && !formData.markTreatmentCompleted;

    navigate(`/patients/${patient.id}`, {
      state: shouldSuggestNextAppointment
        ? {
            suggestNextAppointment: {
              patientId: patient.id,
              treatmentId,
              reason: `Suite : ${treatmentLabel || "traitement"}`,
            },
          }
        : undefined,
    });
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
          <p>
            {appointment.date} · {appointment.time}
            {user && ` · Dr. ${user.firstName}`}
          </p>
        </div>
      </div>

      <form className="consultation-form" onSubmit={handleSubmit}>

        <section className="consultation-section">
          <div className="section-title">
            <span>01</span>
            <div><h2>Motif de consultation</h2><p>Raison principale de la visite du patient.</p></div>
          </div>
          <div className="form-group">
            <label htmlFor="reason">Motif</label>
            <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} rows="3" />
          </div>
        </section>

        <section className="consultation-section">
          <div className="section-title">
            <span>02</span>
            <div><h2>Compte-rendu</h2><p>Petit résumé de ce qui s'est passé pendant la consultation.</p></div>
          </div>
          <div className="form-group">
            <label htmlFor="compteRendu">Compte-rendu</label>
            <textarea id="compteRendu" name="compteRendu" value={formData.compteRendu} onChange={handleChange} rows="4" />
          </div>
        </section>

        <section className="consultation-section">
          <div className="section-title">
            <span>03</span>
            <div><h2>Observation</h2><p>Observation du soin réalisé ou du traitement en cours.</p></div>
          </div>
          <div className="form-group">
            <label htmlFor="observation">Observation</label>
            <textarea id="observation" name="observation" value={formData.observation} onChange={handleChange} rows="4" />
          </div>
        </section>

        <section className="consultation-section">
          <div className="section-title">
            <span>04</span>
            <div><h2>Traitement</h2><p>Rattacher cette consultation à un traitement existant, ou en démarrer un nouveau.</p></div>
          </div>

          <div className="form-group">
            <label htmlFor="treatmentId">Traitement</label>
            <select id="treatmentId" name="treatmentId"
              value={formData.isNewTreatment ? "new" : formData.treatmentId}
              onChange={handleTreatmentSelect}>
              <option value="">Aucun traitement sélectionné</option>
              {patientTreatments.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              <option value="new">+ Démarrer un nouveau traitement</option>
            </select>
            {patientTreatments.length === 0 && !formData.isNewTreatment && (
              <span className="form-help">Aucun traitement en cours pour ce patient — vous pouvez en démarrer un.</span>
            )}
          </div>

          {formData.isNewTreatment && (
            <div className="form-group">
              <label htmlFor="newTreatmentLabel">Nom du nouveau traitement</label>
              <input type="text" id="newTreatmentLabel" placeholder="Ex : Traitement orthodontique"
                value={formData.newTreatmentLabel}
                onChange={(e) => setFormData((prev) => ({ ...prev, newTreatmentLabel: e.target.value }))} />
            </div>
          )}

          {hasTreatmentSelected && (
            <label className="checkbox-inline">
              <input type="checkbox" checked={formData.markTreatmentCompleted}
                onChange={(e) => setFormData((prev) => ({ ...prev, markTreatmentCompleted: e.target.checked }))} />
              Marquer ce traitement comme terminé après cette séance
            </label>
          )}
        </section>

        <section className="consultation-section">
          <div className="section-title">
            <span>05</span>
            <div><h2>Soins réalisés</h2><p>Enregistrer les soins réalisés et les dents concernées pendant cette consultation.</p></div>
          </div>

          <div className="acts-header">
            <h3>Soins</h3>
            <button type="button" className="add-act-btn" onClick={addSoin}><FaPlus />Ajouter un soin</button>
          </div>

          {formData.soins.length === 0 ? (
            <div className="acts-empty"><FaTooth /><p>Aucun soin ajouté à cette consultation.</p></div>
          ) : (
            <div className="acts-list">
              {formData.soins.map((soin, index) => (
                <div className="act-row" key={soin.id}>
                  <div className="form-group">
                    <label>Type de soin</label>
                    <select value={soin.typeSoinId} onChange={(e) => updateSoin(index, "typeSoinId", e.target.value)}>
                      <option value="">Sélectionner un type</option>
                      {typesSoins.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label} — {formatMontant(type.tarif)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Dents concernées</label>
                    <input type="text" placeholder="Ex : 16, 17" value={soin.dents.join(", ")}
                      onChange={(e) => updateSoinDents(index, e.target.value)} />
                    <span className="form-help">Séparer les numéros de dents par une virgule.</span>
                  </div>
                  <button type="button" className="remove-act-btn" onClick={() => removeSoin(index)} title="Supprimer le soin">
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="consultation-section">
          <div className="section-title">
            <span>06</span>
            <div><h2>Paiements</h2><p>Enregistrer les paiements associés à cette consultation.</p></div>
          </div>

          <div className="billing-summary">
            <div className="billing-summary-item">
              <span>Total dû</span>
              <span>{formatMontant(totalDu)}</span>
            </div>
            <div className="billing-summary-item">
              <span>Total payé</span>
              <span>{formatMontant(totalPaye)}</span>
            </div>
            <div className="billing-summary-item">
              <span>Solde restant</span>
              <span className={solde > 0 ? "solde-positive" : "solde-zero"}>{formatMontant(solde)}</span>
            </div>
          </div>

          <div className="acts-header">
            <h3>Paiements</h3>
            <button type="button" className="add-act-btn" onClick={addPaiement} disabled={solde <= 0}>
              <FaPlus />Ajouter un paiement
            </button>
          </div>

          {formData.paiements.length === 0 ? (
            <div className="acts-empty"><FaCreditCard /><p>Aucun paiement enregistré pour cette consultation.</p></div>
          ) : (
            <div className="acts-list">
              {formData.paiements.map((paiement, index) => {
                const error = getPaiementError(index);
                return (
                  <div className="act-row" key={paiement.id}>
                    <div className="form-group">
                      <label>Montant</label>
                      <input type="number" min="0" placeholder="Ex : 50000" value={paiement.amount}
                        onChange={(e) => updatePaiement(index, "amount", e.target.value)} />
                      {error && <span className="form-error">{error}</span>}
                    </div>
                    <div className="form-group">
                      <label>Date</label>
                      <input type="date" value={paiement.date}
                        onChange={(e) => updatePaiement(index, "date", e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Mode de paiement</label>
                      <select value={paiement.method} onChange={(e) => updatePaiement(index, "method", e.target.value)}>
                        <option value="">Sélectionner</option>
                        <option value="cash">Espèces</option>
                        <option value="card">Carte bancaire</option>
                        <option value="mobile-money">Mobile Money</option>
                        <option value="bank-transfer">Virement</option>
                      </select>
                    </div>
                    <button type="button" className="remove-act-btn" onClick={() => removePaiement(index)} title="Supprimer le paiement">
                      <FaTrash />
                    </button>
                  </div>
                );
              })}
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