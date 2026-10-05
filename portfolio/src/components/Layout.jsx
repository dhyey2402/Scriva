import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight, ArrowRight } from 'lucide-react';
import { CMS_URL, LIVE_PORTFOLIO_URL } from '../constants';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnchorClick = (e, targetId) => {
    if (isHomePage) {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-5 pointer-events-none">
      <header
        className={`w-full max-w-5xl pointer-events-auto transition-all duration-500 rounded-2xl ${
          isScrolled
            ? 'glass-nav py-2.5 px-4 sm:px-6 shadow-2xl'
            : 'glass-nav py-3 px-5 sm:px-7'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand Mark — Premium Gold */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 border border-amber-400/20 flex items-center justify-center group-hover:border-amber-400/40 group-hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] transition-all duration-300">
              <span className="font-serif text-amber-300 text-lg font-bold italic">S</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold tracking-[0.12em] text-sm text-white font-sans uppercase">SCRIVA</span>
              <span className="text-[10px] font-mono text-amber-400/60 uppercase tracking-widest hidden sm:inline">CMS</span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5 text-[13px] font-medium text-gray-400">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-white/[0.08] shadow-sm'
                    : 'hover:text-white hover:bg-white/[0.04]'
                }`
              }
            >
              Overview
            </NavLink>
            <a
              href="/#features"
              onClick={(e) => handleAnchorClick(e, 'features')}
              className="px-3.5 py-1.5 rounded-xl hover:text-white hover:bg-white/[0.04] transition-all duration-300"
            >
              Control Room
            </a>
            <a
              href="/#workflow"
              onClick={(e) => handleAnchorClick(e, 'workflow')}
              className="px-3.5 py-1.5 rounded-xl hover:text-white hover:bg-white/[0.04] transition-all duration-300"
            >
              Workflow
            </a>
            <a
              href="/#architecture"
              onClick={(e) => handleAnchorClick(e, 'architecture')}
              className="px-3.5 py-1.5 rounded-xl hover:text-white hover:bg-white/[0.04] transition-all duration-300"
            >
              Architecture
            </a>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-white/[0.08] shadow-sm'
                    : 'hover:text-white hover:bg-white/[0.04]'
                }`
              }
            >
              Portfolio
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-white/[0.08] shadow-sm'
                    : 'hover:text-white hover:bg-white/[0.04]'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Right Action Capsules */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href={CMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-gray-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/20 transition-all duration-300"
            >
              <span>Open CMS</span>
              <ArrowUpRight size={13} className="text-amber-400" />
            </a>
            <a
              href={LIVE_PORTFOLIO_URL}
              className="btn-primary inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold"
            >
              <span>Live Output</span>
              <ArrowRight size={13} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/projects"
              className="btn-primary px-3.5 py-1 rounded-xl text-xs font-bold"
            >
              Portfolio
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/[0.05] border border-white/10 transition-all"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-white/10 space-y-1 text-sm font-medium animate-fade-in">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-xl transition-all ${isActive ? 'text-white bg-white/[0.08]' : 'text-gray-400 hover:text-white'}`
              }
            >
              Overview
            </NavLink>
            <a
              href="/#features"
              onClick={(e) => {
                setIsOpen(false);
                handleAnchorClick(e, 'features');
              }}
              className="block px-3 py-2.5 rounded-xl text-gray-400 hover:text-white transition-all"
            >
              Control Room
            </a>
            <a
              href="/#workflow"
              onClick={(e) => {
                setIsOpen(false);
                handleAnchorClick(e, 'workflow');
              }}
              className="block px-3 py-2.5 rounded-xl text-gray-400 hover:text-white transition-all"
            >
              Publishing Workflow
            </a>
            <a
              href="/#architecture"
              onClick={(e) => {
                setIsOpen(false);
                handleAnchorClick(e, 'architecture');
              }}
              className="block px-3 py-2.5 rounded-xl text-gray-400 hover:text-white transition-all"
            >
              Architecture
            </a>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-xl transition-all ${isActive ? 'text-white bg-white/[0.08]' : 'text-gray-400 hover:text-white'}`
              }
            >
              Public Portfolio
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-xl transition-all ${isActive ? 'text-white bg-white/[0.08]' : 'text-gray-400 hover:text-white'}`
              }
            >
              Contact
            </NavLink>
            <div className="pt-2 border-t border-white/10 flex gap-2">
              <a
                href={CMS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium text-gray-300 bg-white/[0.05] border border-white/10"
              >
                <span>Open CMS</span>
                <ArrowUpRight size={13} />
              </a>
              <a
                href={LIVE_PORTFOLIO_URL}
                className="flex-1 btn-primary flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold"
              >
                <span>Live Output</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="mt-36 border-t border-white/[0.06] bg-[#060912]">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400/10 to-amber-600/5 border border-amber-400/20 flex items-center justify-center">
                <span className="font-serif text-amber-300 text-sm font-bold italic">S</span>
              </div>
              <span className="font-bold tracking-[0.12em] text-sm text-white uppercase">SCRIVA</span>
              <span className="text-gray-600">·</span>
              <span className="text-xs text-gray-400 font-mono tracking-wider">Create. Curate. Publish.</span>
            </div>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed pl-11">
              An architectural publishing platform decoupling portfolio administration from public presentation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400">
            <Link to="/projects" className="hover:text-amber-300 transition-colors duration-300">
              Portfolio
            </Link>
            <Link to="/experience" className="hover:text-amber-300 transition-colors duration-300">
              Experience
            </Link>
            <Link to="/blog" className="hover:text-amber-300 transition-colors duration-300">
              Writing
            </Link>
            <Link to="/contact" className="hover:text-amber-300 transition-colors duration-300">
              Contact
            </Link>
            <a
              href={CMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-400/80 hover:text-amber-300 transition-colors duration-300"
            >
              <span>CMS Portal</span>
              <ArrowUpRight size={12} />
            </a>
            <a
              href="https://github.com/dhyey2402/Scriva"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-300 transition-colors duration-300"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.04]">
          {/* Decorative gold line */}
          <div className="line-gold mb-6" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] font-mono text-gray-600">
            <div>© {new Date().getFullYear()} SCRIVA Platform. All rights reserved.</div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400/40">◆</span>
              <span>PostgreSQL • Django REST Framework • React</span>
              <span className="text-amber-400/40">◆</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative bg-[#080b14] text-gray-100 selection:bg-amber-400/20 selection:text-amber-100">
      {/* Ambient glow effects */}
      <div className="ambient-glow" />
      <div className="ambient-glow-secondary" />

      <Header />
      
      {/* Top spacing to account for floating header */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 flex flex-col relative z-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
