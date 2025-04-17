const racingApiService = require("../services/SportDbApiService");
const jwt = require("jsonwebtoken");
const SportEvent = require("../models/SportEvent");

/**
 * Get the top 5 sports events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTopSportEvents = async (req, res) => {
  try {
    // Verify JWT token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé: Token manquant",
      });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    } catch (error) {
      console.error("Erreur de vérification du token:", error);
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé: Token invalide",
      });
    }

    console.log("Récupération des événements sportifs...");
    const events = await racingApiService.getTodayRaces();
    console.log(`${events.length} événements sportifs récupérés`);

    // Sort by odds (ascending) and take the first 5
    const topEvents = events
      .sort((a, b) => a.odds - b.odds)
      .slice(0, 5)
      .map((event, index) => ({
        ...event,
        position: index + 1,
      }));

    res.status(200).json({
      success: true,
      count: topEvents.length,
      data: topEvents,
    });
  } catch (error) {
    console.error("Erreur dans getTopSportEvents:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des événements sportifs",
      error: error.message,
    });
  }
};

/**
 * Get all sports events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllSportEvents = async (req, res) => {
  try {
    // Verify JWT token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé: Token manquant",
      });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    } catch (error) {
      console.error("Erreur de vérification du token:", error);
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé: Token invalide",
      });
    }

    console.log("Récupération de tous les événements sportifs...");
    const events = await racingApiService.getTodayRaces();
    console.log(`${events.length} événements sportifs récupérés`);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Erreur dans getAllSportEvents:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des événements sportifs",
      error: error.message,
    });
  }
};

/**
 * Get a specific sports event by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSportEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify JWT token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé: Token manquant",
      });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    } catch (error) {
      console.error("Erreur de vérification du token:", error);
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé: Token invalide",
      });
    }

    console.log(`Récupération de l'événement sportif avec l'ID: ${id}`);
    // For simplicity, we'll get all races and filter
    const events = await racingApiService.getTodayRaces();

    // In real app, this would be a database lookup by ID
    // For now, we'll just use the array index
    const eventIndex = parseInt(id, 10);
    if (isNaN(eventIndex) || eventIndex < 0 || eventIndex >= events.length) {
      return res.status(404).json({
        success: false,
        message: "Événement sportif non trouvé",
      });
    }

    const event = events[eventIndex];

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Erreur dans getSportEventById:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'événement sportif",
      error: error.message,
    });
  }
};

/**
 * Search sports events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const searchSportEvents = async (req, res) => {
  try {
    const { term } = req.query;

    // Verify JWT token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé: Token manquant",
      });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    } catch (error) {
      console.error("Erreur de vérification du token:", error);
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé: Token invalide",
      });
    }

    if (!term) {
      return res.status(400).json({
        success: false,
        message: "Un terme de recherche est requis",
      });
    }

    console.log(`Recherche d'événements sportifs avec le terme: ${term}`);
    const events = await racingApiService.getTodayRaces();

    // Simple search on name and description
    const searchTerm = term.toLowerCase();
    const results = events.filter(
      (event) =>
        event.name.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.venue.toLowerCase().includes(searchTerm) ||
        event.sport.toLowerCase().includes(searchTerm) ||
        event.league.toLowerCase().includes(searchTerm) ||
        event.homeTeam.toLowerCase().includes(searchTerm) ||
        event.awayTeam.toLowerCase().includes(searchTerm)
    );

    console.log(`${results.length} événements sportifs trouvés`);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Erreur dans searchSportEvents:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la recherche d'événements sportifs",
      error: error.message,
    });
  }
};

/**
 * Force update of sports events data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const forceUpdateSportEvents = async (req, res) => {
  try {
    // Verify JWT token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé: Token manquant",
      });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    } catch (error) {
      console.error("Erreur de vérification du token:", error);
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé: Token invalide",
      });
    }

    console.log("Mise à jour forcée des données d'événements sportifs...");
    // In a real app, this would trigger a refresh from the actual API
    // For now, we'll just get a new set of random data
    const events = await racingApiService.getTodayRaces();
    console.log(`${events.length} événements sportifs mis à jour`);

    res.status(200).json({
      success: true,
      message: "Données d'événements sportifs mises à jour avec succès",
      count: events.length,
    });
  } catch (error) {
    console.error("Erreur dans forceUpdateSportEvents:", error);
    res.status(500).json({
      success: false,
      message:
        "Erreur lors de la mise à jour des données d'événements sportifs",
      error: error.message,
    });
  }
};

module.exports = {
  getTopSportEvents,
  getAllSportEvents,
  getSportEventById,
  searchSportEvents,
  forceUpdateSportEvents,
};
