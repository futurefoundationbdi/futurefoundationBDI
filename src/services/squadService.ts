// src/services/squadService.ts

const REGISTRY_KEY = 'global_units_registry';
const MY_SQUADS_KEY = 'all_my_squads';

export const squadService = {
  // Récupérer la liste de TOUTES les unités créées (simulation base de données)
  getGlobalRegistry(): string[] {
    return JSON.parse(localStorage.getItem(REGISTRY_KEY) || '[]');
  },

  // Vérifier si un code existe dans le système
  exists(code: string): boolean {
    const registry = this.getGlobalRegistry();
    return registry.includes(code.toUpperCase().trim());
  },

  // Enregistrer officiellement une nouvelle unité
  registerUnit(code: string): void {
    const registry = this.getGlobalRegistry();
    if (!registry.includes(code)) {
      localStorage.setItem(REGISTRY_KEY, JSON.stringify([...registry, code]));
    }
  },

  // Gérer mes unités personnelles (Max 2)
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
