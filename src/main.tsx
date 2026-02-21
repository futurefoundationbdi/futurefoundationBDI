// src/main.tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Le conteneur root n'existe pas");

const root = createRoot(container);
root.render(<App />);

// --- SYSTÈME DE MISE À JOUR POUR APK (LIVE RELOAD) ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then((reg) => {
      reg.onupdatefound = () => {
        const installingWorker = reg.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
              // Nettoyage forcé pour que l'APK récupère les derniers défis
              caches.keys().then(names => {
                for (let name of names) caches.delete(name);
              });
              window.location.reload();
            }
          };
        }
      };
    }).catch(err => console.error("Erreur SW APK:", err));
  });
}