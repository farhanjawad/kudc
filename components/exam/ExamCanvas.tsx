'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCountdown } from '@/lib/hooks/useCountdown';
import { useAutoSave } from '@/lib/hooks/useAutoSave';
import { useExamGuard } from '@/lib/hooks/useExamGuard';
import { submitAttempt } from '@/lib/actions/quiz';

interface Props { attemptId: string; quiz: any; questions: any[]; initialAnswers: Record<string, string>; startedAtMs: number; }

export function ExamCanvas({ attemptId, quiz, questions, initialAnswers, startedAtMs }: Props) {
  const router = useRouter();
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [isPending, startTransition] = useTransition();

  const currentQuestion = questions[currentQIdx];
  const currentAnswer = answers[currentQuestion.id];
  const { saveStatus } = useAutoSave(attemptId, currentQuestion.id, currentAnswer);
  
  const handleAutoSubmit = () => {
    startTransition(async () => { await submitAttempt(attemptId, true); router.push(`/quiz/${quiz.id}/result?attemptId=${attemptId}`); });
  };

  const { isWarningVisible } = useExamGuard(attemptId, handleAutoSubmit);
  const { secondsRemaining } = useCountdown(startedAtMs, quiz.timeLimit, handleAutoSubmit);

  const handleSubmitQuiz = () => {
    if (confirm("Are you sure you want to submit?")) {
      startTransition(async () => { await submitAttempt(attemptId, false); router.push(`/quiz/${quiz.id}/result?attemptId=${attemptId}`); });
    }
  };

  if (isPending) return <div className="p-12 text-center text-xl font-bold text-slate-800">Submitting...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-4 md:p-8">
      {isWarningVisible && <div className="bg-red-600 text-white p-3 mb-4 rounded font-bold">WARNING: Tab switch detected!</div>}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">{quiz.title} (Time left: {Math.floor(secondsRemaining/60)}:{secondsRemaining%60})</h1>
        <div className="text-sm font-medium">{saveStatus === 'saving' ? 'Saving...' : 'Saved'}</div>
      </header>
      
      <main className="bg-white p-8 rounded-xl shadow-sm flex-1">
        <h2 className="text-xl font-medium mb-6">{currentQIdx + 1}. {currentQuestion.text}</h2>
        <div className="space-y-4 mb-8">
          {currentQuestion.options.map((opt: any) => (
            <button key={opt.id} onClick={() => setAnswers(p => ({ ...p, [currentQuestion.id]: opt.id }))} 
              className={`w-full text-left p-4 rounded-xl border-2 ${currentAnswer === opt.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
              {opt.text}
            </button>
          ))}
        </div>
        <div className="flex justify-between">
          <button disabled={currentQIdx === 0} onClick={() => setCurrentQIdx(p => p - 1)} className="px-6 py-2 border rounded-lg">Prev</button>
          {currentQIdx < questions.length - 1 
            ? <button onClick={() => setCurrentQIdx(p => p + 1)} className="px-6 py-2 bg-slate-900 text-white rounded-lg">Next</button>
            : <button onClick={handleSubmitQuiz} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">Submit</button>}
        </div>
      </main>
    </div>
  );
}
