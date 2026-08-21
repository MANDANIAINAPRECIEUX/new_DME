import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaNotesMedical, FaTooth, FaFileMedical } from "react-icons/fa";
import { usePatients } from "../../context/PatientContext";
import { useAppointments } from "../../context/AppointmentContext";
import { useConsultations } from "../../context/ConsultationContext";
import "./PatientRecordPage.css";

function PatientRecordPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { patients } = usePatients();
  const { appointments }=useAppointments();
  const { consultations }=useConsultations();

  const patient = patients.find(
    (patient) => patient.id.toString() === id
  );

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

  const patientAppointments=appointments
    .filter(
      (appointment)=>
        appointment.patientId.toString()===id
    )
    .sort(
      (a,b)=>
        new Date(`${b.date}T${b.time}`)-
        new Date(`${a.date}T${a.time}`)
    );

  const completedAppointments=patientAppointments.filter(
    (appointment)=>appointment.status==="completed"
  );

  const patientConsultations = consultations.filter(
  (consultation) =>
    consultation.patientId.toString() === id
  );

  const fullName = `${patient.firstName} ${patient.lastName}`;

  return (
    <div className="patient-record-page">
      <div className="record-topbar">
        <Link to="/patients" className="back-link">
          <FaArrowLeft />
          Retour aux patients
        </Link>

        <span className="record-label">
          Dossier médical électronique
        </span>
      </div>

      <div className="patient-hero">
        <div className="patient-avatar">
          {patient.firstName.charAt(0)}
          {patient.lastName.charAt(0)}
        </div>

        <div className="patient-hero-info">
          <span className="patient-tag">PATIENT</span>
          <h1>{fullName}</h1>
          <p>Dossier médical du patient</p>
        </div>

        <button
          className="edit-patient-btn"
          onClick={() => navigate(`/patients/${patient.id}/edit`)}
        >
          <FaEdit />
          Modifier les informations
        </button>
      </div>

      <div className="medical-section">
        <div className="section-heading">
          <span>DOSSIER MÉDICAL</span>
          <h2>Suivi du patient</h2>
        </div>

        <div className="medical-grid">
          <div className="medical-card">
            <div className="medical-icon">
              <FaNotesMedical />
            </div>

            <div>
              <h3>Consultations</h3>
              <p>
                {completedAppointments.length === 0
                ? "Aucune consultation enregistrée"
                : "Consultations enregistrées"}
              </p>
            </div>

            <span className="medical-count">
              {patientConsultations.length}
            </span>
          </div>

          <div className="medical-card">
            <div className="medical-icon">
              <FaFileMedical />
            </div>

            <div>
              <h3>Traitements</h3>
              <p>Aucun traitement enregistré</p>
            </div>

            <span className="medical-count">0</span>
          </div>

          <div className="medical-card">
            <div className="medical-icon">
              <FaTooth />
            </div>

            <div>
              <h3>Soins réalisés</h3>
              <p>Aucun soin enregistré</p>
            </div>

            <span className="medical-count">0</span>
          </div>
        </div>
      </div>

      <section className="record-section">

  <div className="section-heading">
    <span>HISTORIQUE</span>
    <h2>Rendez-vous du patient</h2>
  </div>

  {patientAppointments.length === 0 ? (

    <div className="record-empty-state">
      <FaNotesMedical />

      <h3>Aucun rendez-vous</h3>

      <p>
        Les rendez-vous de ce patient apparaîtront
        automatiquement dans son dossier.
      </p>
    </div>

  ) : (

    <div className="appointment-history">

      {patientAppointments.map((appointment) => (

        <div
          className="history-item"
          key={appointment.id}
        >

          <div className="history-date">

            <strong>
              {new Date(
                `${appointment.date}T00:00:00`
              ).toLocaleDateString(
                "fr-FR",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                }
              )}
            </strong>

            <span>
              {appointment.time}
            </span>

          </div>

          <div className="history-content">

            <h3>Rendez-vous</h3>

            <p>
              {appointment.reason ||
                "Motif non renseigné"}
            </p>

          </div>

          <span
            className={`history-status ${appointment.status}`}
          >
            {appointment.status === "completed"
              ? "Terminé"
              : appointment.status === "cancelled"
              ? "Annulé"
              : "En attente"}
          </span>

        </div>

      ))}

    </div>

  )}

      </section>

      <section className="record-section">

  <div className="section-heading">
    <span>HISTORIQUE MÉDICAL</span>
    <h2>Actes et soins réalisés</h2>
  </div>

  <div className="record-empty-state">

    <FaTooth />

    <h3>Aucun soin enregistré</h3>

    <p>
      Les actes réalisés, les dents traitées et les
      traitements seront affichés ici après les consultations.
    </p>

  </div>

      </section>
    </div>
  );
}

export default PatientRecordPage;