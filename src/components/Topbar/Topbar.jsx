import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBell, FaCog, FaUserPlus } from "react-icons/fa";
import { useConsultations } from "../../context/ConsultationContext";
import { usePatients } from "../../context/PatientContext";
import { useTypesSoins } from "../../context/TypeSoinContext";
import { getUnpaidConsultations, formatMontant } from "../../utils/billingUtils";
import { formatDate } from "../../utils/dateUtils";
import menuItems from "../Sidebar/menuItems";
import "./Topbar.css";

function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const { consultations } = useConsultations();
  const { patients } = usePatients();
  const { typesSoins } = useTypesSoins();

  const currentItem = menuItems.find((item) => item.path === location.pathname);
  const pageTitle = currentItem ? currentItem.title : "Dashboard";

  const patientsMap = Object.fromEntries(patients.map((p) => [p.id, p]));
  const unpaidConsultations = getUnpaidConsultations(consultations, typesSoins);
  const totalImpaye = unpaidConsultations.reduce((total, c) => total + c.solde, 0);

  const handleNotificationClick = (patientId) => {
    setShowNotifications(false);
    navigate(`/patients/${patientId}`);
  };

  return (
    <div className="topbar">
      {/*<h1 className="topbar-title">{pageTitle}</h1>*/}

      <div className="topbar-actions">
        <div className="notification-wrapper">
          <button
            className="topbar-icon-btn"
            onClick={() => setShowNotifications((prev) => !prev)}
            title="Notifications"
          >
            <FaBell />
            {unpaidConsultations.length > 0 && (
              <span className="topbar-badge">
                {unpaidConsultations.length > 9 ? "9+" : unpaidConsultations.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-panel">
              <div className="notification-panel-header">
                <span>Soldes impayés</span>
                {totalImpaye > 0 && <span className="notification-total">{formatMontant(totalImpaye)}</span>}
              </div>

              {unpaidConsultations.length === 0 ? (
                <p className="notification-empty">Aucun solde impayé actuellement.</p>
              ) : (
                <div className="notification-list">
                  {unpaidConsultations.map((item) => {
                    const patient = patientsMap[item.patientId];
                    return (
                      <button
                        key={item.consultationId}
                        className="notification-item"
                        onClick={() => handleNotificationClick(item.patientId)}
                      >
                        <div className="notification-item-info">
                          <span className="notification-item-name">
                            {patient ? `${patient.firstName} ${patient.lastName}` : "Patient inconnu"}
                          </span>
                          <span className="notification-item-date">{formatDate(item.date)}</span>
                        </div>
                        <span className="notification-item-amount">{formatMontant(item.solde)}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <button className="topbar-icon-btn" onClick={() => navigate("/patients/new", { state: { quickCreate: true } })}
          title="Nouveau patient"
        >
          <FaUserPlus />
        </button>

        <button className="topbar-icon-btn" onClick={() => navigate("/settings")} title="Paramètres">
          <FaCog />
        </button>
      </div>
    </div>
  );
}

export default Topbar;