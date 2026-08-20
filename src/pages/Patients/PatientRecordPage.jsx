import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaNotesMedical, FaTooth, FaFileMedical } from "react-icons/fa";
import { usePatients } from "../../context/PatientContext";
import "./PatientRecordPage.css";

function PatientRecordPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients } = usePatients();

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
              <p>Aucune consultation enregistrée</p>
            </div>

            <span className="medical-count">0</span>
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

      <div className="record-empty-state">
        <FaNotesMedical />
        <h3>Aucun historique médical</h3>
        <p>
          Les consultations, soins et traitements du patient
          apparaîtront ici.
        </p>
      </div>
    </div>
  );
}

export default PatientRecordPage;