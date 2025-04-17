const mongoose = require("mongoose");

const sportEventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    odds: {
      type: Number,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    bookmaker: {
      type: String,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    description: {
      type: String,
      default: "Information non disponible",
    },
    league: {
      type: String,
      default: "Unknown League",
    },
    homeTeam: {
      type: String,
      default: "",
    },
    awayTeam: {
      type: String,
      default: "",
    },
    sport: {
      type: String,
      default: "Football",
    },
  },
  {
    timestamps: true,
  }
);

// To maintain compatibility with existing code, we'll keep the collection name as "horses"
module.exports = mongoose.model("SportEvent", sportEventSchema, "horses");
