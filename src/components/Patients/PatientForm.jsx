import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { usePatients } from "../../context/PatientContext";
import "./PatientForm.css";

function PatientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { patients, addPatient, updatePatient } = usePatients();

  const isEditMode = Boolean(id);
  const isQuickCreate = Boolean(location.state?.quickCreate);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (isEditMode) {
      const patient = patients.find((patient) => patient.id.toString() === id);
      if (patient) {
        setFormData({
          firstName: patient.firstName || "",
          lastName: patient.lastName || "",
          birthDate: patient.birthDate || "",
          gender: patient.gender || "",
          phone: patient.phone || "",
          address: patient.address || "",
        });
      }
    }
  }, [id, isEditMode, patients]);

  const today = new Date().toISOString().split("T")[0];
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Veuillez renseigner le prénom.";
    if (!formData.lastName.trim()) newErrors.lastName = "Veuillez renseigner le nom.";
    if (!formData.birthDate) { 
      newErrors.birthDate = "Veuillez renseigner la date de naissance.";
    } else if (formData.birthDate > today) { 
      newErrors.birthDate = "La date de naissance ne peut pas être dans le futur.";
    }
    if (!formData.gender) newErrors.gender = "Veuillez sélectionner le sexe.";
    if (!formData.phone.trim()) newErrors.phone = "Veuillez renseigner le numéro de téléphone.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setServerError("");

    try {
      if (isEditMode) {
        await updatePatient(id, formData);
        navigate(`/patients/${id}`);
        return;
      }

      const newPatient = await addPatient(formData);

      if (isQuickCreate) {
        navigate("/appointments/new", { state: { patientId: newPatient.id } });
        return;
      }

      navigate("/patients");
    } catch (err) {
    // Erreurs de validation renvoyées par le backend, champ par champ
      if (err.details?.length) {
        const fieldErrors = {};
        err.details.forEach(({ field, message }) => {
          fieldErrors[field] = message;
        });
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
      setServerError(err.message);
    } finally {
        setSubmitting(false);
      }
  };

  const handleCancel = () => {
    if (isEditMode) {
      navigate(`/patients/${id}`);
    } else if (isQuickCreate) {
      navigate(-1); // retourne à la page d'où venait la création rapide, pas forcément /patients
    } else {
      navigate("/patients");
    }
  };

  return (
    <div className="patient-form-card">
      <div className="patient-form-header">
        <h2>{isEditMode ? "Modifier le patient" : "Nouveau patient"}</h2>
        <p>
          {isEditMode
            ? "Modifier les informations administratives du patient"
            : isQuickCreate
            ? "Enregistrer un nouveau patient — vous pourrez lui planifier un rendez-vous juste après."
            : "Enregistrer les informations administratives du patient"}
        </p>
        <span className="required-info">* Champs obligatoires</span>
      </div>

      <form className="patient-form" onSubmit={handleSubmit}>

        <div className="form-section">
          <h3>Informations personnelles</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prénom *</label>
              <input id="firstName" name="firstName" type="text" value={formData.firstName}
                onChange={handleChange} placeholder="Prénom" />
              {errors.firstName && <span className="form-error">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Nom *</label>
              <input id="lastName" name="lastName" type="text" value={formData.lastName}
                onChange={handleChange} placeholder="Nom" />
              {errors.lastName && <span className="form-error">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="birthDate">Date de naissance *</label>
              <input id="birthDate" name="birthDate" type="date" value={formData.birthDate}
                onChange={handleChange} max={today} />
              {errors.birthDate && <span className="form-error">{errors.birthDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="gender">Sexe *</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Sélectionner</option>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
              </select>
              {errors.gender && <span className="form-error">{errors.gender}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Coordonnées</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Téléphone *</label>
              <input id="phone" name="phone" type="tel" value={formData.phone}
                onChange={handleChange} placeholder="Numéro de téléphone" />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Adresse</label>
            <input id="address" name="address" type="text" value={formData.address}
              onChange={handleChange} placeholder="Adresse du patient" />
          </div>
        </div>

        {serverError && <span className="form-error">{serverError}</span>}

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
          Annuler
          </button>
          <button type="submit" className="save-btn" disabled={submitting}>
            {submitting
              ? "Enregistrement..."
              : isEditMode
              ? "Enregistrer les modifications"
              : isQuickCreate
              ? "Enregistrer et planifier un rendez-vous"
              : "Enregistrer le patient"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PatientForm;