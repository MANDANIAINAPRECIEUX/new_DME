import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppointments } from "../../context/AppointmentContext";
import { useAuth } from "../../context/AuthContext";
import PatientSearchSelect from "../Patients/PatientSearchSelect";
import {
  hasAppointmentConflict,
  CRENEAUX,
  formatCreneau,
} from "../../utils/appointmentUtils";
import "./AppointmentForm.css";

function AppointmentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const { appointments, loading, addAppointment, updateAppointment } =
    useAppointments();
  const { user } = useAuth();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    patientId: location.state?.patientId || "",
    date: "",
    time: "",
    reason: location.state?.reason || "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const appointmentToEdit = appointments.find((a) => a.id.toString() === id);

  useEffect(() => {
    if (appointmentToEdit) {
      setFormData({
        patientId: appointmentToEdit.patientId,
        date: appointmentToEdit.date,
        time: appointmentToEdit.time,
        reason: appointmentToEdit.reason || "",
      });
    }
  }, [appointmentToEdit]);

  // Le docteur du rendez-vous : celui d'origine en modification,
  // sinon le docteur connecté.
  const doctorId = isEditMode
    ? appointmentToEdit?.doctorId ?? user?.id
    : user?.id;

  // Créneaux déjà occupés par ce docteur à la date choisie (RG06)
  const creneauxOccupes = formData.date
    ? appointments
        .filter(
          (a) =>
            a.status !== "cancelled" &&
            Number(a.doctorId) === Number(doctorId) &&
            a.date === formData.date &&
            (!isEditMode || a.id.toString() !== id)
        )
        .map((a) => a.time)
    : [];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientId) {
      newErrors.patientId = "Veuillez sélectionner un patient.";
    }
    if (!formData.date) {
      newErrors.date = "Veuillez renseigner la date.";
    }
    if (!formData.time) {
      newErrors.time = "Veuillez sélectionner un créneau.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const conflict = hasAppointmentConflict(
      appointments,
      { ...formData, doctorId },
      isEditMode ? id : null
    );

    if (conflict) {
      setErrors({
        time: "Ce créneau est déjà occupé. Veuillez choisir un autre horaire.",
      });
      return;
    }

    setSubmitting(true);
    setServerError("");

    try {
      if (isEditMode) {
        await updateAppointment(id, formData);
      } else {
        await addAppointment(formData);
      }
      navigate("/appointments");
    } catch (err) {
      // Filet de sécurité : le serveur revalide le créneau
      if (err.code === "APPOINTMENT_SLOT_UNAVAILABLE") {
        setErrors({ time: err.message });
      } else {
        if (err.details?.length) {
          const fieldErrors = {};
          err.details.forEach(({ field, message }) => {
            fieldErrors[field] = message;
          });
          setErrors((prev) => ({ ...prev, ...fieldErrors }));
        }
        setServerError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isEditMode && loading) {
    return (
      <div className="appointment-form-card">
        <p>Chargement…</p>
      </div>
    );
  }

  if (isEditMode && !appointmentToEdit) {
    return (
      <div className="appointment-form-card">
        <div className="appointment-form-header">
          <h2>Rendez-vous introuvable</h2>
          <p>Le rendez-vous demandé n'existe pas ou n'est plus disponible.</p>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/appointments")}
          >
            Retour aux rendez-vous
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-form-card">
      <div className="appointment-form-header">
        <h2>{isEditMode ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}</h2>
        <p>
          {isEditMode
            ? "Modifier les informations du rendez-vous"
            : "Planifier un rendez-vous pour un patient"}
        </p>
        <span className="required-info">* Champs obligatoires</span>
      </div>

      <form className="appointment-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Informations du rendez-vous</h3>

          <div className="form-group">
            <label htmlFor="patientId">Patient *</label>
            <PatientSearchSelect
              value={formData.patientId}
              onChange={(patientId) =>
                setFormData((prev) => ({ ...prev, patientId }))
              }
              error={errors.patientId}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="time">Créneau *</label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                disabled={!formData.date}
              >
                <option value="">
                  {formData.date
                    ? "Sélectionner un créneau"
                    : "Choisir d'abord une date"}
                </option>

                {CRENEAUX.map((creneau) => {
                  const occupe = creneauxOccupes.includes(creneau);
                  return (
                    <option key={creneau} value={creneau} disabled={occupe}>
                      {formatCreneau(creneau)}
                      {occupe ? " — occupé" : ""}
                    </option>
                  );
                })}
              </select>

              <span className="form-help">Chaque rendez-vous dure une heure.</span>
              {errors.time && <span className="form-error">{errors.time}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reason">Motif</label>
            <input
              id="reason"
              name="reason"
              type="text"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Motif du rendez-vous"
              maxLength={500}
            />
          </div>
        </div>

        {serverError && <span className="form-error">{serverError}</span>}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/appointments")}
          >
            Annuler
          </button>
          <button type="submit" className="save-btn" disabled={submitting}>
            {submitting
              ? "Enregistrement..."
              : isEditMode
              ? "Enregistrer les modifications"
              : "Enregistrer le rendez-vous"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AppointmentForm;