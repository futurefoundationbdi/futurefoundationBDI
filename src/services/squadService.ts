// src/services/squadService.ts
import { supabase } from './supabaseClient'; // Vérifie bien le nom du fichier importé

const MY_SQUADS_KEY = 'all_my_squads';

export type ChallengeMode = 'SYSTEM' | 'CUSTOM';

export interface CustomChallenge {
  label: string;
  points: number;
  setAt: string;
}

export const squadService = {
  // --- SYNC AVEC SUPABASE ---

  // Vérifier si une unité existe pour tout le monde
  async exists(code: string): Promise<boolean> {
    const cleanCode = code.toUpperCase().trim();
    const { data, error } = await supabase
      .from('squads')
      .select('id')
      .eq('id', cleanCode)
      .single();
    
    if (error && error.code !== 'PGRST116') console.error("Erreur Supabase:", error);
    return !!data;
  },

  // Récupérer les données d'une unité depuis le serveur
  async getUnitData(code: string) {
    const cleanCode = code.toUpperCase().trim();
    const { data, error } = await supabase
      .from('squads')
      .select('*')
      .eq('id', cleanCode)
      .single();
    
    return data;
  },

  // Enregistrer l'unité sur le serveur (pour que les amis la voient)
  async registerUnit(code: string, max: number, duration: number, challengeMode: ChallengeMode): Promise<void> {
    const cleanCode = code.toUpperCase().trim();
    
    // On l'insère dans Supabase
    const { error } = await supabase
      .from('squads')
      .insert([{ 
        id: cleanCode, 
        max_members: max, 
        duration: duration, 
        challenge_mode: challengeMode 
      }]);

    if (!error) {
      // On l'ajoute aussi à notre liste personnelle locale pour s'en souvenir
      this.saveToMySquads(cleanCode);
    } else {
      console.error("Impossible de créer l'escouade sur Supabase:", error.message);
      throw new Error("Erreur de création serveur");
    }
  },

  // --- GESTION PERSONNELLE (Local) ---
  // On garde cette partie en LocalStorage pour que le téléphone se souvienne de NOS squads
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

  // NOTE : Pour simplifier l'étape 1, j'ai retiré le chat et les scores. 
  // On les rajoutera une fois que la connexion de base fonctionne !
};
