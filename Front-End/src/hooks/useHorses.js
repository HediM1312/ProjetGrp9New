import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useHorses() {
  const [horses, setHorses] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("🟢 Connecté au WebSocket");
    });

    socket.on("horses_update", (data) => {
      console.log("📦 Données reçues :", data);
      setHorses(data);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Déconnecté du WebSocket");
    });

    return () => {
      socket.disconnect(); // proprement à la fin du hook
    };
  }, []);

  return horses;
}
