import { cookies } from 'next/headers';
import Link from 'next/link';
import { adminAuth, adminFirestore } from '@/lib/firebase/admin';
import { Clock, ArrowRight, Target, FileText, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';

export const revalidate = 60;

async function getUserData() {
  const sessionCookie = (await cookies()).get('__session')?.value;
  if (!sessionCookie) return null;
  
  const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
  
  const [userDoc, attemptsSnap, quizzesSnap] = await Promise.all([
    adminFirestore.collection('users').doc(decodedToken.uid).get(),
    adminFirestore.collection('attempts').where('uid', '==', decodedToken.uid).get(),
    adminFirestore.collection('quizzes').where('status', '==', 'published').get()
  ]);

  return {
    user: userDoc.data(),
    attempts: attemptsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    quizzes: quizzesSnap.docs.map(d => ({ id: d.id, ...d.data() }))
  };
}

export default async function DashboardPage() {
  const data = await getUserData();
  if (!data?.user) return <div className="p-8 text-center">Unauthorized access.</div>;

  const { user, attempts, quizzes } = data;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Student Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student Portal</h1>
            <p className="text-sm text-slate-500">{user.name} • {user.studentId}</p>
          </div>
          <Link href="/logout">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </Link>
        </div>
      </nav>

      {/* Main Content: Quiz Details */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Available Assessments</h2>
          <p className="text-slate-500 mt-1">Select an exam below to view details and begin your attempt.</p>
        </div>

        {quizzes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No Assessments Available</h3>
            <p className="text-slate-500 mt-1">There are currently no published quizzes for your discipline.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {quizzes.map((quiz: any) => {
              const attempt = attempts.find((a: any) => a.quizId === quiz.id);
              let statusText = 'Not Started';
              let StatusIcon = AlertCircle;
              let statusColor = 'bg-slate-100 text-slate-700 border-slate-200';
              let buttonText = 'View Details & Start';
              
              if (attempt) {
                if (attempt.status === 'in-progress') {
                  statusText = 'In Progress';
                  StatusIcon = Clock;
                  statusColor = 'bg-amber-50 text-amber-700 border-amber-200';
                  buttonText = 'Resume Assessment';
                } else {
                  statusText = attempt.passed ? 'Passed' : 'Failed';
                  StatusIcon = CheckCircle2;
                  statusColor = attempt.passed 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-red-50 text-red-700 border-red-200';
                  buttonText = 'View Results';
                }
              }

              return (
                <div key={quiz.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col md:flex-row">
                  
                  {/* Left Column: Quiz Info */}
                  <div className="p-6 md:p-8 flex-1 border-b md:border-b-0 md:border-r border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-900">{quiz.title}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
                        <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                        {statusText}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                      {quiz.description}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-auto">
                      <div className="flex items-center text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <FileText className="w-4 h-4 mr-2 text-blue-500" />
                        {quiz.questionCount} Questions
                      </div>
                      <div className="flex items-center text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <Clock className="w-4 h-4 mr-2 text-amber-500" />
                        {quiz.timeLimit} Minutes
                      </div>
                      <div className="flex items-center text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <Target className="w-4 h-4 mr-2 text-green-500" />
                        {quiz.passingScore}% to Pass
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Action Area */}
                  <div className="p-6 md:p-8 w-full md:w-72 bg-slate-50/50 flex flex-col justify-center items-center text-center">
                    {attempt?.status === 'submitted' || attempt?.status === 'timed-out' ? (
                      <div className="mb-4">
                        <div className="text-sm text-slate-500 font-medium mb-1">Your Score</div>
                        <div className={`text-3xl font-bold ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                          {attempt.score?.toFixed(1)}%
                        </div>
                      </div>
                    ) : null}

                    <Link href={`/quiz/${quiz.id}`} className="w-full mt-auto md:mt-0">
                      <button className={`w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 ${
                        statusText === 'Not Started' || statusText === 'In Progress'
                          ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}>
                        {buttonText}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
