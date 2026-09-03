import { Link } from "react-router-dom";
import { useTreatments } from "../../context/TreatmentContext";
import { usePatients } from "../../context/PatientContext";
import { useConsultations } from "../../context/ConsultationContext";
import "./OngoingTreatments.css";

function OngoingTreatments() {
  const { treatments } = useTreatments();
  const { patients } = usePatients();
  const { consultations } = useConsultations();

  const patientsMap = Object.fromEntries(patients.map((p) => [p.id, p]));

  const ongoingTreatments = treatments
    .filter((t) => t.status === "ongoing")
    .map((treatment) => {
      const treatmentConsultations = consultations
        .filter((c) => c.treatmentId === treatment.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return {
        ...treatment,
        seanceCount: treatmentConsultations.length,
        lastSeanceDate: treatmentConsultations[0]?.createdAt || treatment.startDate,
      };
    })
    .sort((a, b) => new Date(b.lastSeanceDate) - new Date(a.lastSeanceDate));

  return (
    <div className="ongoing-treatments-card">
      <div className="ongoing-treatments-header">
        <h2>Traitements en cours</h2>
        <span className="ongoing-count">{ongoingTreatments.length}</span>
      </div>

      {ongoingTreatments.length === 0 ? (
        <p className="ongoing-empty">Aucun traitement en cours actuellement.</p>
      ) : (
        <div className="ongoing-treatments-list">
          {ongoingTreatments.map((treatment) => {
            const patient = patientsMap[treatment.patientId];

            return (
              <Link
                key={treatment.id}
                to={patient ? `/patients/${patient.id}` : "#"}
                className="ongoing-treatment-item"
              >
                <div>
                  <h3>{patient ? `${patient.firstName} ${patient.lastName}` : "Patient inconnu"}</h3>
                  <p>{treatment.label}</p>
                </div>

                <div className="ongoing-treatment-meta">
                  <span className="seance-count">
                    {treatment.seanceCount} {treatment.seanceCount > 1 ? "séances" : "séance"}
                  </span>
                  <span className="last-seance-date">
                    Dernière : {new Date(treatment.lastSeanceDate).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OngoingTreatments;