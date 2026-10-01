import { useState } from "react";
import { Link } from "react-router-dom";
import { useTreatments } from "../../context/TreatmentContext";
import { usePatients } from "../../context/PatientContext";
import { useConsultations } from "../../context/ConsultationContext";
import { useTypesSoins } from "../../context/TypeSoinContext";
import { getSolde, formatMontant } from "../../utils/billingUtils";
import "./Treatments.css";

function Treatments() {
  const { treatments } = useTreatments();
  const { patients } = usePatients();
  const { consultations } = useConsultations();
  const { typesSoins } = useTypesSoins();

  const [statusFilter, setStatusFilter] = useState("all");

  const patientsMap = Object.fromEntries(patients.map((p) => [p.id, p]));

  const enrichedTreatments = treatments
    .map((treatment) => {
      const treatmentConsultations = consultations.filter((c) => c.treatmentId === treatment.id);
      const solde = treatmentConsultations.reduce(
        (total, c) => total + getSolde(c.soins, c.paiements, typesSoins),
        0
      );
      return { ...treatment, seanceCount: treatmentConsultations.length, solde };
    })
    .filter((t) => statusFilter === "all" || t.status === statusFilter);

  return (
    <div className="treatments-page">
      <div className="treatments-header">
        <div>
          <h1>Traitements</h1>
          <p>Vue d'ensemble des parcours de soins du cabinet</p>
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          <option value="ongoing">En cours</option>
          <option value="completed">Terminés</option>
        </select>
      </div>

      <div className="treatments-table-card">
        <table className="treatments-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Traitement</th>
              <th>Séances</th>
              <th>Statut</th>
              <th>Solde</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {enrichedTreatments.length === 0 ? (
              <tr><td colSpan="6" className="empty-message">Aucun traitement trouvé.</td></tr>
            ) : (
              enrichedTreatments.map((treatment) => {
                const patient = patientsMap[treatment.patientId];
                return (
                  <tr key={treatment.id}>
                    <td>{patient ? `${patient.firstName} ${patient.lastName}` : "Patient inconnu"}</td>
                    <td>{treatment.label}</td>
                    <td>{treatment.seanceCount}</td>
                    <td>
                      <span className={`treatment-status-badge ${treatment.status}`}>
                        {treatment.status === "completed" ? "Terminé" : "En cours"}
                      </span>
                    </td>
                    <td className={treatment.solde > 0 ? "solde-positive" : "solde-zero"}>
                      {formatMontant(treatment.solde)}
                    </td>
                    <td>
                      {patient && (
                        <Link to={`/patients/${patient.id}`} className="details-btn">
                          Voir le dossier
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Treatments;