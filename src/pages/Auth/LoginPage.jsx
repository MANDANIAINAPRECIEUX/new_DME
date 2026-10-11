import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/react";
import { FaTooth, FaEnvelope, FaLock } from "react-icons/fa";
import "./LoginPage.css";

function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoaded || loading) return;

    setLoading(true);
    setError(null);

    try {
      // Authentification réelle via Clerk
      const result = await signIn.create({
        identifier: formData.email.trim(),
        password: formData.password,
      });

      if (result.status === "complete") {
        // Activer la session Clerk
        await setActive({
          session: result.createdSessionId,
        });

        // Rediriger vers le Dashboard
        navigate("/", { replace: true });
      } else {
        setError(
          "Une vérification supplémentaire est nécessaire. " +
            "Veuillez contacter l'administrateur.",
        );
      }
    } catch (err) {
      const clerkError = err?.errors?.[0];

      setError(
        clerkError?.longMessage ||
          clerkError?.message ||
          "Connexion impossible. Vérifiez vos identifiants.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <FaTooth />
        </div>

        <h1>DME Dentaire</h1>
        <p>Connectez-vous pour accéder à votre espace</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <div className="input-with-icon">
              <FaEnvelope />

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>

            <div className="input-with-icon">
              <FaLock />

              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading || !isLoaded}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
