import { useEffect, useState, useRef } from 'react';
import { db } from '@/lib/firebase/client';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

export function useAutoSave(attemptId: string, currentQuestionId: string, answer: string | undefined) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const timeoutRef = useRef<NodeJS.Timeout>();
  const initialMount = useRef(true);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }

    if (!answer) return;

    setSaveStatus('saving');
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        const draftRef = doc(db, 'attempts', attemptId, 'draft_responses', currentQuestionId);
        await setDoc(draftRef, {
          selectedOptionId: answer,
          savedAt: Timestamp.now()
        });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error("Auto-save failed", error);
        setSaveStatus('error');
      }
    }, 800);

    return () => clearTimeout(timeoutRef.current);
  }, [answer, attemptId, currentQuestionId]);

  return { saveStatus };
}
