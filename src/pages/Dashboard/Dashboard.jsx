import AppointmentList from "../../components/Dashboard/AppointmentList";
import OngoingTreatments from "../../components/Dashboard/OngoingTreatments";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-grid">
      <AppointmentList />
      <OngoingTreatments />
    </div>
  );
}

export default Dashboard;