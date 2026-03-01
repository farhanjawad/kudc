import { useState, useEffect } from 'react';

export function useCountdown(startedAtMs: number, timeLimitMinutes: number, onExpire: () => void) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  
  useEffect(() => {
    const endTimeMs = startedAtMs + (timeLimitMinutes * 60 * 1000);
    
    const calculateRemaining = () => {
      const remaining = Math.max(0, Math.floor((endTimeMs - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining === 0) onExpire();
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [startedAtMs, timeLimitMinutes, onExpire]);

  const totalSeconds = timeLimitMinutes * 60;
  let urgencyLevel: 'normal' | 'amber' | 'red' = 'normal';
  
  if (secondsRemaining <= totalSeconds * 0.1) {
    urgencyLevel = 'red';
  } else if (secondsRemaining <= totalSeconds * 0.2) {
    urgencyLevel = 'amber';
  }

  return { secondsRemaining, isExpired: secondsRemaining === 0, urgencyLevel };
}
