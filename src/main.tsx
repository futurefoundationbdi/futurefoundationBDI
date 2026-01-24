import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Le conteneur root n'existe pas");

const root = createRoot(container);
root.render(<App />);

// --- SYSTÈME DE MISE À JOUR ROBUSTE ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Le ?v= force le navigateur à voir un nouveau fichier
    navigator.serviceWorker
      .register(`/sw.js?v=${Date.now()}`)
      .then((registration) => {
        console.log("Service Worker enregistré avec succès");

        // On vérifie les mises à jour
        registration.update();

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  console.log("Nouvelle version détectée, rechargement...");
                  // On vide le cache avant de recharger
                  caches.keys().then((names) => {
                    for (let name of names) caches.delete(name);
                  });
                  window.location.reload();
                }
              }
            };
          }
        };
      })
      .catch((error) => {
        console.error("Erreur d'enregistrement du SW:", error);
      });
  });
}
