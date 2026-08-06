import { FaBell } from "react-icons/fa";
import { appointments } from "../../mock/appointments";
import { doctor } from "../../mock/doctor";
import { getTodayAppointments } from "../../utils/appointmentUtils";
import welcomeImage from "../../assets/Welcome.jpg";
import "./Header.css";

function Header() {

  const today = new Date();

  const weekday = today.toLocaleDateString("fr-FR", {
    weekday: "long",
  });

  const fullDate = today.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const todayAppointments = getTodayAppointments(appointments);

  const remainingAppointments = todayAppointments.filter(
    (appointment) => appointment.status !== "completed"
  ).length;

  const patientsToday = todayAppointments.filter(
    (appointment) =>
      appointment.status === "completed" ||
      appointment.status === "in-progress"
  ).length;

  return (
    <header className="header">

      <div className="header-card date-card">
        <h1>{weekday}</h1>
        <p>{fullDate}</p>
      </div>

      <div className="header-card welcome-card">

        <div className="welcome-text">

          <h2>
            Bonjour, Dr. {doctor.firstName} 👋
          </h2>

          <p>
            Vous avez <strong>{remainingAppointments}</strong> rendez-vous aujourd'hui
          </p>

        </div>

        <img
          src={welcomeImage}
          alt="Bienvenue"
          className="welcome-image"
        />

      </div>

      <div className="header-card patient-card">

        <div className="patient-info">

          <p className="patient-title">
            Patients reçus aujourd'hui
          </p>

          <h3>{patientsToday}</h3>

        </div>

        <button className="notification-btn">
          <FaBell />
        </button>

      </div>

    </header>
  );
}

export default Header;