import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppointments } from "../../context/AppointmentContext";
import { usePatients } from "../../context/PatientContext";
import PatientSearch from "../../components/Patients/PatientSearch";
import AppointmentFilters from "../../components/Appointments/AppointmentFilters";
import AppointmentTable from "../../components/Appointments/AppointmentTable";
import Pagination from "../../components/common/Pagination";
import {
  filterAppointmentsByPatient,
  filterAppointmentsByStatus,
  filterAppointmentsByDate,
} from "../../utils/appointmentUtils";
import "./Appointments.css";

const ITEMS_PER_PAGE = 5;

function Appointments() {
  const { appointments } = useAppointments();
  const { patients } = usePatients();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredByPatient = filterAppointmentsByPatient(appointments, patients, searchTerm);
  const filteredByStatus = filterAppointmentsByStatus(filteredByPatient, statusFilter);
  const filteredAppointments = filterAppointmentsByDate(filteredByStatus, dateFilter);

  // Revenir à la page 1 si n'importe quel filtre change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter]);

  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <div>
          <h1>Rendez-vous</h1>
          <p>Gestion des rendez-vous du cabinet</p>
        </div>

        <Link to="/appointments/new" className="add-appointment-btn">
          + Nouveau rendez-vous
        </Link>
      </div>

      <div className="appointments-toolbar">
        <PatientSearch searchTerm={searchTerm} onSearch={setSearchTerm} />
        <AppointmentFilters
          statusFilter={statusFilter}
          dateFilter={dateFilter}
          onStatusChange={setStatusFilter}
          onDateChange={setDateFilter}
        />
      </div>

      <AppointmentTable appointments={paginatedAppointments} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Appointments;