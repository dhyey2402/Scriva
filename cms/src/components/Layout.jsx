import React, { useState } from 'react';
import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, UserCircle, Wrench, FolderKanban, 
  FileText, Briefcase, MessageSquare, Award, GraduationCap, 
  Link as LinkIcon, LogOut, Menu, X
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'About / Profile', href: '/profile', icon: UserCircle },
    { name: 'Skills', href: '/skills', icon: Wrench },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Blogs', href: '/blogs', icon: FileText },
    { name: 'Experience', href: '/experience', icon: Briefcase },
    { name: 'Testimonials', href: '/testimonials', icon: MessageSquare },
    { name: 'Services', href: '/services', icon: Award },
    { name: 'Education', href: '/education', icon: GraduationCap },
    { name: 'Social Links', href: '/social-links', icon: LinkIcon },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-4 left-4 z-50 w-72 h-[calc(100vh-2rem)] bg-gray-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] text-gray-300 transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 lg:static flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-[120%]'}`}>
        
        {/* Logo Area */}
        <div className="flex items-center justify-between p-6 mt-2">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 transform hover:scale-110 transition-transform duration-300">
              <span className="text-white font-black text-lg">S</span>
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-black text-2xl tracking-widest">SCRIVA</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar px-4">
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 ease-out overflow-hidden ${
                      isActive
                        ? 'text-white bg-white/10 shadow-inner border border-white/5'
                        : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'opacity-100' : ''}`} />
                      
                      <div className={`mr-4 p-2 rounded-xl transition-all duration-300 relative z-10 ${isActive ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20 scale-110' : 'bg-gray-800/50 group-hover:bg-gray-700/50'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <span className="relative z-10 tracking-wide">{item.name}</span>
                      
                      {isActive && (
                        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_2px_rgba(168,85,247,0.4)]" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-4 mx-4 mb-4 mt-2">
          <button
            onClick={logout}
            className="group relative flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-red-400 rounded-2xl bg-red-950/30 border border-red-900/50 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <LogOut className="mr-2 h-4 w-4 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="relative z-10">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

const Header = ({ setIsOpen }) => {
  const location = useLocation();
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    const segment = path.split('/')[1];
    return segment ? segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ') : '';
  };

  return (
    <header className="lg:hidden flex items-center justify-between h-20 px-6 mt-4 mx-4 bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl shadow-lg">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
      >
        <Menu size={20} />
      </button>
      <h1 className="text-lg font-bold text-white tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">{getPageTitle()}</h1>
      <div className="w-9" />
    </header>
  );
};

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[#0a0a0f] font-sans text-gray-100 overflow-hidden relative">
      {/* Ambient background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />

      <div className="flex h-full w-full relative z-10">
        <div className="h-full lg:p-4 lg:pr-0">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        </div>
        
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <Header setIsOpen={setSidebarOpen} />
          
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
