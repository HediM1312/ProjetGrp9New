const express = require("express");
const router = express.Router();
const horseController = require("../controllers/horseController");

// Route pour obtenir le top 5 des chevaux
router.get("/top", horseController.getTopHorses);

// Route pour obtenir tous les chevaux
router.get("/", horseController.getAllHorses);

// Route pour rechercher des chevaux
router.get("/search", horseController.searchHorses);

// Route pour obtenir un cheval spécifique
router.get("/:id", horseController.getHorseById);

// Route pour forcer la mise à jour des données
router.post("/update", horseController.forceUpdate);

module.exports = router;
