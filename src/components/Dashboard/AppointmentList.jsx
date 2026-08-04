import { todayAppointments } from "../../mock/appointments";
import "./AppointmentList.css";

function AppointmentList() {

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Terminé";
      case "in-progress":
        return "En cours";
      case "pending":
        return "En attente";
      default:
        return status;
    }
  };

  return (
    <div className="appointment-card">

      <div className="appointment-header">
        <h2>Rendez-vous du jour</h2>

        <button className="view-all">
          Voir tout
        </button>
      </div>

      <div className="appointment-list">

        {todayAppointments.map((appointment) => (

          <div
            key={appointment.id}
            className="appointment-item"
          >

            <div className="appointment-info">
              <h3>{appointment.patient}</h3>

              <p>{appointment.type}</p>
            </div>

            <div className="appointment-right">

              <span className={`status ${appointment.status}`}>
                {getStatusLabel(appointment.status)}
              </span>

              <span className="appointment-time">
                {appointment.time}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default AppointmentList;