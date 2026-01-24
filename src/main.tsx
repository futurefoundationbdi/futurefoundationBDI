if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // On ajoute ?v=${Date.now()} pour forcer le navigateur à ignorer son cache
    navigator.serviceWorker
      .register(`/sw.js?v=${Date.now()}`)
      .then((registration) => {
        console.log("SW enregistré");
        
        // Force la mise à jour immédiate si une nouvelle version existe
        registration.update();

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                // On vide manuellement les caches pour être sûr
                caches.keys().then(names => {
                  for (let name of names) caches.delete(name);
                });
                console.log("Nouvelle version installée. Redémarrage...");
                window.location.reload();
              }
            };
          }
        };
      })
  });
}
