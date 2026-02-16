// src/services/squadService.ts

const REGISTRY_KEY = 'global_units_registry';
const MY_SQUADS_KEY = 'all_my_squads';
const MESSAGES_PREFIX = 'squad_msg_';
const MEMBERS_PREFIX = 'squad_members_count_';

export type ChallengeMode = 'SYSTEM' | 'CUSTOM';

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

  // AJOUT : challengeMode inclus lors de l'enregistrement
  registerUnit(code: string, max: number, duration: number, challengeMode: ChallengeMode): void {
    const registry = this.getGlobalRegistry();
    const cleanCode = code.toUpperCase().trim();
    
    if (!this.exists(cleanCode)) {
      const newUnit = { 
        id: cleanCode, 
        max: max, 
        duration: duration, 
        challengeMode: challengeMode, // "SYSTEM" ou "CUSTOM"
        createdAt: new Date().toISOString() 
      };
      localStorage.setItem(REGISTRY_KEY, JSON.stringify([...registry, newUnit]));
      
      // Le créateur est automatiquement le premier membre
      localStorage.setItem(`${MEMBERS_PREFIX}${cleanCode}`, "1");
    }
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
      // On déclenche un événement pour mettre à jour l'UI des autres membres
      window.dispatchEvent(new Event('squad_update'));
    }
  },

  // --- SYSTÈME DE CHAT OPTIMISÉ ---
  getMessages(code: string): any[] {
    return JSON.parse(localStorage.getItem(`${MESSAGES_PREFIX}${code}`) || '[]');
  },

  sendMessage(code: string, text: string, userName: string): any[] {
    const messages = this.getMessages(code);
    const newMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ID plus unique
      text,
      user_name: userName,
      timestamp: new Date().toISOString()
    };
    const updated = [...messages, newMessage];
    localStorage.setItem(`${MESSAGES_PREFIX}${code}`, JSON.stringify(updated));
    
    // GARANTIE INSTANTANÉE : Déclenche un événement global pour l'UI
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
    return filtered;
  }
};
