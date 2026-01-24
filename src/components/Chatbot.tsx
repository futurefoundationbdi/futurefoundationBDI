import { useEffect } from "react";

// On déclare chatbase pour éviter les erreurs TypeScript
declare global {
  interface Window {
    chatbase?: any;
  }
}

const Chatbot = () => {
  useEffect(() => {
    // 1. Initialisation sécurisée du SDK
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = (...args: any[]) => {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(args);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") return target.q;
          return (...args: any[]) => target(prop, ...args);
        },
      });
    }

    // 2. Fonction d'injection du script
    const injectScript = () => {
      if (!document.getElementById("78PAJB7Kzx7C0WL_8JNuL")) {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "78PAJB7Kzx7C0WL_8JNuL";
        script.setAttribute("chatbotId", "78PAJB7Kzx7C0WL_8JNuL");
        script.setAttribute("domain", "www.chatbase.co");
        script.defer = true; // Permet de ne pas bloquer le chargement du site
        document.body.appendChild(script);
      }
    };

    // 3. Exécution immédiate ou sur écouteur
    if (document.readyState === "complete") {
      injectScript();
    } else {
      window.addEventListener("load", injectScript);
      // Nettoyage de l'écouteur si le composant est démonté
      return () => window.removeEventListener("load", injectScript);
    }
  }, []);

  return null;
};

export default Chatbot;
