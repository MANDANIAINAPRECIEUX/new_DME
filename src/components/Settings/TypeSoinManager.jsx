import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { useTypesSoins } from "../../context/TypeSoinContext";
import "./TypeSoinManager.css";

function TypeSoinManager() {
  const { typesSoins, addTypeSoin, updateTypeSoin, deleteTypeSoin } = useTypesSoins();

  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingLabel, setEditingLabel] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    addTypeSoin(newLabel);
    setNewLabel("");
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
    const confirmed = window.confirm(
      "Supprimer ce type de soin ? Les consultations existantes qui l'utilisent garderont sa valeur actuelle."
    );
    if (confirmed) deleteTypeSoin(id);
  };

  return (
    <div className="type-soin-manager">
      <div className="type-soin-header">
        <h2>Types de soins</h2>
        <p>Gérer la liste des types de soins proposés lors des consultations.</p>
      </div>

      <form className="type-soin-add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Ex : Détartrage"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
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
          {typesSoins.map((type) => (
            <li key={type.id} className="type-soin-item">
              {editingId === type.id ? (
                <>
                  <input
                    type="text"
                    value={editingLabel}
                    onChange={(e) => setEditingLabel(e.target.value)}
                    autoFocus
                  />
                  <div className="type-soin-actions">
                    <button type="button" className="confirm-btn" onClick={() => saveEdit(type.id)}>
                      <FaCheck />
                    </button>
                    <button type="button" className="cancel-btn-icon" onClick={cancelEdit}>
                      <FaTimes />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span>{type.label}</span>
                  <div className="type-soin-actions">
                    <button type="button" className="edit-btn" onClick={() => startEdit(type)}>
                      <FaEdit />
                    </button>
                    <button type="button" className="delete-btn" onClick={() => handleDelete(type.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TypeSoinManager;