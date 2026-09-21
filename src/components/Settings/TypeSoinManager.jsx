import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { useTypesSoins } from "../../context/TypeSoinContext";
import { useConsultations } from "../../context/ConsultationContext";
import { formatMontant } from "../../utils/billingUtils";
import "./TypeSoinManager.css";

function TypeSoinManager() {
  const { typesSoins, addTypeSoin, updateTypeSoin, deleteTypeSoin } = useTypesSoins();
  const { consultations } = useConsultations();

  const [newLabel, setNewLabel] = useState("");
  const [newTarif, setNewTarif] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingLabel, setEditingLabel] = useState("");

  const isTypeSoinUsed = (typeSoinId) =>
    consultations.some((c) => (c.soins || []).some((s) => s.typeSoinId === typeSoinId));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newLabel.trim() || newTarif === "" || Number(newTarif) < 0) return;
    addTypeSoin(newLabel, newTarif);
    setNewLabel("");
    setNewTarif("");
  };

  const startEdit = (type) => {
    setEditingId(type.id);
    setEditingLabel(type.label);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingLabel("");
  };

  const saveEdit = (id) => {
    if (!editingLabel.trim()) return;
    updateTypeSoin(id, editingLabel);
    cancelEdit();
  };

  const handleDelete = (id) => {
    if (isTypeSoinUsed(id)) return;
    if (window.confirm("Supprimer ce type de soin ?")) deleteTypeSoin(id);
  };

  return (
    <div className="type-soin-manager">
      <div className="type-soin-header">
        <h2>Types de soins et tarifs</h2>
        <p>Le tarif d'un type de soin ne peut plus être modifié une fois créé.</p>
      </div>

      <form className="type-soin-add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Nom du soin (ex : Détartrage)"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
        />
        <input
          type="number"
          min="0"
          placeholder="Tarif"
          value={newTarif}
          onChange={(e) => setNewTarif(e.target.value)}
        />
        <button type="submit" className="add-type-btn">
          <FaPlus />
          Ajouter
        </button>
      </form>

      {typesSoins.length === 0 ? (
        <p className="type-soin-empty">Aucun type de soin enregistré.</p>
      ) : (
        <ul className="type-soin-list">
          {typesSoins.map((type) => {
            const used = isTypeSoinUsed(type.id);

            return (
              <li key={type.id} className="type-soin-item">
                {editingId === type.id ? (
                  <>
                    <input
                      type="text"
                      value={editingLabel}
                      onChange={(e) => setEditingLabel(e.target.value)}
                      autoFocus
                    />
                    <span className="type-soin-tarif">{formatMontant(type.tarif)}</span>
                    <div className="type-soin-actions">
                      <button type="button" className="confirm-btn" onClick={() => saveEdit(type.id)}><FaCheck /></button>
                      <button type="button" className="cancel-btn-icon" onClick={cancelEdit}><FaTimes /></button>
                    </div>
                  </>
                ) : (
                  <>
                    <span>{type.label}</span>
                    <span className="type-soin-tarif">{formatMontant(type.tarif)}</span>
                    <div className="type-soin-actions">
                      <button type="button" className="edit-btn" onClick={() => startEdit(type)}><FaEdit /></button>
                      <button
                        type="button"
                        className="delete-btn"
                        disabled={used}
                        title={used ? "Utilisé dans des consultations — suppression impossible" : "Supprimer"}
                        onClick={() => handleDelete(type.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default TypeSoinManager;