import { FaSearch } from "react-icons/fa";
import "./PatientSearch.css";

function PatientSearch() {
  return (
    <div className="patient-search">

      <div className="search-box">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Rechercher un patient..."
        />

      </div>

    </div>
  );
}

export default PatientSearch;