import type { Metadata } from 'next';
import AdminNavbar from '@/components/admin/AdminNavbar';

export const metadata: Metadata = {
  title: 'Admin Console - LMS',
  description: 'Manage users, quizzes, and view results securely.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AdminNavbar />
      <main className="flex-1 w-full relative">
        {children}
      </main>
    </div>
  );
}
