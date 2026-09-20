import express from "express";
import cors from "cors";

const app = express();

// Autoriser le frontend local à appeler l’API.
app.use(cors({
  origin: "http://localhost:5173",
}));

// Lire les données JSON des requêtes.
app.use(express.json());

// Vérifier que le serveur répond.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Le backend du cabinet dentaire fonctionne.",
  });
});

// Répondre aux routes inexistantes.
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Route introuvable.",
    },
  });
});

export default app;