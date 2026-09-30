import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";

const app = express();

// Autoriser le frontend local à appeler l’API.
app.use(cors({
  origin: "http://localhost:5173",
}));

// Lire les données JSON des requêtes.
app.use(express.json());

// Route publique : vérifier que le serveur répond.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Le backend du cabinet dentaire fonctionne.",
  });
});

// Vérifier les sessions Clerk pour les routes suivantes.
app.use(clerkMiddleware({
  authorizedParties: ["http://localhost:5173"],
}));

// Retourner l’identité Clerk de l’utilisateur connecté.
app.get("/api/auth/me", (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Connexion requise.",
      },
    });
  }

  return res.status(200).json({
    clerkUserId: userId,
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

// Renvoyer une réponse JSON en cas d’erreur interne.
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Une erreur interne est survenue.",
    },
  });
});

export default app;