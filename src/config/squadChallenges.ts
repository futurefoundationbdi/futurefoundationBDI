export type ChallengeMode = 'SYSTEM' | 'CUSTOM';

export interface Challenge {
  id: string;
  label: string;
  points: number;
  description?: string;
}

export const SYSTEM_CHALLENGES: Challenge[] = [
  // TECH & FOCUS
  { id: 'tech_01', label: 'Zéro distraction : 2h sans réseaux sociaux', points: 50 },
  { id: 'tech_02', label: 'Blackout : Smartphone éteint 1h avant de dormir', points: 40 },
  { id: 'tech_03', label: 'Inbox Zero : Nettoyer ses mails polluants', points: 30 },
  
  // PHYSIQUE & BIO
  { id: 'fit_01', label: 'Protocole physique : 30 min d\'entraînement', points: 50 },
  { id: 'fit_02', label: 'Endurance : 10 000 pas minimum', points: 40 },
  { id: 'bio_01', label: 'Hydratation : 2L d\'eau consommés', points: 30 },
  { id: 'bio_02', label: 'Douche Froide : 2 min de protocole cryo', points: 60 },
  
  // MENTAL
  { id: 'mind_01', label: 'Focus Mental : 15 min de lecture/apprentissage', points: 50 },
  { id: 'mind_02', label: 'Silence : 10 min de méditation profonde', points: 30 },
  { id: 'mind_03', label: 'Planification : Noter les 3 tâches clés de demain', points: 20 }
];
