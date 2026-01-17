// src/data/quizQuestions.ts

export type Question = {
  q: string;
  o: string[];
  c: number;
  e: string;
};

export const QUIZ_DATABASE: Record<string, Question[]> = {
  debutant: [
    // --- LIVRE & BASE ---
    { q: "Qui est le personnage principal qui découvre les secrets de l'argent ?", o: ["Ismaël", "Alain", "Edouard"], c: 0, e: "L'histoire suit le jeune Ismaël et les enseignements de sa grand-mère." },
    { q: "Que signifie le terme latin 'Ex-Nihilo' concernant la monnaie ?", o: ["Depuis le coffre", "À partir de rien", "Par le travail"], c: 1, e: "Il décrit comment les banques créent l'argent par une simple écriture comptable lors d'un prêt." },
    { q: "Quelle institution a le monopole exclusif de l'émission des billets au Burundi ?", o: ["La Bancobu", "La BRB", "Le Ministère des Finances"], c: 1, e: "Seule la Banque de la République du Burundi peut émettre la monnaie fiduciaire." },
    { q: "Quel pourcentage de l'argent en circulation est représenté par la monnaie scripturale ?", o: ["Environ 50%", "Plus de 90%", "Moins de 10%"], c: 1, e: "La majeure partie de l'argent n'est pas physique, ce sont des chiffres sur des comptes." },
    { q: "Comment la grand-mère d'Ismaël définit-elle l'argent ?", o: ["Une chose physique", "Une histoire", "Un mal nécessaire"], c: 1, e: "L'argent est avant tout une histoire de confiance et de promesses." },
    { q: "Comment appelle-t-on l'ancêtre des échanges sans argent ?", o: ["Le don", "Le Troc", "Le virement"], c: 1, e: "Le troc consistait à échanger directement un bien contre un autre." },
    { q: "Qu'est-ce que le problème de la 'double coïncidence des besoins' ?", o: ["Manquer d'argent", "La difficulté du troc", "L'inflation"], c: 1, e: "C'est l'obligation de trouver quelqu'un qui veut exactement ce que vous offrez." },
    { q: "La monnaie fiduciaire est appelée ainsi car 'fides' signifie...", o: ["Papier", "Confiance", "Richesse"], c: 1, e: "Les billets n'ont de valeur que parce que nous avons confiance en l'autorité qui les émet." },
    { q: "Quelle est la 'main visible' de l'argent selon l'ouvrage ?", o: ["La monnaie fiduciaire", "Le crédit", "L'inflation"], c: 0, e: "C'est l'argent que l'on peut toucher : billets et pièces." },
    { q: "Qui crée la monnaie scripturale (les chiffres sur les comptes) ?", o: ["La BRB uniquement", "Les banques commerciales", "Le gouvernement"], c: 1, e: "Ce sont les banques comme la BCB ou KCB qui créent cet argent en accordant des prêts." },
    { q: "Dans le livre, que représentent les 'Jetons BRB' ?", o: ["Des cadeaux", "L'argent utilisé entre les banques", "Des pièces de 50 FBu"], c: 1, e: "C'est la monnaie de règlement interbancaire gérée par la Banque Centrale." },
    { q: "Selon l'ouvrage, l'inflation est comparée à...", o: ["Un moteur", "De l'argent qui rétrécit", "Une récompense"], c: 1, e: "L'inflation fait que l'argent perd de sa valeur et achète moins de choses." },
    { q: "Le 'Droit d'Ouvrage' mentionne quel auteur ?", o: ["Ismaël", "Future Foundation BDI", "Robert Kiyosaki"], c: 1, e: "L'ouvrage est produit par The Future Foundation Burundi." },
    { q: "Quel outil la BRB utilise-t-elle pour contrôler le 'volume' de l'argent ?", o: ["Les impôts", "Les taux directeurs", "La publicité"], c: 1, e: "En changeant les taux, la BRB rend le crédit plus ou moins cher." },
    { q: "La monnaie électronique (Lumicash, Ecocash) est gérée par...", o: ["Des banques uniquement", "Des institutions de monnaie électronique", "L'État"], c: 1, e: "Ces services fonctionnent souvent via des entreprises de télécom agréées." },
    { q: "Que signifie l'acronyme FBu ?", o: ["Finance Burundaise", "Franc Burundais", "Fonds Burundais"], c: 1, e: "C'est l'abréviation de la monnaie nationale du Burundi." },
    { q: "L'argent déposé sur un compte Lumicash est considéré comme...", o: ["De l'or", "De la monnaie électronique", "Un don"], c: 1, e: "C'est une représentation numérique de la monnaie fiduciaire." },
    { q: "Vrai ou Faux : La BRB prête de l'argent directement aux citoyens ?", o: ["Vrai", "Faux", "Seulement aux riches"], c: 1, e: "La BRB est la banque des banques, elle ne traite pas avec les particuliers." },
    { q: "Le troc était difficile car les biens étaient souvent...", o: ["Trop chers", "Périssables ou non divisibles", "Interdits"], c: 1, e: "Difficile d'échanger une vache contre un œuf sans perdre de valeur." },
    { q: "Le monopole de la BRB signifie que...", o: ["Elle possède toutes les banques", "Elle est la seule à pouvoir créer les billets", "Elle fixe les prix du riz"], c: 1, e: "C'est un droit exclusif accordé par l'État." },
    
    // --- DÉVELOPPEMENT PERSONNEL BASE ---
    { q: "Selon le livre, qu'est-ce qu'un Actif ?", o: ["Une belle voiture de loisir", "Ce qui met de l'argent dans ma poche", "Mes vêtements de marque"], c: 1, e: "Un actif génère des revenus ou prend de la valeur." },
    { q: "Qu'est-ce qu'un Passif ?", o: ["Un compte épargne", "Ce qui sort de l'argent de ma poche", "Un terrain"], c: 1, e: "Un passif coûte de l'argent sans en rapporter." },
    { q: "Quelle est la règle 50/30/20 ?", o: ["Un code de carte", "Une gestion de budget", "Un taux d'intérêt"], c: 1, e: "50% Besoins, 30% Envies, 20% Épargne/Investissement." },
    { q: "Que signifie 'Se payer en premier' ?", o: ["Acheter des vêtements", "Épargner avant de dépenser", "Aller au restaurant"], c: 1, e: "C'est mettre de l'argent de côté pour son avenir dès réception du revenu." },
    { q: "Qu'est-ce que le 'plaisir retardé' ?", o: ["Être triste", "Attendre pour acheter quelque chose de mieux", "Payer ses dettes tard"], c: 1, e: "C'est sacrifier une envie immédiate pour un objectif futur plus grand." },
    { q: "Un smartphone utilisé uniquement pour les jeux est...", o: ["Un actif", "Un passif", "Un investissement"], c: 1, e: "Il vide votre poche sans rapporter d'argent." },
    { q: "La discipline financière, c'est...", o: ["Se priver de tout", "Rester fidèle à ses objectifs malgré les tentations", "Travailler sans dormir"], c: 1, e: "C'est le pont entre vos objectifs et leur réalisation." },
    { q: "Ismaël reçoit 10.000 FBu. Il achète une poule pour avoir des œufs. C'est...", o: ["Un passif", "Un actif", "Une dépense inutile"], c: 1, e: "La poule produit quelque chose qui a de la valeur." },
    { q: "Quelle est la première étape pour maîtriser son budget ?", o: ["Emprunter", "Noter toutes ses dépenses", "Ouvrir un grand magasin"], c: 1, e: "On ne peut pas gérer ce qu'on ne mesure pas." },
    { q: "La différence entre un besoin et une envie est...", o: ["Le prix", "Le caractère essentiel pour la survie/travail", "La couleur"], c: 1, e: "Le besoin est vital, l'envie est un confort supplémentaire." },
    { q: "Pourquoi le 'paraître' est-il dangereux ?", o: ["Il coûte cher en électricité", "Il crée des passifs pour impressionner autrui", "Il attire les mouches"], c: 1, e: "Dépenser pour l'image ruine la capacité d'investissement." },
    { q: "L'épargne de précaution sert à...", o: ["Acheter un cadeau", "Gérer les imprévus (maladie, panne)", "Voyager"], c: 1, e: "C'est votre filet de sécurité financier." },
    { q: "Vivre 'en dessous de ses moyens' permet de...", o: ["Devenir pauvre", "Dégager un excédent pour investir", "Ne plus manger"], c: 1, e: "C'est le secret de la création de richesse." },
    { q: "Le budget 'équilibré' est quand...", o: ["Dépenses > Revenus", "Dépenses = Revenus", "Dépenses < Revenus"], c: 2, e: "L'idéal est que les revenus soient supérieurs aux dépenses." }
  ],

  intermediaire: [
    // --- INVESTISSEMENT & MARCHÉS ---
    { q: "Qu'est-ce qu'une action en bourse ?", o: ["Une dette de l'entreprise", "Une part de propriété", "Un prêt à l'État"], c: 1, e: "Posséder une action, c'est posséder une petite partie d'une société." },
    { q: "Une obligation est un titre où vous...", o: ["Devenez patron", "Prêtez de l'argent", "Payez une amende"], c: 1, e: "C'est un prêt fait à une entité (État ou entreprise) contre intérêts." },
    { q: "Quelle est la différence entre épargner et investir ?", o: ["C'est la même chose", "L'épargne est mise de côté, l'investissement travaille", "L'épargne est plus risquée"], c: 1, e: "Investir vise à faire grandir son capital." },
    { q: "Qu'est-ce qu'un dividende ?", o: ["Une taxe", "Une part de bénéfice reversée", "Un type de compte"], c: 1, e: "C'est la récompense versée aux actionnaires." },
    { q: "Que signifie 'diversifier son portefeuille' ?", o: ["Avoir plusieurs portefeuilles", "Ne pas mettre tous ses œufs dans le même panier", "Acheter beaucoup d'actions d'une seule entreprise"], c: 1, e: "Il faut répartir les risques." },
    { q: "Qu'est-ce que les intérêts composés ?", o: ["Des intérêts simples", "Des intérêts sur les intérêts", "Une taxe bancaire"], c: 1, e: "Les intérêts génèrent de nouveaux intérêts à chaque période." },
    { q: "Qu'est-ce qu'un marché 'Bull' (Taureau) ?", o: ["Un marché en baisse", "Un marché en hausse", "Un marché fermé"], c: 1, e: "Le taureau symbolise la croissance et l'optimisme." },
    { q: "Un actif 'liquide' est un actif qui...", o: ["Peut être vendu rapidement en cash", "Vaut très cher", "Est imaginaire"], c: 0, e: "La liquidité est la vitesse de conversion en argent liquide." },
    { q: "Que signifie 'ROI' en finance ?", o: ["Roi de la banque", "Retour sur Investissement", "Risque Obscur Imminent"], c: 1, e: "Return On Investment : mesure la rentabilité." },
    { q: "L'inflation grignote...", o: ["Les dettes", "Le pouvoir d'achat de l'argent", "Les murs des banques"], c: 1, e: "Avec la même somme, on achète moins de choses." },
    { q: "Le 'Dépôt à Terme' (DAT) rapporte...", o: ["Moins que le compte courant", "Un intérêt plus élevé car l'argent est bloqué", "Rien du tout"], c: 1, e: "La banque vous récompense pour la stabilité des fonds." },
    { q: "Une 'plus-value' est réalisée quand...", o: ["On vend moins cher qu'à l'achat", "On vend plus cher qu'à l'achat", "On perd son portefeuille"], c: 1, e: "C'est le gain de capital." },
    { q: "L'or est souvent considéré comme une...", o: ["Dépense inutile", "Valeur refuge", "Monnaie scripturale"], c: 1, e: "Il protège contre les crises économiques." },
    { q: "Un courtier (broker) sert à...", o: ["Garder votre argent sous clé", "Exécuter vos ordres d'achat en bourse", "Prêter aux pauvres"], c: 1, e: "C'est l'intermédiaire technique." },
    { q: "Quelle est la différence entre crédit de consommation et investissement ?", o: ["Aucune", "Le crédit de conso achète souvent des passifs", "L'investissement est gratuit"], c: 1, e: "Le crédit conso finance souvent la dépréciation." },
    { q: "Qu'est-ce que la capitalisation boursière ?", o: ["Le profit annuel", "La valeur totale des actions d'une entreprise", "Le nombre de salariés"], c: 1, e: "C'est le prix d'une action multiplié par le nombre total d'actions." },
    { q: "Un indice boursier (ex: S&P 500) est...", o: ["Une seule action", "Un panier d'actions représentatif", "Un code secret"], c: 1, e: "Il sert à mesurer la température du marché." },
    
    // --- PSYCHOLOGIE & GESTION ---
    { q: "Le 'biais de confirmation' en finance, c'est...", o: ["Écouter tous les avis", "Ne chercher que les infos qui nous donnent raison", "Oublier son mot de passe"], c: 1, e: "C'est un piège mental qui empêche de voir les risques." },
    { q: "Pourquoi l'entourage influence-t-il votre QI financier ?", o: ["Ils paient vos factures", "On adopte souvent les habitudes de ses proches", "Ils n'ont aucune influence"], c: 1, e: "Le cercle social définit souvent la 'norme' de dépense." },
    { q: "Savoir dire 'no' à un achat impulsif est une preuve de...", o: ["Avarice", "Discipline financière", "Pauvreté"], c: 1, e: "La discipline est la clé du succès." },
    { q: "La règle de base face à une arnaque (Ponzi) est...", o: ["Si c'est trop beau pour être vrai, ça l'est", "Il faut essayer pour savoir", "Faire confiance aux amis"], c: 0, e: "Les rendements miracles sans risque n'existent pas." },
    { q: "Qu'est-ce que 'l'inflation lifestyle' ?", o: ["Augmenter ses dépenses dès que le salaire monte", "Manger plus sainement", "Avoir un style de vie pauvre"], c: 0, e: "C'est le piège qui empêche de devenir riche malgré un bon salaire." },
    { q: "Le coût d'opportunité, c'est...", o: ["Le prix d'un ticket", "Ce à quoi on renonce en faisant un choix", "Une promotion"], c: 1, e: "Dépenser 1000 FBu dans un soda, c'est renoncer à les investir." },
    { q: "L'argent est un 'serviteur' mais un mauvais...", o: ["Ami", "Maître", "Conseiller"], c: 1, e: "Si vous ne dirigez pas votre argent, il vous dirigera." },
    { q: "Quelle émotion pousse souvent à acheter au sommet d'une bulle ?", o: ["La peur de perdre (FOMO)", "La tristesse", "La colère"], c: 0, e: "Le FOMO (Fear Of Missing Out) fait faire de mauvaises affaires." },
    { q: "La patience est une vertu car...", o: ["Elle est gratuite", "Elle permet aux intérêts composés d'agir", "Elle remplace le travail"], c: 1, e: "La richesse se construit sur le temps long." },
    { q: "L'indépendance financière, c'est...", o: ["Travailler 24h/24", "Ne plus dépendre d'un patron pour vivre", "Avoir beaucoup de dettes"], c: 1, e: "Vos actifs paient votre style de vie." },
    { q: "Qu'est-ce qu'une 'dépense invisible' ?", o: ["Un vol", "Les petits frais qui s'accumulent (frais bancaires, etc.)", "Un achat d'art"], c: 1, e: "Ces petites fuites coulent les grands navires financiers." },
    { q: "Le 'Mindset' (état d'esprit) de l'investisseur est...", o: ["Orienté vers la consommation", "Orienté vers la production et l'actif", "Orienté vers la chance"], c: 1, e: "L'investisseur cherche à créer de la valeur." },
    { q: "L'intelligence financière permet surtout de...", o: ["Tricher", "Mieux gérer les risques et opportunités", "Devenir ministre"], c: 1, e: "C'est un outil de discernement." },
    { q: "Un 'passif' peut-il devenir un 'actif' ?", o: ["Jamais", "Oui, s'il commence à rapporter de l'argent", "Seulement si on le vend"], c: 1, e: "Exemple: une voiture personnelle qui devient un taxi." },
    { q: "La 'rat race' (course de rats) décrit...", o: ["Un sport", "Le cycle travailler-payer-dépenser", "Une méthode de vente"], c: 1, e: "C'est l'esclavage financier moderne." },
    { q: "Pour Ismaël, la connaissance était...", o: ["Un fardeau", "La vraie monnaie de sa grand-mère", "Une perte de temps"], c: 1, e: "Savoir comment l'argent marche est le premier investissement." }
  ],

  avance: [
    // --- CONCEPTS AVANCÉS & SCÉNARIOS ---
    { q: "L'effet de levier consiste à...", o: ["Réduire ses dettes", "Utiliser l'emprunt pour investir plus", "Travailler plus"], c: 1, e: "C'est augmenter sa capacité d'investissement grâce à l'endettement." },
    { q: "Le refinancement est le processus par lequel...", o: ["Le client paie", "Les banques empruntent à la Banque Centrale", "L'État augmente les impôts"], c: 1, e: "C'est ainsi que les banques obtiennent des liquidités." },
    { q: "Qu'est-ce que l'inclusion financière ?", o: ["Payer ses impôts", "L'accès aux services financiers pour tous", "Avoir beaucoup d'argent"], c: 1, e: "C'est permettre à chacun d'accéder à l'économie." },
    { q: "L'inflation élevée favorise qui ?", o: ["Les épargnants", "Ceux qui ont des dettes à taux fixe", "Les retraités"], c: 1, e: "La valeur réelle de la dette diminue avec l'inflation." },
    { q: "Le prix du riz augmente partout à Bujumbura. C'est un signe de...", o: ["Croissance", "Inflation", "Prospérité"], c: 1, e: "L'augmentation générale des prix est l'inflation." },
    { q: "L'argent 'Ex-Nihilo' disparaît quand...", o: ["Le banquier part", "La dette est remboursée", "On achète du pain"], c: 1, e: "Le remboursement d'un prêt détruit la monnaie créée." },
    { q: "La liberté financière est atteinte quand...", o: ["On a 1 milliard", "Les revenus passifs couvrent les dépenses", "On n'a plus de compte"], c: 1, e: "C'est ne plus dépendre d'un travail actif pour vivre." },
    { q: "Dépenser pour 'paraître' est souvent...", o: ["Un bon investissement social", "Un piège de l'ego qui crée des passifs", "Obligatoire"], c: 1, e: "C'est sacrifier sa richesse future pour une image immédiate." },
    { q: "Qu'est-ce que la 'monnaie de banque centrale' ?", o: ["Les billets des citoyens", "L'argent utilisé uniquement entre banques (jetons)", "Les pièces de 10 FBu"], c: 1, e: "C'est la base monétaire sécurisée du système." },
    { q: "Si la BRB augmente ses taux directeurs, que se passe-t-il ?", o: ["Le crédit devient moins cher", "Le crédit devient plus cher et l'inflation baisse", "L'argent coule à flot"], c: 1, e: "Cela freine la création monétaire pour stabiliser les prix." },
    { q: "Un 'marché Bear' (Ours) signifie...", o: ["Une forte hausse", "Une chute prolongée des prix", "Un marché fermé"], c: 1, e: "L'ours donne un coup de patte vers le bas." },
    { q: "La 'réserve obligatoire' est un pourcentage...", o: ["De profit", "De dépôts que la banque doit bloquer à la BRB", "De taxes"], c: 1, e: "Cela limite la capacité des banques à prêter trop." },
    { q: "Qu'est-ce qu'une 'obligation du Trésor' ?", o: ["Une pièce d'or", "Un prêt fait à l'État burundais", "Un impôt"], c: 1, e: "C'est une dette publique rémunérée." },
    { q: "Pourquoi l'investissement immobilier est-il populaire ?", o: ["C'est joli", "Il génère des revenus locatifs et peut s'apprécier", "C'est sans risque"], c: 1, e: "C'est un actif tangible et productif." },
    { q: "Les '3 E' de l'investisseur sont...", o: ["Espoir, Épargne, État", "Éducation, Expérience, Excédent", "Énergie, Égalité, Éthique"], c: 1, e: "Sans ces trois-là, l'investissement est un jeu de hasard." },
    { q: "Un investissement spéculatif repose sur...", o: ["La production de richesse", "L'espoir de revendre plus cher à quelqu'un d'autre", "Le travail"], c: 1, e: "C'est souvent risqué (théorie du plus grand imbécile)." },
    { q: "Le 'risque de contrepartie' est le risque que...", o: ["Le prix baisse", "L'autre personne ne rembourse pas sa dette", "La banque ferme le dimanche"], c: 1, e: "C'est le risque de défaut." },
    { q: "Qu'est-ce que le 'spread' ?", o: ["Un gâteau", "La différence entre prix d'achat et prix de vente", "Un taux d'intérêt"], c: 1, e: "C'est la marge de l'intermédiaire." },
    { q: "L'adage 'Ne mettez pas tous vos œufs dans le même panier' prône...", o: ["La concentration", "La diversification", "Le vol"], c: 1, e: "Répartir les risques évite la ruine totale." },
    { q: "Quelle est la fonction d'un 'fonds de pension' ?", o: ["Prêter aux jeunes", "Investir pour payer les retraites futures", "Gérer le budget de l'État"], c: 1, e: "C'est un investisseur institutionnel de long terme." },
    { q: "Qu'est-ce que la 'déflation' ?", o: ["Hausse des prix", "Baisse générale et durable des prix", "Une crevaison"], c: 1, e: "C'est l'inverse de l'inflation, souvent signe de crise." },
    { q: "Un actif 'tangible' est...", o: ["Une action numérique", "Un bien physique (terrain, immeuble, or)", "Une idée"], c: 1, e: "On peut le toucher et il a une valeur intrinsèque." },
    { q: "Le 'benchmark' sert à...", o: ["S'asseoir", "Comparer la performance de son investissement", "Payer moins d'impôts"], c: 1, e: "C'est le point de référence." },
    { q: "Qu'est-ce qu'une 'bulle financière' ?", o: ["Une fête", "Des prix qui montent bien au-delà de la valeur réelle", "Un compte sécurisé"], c: 1, e: "Elle finit toujours par éclater violemment." },
    { q: "La 'solvabilité' d'une personne est...", o: ["Sa gentillesse", "Sa capacité à payer ses dettes à long terme", "Son solde bancaire"], c: 1, e: "C'est la mesure de sa santé financière réelle." },
    { q: "Un investisseur 'Value' cherche des entreprises...", o: ["Très chères", "Sous-évaluées par le marché", "Qui font de la publicité"], c: 1, e: "Acheter 1 dollar pour 50 cents." },
    { q: "Qu'est-ce que l'asymétrie d'information ?", o: ["Quand tout le monde sait tout", "Quand une partie en sait plus que l'autre dans un contrat", "Une erreur de calcul"], c: 1, e: "Cela peut mener à des abus de confiance." },
    { q: "La 'main invisible' de la monnaie scripturale signifie que...", o: ["Elle est magique", "Elle n'existe que par des écritures comptables", "On ne peut pas la voler"], c: 1, e: "Elle circule sans support physique." },
    { q: "Quel est l'impact d'une monnaie forte sur les exportations ?", o: ["Elle les favorise", "Elle les rend plus chères et difficiles", "Aucun impact"], c: 1, e: "Les produits locaux deviennent plus coûteux pour les étrangers." },
    { q: "Le but ultime du livre 'L'Argent Révélé' est de...", o: ["Vendre des livres", "Éradiquer l'illettrisme financier au Burundi", "Devenir banquier"], c: 1, e: "Donner les clés de la liberté à la nouvelle génération." },
    { q: "Quelle leçon Ismaël a-t-il apprise sur l'argent ?", o: ["C'est une fin en soi", "C'est un outil qui demande de la sagesse", "Il faut le garder sous le matelas"], c: 1, e: "L'argent est le reflet de nos choix et de notre éducation." },
    { q: "Un Burundi prospère commence par...", o: ["La chance", "Des citoyens financièrement éduqués", "Plus de dons étrangers"], c: 1, e: "La réussite de tous est notre priorité." }
  ]
};
