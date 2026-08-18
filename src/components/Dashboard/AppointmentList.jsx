import { appointments } from "../../mock/appointments";
import { patients } from "../../mock/patients";
import { getTodayAppointments } from "../../utils/appointmentUtils";
import "./AppointmentList.css";

function AppointmentList() {

  const todayAppointments = getTodayAppointments(appointments);

  const patientsMap = Object.fromEntries(
    patients.map((patient) => [patient.id, patient])
  );

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Terminé";
      case "cancelled":
        return "Annulé";
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

        {todayAppointments.map((appointment) => {

          const patient = patientsMap[appointment.patientId];

          return (

            <div
              key={appointment.id}
              className="appointment-item"
            >

              <div className="appointment-info">

                <h3>
                  {patient
                    ? `${patient.firstName} ${patient.lastName}`
                    : "Patient inconnu"}
                </h3>

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

          );

        })}

      </div>

    </div>
  );
}

export default AppointmentList;