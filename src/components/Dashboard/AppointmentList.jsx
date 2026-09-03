import { useNavigate } from "react-router-dom";
import { useAppointments } from "../../context/AppointmentContext";
import { usePatients } from "../../context/PatientContext";
import { getTodayAppointments, getUpcomingAppointments } from "../../utils/appointmentUtils";
import "./AppointmentList.css";

function formatGroupDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === tomorrow.getTime()) return "Demain";

  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

function groupByDate(appointments) {
  return appointments.reduce((groups, appointment) => {
    const key = appointment.date;
    if (!groups[key]) groups[key] = [];
    groups[key].push(appointment);
    return groups;
  }, {});
}

function AppointmentList() {
  const navigate = useNavigate();
  const { appointments } = useAppointments();
  const { patients } = usePatients();

  const todayAppointments = getTodayAppointments(appointments);
  const upcomingAppointments = getUpcomingAppointments(appointments).slice(0, 5);
  const upcomingGrouped = groupByDate(upcomingAppointments);

  const patientsMap = Object.fromEntries(patients.map((patient) => [patient.id, patient]));

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed": return "Terminé";
      case "cancelled": return "Annulé";
      case "pending": return "En attente";
      default: return status;
    }
  };

  const handleAppointmentClick = (appointment) => {
    if (appointment.status !== "pending") return;
    navigate(`/consultations/${appointment.id}`);
  };

  return (
    <div className="appointment-card">
      <div className="appointment-header">
        <h2>Rendez-vous du jour</h2>
        <button className="view-all" onClick={() => navigate("/appointments")}>
          Voir tout
        </button>
      </div>

      {todayAppointments.length === 0 ? (
        <p className="week-empty">Aucun rendez-vous aujourd'hui.</p>
      ) : (
        <div className="appointment-list">
          {todayAppointments.map((appointment) => {
            const patient = patientsMap[appointment.patientId];
            const isClickable = appointment.status === "pending";

            return (
              <div
                key={appointment.id}
                className={`appointment-item ${isClickable ? "clickable" : ""}`}
                onClick={() => handleAppointmentClick(appointment)}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === "Enter" || e.key === " ")) {
                    handleAppointmentClick(appointment);
                  }
                }}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                title={isClickable ? "Cliquer pour démarrer la consultation" : undefined}
              >
                <div className="appointment-time-block">
                  <span className="appointment-time">
                    {appointment.time}
                  </span>
                </div>
                <div className="appointment-info">
                  <h3>{patient ? `${patient.firstName} ${patient.lastName}` : "Patient inconnu"}</h3>
                  <p> {appointment.reason || "Motif non renseigné"}</p>
                </div>
                <div className="appointment-right">
                  <span className={`status ${appointment.status}`}>
                    {getStatusLabel(appointment.status)}
                  </span>
                  {isClickable && (
                    <span className="appointment-arrow">
                      ›
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <hr className="appointment-divider" />

      <h3 className="week-section-title">Cette semaine</h3>

      {Object.keys(upcomingGrouped).length === 0 ? (
        <p className="week-empty">Aucun rendez-vous prévu dans les prochains jours.</p>
      ) : (
        Object.entries(upcomingGrouped).map(([date, dateAppointments]) => (
          <div className="week-date-group" key={date}>
            <p className="week-date-label">{formatGroupDate(date)}</p>

            {dateAppointments.map((appointment) => {
              const patient = patientsMap[appointment.patientId];

              return (
                <div className="week-appointment-item" key={appointment.id}>
                  <h4>{patient ? `${patient.firstName} ${patient.lastName}` : "Patient inconnu"}</h4>
                  <span className="week-appointment-time">{appointment.time}</span>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}

export default AppointmentList;