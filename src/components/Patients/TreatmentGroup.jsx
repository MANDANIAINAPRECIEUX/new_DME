import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";
import { useTypesSoins } from "../../context/TypeSoinContext";
import { getSolde, formatMontant } from "../../utils/billingUtils";
import ConsultationCard from "./ConsultationCard";

function TreatmentGroup({
  treatment,
  patientAppointments,
  completeTreatment,
  reopenTreatment,
  suggestNextAppointment,
  onPlanNextAppointment,
}) {
  const [showAll, setShowAll] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [busy, setBusy] = useState(false);
  const { typesSoins } = useTypesSoins();

  const consultations = treatment.consultations || [];
  const isCompleted = treatment.status === "completed";

  const soldeTraitement = consultations.reduce(
    (total, c) => total + getSolde(c.soins, c.paiements, typesSoins),
    0
  );

  const handleComplete = async () => {
    // RG08 : au moins une séance pour terminer un traitement
    if (consultations.length === 0) {
      alert("Un traitement doit comporter au moins une séance pour être terminé.");
      return;
    }

    if (soldeTraitement > 0) {
      alert(
        `Impossible de terminer ce traitement : il reste un solde de ${formatMontant(soldeTraitement)} à régler sur l'ensemble des séances.`
      );
      return;
    }

    // RG09 : la fin ne précède ni le début ni la dernière séance
    const today = new Date().toLocaleDateString("sv-SE"); // AAAA-MM-JJ, heure locale
    const lastSeanceDate = consultations
      .map((c) => c.consultationDate)
      .filter(Boolean)
      .sort()
      .at(-1);
    const endDate = [today, lastSeanceDate, treatment.startDate]
      .filter(Boolean)
      .sort()
      .at(-1);

    setBusy(true);
    try {
      await completeTreatment(treatment.id, endDate);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleReopen = async () => {
    setBusy(true);
    try {
      await reopenTreatment(treatment.id);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const showBanner =
    suggestNextAppointment?.treatmentId === treatment.id && !bannerDismissed;
  const displayedConsultations = showAll ? consultations : consultations.slice(-1);

  return (
    <div className="treatment-group">
      <div className="treatment-group-header">
        <div className="treatment-title">
          <span className="treatment-label-tag">PARCOURS</span>
          <h3>{treatment.label || "Sans intitulé"}</h3>
          <span className={`treatment-status ${treatment.status || "ongoing"}`}>
            {isCompleted ? "Terminé" : "En cours"}
          </span>
          {soldeTraitement > 0 && (
            <span className="treatment-solde-badge">
              Solde : {formatMontant(soldeTraitement)}
            </span>
          )}
        </div>

        <div className="treatment-header-actions">
          {isCompleted ? (
            <button
              type="button"
              className="complete-treatment-btn"
              disabled={busy}
              onClick={handleReopen}
            >
              Rouvrir
            </button>
          ) : (
            <button
              type="button"
              className="complete-treatment-btn"
              disabled={busy}
              onClick={handleComplete}
            >
              Terminer
            </button>
          )}
        </div>
      </div>

      {showBanner && (
        <div className="next-appointment-banner">
          <div>
            <strong>Planifier la prochaine séance ?</strong>
            <p>
              Ce traitement est toujours en cours — vous pouvez programmer le
              prochain rendez-vous maintenant.
            </p>
          </div>
          <div className="next-appointment-banner-actions">
            <button className="plan-next-btn" onClick={onPlanNextAppointment}>
              Planifier
            </button>
            <button
              className="dismiss-banner-btn"
              onClick={() => setBannerDismissed(true)}
              title="Ignorer"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {consultations.length === 0 ? (
        <p className="treatment-empty">Aucune séance enregistrée.</p>
      ) : (
        <>
          <div className="medical-history-list">
            {displayedConsultations.map((consultation) => {
              const originalIndex = consultations.indexOf(consultation);
              return (
                <ConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  appointment={patientAppointments.find(
                    (a) => a.id === consultation.appointmentId
                  )}
                  seanceNumber={originalIndex + 1}
                />
              );
            })}
          </div>

          {consultations.length > 1 && (
            <button
              type="button"
              className="show-sessions-btn"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? (
                <>
                  <FaChevronUp />
                  Réduire les séances
                </>
              ) : (
                <>
                  <FaChevronDown />
                  Voir les {consultations.length} séances
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default TreatmentGroup;