import { cookies } from 'next/headers';
import Link from 'next/link';
import { adminAuth, adminFirestore } from '@/lib/firebase/admin';
import { Clock, ArrowRight, Target, FileText, CheckCircle2, AlertCircle, LogOut, XCircle } from 'lucide-react';

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
    attempts: attemptsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[],
    quizzes: quizzesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]
  };
}

export default async function DashboardPage() {
  const data = await getUserData();
  if (!data?.user) return <div className="p-8 text-center">Unauthorized access.</div>;

  const { user, attempts, quizzes } = data;
  
  // Security Locks
  const isApproved = user.status === 'approved';
  const isPending = user.status === 'pending';
  const isRejected = user.status === 'rejected';

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div><h1 className="text-xl font-bold text-slate-900 tracking-tight">Student Portal</h1><p className="text-sm text-slate-500">{user.name} • {user.studentId}</p></div>
          <Link href="/logout"><button className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><LogOut className="w-4 h-4 mr-2" />Sign Out</button></Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Dynamic Warning Banners based on Status */}
        {isPending && (
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl mb-8 flex items-start shadow-sm">
            <AlertCircle className="w-6 h-6 text-amber-600 mr-3 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-900 text-lg">Account Pending Approval</h3>
              <p className="text-amber-700 mt-1 leading-relaxed">You can view the assessment syllabus and details below, but your action buttons are locked. You will not be able to start any quizzes until an administrator approves your account.</p>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="bg-red-50 border border-red-200 p-5 rounded-2xl mb-8 flex items-start shadow-sm">
            <XCircle className="w-6 h-6 text-red-600 mr-3 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-900 text-lg">Application Rejected</h3>
              <p className="text-red-700 mt-1 leading-relaxed">Admin Reason: {user.rejectionReason || 'Please contact administration.'}</p>
            </div>
          </div>
        )}

        <div className="mb-6"><h2 className="text-2xl font-bold text-slate-900">Available Assessments</h2></div>

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
              let statusText = 'Not Started'; let StatusIcon = AlertCircle; let statusColor = 'bg-slate-100 text-slate-700 border-slate-200'; let buttonText = 'View Details & Start';
              
              if (attempt) {
                if (attempt.status === 'in-progress') { statusText = 'In Progress'; StatusIcon = Clock; statusColor = 'bg-amber-50 text-amber-700 border-amber-200'; buttonText = 'Resume Assessment'; }
                else { statusText = attempt.passed ? 'Passed' : 'Failed'; StatusIcon = CheckCircle2; statusColor = attempt.passed ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'; buttonText = 'View Results'; }
              }

              // Determine if we wrap the button in a Link, or if it's a dead div (because they are pending)
              const ActionWrapper = isApproved ? Link : 'div';
              const hrefProps = isApproved ? { href: `/quiz/${quiz.id}` } : {};

              return (
                <div key={quiz.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col md:flex-row">
                  <div className="p-6 md:p-8 flex-1 border-b md:border-b-0 md:border-r border-slate-100">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-bold text-slate-900">{quiz.title}</h3><span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}><StatusIcon className="w-3.5 h-3.5 mr-1.5" />{statusText}</span></div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-wrap">{quiz.description}</p>
                    <div className="flex flex-wrap gap-4 mt-auto">
                      <div className="flex items-center text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><FileText className="w-4 h-4 mr-2 text-blue-500" />{quiz.questionCount} Questions</div>
                      <div className="flex items-center text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Clock className="w-4 h-4 mr-2 text-amber-500" />{quiz.timeLimit} Minutes</div>
                      <div className="flex items-center text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Target className="w-4 h-4 mr-2 text-green-500" />{quiz.passingScore}% to Pass</div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 w-full md:w-72 bg-slate-50/50 flex flex-col justify-center items-center text-center">
                    {attempt?.status === 'submitted' || attempt?.status === 'timed-out' ? (
                      <div className="mb-4"><div className="text-sm text-slate-500 font-medium mb-1">Your Score</div><div className={`text-3xl font-bold ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>{attempt.score?.toFixed(1)}%</div></div>
                    ) : null}

                    <ActionWrapper {...hrefProps as any} className="w-full mt-auto md:mt-0">
                      <button 
                        disabled={!isApproved}
                        className={`w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 ${
                          !isApproved 
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                            : (statusText === 'Not Started' || statusText === 'In Progress'
                                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50')
                        }`}
                      >
                        {isApproved ? buttonText : 'Locked (Pending)'}
                        {isApproved && <ArrowRight className="w-4 h-4 ml-2" />}
                      </button>
                    </ActionWrapper>
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
