import { useEffect } from "react";

const Chatbot = () => {
  useEffect(() => {
    // Initialisation du SDK Chatbase
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = (...arguments: any[]) => {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(arguments);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") {
            return target.q;
          }
          return (...args: any[]) => target(prop, ...args);
        },
      });
    }

    // Chargement du script d'affichage
    const onLoad = () => {
      if (!document.getElementById("78PAJB7Kzx7C0WL_8JNuL")) {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "78PAJB7Kzx7C0WL_8JNuL";
        script.setAttribute("domain", "www.chatbase.co");
        script.setAttribute("chatbotId", "78PAJB7Kzx7C0WL_8JNuL");
        document.body.appendChild(script);
      }
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }
  }, []);

  return null; // Ce composant ne dessine rien, il injecte juste le bot
};

export default Chatbot;
