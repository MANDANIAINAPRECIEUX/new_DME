import { doctors } from "../../mock/doctors";
import "./AppointmentFilters.css";

function AppointmentFilters({
  statusFilter,
  dateFilter,
  doctorFilter,
  onStatusChange,
  onDateChange,
  onDoctorChange,
}) {
  return (
    <div className="appointment-filters">

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="all">Tous les statuts</option>
        <option value="pending">En attente</option>
        <option value="completed">Terminé</option>
        <option value="cancelled">Annulé</option>
      </select>

      <select
        value={dateFilter}
        onChange={(e) => onDateChange(e.target.value)}
      >
        <option value="all">Toutes les dates</option>
        <option value="today">Aujourd'hui</option>
        <option value="tomorrow">Demain</option>
        <option value="week">Cette semaine</option>
        <option value="upcoming">À venir</option>
        <option value="past">Passés</option>
      </select>

      {doctors.length > 1 && (
        <select
          value={doctorFilter}
          onChange={(e) => onDoctorChange(e.target.value)}
        >
          <option value="all">Tous les docteurs</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              Dr. {doctor.firstName}
            </option>
          ))}
        </select>
      )}

    </div>
  );
}

export default AppointmentFilters;