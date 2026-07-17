import { FaBell } from "react-icons/fa";
import { todayAppointments } from "../../mock/appointments";
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

  const remainingAppointments = todayAppointments.filter(
    (appointment) =>
      appointment.status !== "completed"
  ).length;

  return (
    <header className="header">
      <div className="header-date">
        <h1>{weekday}</h1>
        <p>{fullDate}</p>
      </div>

       <div className="header-welcome">
        <h2>
          Bonjour, Docteur 👋
        </h2>
        <p>
          Vous avez{" "}
          <strong>
            {remainingAppointments}
          </strong>{" "}
          rendez-vous aujourd'hui
        </p>
      </div>

      <div className="header-actions">
        <button className="notification-btn">
          <FaBell />
        </button>
      </div>
    </header>
  );
}

export default Header;