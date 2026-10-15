import { useDents } from "../../context/DentContext";
import "./DentSelector.css";

function DentSelector({ selectedDents, onChange }) {
  const { dents, loading, error } = useDents();

  const toggleDent = (number) => {
    if (selectedDents.includes(number)) {
      onChange(selectedDents.filter((d) => d !== number));
    } else {
      onChange([...selectedDents, number]);
    }
  };

  if (loading) {
    return <p className="dent-selector-status">Chargement des dents…</p>;
  }

  if (error) {
    return <p className="dent-selector-status error">{error}</p>;
  }

  if (dents.length === 0) {
    return (
      <p className="dent-selector-status">
        Aucune dent disponible : le référentiel est vide.
      </p>
    );
  }

  return (
    <div className="dent-selector">
      {dents.map(({ id, number }) => (
        <button
          type="button"
          key={id}
          className={`dent-chip ${selectedDents.includes(number) ? "selected" : ""}`}
          onClick={() => toggleDent(number)}
        >
          {number}
        </button>
      ))}
    </div>
  );
}

export default DentSelector;