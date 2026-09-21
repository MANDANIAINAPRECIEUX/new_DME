import { useState } from "react";
import { FaNotesMedical, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTypesSoins } from "../../context/TypeSoinContext";
import { useConsultations } from "../../context/ConsultationContext";
import { doctors } from "../../mock/doctors";
import { getTotalDu, getTotalPaye, formatMontant } from "../../utils/billingUtils";
import { formatDate } from "../../utils/dateUtils";

function ConsultationCard({ consultation, appointment, seanceNumber }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const { typesSoins } = useTypesSoins();
  const { updateConsultation } = useConsultations();
  const typesSoinsMap = Object.fromEntries(typesSoins.map((t) => [t.id, t.label]));

  const doctorsMap = Object.fromEntries(doctors.map((d) => [d.id, d]));
  const consultationDoctor = doctorsMap[consultation.doctorId];

  const soins = consultation.soins || [];
  const paiements = consultation.paiements || [];

  const totalDu = getTotalDu(soins, typesSoins);
  const totalPaye = getTotalPaye(paiements);
  const solde = totalDu - totalPaye;

  const hasDetails = consultation.compteRendu || consultation.observation || soins.length > 0;

  const handleAddPayment = (e) => {
    e.preventDefault();
    const amount = Number(paymentAmount);

    if (!paymentAmount || amount <= 0) {
      setPaymentError("Le montant doit être strictement positif.");
      return;
    }
    if (amount > solde) {
      setPaymentError(`Dépasse le solde restant (${formatMontant(solde)}).`);
      return;
    }

    updateConsultation(consultation.id, {
      paiements: [...paiements, { id: Date.now(), amount, date: paymentDate, method: paymentMethod }],
    });

    setPaymentAmount("");
    setPaymentMethod("");
    setPaymentError("");
    setShowAddPayment(false);
  };

  return (
    <div className="medical-history-card">
      <div className="medical-history-header">
        <div className="history-main-info">
          <div className="history-icon">
            <FaNotesMedical />
          </div>

          <div>
            <span>{seanceNumber ? `SÉANCE ${seanceNumber}` : "CONSULTATION"}</span>
            <h3>{consultation.reason || "Consultation"}</h3>

            {appointment && (
              <p>
                {formatDate(`${appointment.date}T00:00:00`)}
                {" · "}
                {appointment.time}
                {consultationDoctor && ` · Dr. ${consultationDoctor.firstName}`}
              </p>
            )}
          </div>
        </div>

        <div className="consultation-card-actions">
          {soins.length > 0 && (
            <span className="acts-count">
              {soins.length} {soins.length > 1 ? "soins" : "soin"}
            </span>
          )}

          {hasDetails && (
            <button
              type="button"
              className="details-btn"
              onClick={() => setShowDetails((prev) => !prev)}
            >
              {showDetails ? "Masquer" : "Détails"}
              {showDetails ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="medical-history-body">
          {consultation.compteRendu && (
            <div className="consultation-detail">
              <h4>Compte-rendu</h4>
              <p>{consultation.compteRendu}</p>
            </div>
          )}

          {consultation.observation && (
            <div className="consultation-detail">
              <h4>Observation</h4>
              <p>{consultation.observation}</p>
            </div>
          )}

          {soins.length > 0 && (
            <div className="consultation-detail">
              <h4>Soins réalisés</h4>

              <div className="acts-history-table">
                <div className="acts-history-header">
                  <span>Dent(s)</span>
                  <span>Type de soin</span>
                </div>

                {soins.map((soin) => (
                  <div className="acts-history-row" key={soin.id}>
                    <span className="tooth-number">
                      {soin.dents && soin.dents.length > 0 ? soin.dents.join(", ") : "—"}
                    </span>
                    <span>{typesSoinsMap[soin.typeSoinId] || "Soin non renseigné"}</span>
                  </div>
                ))}
              </div>

              <div className="billing-summary">
                <div className="billing-summary-item">
                  <span>Total dû</span>
                  <span>{formatMontant(totalDu)}</span>
                </div>
                <div className="billing-summary-item">
                  <span>Total payé</span>
                  <span>{formatMontant(totalPaye)}</span>
                </div>
                <div className="billing-summary-item">
                  <span>Solde</span>
                  <span className={solde > 0 ? "solde-positive" : "solde-zero"}>
                    {formatMontant(solde)}
                  </span>
                </div>
              </div>

              {solde > 0 && !showAddPayment && (
                <button
                  type="button"
                  className="add-payment-btn"
                  onClick={() => setShowAddPayment(true)}
                >
                  Enregistrer un paiement
                </button>
              )}

              {showAddPayment && (
                <form className="inline-payment-form" onSubmit={handleAddPayment}>
                  <div className="form-group">
                    <label>Montant</label>
                    <input
                      type="number"
                      min="0"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder={`Max ${solde}`}
                    />
                  </div>

                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Mode</label>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      <option value="">Sélectionner</option>
                      <option value="cash">Espèces</option>
                      <option value="card">Carte bancaire</option>
                      <option value="mobile-money">Mobile Money</option>
                      <option value="bank-transfer">Virement</option>
                    </select>
                  </div>

                  {paymentError && <span className="form-error">{paymentError}</span>}

                  <div className="inline-payment-actions">
                    <button type="button" className="cancel-btn" onClick={() => setShowAddPayment(false)}>
                      Annuler
                    </button>
                    <button type="submit" className="save-btn">
                      Valider
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {paiements.length > 0 && (
            <div className="consultation-detail">
              <h4>Paiements</h4>
              <div className="acts-history-table">
                <div className="acts-history-header">
                  <span>Date</span>
                  <span>Montant</span>
                </div>
                {paiements.map((p) => (
                  <div className="acts-history-row" key={p.id}>
                    <span>{formatDate(p.date)}</span>
                    <span>{formatMontant(p.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ConsultationCard;