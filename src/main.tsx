import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Le conteneur root n'existe pas");

const root = createRoot(container);
root.render(<App />);

// --- SYSTÈME DE MISE À JOUR STABLE ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Suppression du Date.now() pour éviter la boucle de rechargement
    navigator.serviceWorker.register("/sw.js").then((reg) => {
      
      reg.onupdatefound = () => {
        const installingWorker = reg.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
              // On vide les caches et on recharge UNE SEULE FOIS
              caches.keys().then(names => {
                for (let name of names) caches.delete(name);
              });
              console.log("Mise à jour installée, redémarrage...");
              window.location.reload();
            }
          };
        }
      };
    }).catch(err => console.error("Erreur SW:", err));
  });
}
