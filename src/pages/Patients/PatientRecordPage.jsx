import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaNotesMedical, FaTooth, FaFileMedical, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { usePatients } from "../../context/PatientContext";
import { useAppointments } from "../../context/AppointmentContext";
import { useConsultations } from "../../context/ConsultationContext";
import { useTreatments } from "../../context/TreatmentContext";
import "./PatientRecordPage.css";

function formatDate(dateStr, options = { day: "2-digit", month: "long", year: "numeric" }) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", options);
}

function PatientRecordPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { patients } = usePatients();
  const { appointments } = useAppointments();
  const { consultations } = useConsultations();
  const { treatments, updateTreatment } = useTreatments();

  const patient = patients.find((p) => p.id.toString() === id);

  if (!patient) {
    return (
      <div className="patient-record-page">
        <div className="patient-not-found">
          <h2>Patient introuvable</h2>
          <p>Le patient demandé n'existe pas ou n'est plus disponible.</p>
          <Link to="/patients" className="back-btn">
            <FaArrowLeft />
            Retour aux patients
          </Link>
        </div>
      </div>
    );
  }

  const patientAppointments = appointments
    .filter((a) => a.patientId.toString() === id)
    .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));

  const patientConsultations = consultations
    .filter((c) => c.patientId.toString() === id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const patientTreatments = treatments
    .filter((t) => t.patientId.toString() === id)
    .map((treatment) => {
      const treatmentConsultations = patientConsultations
        .filter((c) => c.treatmentId === treatment.id)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      return { ...treatment, consultations: treatmentConsultations };
    })
    .sort((a, b) => {
      const lastA = a.consultations.at(-1)?.createdAt || a.startDate;
      const lastB = b.consultations.at(-1)?.createdAt || b.startDate;
      return new Date(lastB) - new Date(lastA);
    });

  const unclassifiedConsultations = patientConsultations.filter((c) => !c.treatmentId);

  const totalSoins = patientConsultations.reduce((total, c) => total + (c.soins?.length || 0), 0);

  const fullName = `${patient.firstName} ${patient.lastName}`;

  return (
    <div className="patient-record-page">
      <div className="record-topbar">
        <Link to="/patients" className="back-link">
          <FaArrowLeft />
          Retour aux patients
        </Link>
        <span className="record-label">DOSSIER MEDICAL ELECTRONIQUE</span>
      </div>

      <div className="patient-hero">
        <div className="patient-avatar">
          {patient.firstName.charAt(0)}
          {patient.lastName.charAt(0)}
        </div>
        <div className="patient-hero-info">
          <h1>{fullName}</h1>
          <p>Suivi et historique du patient</p>
        </div>
        <button className="edit-patient-btn" onClick={() => navigate(`/patients/${patient.id}/edit`)}>
          <FaEdit />
          Modifier les informations
        </button>
      </div>

      <div className="medical-section">
        <div className="section-heading">
          <span>DME</span>
          <h2>Résumé du dossier</h2>
        </div>

        <div className="medical-grid">
          <div className="medical-card">
            <div className="medical-icon"><FaFileMedical /></div>
            <div>
              <h3>Traitements</h3>
              <p>{patientTreatments.length === 0 ? "Aucun traitement enregistré" : "Parcours de soin"}</p>
            </div>
            <span className="medical-count">{patientTreatments.length}</span>
          </div>

          <div className="medical-card">
            <div className="medical-icon"><FaNotesMedical /></div>
            <div>
              <h3>Consultations</h3>
              <p>{patientConsultations.length === 0 ? "Aucune consultation enregistrée" : "Consultations enregistrées"}</p>
            </div>
            <span className="medical-count">{patientConsultations.length}</span>
          </div>

          <div className="medical-card">
            <div className="medical-icon"><FaTooth /></div>
            <div>
              <h3>Soins réalisés</h3>
              <p>{totalSoins === 0 ? "Aucun soin enregistré" : "Soins réalisés au total"}</p>
            </div>
            <span className="medical-count">{totalSoins}</span>
          </div>
        </div>
      </div>

      <section className="record-section">
        <div className="section-heading">
          <span>RENDEZ-VOUS</span>
          <h2>Historique des rendez-vous</h2>
        </div>

        {patientAppointments.length === 0 ? (
          <div className="record-empty-state">
            <FaNotesMedical />
            <h3>Aucun rendez-vous</h3>
            <p>Les rendez-vous de ce patient apparaîtront automatiquement dans son dossier.</p>
          </div>
        ) : (
          <div className="appointment-history">
            {patientAppointments.map((appointment) => (
              <div className="history-item" key={appointment.id}>
                <div className="history-date">
                  <strong>{formatDate(`${appointment.date}T00:00:00`, { day: "2-digit", month: "short", year: "numeric" })}</strong>
                  <span>{appointment.time}</span>
                </div>
                <div className="history-content">
                  <h3>Rendez-vous</h3>
                  <p>{appointment.reason || "Motif non renseigné"}</p>
                </div>
                <span className={`history-status ${appointment.status}`}>
                  {appointment.status === "completed" ? "Terminé" : appointment.status === "cancelled" ? "Annulé" : "En attente"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="record-section">
        <div className="section-heading">
          <span>HISTORIQUE MÉDICAL</span>
          <h2>Traitements et consultations</h2>
        </div>

        {patientTreatments.length === 0 && unclassifiedConsultations.length === 0 ? (
          <div className="record-empty-state">
            <FaTooth />
            <h3>Aucune consultation enregistrée</h3>
            <p>Les traitements, consultations et soins réalisés apparaîtront ici.</p>
          </div>
        ) : (
          <>
            {patientTreatments.map((treatment) => (
              <TreatmentGroup
                key={treatment.id}
                treatment={treatment}
                patientAppointments={patientAppointments}
                updateTreatment={updateTreatment}
              />
            ))}

           {unclassifiedConsultations.length > 0 && (
              <div className="treatment-group">
                <div className="treatment-group-header">
                  <div>
                    <span className="treatment-label-tag">
                      CONSULTATIONS
                    </span>

                    <h3>
                      Consultations sans parcours associé
                    </h3>
                  </div>
                </div>

                <div className="medical-history-list">
                  {unclassifiedConsultations.map((consultation) => (
                   <ConsultationCard
                    key={consultation.id}
                    consultation={consultation}
                    appointment={patientAppointments.find(
                      (a) => a.id === consultation.appointmentId
                    )}
                  />
                  ))}
                </div>
  </div>
)}
          </>
        )}
      </section>
    </div>
  );
}

function TreatmentGroup({
  treatment,
  patientAppointments,
  updateTreatment,
}) {
  const [showAll, setShowAll] = useState(false);

  const consultations = treatment.consultations || [];

  // Par défaut, on affiche uniquement la dernière séance
  const displayedConsultations = showAll
    ? consultations
    : consultations.slice(-1);

  return (
    <div className="treatment-group">

      <div className="treatment-group-header">

        <div className="treatment-title">

          <span className="treatment-label-tag">
            PARCOURS
          </span>

          <h3>
            {treatment.label || "Sans intitulé"}
          </h3>

          <span
            className={`treatment-status ${
              treatment.status || "ongoing"
            }`}
          >
            {treatment.status === "completed"
              ? "Terminé"
              : "En cours"}
          </span>

        </div>

        <div className="treatment-header-actions">

          {treatment.status !== "completed" && (
            <button
              type="button"
              className="complete-treatment-btn"
              onClick={() =>
                updateTreatment(
                  treatment.id,
                  { status: "completed" }
                )
              }
            >
              Terminer
            </button>
          )}

        </div>

      </div>

      {consultations.length === 0 ? (
        <p className="treatment-empty">
          Aucune séance enregistrée.
        </p>
      ) : (
        <>
          <div className="medical-history-list">

            {displayedConsultations.map((consultation) => {

              const originalIndex =
                consultations.indexOf(consultation);

              return (
                <ConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  appointment={patientAppointments.find(
                    (a) =>
                      a.id === consultation.appointmentId
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
              onClick={() =>
                setShowAll((prev) => !prev)
              }
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

function ConsultationCard({
  consultation,
  appointment,
  seanceNumber,
}) {
  const [showDetails, setShowDetails] = useState(false);

  const soins = consultation.soins || [];

  const hasDetails =
    consultation.compteRendu ||
    consultation.observation ||
    soins.length > 0;

  return (
    <div className="medical-history-card">

      <div className="medical-history-header">

        <div className="history-main-info">

          <div className="history-icon">
            <FaNotesMedical />
          </div>

          <div>

            <span>
              {seanceNumber
                ? `SÉANCE ${seanceNumber}`
                : "CONSULTATION"}
            </span>

            <h3>
              {consultation.reason || "Consultation"}
            </h3>

            {appointment && (
              <p>
                {formatDate(
                  `${appointment.date}T00:00:00`
                )}
                {" · "}
                {appointment.time}
              </p>
            )}

          </div>

        </div>

        <div className="consultation-card-actions">

          {soins.length > 0 && (
            <span className="acts-count">
              {soins.length}{" "}
              {soins.length > 1
                ? "soins"
                : "soin"}
            </span>
          )}

          {hasDetails && (
            <button
              type="button"
              className="details-btn"
              onClick={() =>
                setShowDetails((prev) => !prev)
              }
            >
              {showDetails
                ? "Masquer"
                : "Détails"}

              {showDetails ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )}
            </button>
          )}

        </div>

      </div>

      {showDetails && (
        <div className="medical-history-body">

          {consultation.compteRendu && (
            <div className="consultation-detail">

              <h4>Compte-rendu</h4>

              <p>
                {consultation.compteRendu}
              </p>

            </div>
          )}

          {consultation.observation && (
            <div className="consultation-detail">

              <h4>Observation</h4>

              <p>
                {consultation.observation}
              </p>

            </div>
          )}

          {soins.length > 0 && (
            <div className="consultation-detail">

              <h4>Soins réalisés</h4>

              <div className="acts-history-table">

                <div className="acts-history-header">
                  <span>Dent(s)</span>
                  <span>Type de soin</span>
                </div>

                {soins.map((soin) => (
                  <div
                    className="acts-history-row"
                    key={soin.id}
                  >

                    <span className="tooth-number">
                      {soin.dents &&
                      soin.dents.length > 0
                        ? soin.dents.join(", ")
                        : "—"}
                    </span>

                    <span>
                      {soin.typeSoin ||
                        "Soin non renseigné"}
                    </span>

                  </div>
                ))}

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default PatientRecordPage;