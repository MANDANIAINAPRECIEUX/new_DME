import { useAppointments } from "../../context/AppointmentContext";
import { usePatients } from "../../context/PatientContext";
import "./AppointmentTable.css";

function AppointmentTable(){
  const { appointments }=useAppointments();
  const { patients }=usePatients();

  const patientsMap=Object.fromEntries(
    patients.map((patient)=>[patient.id,patient])
  );

  const getStatusLabel=(status)=>{
    switch(status){
      case "pending":
        return "En attente";
      case "completed":
        return "Terminé";
      case "cancelled":
        return "Annulé";
      default:
        return status;
    }
  };

  return(
    <div className="appointment-table-card">
      <table className="appointment-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Heure</th>
            <th>Patient</th>
            <th>Motif</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {appointments.length===0 ? (
            <tr>
              <td colSpan="6" className="empty-message">
                Aucun rendez-vous trouvé.
              </td>
            </tr>
          ) : (
            appointments.map((appointment)=>{
              const patient=patientsMap[appointment.patientId];

              return(
                <tr key={appointment.id}>
                  <td>
                    {new Date(appointment.date).toLocaleDateString("fr-FR")}
                  </td>

                  <td>
                    {appointment.time}
                  </td>

                  <td>
                    {patient
                      ? `${patient.firstName} ${patient.lastName}`
                      : "Patient inconnu"}
                  </td>

                  <td>
                    {appointment.reason||"—"}
                  </td>

                  <td>
                    <span className={`status ${appointment.status}`}>
                      {getStatusLabel(appointment.status)}
                    </span>
                  </td>

                  <td>
                    <button className="details-btn">
                      Voir
                    </button>
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