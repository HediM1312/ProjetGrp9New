const axios = require("axios");

class SportsDBApiService {
  constructor() {
    this.baseURL =
      process.env.SPORTSDB_API_URL || "https://www.thesportsdb.com/api/v1/json";
    this.apiKey = process.env.SPORTSDB_API_KEY || "3";
    // Liste des IDs de grandes ligues de football
    this.leagueIds = [
      4328, // Premier League
      4335, // La Liga
      4331, // Bundesliga
      4334, // Ligue 1
      4332, // Serie A
      4337, // Eredivisie
      4344, // Champions League
      4350, // Europa League
      4346, // Serie A (Brazil)
      4330, // Primeira Liga (Portugal)
      4338, // MLS
    ];
  }

  async getTodayRaces() {
    // Pour stocker tous les événements récupérés
    let allEvents = [];

    try {
      console.log("Fetching real football events from TheSportsDB...");

      // Essayer aussi les événements à venir au lieu des événements passés
      // Pour les ligues principales
      for (const leagueId of this.leagueIds) {
        try {
          // On essaie d'abord les événements à venir (eventsnextleague)
          const response = await axios.get(
            `${this.baseURL}/${this.apiKey}/eventsnextleague.php`,
            {
              params: {
                id: leagueId,
              },
            }
          );

          if (
            response.data &&
            response.data.events &&
            response.data.events.length > 0
          ) {
            console.log(
              `Fetched ${response.data.events.length} upcoming football events from league ID ${leagueId}`
            );
            // Ajouter ces événements à notre collection
            allEvents = [...allEvents, ...response.data.events];

            // Si nous avons au moins 10 événements, c'est suffisant
            if (allEvents.length >= 10) {
              break;
            }
          }
        } catch (error) {
          console.log(
            `Error fetching upcoming data for league ID ${leagueId}: ${error.message}`
          );
          // Essayer les événements passés comme fallback
          try {
            const response = await axios.get(
              `${this.baseURL}/${this.apiKey}/eventslast.php`,
              {
                params: {
                  id: leagueId,
                },
              }
            );

            if (
              response.data &&
              response.data.results &&
              response.data.results.length > 0
            ) {
              console.log(
                `Fetched ${response.data.results.length} past football events from league ID ${leagueId}`
              );
              // Ajouter ces événements à notre collection
              allEvents = [...allEvents, ...response.data.results];

              if (allEvents.length >= 10) {
                break;
              }
            }
          } catch (innerError) {
            console.log(
              `Error fetching past data for league ID ${leagueId}: ${innerError.message}`
            );
            continue;
          }
        }
      }

      // Filtrer pour garder uniquement les matchs futurs ou d'aujourd'hui
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Début de la journée

      const filteredEvents = allEvents.filter((event) => {
        const eventDate = new Date(
          event.dateEvent || event.strDate || new Date()
        );
        return eventDate >= today;
      });

      console.log(
        `Found ${filteredEvents.length} upcoming football events after filtering`
      );

      // Si nous avons trouvé des événements réels futurs, les formater et les renvoyer
      if (filteredEvents.length > 0) {
        return this.formatEventData(filteredEvents);
      }

      // Si aucun événement futur n'est disponible, essayer d'utiliser les API pour des événements de cette journée
      try {
        const todayString = today.toISOString().split("T")[0];
        const responseDayEvents = await axios.get(
          `${this.baseURL}/${this.apiKey}/eventsday.php`,
          {
            params: {
              d: todayString,
              s: "Soccer",
            },
          }
        );

        if (
          responseDayEvents.data &&
          responseDayEvents.data.events &&
          responseDayEvents.data.events.length > 0
        ) {
          console.log(
            `Found ${responseDayEvents.data.events.length} football events for today (${todayString})`
          );
          return this.formatEventData(responseDayEvents.data.events);
        }
      } catch (error) {
        console.log(`Error fetching today's events: ${error.message}`);
      }

      // Si aucune donnée n'est disponible, renvoyer un tableau vide
      console.log("No upcoming football events available from TheSportsDB API");
      return [];
    } catch (error) {
      console.error(
        "Error fetching data from TheSportsDB:",
        error.response?.data || error.message
      );
      // En cas d'erreur globale, renvoyer un tableau vide
      return [];
    }
  }

  formatEventData(events) {
    if (!events || events.length === 0) {
      return [];
    }

    return events.map((event) => {
      // Utiliser strDate si dateEvent n'est pas disponible (ils utilisent différents champs selon l'endpoint)
      const eventDate = new Date(
        event.dateEvent || event.strDate || new Date()
      );
      const formattedDate = eventDate.toISOString().split("T")[0]; // YYYY-MM-DD format

      // Générer les trois cotes pour le match (1-X-2)
      const matchOdds = this.getRealisticOdds(
        event.strHomeTeam,
        event.strAwayTeam
      );

      return {
        name: `${event.strHomeTeam || ""} vs ${event.strAwayTeam || ""}`,
        odds: matchOdds.homeWin, // Pour la compatibilité avec le code existant
        homeWinOdds: matchOdds.homeWin, // Cote pour la victoire de l'équipe à domicile
        drawOdds: matchOdds.draw, // Cote pour le match nul
        awayWinOdds: matchOdds.awayWin, // Cote pour la victoire de l'équipe à l'extérieur
        eventDate: eventDate,
        formattedDate: formattedDate,
        bookmaker: "TheSportsDB", // Utiliser TheSportsDB comme bookmaker
        eventName: event.strEvent || "",
        venue: event.strVenue || "Stade inconnu",
        description: `${event.strLeague || ""} - ${event.strSeason || ""}`,
        imageUrl:
          event.strThumb ||
          `https://via.placeholder.com/150?text=${encodeURIComponent(
            event.strEvent || "Match de football"
          )}`,
        league: event.strLeague || "",
        homeTeam: event.strHomeTeam || "",
        awayTeam: event.strAwayTeam || "",
        sport: "Football",
      };
    });
  }

  /**
   * Génère des cotes réalistes basées sur les équipes en présence
   * @param {string} homeTeam - Équipe à domicile
   * @param {string} awayTeam - Équipe à l'extérieur
   * @returns {Object} - Objet contenant les trois cotes (1-X-2)
   */
  getRealisticOdds(homeTeam, awayTeam) {
    // Liste des équipes de haut niveau qui ont généralement des cotes plus basses
    const topTeams = [
      "Manchester United",
      "Manchester City",
      "Liverpool",
      "Chelsea",
      "Arsenal",
      "Tottenham",
      "Barcelona",
      "Real Madrid",
      "Atletico Madrid",
      "Bayern Munich",
      "Borussia Dortmund",
      "Paris Saint-Germain",
      "Juventus",
      "Inter Milan",
      "AC Milan",
      "Ajax",
      "Porto",
      "Benfica",
    ];

    // Vérifier si l'une des équipes est une équipe de haut niveau
    const isHomeTopTeam = topTeams.some(
      (team) => homeTeam && homeTeam.includes(team)
    );
    const isAwayTopTeam = topTeams.some(
      (team) => awayTeam && awayTeam.includes(team)
    );

    let homeWinOdds, drawOdds, awayWinOdds;

    // Déterminer les cotes en fonction du statut des équipes
    if (isHomeTopTeam && isAwayTopTeam) {
      // Match entre deux équipes de haut niveau - cotes plus équilibrées
      homeWinOdds = 2.2 + (Math.random() - 0.5) * 0.6; // ~2.0-2.5
      drawOdds = 3.0 + (Math.random() - 0.5) * 0.5; // ~2.8-3.3
      awayWinOdds = 2.8 + (Math.random() - 0.5) * 0.7; // ~2.5-3.2
    } else if (isHomeTopTeam) {
      // L'équipe à domicile est favorisée
      homeWinOdds = 1.4 + (Math.random() - 0.5) * 0.4; // ~1.2-1.6
      drawOdds = 3.5 + (Math.random() - 0.5) * 0.8; // ~3.1-3.9
      awayWinOdds = 6.0 + (Math.random() - 0.5) * 3.0; // ~4.5-7.5
    } else if (isAwayTopTeam) {
      // L'équipe à l'extérieur est favorisée
      homeWinOdds = 3.8 + (Math.random() - 0.5) * 1.5; // ~3.0-4.5
      drawOdds = 3.3 + (Math.random() - 0.5) * 0.8; // ~2.9-3.7
      awayWinOdds = 1.8 + (Math.random() - 0.5) * 0.6; // ~1.5-2.1
    } else {
      // Match entre équipes de niveau similaire
      homeWinOdds = 2.2 + (Math.random() - 0.5) * 0.9; // ~1.8-2.7
      drawOdds = 3.1 + (Math.random() - 0.5) * 0.7; // ~2.8-3.5
      awayWinOdds = 3.0 + (Math.random() - 0.5) * 1.0; // ~2.5-3.5
    }

    // Arrondir à deux décimales pour imiter les cotes réelles des bookmakers
    return {
      homeWin: parseFloat(homeWinOdds.toFixed(2)),
      draw: parseFloat(drawOdds.toFixed(2)),
      awayWin: parseFloat(awayWinOdds.toFixed(2)),
    };
  }

  generateRandomOdds() {
    // Une méthode simple pour générer des cotes pour les matchs récupérés
    return parseFloat((Math.random() * 2 + 1).toFixed(2));
  }

  async getEventResults(id) {
    try {
      // Essayer de récupérer des événements réels
      const events = await this.getTodayRaces();

      // Si nous avons des événements, en renvoyer 3 comme résultats
      if (events.length > 0) {
        return {
          success: true,
          data: {
            id,
            results: events.slice(0, 3).map((event, index) => ({
              position: index + 1,
              event: event.name,
              date: event.formattedDate,
            })),
          },
        };
      }

      // Si aucun événement n'est disponible
      return {
        success: false,
        data: {
          id,
          results: [],
        },
      };
    } catch (error) {
      console.error("Error getting event results:", error.message);
      return {
        success: false,
        data: {
          id,
          results: [],
        },
      };
    }
  }
}

module.exports = new SportsDBApiService();
