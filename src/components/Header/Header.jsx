import { FaCalendarAlt, FaCoins, FaUserFriends } from "react-icons/fa";
import { useAppointments } from "../../context/AppointmentContext";
import { useConsultations } from "../../context/ConsultationContext";
import { useAuth } from "../../context/AuthContext";
import { getTodayAppointments } from "../../utils/appointmentUtils";
import { getRecetteJour, formatMontant } from "../../utils/billingUtils";
import welcomeImage from "../../assets/Welcome.jpg";
import "./Header.css";

function Header() {
  const { user } = useAuth();
  const { appointments } = useAppointments();
  const { consultations } = useConsultations();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

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

  const recetteJour = getRecetteJour(consultations, todayStr);

  return (
    <header className="dashboard-header">
      <div className="header-section-title">
        <span>Résumé du jour</span>
      </div>

      <div className="header">
        <div className="header-card date-card">
          <FaCalendarAlt className="date-icon" />
          <div className="date-info">
            <h1>{weekday}</h1>
            <p>{fullDate}</p>
          </div>
        </div>

        <div className="header-card welcome-card">
          <div className="welcome-text">
            <h2>Bonjour, Dr. {user?.firstName} 👋</h2>
            <p>
              Vous avez <strong>{remainingAppointments}</strong> rendez-vous
              aujourd'hui
            </p>
          </div>
          <img
            src={welcomeImage}
            alt="Bienvenue"
            className="welcome-image"
          />
        </div>

        <div className="header-card recette-card">
          <div className="recette-icon">
            <FaCoins />
          </div>
          <div className="recette-info">
            <p className="recette-title">Recettes du jour</p>
            <h3>{formatMontant(recetteJour)}</h3>
          </div>
        </div>

        <div className="header-card patient-card">
          <div className="patient-icon">
            <FaUserFriends />
          </div>

          <div className="patient-info">
            <p className="patient-title">Patients reçus</p>
            <h3>{patientsToday}</h3>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;