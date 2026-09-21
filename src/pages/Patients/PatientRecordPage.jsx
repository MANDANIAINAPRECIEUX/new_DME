import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaNotesMedical, FaTooth, FaFileMedical } from "react-icons/fa";
import { usePatients } from "../../context/PatientContext";
import { useAppointments } from "../../context/AppointmentContext";
import { useConsultations } from "../../context/ConsultationContext";
import { useTreatments } from "../../context/TreatmentContext";
import TreatmentGroup from "../../components/Patients/TreatmentGroup";
import ConsultationCard from "../../components/Patients/ConsultationCard";
import { formatDate } from "../../utils/dateUtils";
import "./PatientRecordPage.css";

function PatientRecordPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const suggestNextAppointment = location.state?.suggestNextAppointment;

  const handlePlanNextAppointment = () => {
    navigate("/appointments/new", {
      state: {
        patientId: suggestNextAppointment.patientId,
        reason: suggestNextAppointment.reason,
      },
    });
  };

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
                suggestNextAppointment={suggestNextAppointment}
                onPlanNextAppointment={handlePlanNextAppointment}
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

export default PatientRecordPage;