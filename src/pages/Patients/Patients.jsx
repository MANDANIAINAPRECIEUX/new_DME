import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import PatientSearch from "../../components/Patients/PatientSearch";
import PatientTable from "../../components/Patients/PatientTable";
import Pagination from "../../components/common/Pagination";
import "./Patients.css";

const ITEMS_PER_PAGE = 5;

function Patients() {
  const { patients } = usePatients();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase().trim();
    return fullName.includes(search);
  });

  // Revenir à la page 1 dès que la recherche change,
  // sinon on peut se retrouver sur une page qui n'existe plus.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);

  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="patients-page">
      <div className="patients-header">
        <div>
          <h1>Patients</h1>
          <p>Gestion des patients du cabinet</p>
        </div>

        <Link to="/patients/new" className="add-patient-btn">
          + Nouveau patient
        </Link>
      </div>

      <PatientSearch searchTerm={searchTerm} onSearch={setSearchTerm} />

      <PatientTable patients={paginatedPatients} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Patients;