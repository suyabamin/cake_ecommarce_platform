import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Cake, FolderTree, PackageCheck, Users, 
  Star, MessageSquare, FileText, ArrowLeft, Shield, Menu, X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { isAdmin, userProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Security guard check
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Shield className="w-16 h-16 text-rose-500" />
        <h2 className="font-serif-title font-bold text-2xl text-gray-900">Access Restricted</h2>
        <p className="text-xs text-gray-500 max-w-md">
          You must be logged in as an Admin or Super Admin to view the administration dashboard.
        </p>
        <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-rose-600 text-white rounded-full text-xs font-bold">
          Return to Storefront
        </button>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Cakes', path: '/admin/cakes', icon: Cake },
    { label: 'Manage Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Manage Orders', path: '/admin/orders', icon: PackageCheck },
    { label: 'Customer Support Chat', path: '/admin/messages', icon: MessageSquare },
    { label: 'Customer Registry', path: '/admin/customers', icon: Users },
    { label: 'Review Moderation', path: '/admin/reviews', icon: Star },
    { label: 'Site Content CMS', path: '/admin/cms', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-rose-50/40 flex flex-col md:flex-row">
      
      {/* Mobile Bar */}
      <div className="md:hidden bg-rose-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-rose-300" />
          <span className="font-serif-title font-bold text-sm">Bakery Admin Portal</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-full md:w-64 bg-slate-900 text-slate-200 p-6 flex flex-col justify-between ${mobileOpen ? 'block' : 'hidden md:flex'}`}>
        <div className="space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <Link to="/" className="flex items-center gap-2 text-rose-400 font-bold text-xs hover:underline mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Exit to Storefront
            </Link>
            <h2 className="font-serif-title font-bold text-xl text-white">Velvet & Frost</h2>
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 block mt-0.5">
              Admin Control Hub
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-rose-600 text-white font-bold shadow-md'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
          <p className="font-semibold text-slate-200">{userProfile?.displayName || 'Admin'}</p>
          <p className="text-[10px] text-rose-400 capitalize">{userProfile?.role || 'admin'}</p>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}
