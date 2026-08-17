import { Link } from "react-router-dom";
import PatientSearch from "../../components/Patients/PatientSearch";
import PatientTable from "../../components/Patients/PatientTable";
import "./Patients.css";

function Patients() {
  return (
    <div className="patients-page">

      <div className="patients-header">

        <div>
          <h1>Patients</h1>
          <p>Gestion des patients du cabinet</p>
        </div>

         <Link
          to="/patients/new"
          className="add-patient-btn"
        >
          + Nouveau patient
        </Link>

      </div>

      <PatientSearch />

      <PatientTable />

    </div>
  );
}

export default Patients;