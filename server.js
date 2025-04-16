require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const horseRoutes = require("./routes/horseRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Configuration de sécurité pour CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging basique
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Connexion à MongoDB avec options de configuration
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/horses", horseRoutes);

// Route de base pour vérifier que le serveur fonctionne
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Gestion des routes non trouvées
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: "Route non trouvée",
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Erreur serveur",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
