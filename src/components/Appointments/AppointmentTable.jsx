import { useNavigate } from "react-router-dom";
import { useAppointments } from "../../context/AppointmentContext";
import "./AppointmentTable.css";

const STATUS_LABELS = {
  pending: "En attente",
  completed: "Terminé",
  cancelled: "Annulé",
};

function AppointmentTable({ appointments }) {
  const navigate = useNavigate();
  const { cancelAppointment } = useAppointments();

  const handleCancel = async (appointmentId) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment annuler ce rendez-vous ?"
    );
    if (!confirmed) return;

    try {
      await cancelAppointment(appointmentId);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="appointment-table-card">
      <table className="appointment-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Heure</th>
            <th>Patient</th>
            <th>Docteur</th>
            <th>Motif</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan="7" className="empty-message">
                Aucun rendez-vous trouvé.
              </td>
            </tr>
          ) : (
            appointments.map((appointment) => {
              const { patient, doctor } = appointment;
              const isPending = appointment.status === "pending";

              return (
                <tr key={appointment.id}>
                  <td>{new Date(appointment.date).toLocaleDateString("fr-FR")}</td>
                  <td>{appointment.time}</td>
                  <td>
                    {patient
                      ? `${patient.firstName} ${patient.lastName}`
                      : "Patient inconnu"}
                  </td>
                  <td>{doctor ? `Dr. ${doctor.firstName}` : "—"}</td>
                  <td>{appointment.reason || "—"}</td>
                  <td>
                    <span className={`status ${appointment.status}`}>
                      {STATUS_LABELS[appointment.status] ?? appointment.status}
                    </span>
                  </td>
                  <td>
                    <div className="appointment-actions">
                      <button
                        className={`edit-appointment-btn ${!isPending ? "disabled" : ""}`}
                        disabled={!isPending}
                        onClick={() =>
                          navigate(`/appointments/${appointment.id}/edit`)
                        }
                      >
                        Modifier
                      </button>

                      <button
                        className={`start-consultation-btn ${!isPending ? "disabled" : ""}`}
                        disabled={!isPending}
                        onClick={() =>
                          navigate(`/consultations/${appointment.id}`)
                        }
                      >
                        Démarrer
                      </button>

                      <button
                        className="cancel-appointment-btn"
                        disabled={!isPending}
                        onClick={() => handleCancel(appointment.id)}
                      >
                        Annuler
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentTable;