const axios = require("axios");

class RacingApiService {
  constructor() {
    this.apiUsername = process.env.RACING_API_USERNAME;
    this.apiPassword = process.env.RACING_API_PASSWORD;
    this.baseURL = "https://api.pmu.fr/rest/client/1"; // URL exemple pour PMU
  }

  async getAuthToken() {
    try {
      const response = await axios.post(
        `${this.baseURL}/token`,
        {},
        {
          auth: {
            username: this.apiUsername,
            password: this.apiPassword,
          },
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      throw new Error("Échec de l'authentification à l'API des courses");
    }
  }

  async getTodayRaces() {
    try {
      const token = await this.getAuthToken();
      const today = new Date().toISOString().split("T")[0];

      const response = await axios.get(`${this.baseURL}/races/${today}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return this.formatRaceData(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des courses:", error);
      throw new Error("Impossible de récupérer les données des courses");
    }
  }

  formatRaceData(data) {
    // Transformation des données de l'API en format compatible avec notre modèle Horse
    return (
      data.races?.map((race) => ({
        name: race.horse_name,
        odds: race.current_odds,
        raceDate: new Date(race.start_time),
        bookmaker: "PMU",
        raceName: race.race_name,
        track: race.hippodrome,
        description: `${race.race_type} - ${race.horse_age} ans`,
        imageUrl: race.horse_image || "https://via.placeholder.com/150",
      })) || []
    );
  }
}

module.exports = new RacingApiService();
