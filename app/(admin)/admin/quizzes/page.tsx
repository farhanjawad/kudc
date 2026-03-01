import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { adminAuth, adminFirestore } from '@/lib/firebase/admin';
import { Plus, Edit2, FileText } from 'lucide-react';

export const revalidate = 0;

async function getQuizzes() {
  const sessionCookie = (await cookies()).get('__session')?.value;
  if (!sessionCookie) redirect('/login');
  
  const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
  if (decodedToken.role !== 'admin') redirect('/dashboard');

  const quizzesSnap = await adminFirestore.collection('quizzes').orderBy('createdAt', 'desc').get();
  return quizzesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function AdminQuizzesPage() {
  const quizzes = await getQuizzes();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quiz Management</h1>
          <p className="text-slate-500">Create, edit, and publish assessments.</p>
        </div>
        <Link href="/admin/quizzes/new">
          <button className="flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5 mr-2" /> Create Quiz
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {quizzes.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <FileText className="w-12 h-12 text-slate-300 mb-4" />
            <p>No quizzes have been created yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr><th className="px-6 py-4">Title & Details</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Config</th></tr>
              </thead>
              <tbody>
                {quizzes.map((quiz: any) => (
                  <tr key={quiz.id} className="border-b border-slate-100">
                    <td className="px-6 py-4"><div className="font-medium">{quiz.title}</div><div className="text-slate-500 text-xs truncate max-w-xs">{quiz.description}</div></td>
                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${quiz.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>{quiz.status.toUpperCase()}</span></td>
                    <td className="px-6 py-4"><div className="text-slate-700">{quiz.questionCount} Questions</div><div className="text-slate-500 text-xs">{quiz.timeLimit} mins</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
