import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Users, MailCheck, FileSpreadsheet, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';

const navItems = [
  { to: '/admin/leads', label: 'Leads', icon: Users, desc: 'Contact inquiries' },
  { to: '/admin/subscribers', label: 'Subscribers', icon: MailCheck, desc: 'Newsletter signups' },
  { to: '/admin/brochure-requests', label: 'Brochure Requests', icon: FileSpreadsheet, desc: 'Dossier downloads' },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin/login', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-wider text-white">ATM MALL</span>
                <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                  Admin Portal
                </span>
              </div>
            </div>
          </div>

          {/* User badge + Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Admin Email Badge */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-medium text-slate-200">{user?.email || 'Admin User'}</span>
              <span className="text-[10px] text-slate-400">Authenticated</span>
            </div>

            {/* Public Site Link */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
              title="Open public website in a new tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden md:inline">View Site</span>
            </a>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20 hover:border-red-500/30 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-slate-800/60 bg-slate-900/50">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 sm:px-6 lg:px-8 py-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-400">
        ATM MALL &copy; {new Date().getFullYear()} — Internal Admin Dashboard
      </footer>
    </div>
  );
}
