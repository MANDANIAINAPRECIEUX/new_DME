import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppointments } from "../../context/AppointmentContext";
import { usePatients } from "../../context/PatientContext";
import PatientSearch from "../../components/Patients/PatientSearch";
import AppointmentFilters from "../../components/Appointments/AppointmentFilters";
import AppointmentTable from "../../components/Appointments/AppointmentTable";
import {
  filterAppointmentsByPatient,
  filterAppointmentsByStatus,
  filterAppointmentsByDate,
} from "../../utils/appointmentUtils";
import "./Appointments.css";

function Appointments() {
  const { appointments } = useAppointments();
  const { patients } = usePatients();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const filteredByPatient = filterAppointmentsByPatient(
    appointments,
    patients,
    searchTerm
  );

  const filteredByStatus = filterAppointmentsByStatus(
    filteredByPatient,
    statusFilter
  );

  const filteredAppointments = filterAppointmentsByDate(
    filteredByStatus,
    dateFilter
  );

  return (
    <div className="appointments-page">

      <div className="appointments-header">

        <div>
          <h1>Rendez-vous</h1>
          <p>Gestion des rendez-vous du cabinet</p>
        </div>

        <Link
          to="/appointments/new"
          className="add-appointment-btn"
        >
          + Nouveau rendez-vous
        </Link>

      </div>

      <div className="appointments-toolbar">

        <PatientSearch
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
        />

        <AppointmentFilters
          statusFilter={statusFilter}
          dateFilter={dateFilter}
          onStatusChange={setStatusFilter}
          onDateChange={setDateFilter}
        />

      </div>

      <AppointmentTable
        appointments={filteredAppointments}
      />

    </div>
  );
}

export default Appointments;