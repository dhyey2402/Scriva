import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { Menu, X, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../api/axios';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const handleAnchorClick = (e, targetId) => {
    if (isHomePage) {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo & Product Badge */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-black text-lg">S</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-white font-black text-xl tracking-wider">SCRIVA</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                    CMS Platform
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium tracking-tight hidden sm:block">
                  Create. Curate. Publish.
                </span>
              </div>
            </NavLink>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              Home
            </NavLink>
            <a
              href="/#features"
              onClick={(e) => handleAnchorClick(e, 'features')}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              Features
            </a>
            <a
              href="/#how-it-works"
              onClick={(e) => handleAnchorClick(e, 'how-it-works')}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              How It Works
            </a>
            <a
              href="/#architecture"
              onClick={(e) => handleAnchorClick(e, 'architecture')}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              Architecture
            </a>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              Portfolio
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="http://localhost:5174/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              title="Open Custom CMS in new tab"
            >
              <ShieldCheck size={14} className="text-purple-400" />
              <span>CMS Portal</span>
              <ExternalLink size={12} className="opacity-60" />
            </a>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <span>Open Portfolio</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/projects"
              className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg sm:hidden"
            >
              Portfolio
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden glass-panel border-t border-white/10 bg-[#0a0a0f]/95 px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-xl text-base font-semibold ${
                isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            Home
          </NavLink>
          <a
            href="/#features"
            onClick={(e) => {
              setIsOpen(false);
              handleAnchorClick(e, 'features');
            }}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-gray-400 hover:text-white hover:bg-white/5"
          >
            Features
          </a>
          <a
            href="/#how-it-works"
            onClick={(e) => {
              setIsOpen(false);
              handleAnchorClick(e, 'how-it-works');
            }}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-gray-400 hover:text-white hover:bg-white/5"
          >
            How It Works
          </a>
          <a
            href="/#architecture"
            onClick={(e) => {
              setIsOpen(false);
              handleAnchorClick(e, 'architecture');
            }}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-gray-400 hover:text-white hover:bg-white/5"
          >
            Architecture
          </a>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-xl text-base font-semibold ${
                isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            Selected Works (/projects)
          </NavLink>
          <NavLink
            to="/experience"
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-xl text-base font-semibold ${
                isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            Experience (/experience)
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-xl text-base font-semibold ${
                isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            Blog Articles (/blog)
          </NavLink>
          <NavLink
            to="/testimonials"
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-xl text-base font-semibold ${
                isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            Testimonials (/testimonials)
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-xl text-base font-semibold ${
                isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            Contact Form (/contact)
          </NavLink>
          
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <a
              href="http://localhost:5174/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-gray-300 bg-white/5 border border-white/10 rounded-xl"
            >
              <ShieldCheck size={16} className="text-purple-400" />
              <span>Open Custom CMS</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => {
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await api.get('social-links/');
        setSocials(res.data);
      } catch (error) {
        // Fallback silently if unpopulated
      }
    };
    fetchSocials();
  }, []);

  return (
    <footer className="glass-panel border-t border-white/10 border-b-0 border-x-0 mt-32 bg-[#08080c]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="text-white font-black text-base">S</span>
              </div>
              <span className="text-white font-black text-xl tracking-wider">SCRIVA</span>
            </div>
            <p className="text-sm font-semibold text-indigo-400">
              Create. Curate. Publish.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              A decoupled portfolio CMS and dynamic publishing engine. Create and manage portfolio content through a dedicated administrative portal and publish directly to a high-performance public client.
            </p>
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-xs capitalize transition-colors"
                  >
                    {social.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Platform Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/#features" className="hover:text-white transition-colors">CMS Features</a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <a href="/#architecture" className="hover:text-white transition-colors">Architecture</a>
              </li>
              <li>
                <a href="/#portfolio-preview" className="hover:text-white transition-colors">Portfolio Preview</a>
              </li>
              <li>
                <a
                  href="http://localhost:5174/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-indigo-400 transition-colors"
                >
                  <span>CMS Portal</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Public Portfolio Output Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Public Portfolio</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">Selected Works</Link>
              </li>
              <li>
                <Link to="/experience" className="hover:text-white transition-colors">Experience Timeline</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">Writing & Insights</Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-white transition-colors">Client Testimonials</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Get in Touch</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} SCRIVA. Built with Django REST Framework, React, and PostgreSQL.
          </p>
          <div className="flex items-center gap-4">
            <span>Decoupled CMS & Publishing Platform</span>
            <span>•</span>
            <a
              href="https://github.com/dhyey2402/Scriva"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0a0a0f] text-gray-100">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-900/15 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/15 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-blue-900/10 blur-[140px] pointer-events-none -z-10" />

      <Header />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
