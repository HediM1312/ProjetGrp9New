const mongoose = require("mongoose");

const horseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    odds: {
      type: Number,
      required: true,
    },
    raceDate: {
      type: Date,
      required: true,
    },
    bookmaker: {
      type: String,
      required: true,
    },
    raceName: {
      type: String,
      required: true,
    },
    track: {
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Horse", horseSchema);
