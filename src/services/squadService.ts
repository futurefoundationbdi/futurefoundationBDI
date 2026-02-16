// src/services/squadService.ts

const REGISTRY_KEY = 'global_units_registry';
const MY_SQUADS_KEY = 'all_my_squads';
const MESSAGES_PREFIX = 'squad_msg_';
const MEMBERS_PREFIX = 'squad_members_count_';
const CHALLENGE_PREFIX = 'squad_current_challenge_'; // Nouveau : stockage du défi actif

export type ChallengeMode = 'SYSTEM' | 'CUSTOM';

export interface CustomChallenge {
  label: string;
  points: number;
  setAt: string;
}

export const squadService = {
  // --- REGISTRE GLOBAL ---
  getGlobalRegistry(): any[] {
    return JSON.parse(localStorage.getItem(REGISTRY_KEY) || '[]');
  },

  exists(code: string): boolean {
    const registry = this.getGlobalRegistry();
    return registry.some(unit => unit.id === code.toUpperCase().trim());
  },

  getUnitData(code: string) {
    const registry = this.getGlobalRegistry();
    return registry.find(unit => unit.id === code.toUpperCase().trim());
  },

  registerUnit(code: string, max: number, duration: number, challengeMode: ChallengeMode): void {
    const registry = this.getGlobalRegistry();
    const cleanCode = code.toUpperCase().trim();
    
    if (!this.exists(cleanCode)) {
      const newUnit = { 
        id: cleanCode, 
        max: max, 
        duration: duration, 
        challengeMode: challengeMode,
        createdAt: new Date().toISOString() 
      };
      localStorage.setItem(REGISTRY_KEY, JSON.stringify([...registry, newUnit]));
      localStorage.setItem(`${MEMBERS_PREFIX}${cleanCode}`, "1");
    }
  },

  // --- GESTION DES DÉFIS (Nouveau) ---
  
  // Sauvegarder le défi (qu'il soit Custom ou tiré du Système)
  setSquadChallenge(code: string, challenge: CustomChallenge): void {
    localStorage.setItem(`${CHALLENGE_PREFIX}${code}`, JSON.stringify(challenge));
    window.dispatchEvent(new Event('squad_update')); // Informe les composants du changement
  },

  // Récupérer le défi actuel
  getSquadChallenge(code: string): CustomChallenge | null {
    const data = localStorage.getItem(`${CHALLENGE_PREFIX}${code}`);
    return data ? JSON.parse(data) : null;
  },

  // --- GESTION DES MEMBRES ---
  getMemberCount(code: string): number {
    return parseInt(localStorage.getItem(`${MEMBERS_PREFIX}${code}`) || "0");
  },

  addMember(code: string): void {
    const count = this.getMemberCount(code);
    const unit = this.getUnitData(code);
    
    if (unit && count < unit.max) {
      localStorage.setItem(`${MEMBERS_PREFIX}${code}`, (count + 1).toString());
      window.dispatchEvent(new Event('squad_update'));
    }
  },

  // --- SYSTÈME DE CHAT ---
  getMessages(code: string): any[] {
    return JSON.parse(localStorage.getItem(`${MESSAGES_PREFIX}${code}`) || '[]');
  },

  sendMessage(code: string, text: string, userName: string): any[] {
    const messages = this.getMessages(code);
    const newMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      user_name: userName,
      timestamp: new Date().toISOString()
    };
    const updated = [...messages, newMessage];
    localStorage.setItem(`${MESSAGES_PREFIX}${code}`, JSON.stringify(updated));
    window.dispatchEvent(new Event('squad_message_received'));
    return updated;
  },

  // --- GESTION PERSONNELLE ---
  getMySquads(): string[] {
    return JSON.parse(localStorage.getItem(MY_SQUADS_KEY) || '[]');
  },

  saveToMySquads(code: string): void {
    const squads = this.getMySquads();
    if (!squads.includes(code)) {
      localStorage.setItem(MY_SQUADS_KEY, JSON.stringify([...squads, code]));
    }
  },

  removeFromMySquads(code: string): string[] {
    const filtered = this.getMySquads().filter(id => id !== code);
    localStorage.setItem(MY_SQUADS_KEY, JSON.stringify(filtered));
    // Optionnel: On pourrait nettoyer le localStorage ici pour cette squad
    return filtered;
  }
};
