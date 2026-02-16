// src/services/squadService.ts

const REGISTRY_KEY = 'global_units_registry';
const MY_SQUADS_KEY = 'all_my_squads';

export const squadService = {
  // Récupérer tous les codes existants dans le "système"
  getGlobalRegistry(): string[] {
    return JSON.parse(localStorage.getItem(REGISTRY_KEY) || '[]');
  },

  // Vérifier si un code d'unité existe
  exists(code: string): boolean {
    const registry = this.getGlobalRegistry();
    return registry.includes(code.toUpperCase().trim());
  },

  // Enregistrer une nouvelle unité dans le système
  registerNewUnit(code: string): void {
    const registry = this.getGlobalRegistry();
    if (!registry.includes(code)) {
      localStorage.setItem(REGISTRY_KEY, JSON.stringify([...registry, code]));
    }
  },

  // Ajouter une unité à ma liste personnelle
  addToMySquads(code: string): void {
    const mySquads = JSON.parse(localStorage.getItem(MY_SQUADS_KEY) || '[]');
    if (!mySquads.includes(code)) {
      const updated = [...mySquads, code];
      localStorage.setItem(MY_SQUADS_KEY, JSON.stringify(updated));
    }
  }
};
