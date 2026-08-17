import "./PatientForm.css";

function PatientForm() {
  return (
    <div className="patient-form-card">

      <div className="patient-form-header">
        <h2>Nouveau patient</h2>
        <p>Enregistrer les informations administratives du patient</p>
      </div>

      <form className="patient-form">

        <div className="form-section">
          <h3>Informations personnelles</h3>

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <input
                id="firstName"
                type="text"
                placeholder="Prénom"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <input
                id="lastName"
                type="text"
                placeholder="Nom"
              />
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="birthDate">Date de naissance</label>
              <input
                id="birthDate"
                type="date"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Sexe</label>
              <select id="gender" defaultValue="">
                <option value="" disabled>
                  Sélectionner
                </option>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
              </select>
            </div>

          </div>
        </div>

        <div className="form-section">
          <h3>Coordonnées</h3>

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <input
                id="phone"
                type="tel"
                placeholder="Numéro de téléphone"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="Adresse e-mail"
              />
            </div>

          </div>

          <div className="form-group">
            <label htmlFor="address">Adresse</label>
            <input
              id="address"
              type="text"
              placeholder="Adresse du patient"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
          >
            Annuler
          </button>

          <button
            type="submit"
            className="save-btn"
          >
            Enregistrer le patient
          </button>
        </div>

      </form>

    </div>
  );
}

export default PatientForm;