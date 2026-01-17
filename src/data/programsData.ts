export const VACATION_PROGRAM_DATA = {
  // --- SECTION PROCHAIN ÉVÉNEMENT (DROITE DU MODAL) ---
  // Conseil : Gardez des titres courts pour le mobile
  nextEvent: {
    title: "Été Solidaire",
    date: "Juillet - Août 2026",
    location: "Bujumbura",
    target: "100 Enfants",
    status: "Places Limitées", // Apparaît dans le badge clignotant
    description: "Un mois intensif pour offrir des vêtements chauds, du matériel scolaire et un soutien éducatif aux enfants les plus marginalisés."
  },

  // --- SECTION GALERIE (PHOTOS DÉFILANTES) ---
  // Conseil : Utilisez des images au format Paysage (Horizontal) pour un meilleur rendu mobile
  gallery: [
    { 
      url: "/act1.jpg", 
      caption: "Atelier de lecture & leadership" 
    },
    { 
      url: "/act2.jpg", 
      caption: "Distribution de kits scolaires" 
    },
    { 
      url: "/act3.jpg", 
      caption: "Activités d'éveil et de sport" 
    }
  ],

  // --- SECTION STORYTELLING (HISTOIRES D'IMPACT) ---
  // Conseil : Maximum 2-3 phrases par histoire pour éviter de trop longs défilements sur mobile
  stories: [
    { 
      name: "Robin", 
      context: "Enfant asthmatique", 
      text: "Grâce au programme, Robin a reçu un pull pour se protéger du froid. Il a pu suivre les cours sereinement et admirer la générosité de Noël." 
    },
    { 
      name: "Aline", 
      context: "Famille démunie", 
      text: "Aline a découvert sa passion pour le leadership. Aujourd'hui, elle aide les plus petits de son quartier à réviser leurs leçons." 
    }
  ]
};
