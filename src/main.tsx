import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// --- VERSION OPTIMISÉE POUR LES MISES À JOUR AUTOMATIQUES ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("🎮 Mode Jeu Hors-ligne activé !", registration.scope);

        // Force la vérification d'une nouvelle version au chargement
        registration.update();

        // Détecte quand un nouveau fichier sw.js est trouvé
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  // Une nouvelle version est prête : on recharge la page
                  console.log("Mise à jour du jeu trouvée... Redémarrage !");
                  window.location.reload();
                }
              }
            };
          }
        };
      })
      .catch((err) => {
        console.log("❌ Échec de l'activation :", err);
      });
  });
}
