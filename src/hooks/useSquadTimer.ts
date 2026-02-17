// src/hooks/useSquadTimer.ts
import { useState, useEffect } from 'react';

export const useSquadTimer = (squadId: string | null, isFull: boolean, hasChallenge: boolean) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    // La logique : On ne lance le chrono QUE si l'unité est pleine ET qu'un défi existe
    if (!squadId || !isFull || !hasChallenge) {
      setTimeLeft(null);
      return;
    }

    const calculateTime = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);

      const diff = midnight.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("EXPIRED");
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setIsUrgent(h < 1); // Alerte rouge si moins d'une heure
      
      setTimeLeft(
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      );
    };

    const timer = setInterval(calculateTime, 1000);
    calculateTime();

    return () => clearInterval(timer);
  }, [squadId, isFull, hasChallenge]);

  return { timeLeft, isUrgent };
};
