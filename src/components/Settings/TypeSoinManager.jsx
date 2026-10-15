import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useTypesSoins } from "../../context/TypeSoinContext";
import { formatMontant } from "../../utils/billingUtils";
import "./TypeSoinManager.css";

function TypeSoinManager() {
  const { typesSoins, loading, error, addTypeSoin } = useTypesSoins();

  const [newLabel, setNewLabel] = useState("");
  const [newTarif, setNewTarif] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    const label = newLabel.trim();

    if (!label || newTarif === "" || Number(newTarif) < 0) {
      setFormError("Renseignez un libellé et un tarif positif ou nul.");
      return;
    }

    const exists = typesSoins.some(
      (t) => t.label.toLowerCase() === label.toLowerCase()
    );
    if (exists) {
      setFormError("Ce type de soin existe déjà.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      await addTypeSoin(label, newTarif);
      setNewLabel("");
      setNewTarif("");
    } catch (err) {
      const detail = err.details?.map((d) => d.message).join(" ");
      setFormError(detail || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="type-soin-manager">
      <div className="type-soin-header">
        <h2>Types de soins</h2>
        <p>
          Le tarif d'un type de soin est fixé à la création : il ne peut plus
          être modifié, et le type de soin ne peut pas être supprimé.
        </p>
      </div>

      <form className="type-soin-add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Nom du soin (ex : Détartrage)"
          value={newLabel}
          maxLength={150}
          onChange={(e) => setNewLabel(e.target.value)}
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Tarif"
          value={newTarif}
          onChange={(e) => setNewTarif(e.target.value)}
        />
        <button type="submit" className="add-type-btn" disabled={submitting}>
          <FaPlus />
          {submitting ? "Ajout…" : "Ajouter"}
        </button>
      </form>

      {formError && <p className="type-soin-form-error">{formError}</p>}
      {error && <p className="type-soin-form-error">{error}</p>}

      {loading ? (
        <p className="type-soin-empty">Chargement…</p>
      ) : typesSoins.length === 0 ? (
        <p className="type-soin-empty">Aucun type de soin enregistré.</p>
      ) : (
        <ul className="type-soin-list">
          {typesSoins.map((type) => (
            <li key={type.id} className="type-soin-item">
              <span>{type.label}</span>
              <span className="type-soin-tarif">{formatMontant(type.tarif)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TypeSoinManager;