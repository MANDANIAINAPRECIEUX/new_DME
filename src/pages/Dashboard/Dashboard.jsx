import { Link } from "react-router-dom";
import { useTreatments } from "../../context/TreatmentContext";
import AppointmentList from "../../components/Dashboard/AppointmentList";
import OngoingTreatments from "../../components/Dashboard/OngoingTreatments";
import "./Dashboard.css";

function Dashboard() {
  const { treatments } = useTreatments();

  const ongoingTreatments = treatments.filter(
    (treatment) => treatment.status === "ongoing"
  );

  return (
    <div className="dashboard-grid">
      <section className="dashboard-section">
        <div className="dashboard-section-title">
          <span>Rendez-vous du jour</span>
          <Link to="/appointments">Voir tout</Link>
        </div>

        <AppointmentList />
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-title">
          <span>Traitements en cours</span>
          <span className="section-count">{ongoingTreatments.length}</span>
        </div>

        <OngoingTreatments />
      </section>
    </div>
  );
}

export default Dashboard;