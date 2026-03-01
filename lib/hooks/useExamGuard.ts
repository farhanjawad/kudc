import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/client';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';

export function useExamGuard(attemptId: string, autoSubmitCallback: () => void) {
  const [focusLossCount, setFocusLossCount] = useState(0);
  const [isWarningVisible, setIsWarningVisible] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        const newCount = focusLossCount + 1;
        setFocusLossCount(newCount);
        setIsWarningVisible(true);

        const attemptRef = doc(db, 'attempts', attemptId);
        await updateDoc(attemptRef, {
          focusLossEvents: arrayUnion({ 
            timestamp: Timestamp.now(), 
            count: newCount 
          })
        }).catch(console.error);

        if (newCount >= 5) {
          autoSubmitCallback();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [attemptId, focusLossCount, autoSubmitCallback]);

  return { focusLossCount, isWarningVisible, setIsWarningVisible };
}
