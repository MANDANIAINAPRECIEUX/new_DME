import { useState } from "react";
import { Link } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import PatientSearch from "../../components/Patients/PatientSearch";
import PatientTable from "../../components/Patients/PatientTable";
import "./Patients.css";

function Patients() {
  const { patients } = usePatients();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase().trim();

    return fullName.includes(search);
  });

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

      <PatientSearch
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
      />

      <PatientTable patients={filteredPatients} />

    </div>
  );
}

export default Patients;