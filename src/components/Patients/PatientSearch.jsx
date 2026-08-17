import { FaSearch } from "react-icons/fa";
import "./PatientSearch.css";

function PatientSearch({ searchTerm, onSearch }) {
  return (
    <div className="patient-search">
      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Rechercher un patient..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}

export default PatientSearch;