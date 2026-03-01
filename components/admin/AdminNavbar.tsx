'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, BarChart, LogOut, ShieldAlert } from 'lucide-react';

export default function AdminNavbar() {
  const pathname = usePathname();
  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Quizzes', href: '/admin/quizzes', icon: FileText },
    { name: 'Results', href: '/admin/results', icon: BarChart },
  ];

  return (
    <nav className="bg-slate-900 text-slate-300 border-b border-slate-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-2 text-white font-bold text-lg">
            <div className="p-1.5 bg-blue-500/10 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-blue-500" />
            </div>
            <span className="hidden sm:block tracking-tight">Admin Console</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1 flex-1 justify-center">
            {links.map(link => {
              const Icon = link.icon;
              // Precise active state matching
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'hover:bg-slate-800 hover:text-white text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className="flex items-center">
            <Link 
              href="/logout" 
              className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2 sm:mr-0 md:mr-2" /> 
              <span className="hidden sm:block">Sign Out</span>
            </Link>
          </div>

        </div>

        {/* Mobile Navigation (Scrollable horizontally) */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-2 pb-3 hide-scrollbar">
          {links.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`flex items-center whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5 mr-1.5" />
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
