// src/config/squadChallenges.ts

export type ChallengeMode = 'SYSTEM' | 'CUSTOM';
export type ChallengeCategory = 'TECH' | 'FIT' | 'BIO' | 'MIND' | 'CUSTOM';

export interface Challenge {
  id: string;
  label: string;
  points: number;
  category: ChallengeCategory;
  description?: string;
}

export const SYSTEM_CHALLENGES: Challenge[] = [
  // TECH & FOCUS
  { id: 'tech_01', label: 'Zéro distraction : 2h sans réseaux sociaux', points: 50, category: 'TECH' },
  { id: 'tech_02', label: 'Blackout : Smartphone éteint 1h avant de dormir', points: 40, category: 'TECH' },
  { id: 'tech_03', label: 'Inbox Zero : Nettoyer ses mails polluants', points: 30, category: 'TECH' },
  
  // PHYSIQUE & BIO
  { id: 'fit_01', label: 'Protocole physique : 30 min d\'entraînement', points: 50, category: 'FIT' },
  { id: 'fit_02', label: 'Endurance : 10 000 pas minimum', points: 40, category: 'FIT' },
  { id: 'bio_01', label: 'Hydratation : 2L d\'eau consommés', points: 30, category: 'BIO' },
  { id: 'bio_02', label: 'Douche Froide : 2 min de protocole cryo', points: 60, category: 'BIO' },
  
  // MENTAL
  { id: 'mind_01', label: 'Focus Mental : 15 min de lecture', points: 50, category: 'MIND' },
  { id: 'mind_02', label: 'Silence : 10 min de méditation profonde', points: 30, category: 'MIND' },
  { id: 'mind_03', label: 'Planification : Noter les 3 tâches de demain', points: 20, category: 'MIND' }
];

// Utilitaire pour obtenir la couleur selon la catégorie
export const getCategoryColor = (cat: ChallengeCategory) => {
  switch (cat) {
    case 'TECH': return 'text-blue-400';
    case 'FIT': return 'text-red-400';
    case 'BIO': return 'text-green-400';
    case 'MIND': return 'text-purple-400';
    default: return 'text-white/50';
  }
};
