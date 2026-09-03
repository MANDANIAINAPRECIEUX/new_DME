import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { usePatients } from "../../context/PatientContext";
import "./PatientSearchSelect.css";

function PatientSearchSelect({ value, onChange, error }) {
  const { patients } = usePatients();
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  const selectedPatient = patients.find(
    (patient) => patient.id === Number(value)
  );

  const filteredPatients = patients.filter((patient) => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return false;
    }

    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const phone = patient.phone?.toLowerCase() || "";

    return (
      fullName.includes(searchValue) ||
      phone.includes(searchValue)
    );
  });

  const handleSelect = (patient) => {
    onChange(patient.id);
    setSearch("");
    setShowResults(false);
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setShowResults(true);

    if (value) {
      onChange("");
    }
  };

  return (
    <div className="patient-search-select">
      <div className="patient-search-box">
        <FaSearch className="patient-search-icon" />

        <input
          type="text"
          value={
            selectedPatient
              ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
              : search
          }
          onChange={handleInputChange}
          onFocus={() => setShowResults(true)}
          placeholder="Rechercher un patient..."
        />
      </div>

      {showResults && search && (
        <div className="patient-search-results">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <button
                key={patient.id}
                type="button"
                className="patient-result"
                onClick={() => handleSelect(patient)}
              >
                <strong>
                  {patient.firstName} {patient.lastName}
                </strong>

                <span>
                  Né(e) le{" "}
                  {new Date(patient.birthDate).toLocaleDateString("fr-FR")}
                  {" · "}
                  {patient.phone || "Téléphone non renseigné"}
                </span>
              </button>
            ))
          ) : (
            <div className="no-patient-result">
              Aucun patient trouvé.
            </div>
          )}
        </div>
      )}

      {selectedPatient && (
        <button
          type="button"
          className="change-patient-btn"
          onClick={() => {
            onChange("");
            setSearch("");
          }}
        >
          Changer de patient
        </button>
      )}

      {error && (
        <span className="form-error">
          {error}
        </span>
      )}
    </div>
  );
}

export default PatientSearchSelect;