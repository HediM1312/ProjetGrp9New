const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // autorise ton front local
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("🟢 Client connecté");

  const sendFakeHorses = () => {
    const horses = [
      {
        nom: "Éclair du Vent",
        cote: (Math.random() * 5 + 1).toFixed(2),
        course: "Paris - Vincennes"
      },
      {
        nom: "Tonnerre de Feu",
        cote: (Math.random() * 5 + 1).toFixed(2),
        course: "Lyon - La Soie"
      },
      {
        nom: "Foudre Blanche",
        cote: (Math.random() * 5 + 1).toFixed(2),
        course: "Marseille - Borély"
      }
    ];

    socket.emit("horses_update", horses);
  };

  // Envoie immédiat + toutes les 5 secondes
  sendFakeHorses();
  const interval = setInterval(sendFakeHorses, 5000);

  socket.on("disconnect", () => {
    console.log("🔴 Client déconnecté");
    clearInterval(interval);
  });
});

server.listen(3001, () => {
  console.log("🚀 Serveur WebSocket en écoute sur http://localhost:3001");
});
