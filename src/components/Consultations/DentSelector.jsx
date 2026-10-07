import { dents } from "../../mock/dents";
import "./DentSelector.css";

function DentSelector({ selectedDents, onChange }) {
  const toggleDent = (dent) => {
    if (selectedDents.includes(dent)) {
      onChange(selectedDents.filter((d) => d !== dent));
    } else {
      onChange([...selectedDents, dent]);
    }
  };

  return (
    <div className="dent-selector">
      {dents.map((dent) => (
        <button
          type="button"
          key={dent}
          className={`dent-chip ${selectedDents.includes(dent) ? "selected" : ""}`}
          onClick={() => toggleDent(dent)}
        >
          {dent}
        </button>
      ))}
    </div>
  );
}

export default DentSelector;