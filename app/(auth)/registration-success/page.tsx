'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { User, UserRound } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const gender = searchParams.get('gender') || 'other';

  const isMale = gender === 'male';
  const isFemale = gender === 'female';

  // Dynamic content tailored to gender
  const greeting = isMale ? "Assalamualikum, Brother!" : isFemale ? "Assalamualikum, Sister!" : "Welcome!";
  const subText = "We are thrilled to welcome you to our jourey in exploring the life of our beloved Prohet(S).";

  const Icon = isFemale ? UserRound : User;
  const themeColor = isMale ? 'text-blue-600 bg-blue-100' : isFemale ? 'text-pink-600 bg-pink-100' : 'text-indigo-600 bg-indigo-100';
  const btnColor = isMale ? 'bg-blue-600 hover:bg-blue-700' : isFemale ? 'bg-pink-600 hover:bg-pink-700' : 'bg-indigo-600 hover:bg-indigo-700';

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
      <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${themeColor}`}>
        <Icon className="w-10 h-10" />
      </div>
      
      <h1 className="text-3xl font-bold text-slate-900 mb-3">{greeting}</h1>
      
      <p className="text-slate-600 mb-4 leading-relaxed text-sm">
        {subText}
      </p>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-left">
        <p className="text-amber-800 text-sm">
          <strong>Account Pending Approval</strong><br/>
          Your application has been successfully submitted. You may proceed to your dashboard to view the upcoming syllabus, but you cannot take any assessments until an admin approves your account.
        </p>
      </div>

      <Link href="/dashboard">
        <button className={`w-full py-3.5 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg ${btnColor}`}>
          Proceed to Dashboard
        </button>
      </Link>
    </div>
  );
}

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Suspense is strictly required by Next.js 15 when using useSearchParams in Client Components */}
      <Suspense fallback={<div className="animate-pulse w-full max-w-md h-64 bg-slate-200 rounded-2xl"></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
