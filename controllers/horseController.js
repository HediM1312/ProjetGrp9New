const Horse = require("../models/Horse");
const racingApiService = require("../services/racingApiService");

// Cache pour stocker les données (évite les appels API trop fréquents)
let lastFetch = null;
let cacheExpiration = 5 * 60 * 1000; // 5 minutes

// Récupérer le top 5 des chevaux
exports.getTopHorses = async (req, res) => {
  try {
    await updateHorsesData();
    const topHorses = await Horse.find().sort({ odds: 1 }).limit(5);

    res.json({
      success: true,
      data: topHorses,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error getting top horses:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération du top 5",
      details: error.message,
    });
  }
};

// Récupérer tous les chevaux
exports.getAllHorses = async (req, res) => {
  try {
    await updateHorsesData();
    const horses = await Horse.find().sort({ odds: 1 });

    res.json({
      success: true,
      data: horses,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error getting all horses:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des chevaux",
      details: error.message,
    });
  }
};

// Récupérer un cheval par son ID
exports.getHorseById = async (req, res) => {
  try {
    const horse = await Horse.findById(req.params.id);
    if (!horse) {
      return res.status(404).json({
        success: false,
        error: "Cheval non trouvé",
      });
    }

    res.json({
      success: true,
      data: horse,
    });
  } catch (error) {
    console.error("Error getting horse by id:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération du cheval",
      details: error.message,
    });
  }
};

// Rechercher des chevaux
exports.searchHorses = async (req, res) => {
  try {
    const { query } = req.query;
    const searchRegex = new RegExp(query, "i");

    const horses = await Horse.find({
      $or: [
        { name: searchRegex },
        { raceName: searchRegex },
        { track: searchRegex },
        { description: searchRegex },
      ],
    }).sort({ odds: 1 });

    res.json({
      success: true,
      data: horses,
      count: horses.length,
    });
  } catch (error) {
    console.error("Error searching horses:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la recherche",
      details: error.message,
    });
  }
};

// Forcer la mise à jour des données
exports.forceUpdate = async (req, res) => {
  try {
    lastFetch = null; // Reset le cache
    await updateHorsesData(true);

    res.json({
      success: true,
      message: "Données mises à jour avec succès",
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error forcing update:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la mise à jour forcée",
      details: error.message,
    });
  }
};

// Fonction utilitaire pour mettre à jour les données
async function updateHorsesData(force = false) {
  const now = new Date();
  if (!force && lastFetch && now - lastFetch < cacheExpiration) {
    return; // Utilise le cache si les données sont récentes
  }

  try {
    const races = await racingApiService.getTodayRaces();

    if (races && races.length > 0) {
      await Horse.deleteMany({}); // Nettoie les anciennes données
      await Horse.insertMany(races); // Insère les nouvelles données
      lastFetch = now;
    }
  } catch (error) {
    console.error("Error updating horse data:", error);
    throw new Error("Impossible de mettre à jour les données des courses");
  }
}
