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

  const patientConsultations = consultations.filter(
  (consultation) =>
    consultation.patientId.toString() === id
  );

  const patientActs = patientConsultations.flatMap(
  (consultation) =>
    (consultation.acts || []).map((act) => ({
      ...act,
      consultationId: consultation.id,
      date: consultation.createdAt,
    }))
  );

  const patientTreatments = patientActs.filter(
  (act) => act.treatment && act.treatment.trim() !== ""
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
          DOSSIER MEDICAL ELECTRONIQUE
        </span>
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
          <span>DME</span>
          <h2>Résumé du dossier</h2>
        </div>

        <div className="medical-grid">
          <div className="medical-card">
            <div className="medical-icon">
              <FaNotesMedical />
            </div>

            <div>
              <h3>Consultations</h3>
              <p>
                {patientConsultations.length === 0
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
              <p>
              {patientTreatments.length === 0
              ? "Aucun traitement enregistré"
              : "Traitements enregistrés"}
              </p>
            </div>

              <span className="medical-count">
             {patientTreatments.length}
              </span>
          </div>

          <div className="medical-card">
            <div className="medical-icon">
              <FaTooth />
            </div>

            <div>
              <h3>Soins réalisés</h3>
              <p>Aucun soin enregistré</p>
            </div>

            <span className="medical-count">{patientActs.length}</span>
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
    <h2>Actes et Traitements</h2>
  </div>

  {patientActs.length === 0 ? (

    <div className="record-empty-state">
      <FaTooth />

      <h3>Aucun acte enregistré</h3>

      <p>
        Les actes réalisés, les dents traitées et les traitements
        apparaîtront ici après les consultations.
      </p>
    </div>

  ) : (

    <div className="medical-history-list">

  {patientConsultations.map((consultation) => {

    const consultationActs = consultation.acts || [];

    if (consultationActs.length === 0) {
      return null;
    }

    const appointment = patientAppointments.find(
      (appointment) =>
        appointment.id === consultation.appointmentId
    );

    return (
      <div
        className="medical-history-card"
        key={consultation.id}
      >

        <div className="medical-history-header">

          <div className="history-main-info">

            <div className="history-icon">
              <FaNotesMedical />
            </div>

            <div>
              <span>CONSULTATION</span>

              <h3>
                {consultation.reason || "Consultation"}
              </h3>

              {appointment && (
                <p>
                  {new Date(
                    `${appointment.date}T00:00:00`
                  ).toLocaleDateString(
                    "fr-FR",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    }
                  )}
                  {" · "}
                  {appointment.time}
                </p>
              )}

            </div>

          </div>

          <span className="acts-count">
            {consultationActs.length}
            {" "}
            {consultationActs.length > 1 ? "actes" : "acte"}
          </span>

        </div>


        <div className="medical-history-body">

          <h4>Actes réalisés</h4>

          <div className="acts-history-table">

            <div className="acts-history-header">
              <span>Dent</span>
              <span>Acte / soin</span>
              <span>Traitement</span>
            </div>

            {consultationActs.map((act, index) => (

              <div
                className="acts-history-row"
                key={index}
              >

                <span className="tooth-number">
                  {act.tooth || "—"}
                </span>

                <span>
                  {act.act || "Acte non renseigné"}
                </span>

                <span className="treatment-value">
                  {act.treatment || "—"}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>
    );
  })}

</div>
  )}

          </section>
    </div>
  );
}

export default PatientRecordPage;