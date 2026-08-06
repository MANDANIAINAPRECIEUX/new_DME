import { patients } from "../../mock/patients";
import "./PatientTable.css";

function PatientTable() {
  return (
    <div className="patient-table-card">

      <table className="patient-table">

        <thead>

          <tr>
            <th>Patient</th>
            <th>Sexe</th>
            <th>Date de naissance</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {patients.map((patient) => (

            <tr key={patient.id}>

              <td>
                {patient.firstName} {patient.lastName}
              </td>

              <td>
                {patient.gender === "M" ? "Homme" : "Femme"}
              </td>

              <td>
                {new Date(patient.birthDate).toLocaleDateString("fr-FR")}
              </td>

              <td>
                {patient.phone}
              </td>

              <td>
                {patient.address}
              </td>

              <td>

                <button className="details-btn">
                  Voir
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default PatientTable;