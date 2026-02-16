export const SYSTEM_CHALLENGES = [
  { id: 'tech_01', label: 'Zéro distraction : 2h sans réseaux sociaux', points: 50 },
  { id: 'fit_01', label: 'Protocole physique : 30 min d\'entraînement', points: 50 },
  { id: 'mind_01', label: 'Focus Mental : 15 min de lecture/apprentissage', points: 50 },
  { id: 'bio_01', label: 'Hydratation : 2L d\'eau consommés', points: 30 }
];

export type ChallengeMode = 'SYSTEM' | 'CUSTOM';
