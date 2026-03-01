import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, adminFirestore } from '@/lib/firebase/admin';
import ExportCSVButton from '@/components/admin/ExportCSVButton';

export const revalidate = 0;

export default async function AdminResultsPage() {
  const sessionCookie = (await cookies()).get('__session')?.value;
  if (!sessionCookie) redirect('/login');
  const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
  if (decodedToken.role !== 'admin') redirect('/dashboard');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Grade Ledger</h1>
        <ExportCSVButton />
      </div>
      <div className="bg-white p-8 rounded shadow text-slate-500">
        Results export ready. Use the button above to generate a full server-side CSV payload.
      </div>
    </div>
  );
}
