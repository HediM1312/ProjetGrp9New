const express = require("express");
const router = express.Router();
const sportController = require("../controllers/sportController");
const { protect } = require("../middleware/auth");

// Appliquer le middleware d'authentification à toutes les routes
router.use(protect);

// Route pour obtenir le top 5 des chevaux
router.get("/top", sportController.getTopSportEvents);

// Route pour obtenir tous les chevaux
router.get("/", sportController.getAllSportEvents);

// Route pour rechercher des chevaux
router.get("/search", sportController.searchSportEvents);

// Route pour obtenir un cheval spécifique
router.get("/:id", sportController.getSportEventById);

// Route pour forcer la mise à jour des données
router.post("/update", sportController.forceUpdateSportEvents);

module.exports = router;
