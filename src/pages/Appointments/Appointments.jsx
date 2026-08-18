import AppointmentTable from "../../components/Appointments/AppointmentTable";
import "./Appointments.css";

function Appointments(){
  return(
    <div className="appointments-page">
      <div className="appointments-header">
        <div>
          <h1>Rendez-vous</h1>
          <p>Gestion des rendez-vous du cabinet</p>
        </div>

        <button className="add-appointment-btn">
          + Nouveau rendez-vous
        </button>
      </div>

      <AppointmentTable />
    </div>
  );
}

export default Appointments;