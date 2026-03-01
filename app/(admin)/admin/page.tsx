import { redirect } from 'next/navigation';

/**
 * Root page — immediately redirects to the login page.
 * Middleware handles authenticated users and routes them appropriately.
 */
export default function RootPage() {
  redirect('/admin/dashboard');
}
