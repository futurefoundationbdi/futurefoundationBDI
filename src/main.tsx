import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// --- AJOUT POUR LE JEU HORS-LIGNE ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("🎮 Mode Jeu Hors-ligne activé avec succès !", reg.scope);
      })
      .catch((err) => {
        console.log("❌ Échec de l'activation du mode hors-ligne :", err);
      });
  });
}
