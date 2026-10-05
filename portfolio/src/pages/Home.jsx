import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Lock,
  Sparkles,
} from 'lucide-react';
import api from '../api/axios';
import { CMS_URL } from '../constants';

/* ──────────────────────────────────────────────────────────────
   Scroll reveal hook — triggers .visible class when in viewport
   ────────────────────────────────────────────────────────────── */
const useRevealOnScroll = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

/* ──────────────────────────────────────────────────────────────
   3D Tilt Card — follows cursor with perspective transform
   ────────────────────────────────────────────────────────────── */
const TiltCard = ({ children, className = '' }) => {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────
   HOME PAGE
   ────────────────────────────────────────────────────────────── */
const Home = () => {
  const [activeModule, setActiveModule] = useState(1);
  const [demoState, setDemoState] = useState('draft');
  const [profileData, setProfileData] = useState(null);
  const [liveProject, setLiveProject] = useState(null);
  const [liveSkills, setLiveSkills] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useRevealOnScroll();

  /* Parallax mouse tracking for hero section */
  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [profileRes, projectsRes, skillsRes] = await Promise.allSettled([
          api.get('profile/'),
          api.get('projects/'),
          api.get('skills/'),
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value.data?.length > 0) {
          setProfileData(profileRes.value.data[0]);
        }
        if (projectsRes.status === 'fulfilled' && projectsRes.value.data?.length > 0) {
          setLiveProject(projectsRes.value.data[0]);
        }
        if (skillsRes.status === 'fulfilled' && skillsRes.value.data?.length > 0) {
          setLiveSkills(skillsRes.value.data.slice(0, 5));
        }
      } catch (err) {
        // Fallback silently
      }
    };
    fetchPortfolioData();
  }, []);

  const modules = [
    {
      id: 1, num: '01', title: 'Profile & Identity',
      short: 'Biographical core, contact email, avatar, and resume asset.',
      fields: ['Full Name', 'Professional Title', 'Markdown Biography', 'Profile Portrait', 'PDF Resume', 'Contact Email'],
      apiRoute: 'GET /api/profile/',
      detail: 'Controls the root identity of the public portfolio. Updates are reflected across header, hero, and metadata tags instantly.'
    },
    {
      id: 2, num: '02', title: 'Selected Works',
      short: 'Projects catalog with draft/published state toggling.',
      fields: ['Project Title', 'Description', 'Cover Image', 'GitHub Repository URL', 'Live Demo URL', 'Featured Flag', 'State: DRAFT/PUBLISHED'],
      apiRoute: 'GET /api/projects/',
      detail: 'A multi-field project repository. Draft works remain strictly hidden at the ORM layer while approved projects stream to /projects.'
    },
    {
      id: 3, num: '03', title: 'Technical Skills',
      short: 'Ranked competencies, categories, and proficiency ratings.',
      fields: ['Skill Name', 'Domain Category', 'Proficiency (1–100%)', 'Display Sequence Order'],
      apiRoute: 'GET /api/skills/',
      detail: 'Governs your technical stack. The public client renders skills with interactive hover metrics and domain grouping.'
    },
    {
      id: 4, num: '04', title: 'Career Timeline',
      short: 'Chronological roles, tenures, and verified achievements.',
      fields: ['Company / Organization', 'Role Title', 'Start Date', 'End Date', 'Is Current Position', 'Accomplishment Summary'],
      apiRoute: 'GET /api/experience/',
      detail: 'Structures historical career milestones. Clean timeline rendering with present-tenure badges and company metadata.'
    },
    {
      id: 5, num: '05', title: 'Editorial Writing',
      short: 'Technical articles, architectural essays, and tutorials.',
      fields: ['Article Title', 'Cover Image', 'Full Markdown Text', 'State: DRAFT/PUBLISHED', 'Created Timestamp'],
      apiRoute: 'GET /api/blogs/',
      detail: 'A dedicated publishing pipeline for technical thought leadership, complete with reading time markers and cover media.'
    },
    {
      id: 6, num: '06', title: 'Client Endorsements',
      short: 'Client quotes, company affiliations, and visibility status.',
      fields: ['Client Full Name', 'Professional Role', 'Company Affiliation', 'Endorsement Text', 'State: DRAFT/PUBLISHED'],
      apiRoute: 'GET /api/testimonials/',
      detail: 'Curates verified social proof from colleagues, clients, and engineering leaders with approval gating.'
    }
  ];

  const currentModule = modules.find(m => m.id === activeModule) || modules[0];

  return (
    <div className="space-y-40">

      {/* ════════════════════════════════════════════════════════════
          01 / THE SYSTEM — 3D Perspective Hero
          ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-visible">
        {/* Background decorative elements */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-amber-400/[0.03] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-blue-400/[0.02] blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Typographic Hero */}
          <div className="lg:col-span-6 space-y-8 pt-2">
            <div className="space-y-4 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gold-badge text-[11px] font-mono tracking-widest uppercase">
                <Sparkles size={12} />
                <span>The Publishing System</span>
              </div>
              <h1 className="heading-serif text-5xl sm:text-6xl lg:text-7xl text-white">
                Create.
                <br />
                Curate.
                <br />
                <span className="gold-text">Publish.</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-gray-300/90 leading-relaxed max-w-lg font-light animate-fade-in-up delay-200">
              Your portfolio content deserves a dedicated publishing system — not hardcoded components,
              manual Git commits, and brittle build cycles.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 animate-fade-in-up delay-300">
              <a
                href="#features"
                className="btn-primary px-6 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2"
              >
                <span>Explore the Control Room</span>
                <ArrowRight size={15} />
              </a>
              <Link
                to="/projects"
                className="btn-secondary px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
              >
                <span>Open Public Portfolio</span>
                <ArrowUpRight size={15} className="text-amber-400/60" />
              </Link>
            </div>

            {/* Technical Metadata Strip */}
            <div className="pt-6 border-t border-white/[0.06] flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-mono text-gray-400 animate-fade-in-up delay-400">
              {[
                ['ARCH', 'DECOUPLED'],
                ['DB', 'POSTGRESQL'],
                ['AUTH', 'JWT BEARER'],
                ['API', 'DJANGO REST'],
              ].map(([label, value]) => (
                <div key={label}>
                  <span className="text-gray-500">{label}:</span>{' '}
                  <span className="text-gray-300">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Content Publishing Workspace Preview */}
          <div className="lg:col-span-6 perspective-container">
            <TiltCard>
              <div
                className="glass-card rounded-2xl overflow-hidden gold-glow animate-fade-in-up delay-300"
                style={{
                  transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
                  transition: 'transform 0.15s ease-out',
                }}
              >
                {/* Window Header */}
                <div className="px-5 py-3.5 border-b border-white/[0.06] bg-black/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
                    </div>
                    <span className="text-[11px] font-mono text-gray-400 pl-1">SCRIVA WORKSPACE</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ONLINE • POSTGRES</span>
                  </div>
                </div>

                {/* Workspace Content */}
                <div className="p-6 space-y-4">
                  <div className="text-[11px] font-mono tracking-wider text-gray-500 uppercase flex justify-between items-center">
                    <span>MANAGED CONTENT QUEUE</span>
                    <span className="text-amber-400/60">3 ENTRIES</span>
                  </div>

                  {/* Content Item 1 */}
                  <div className="glass-elevated p-4 rounded-xl space-y-2 hover-lift">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">PROJECT • SHOWCASE</div>
                        <div className="text-sm font-bold text-white">
                          {liveProject?.title || 'Distributed Application Architecture'}
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                        PUBLISHED
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {liveProject?.description || 'Scalable web systems built with Django REST Framework, PostgreSQL, and React.'}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-gray-400 border-t border-white/[0.04]">
                      <span>SLUG: /projects/</span>
                      <span className="text-amber-400/70">LIVE ON PORTFOLIO</span>
                    </div>
                  </div>

                  {/* Content Item 2 */}
                  <div className="glass-elevated p-4 rounded-xl space-y-2 hover-lift">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">CAREER • EXPERIENCE</div>
                        <div className="text-sm font-bold text-white">
                          Staff Full-Stack Software Engineer
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                        PUBLISHED
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Lead architecture, decoupled REST APIs, and client performance optimizations.
                    </div>
                  </div>

                  {/* Content Item 3 (Draft) */}
                  <div className="glass-elevated p-4 rounded-xl space-y-2 border-amber-400/15 hover-lift">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="text-[10px] font-mono text-amber-400/80 uppercase tracking-wider">ARTICLE • IN PROGRESS</div>
                        <div className="text-sm font-bold text-white">
                          Decoupling Content from Bundles
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                        DRAFT
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Draft essay currently locked inside CMS. Excluded from public API queries.
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Lock size={12} className="text-amber-400/60" />
                      <span>MUTATIONS REQUIRE JWT AUTH</span>
                    </span>
                    <a
                      href={CMS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400/80 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                    >
                      <span>ENTER CMS</span>
                      <ArrowUpRight size={11} />
                    </a>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* 3D floating decoration elements */}
        <div
          className="hidden lg:block absolute -bottom-8 left-1/4 w-20 h-20 rounded-2xl glass-subtle animate-float opacity-50 pointer-events-none"
          style={{ transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)` }}
        />
        <div
          className="hidden lg:block absolute top-1/3 -right-6 w-14 h-14 rounded-xl glass-subtle animate-float-delayed opacity-30 pointer-events-none"
          style={{ transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)` }}
        />
      </section>

      {/* ════════════════════════════════════════════════════════════
          02 / CONTENT CONTROL — The Control Room
          ════════════════════════════════════════════════════════════ */}
      <section id="features" className="space-y-12 pt-6 reveal">
        <div className="border-b border-white/[0.06] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gold-badge text-[11px] font-mono tracking-widest uppercase">
              02 / Content Control
            </div>
            <h2 className="heading-serif text-3xl sm:text-4xl lg:text-5xl text-white">
              The Control Room.
            </h2>
          </div>
          <p className="text-sm text-gray-400 max-w-md leading-relaxed font-light">
            Everything that defines your professional identity, governed from a single administrative workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Module Index */}
          <div className="lg:col-span-5 space-y-2">
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 cursor-pointer border ${
                  activeModule === mod.id
                    ? 'glass-elevated border-amber-400/30 text-white gold-glow'
                    : 'glass-subtle border-transparent text-gray-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-amber-400/70">{mod.num}</span>
                    <span className="text-sm font-bold">{mod.title}</span>
                  </div>
                  {activeModule === mod.id && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1 pl-7 line-clamp-1">
                  {mod.short}
                </div>
              </button>
            ))}
          </div>

          {/* Module Inspector */}
          <div className="lg:col-span-7">
            <TiltCard>
              <div className="glass-card p-7 rounded-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.06] gap-2">
                  <div>
                    <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
                      MODULE {currentModule.num} / SPECIFICATION
                    </div>
                    <h3 className="text-xl font-bold text-white mt-1 font-serif">
                      {currentModule.title}
                    </h3>
                  </div>
                  <div className="text-xs font-mono text-gray-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/5">
                    {currentModule.apiRoute}
                  </div>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed font-light">
                  {currentModule.detail}
                </p>

                <div className="space-y-3 pt-2">
                  <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                    MANAGED SCHEMA FIELDS
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {currentModule.fields.map((field, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg glass-subtle text-gray-300 flex items-center gap-2 font-mono text-[11px] hover:border-amber-400/20 transition-colors duration-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
                        <span>{field}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-400">
                  <span>Persistence: PostgreSQL Relational Table</span>
                  <span className="text-amber-400 font-mono">STATE-ISOLATED</span>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          03 / PUBLISHING ENGINE — The Lifecycle Rail
          ════════════════════════════════════════════════════════════ */}
      <section id="workflow" className="space-y-12 pt-6 reveal">
        <div className="border-b border-white/[0.06] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gold-badge text-[11px] font-mono tracking-widest uppercase">
              03 / Publishing Engine
            </div>
            <h2 className="heading-serif text-3xl sm:text-4xl lg:text-5xl text-white">
              The Lifecycle Rail.
            </h2>
          </div>
          <p className="text-sm text-gray-400 max-w-md leading-relaxed font-light">
            A linear progression isolating in-progress authorship from public visitors until explicitly approved.
          </p>
        </div>

        {/* Horizontal Rail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '01 / CREATE', title: 'Author Content', desc: 'Create projects, write essays, or update milestones using dedicated CMS forms and upload handlers.' },
            { step: '02 / CURATE', title: 'Draft & Organize', desc: 'Organize display order, upload screenshots up to 5 MB, and save entries safely in `DRAFT` state.' },
            { step: '03 / REVIEW', title: 'Toggle State', desc: 'Verify accuracy. When ready, flip state to `PUBLISHED`. The DRF API updates query availability instantly.' },
            { step: '04 / PUBLISH', title: 'Public Stream', desc: 'The public React portfolio reflects the update on its next query with zero client rebuilding.' },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl space-y-3 hover-lift group">
              <div className="text-xs font-mono font-bold text-amber-400">{item.step}</div>
              <h3 className="text-base font-bold text-white font-serif">{item.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">{item.desc}</p>
              {/* Subtle gold line at bottom */}
              <div className="w-8 h-px bg-gradient-to-r from-amber-400/40 to-transparent group-hover:w-16 transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* ORM Isolation Demo */}
        <div className="glass-card p-7 rounded-2xl space-y-5 max-w-4xl mx-auto reveal">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">DATABASE QUERY SIMULATION</div>
              <h4 className="text-base font-bold text-white mt-0.5 font-serif">Django BasePublishViewSet Queryset Filter</h4>
            </div>
            <div className="inline-flex p-1 rounded-xl glass-subtle text-xs font-mono">
              <button
                onClick={() => setDemoState('draft')}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                  demoState === 'draft'
                    ? 'bg-amber-400/15 text-amber-300 font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                state = 'DRAFT'
              </button>
              <button
                onClick={() => setDemoState('published')}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                  demoState === 'published'
                    ? 'bg-emerald-400/15 text-emerald-300 font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                state = 'PUBLISHED'
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/30 border border-white/[0.04] font-mono text-xs space-y-2 text-gray-300">
            <div className="text-gray-400 pb-1.5 border-b border-white/[0.04] flex justify-between">
              <span>SQL QUERY GATE</span>
              <span>USER: UNCONFIRMED_ANONYMOUS</span>
            </div>
            {demoState === 'draft' ? (
              <div className="space-y-1 text-amber-300/90">
                <p>SELECT * FROM api_project WHERE state = 'PUBLISHED';</p>
                <p className="text-gray-400">→ Records Returned: 0 (Draft items excluded at ORM level)</p>
                <p className="text-[11px] text-gray-400 pt-1">
                  Draft works in progress are completely isolated. Public visitors receive empty payloads for unapproved content.
                </p>
              </div>
            ) : (
              <div className="space-y-1 text-emerald-300/90">
                <p>SELECT * FROM api_project WHERE state = 'PUBLISHED';</p>
                <p className="text-gray-400">→ Records Returned: 1 (Live approved payload streamed to client)</p>
                <p className="text-[11px] text-gray-400 pt-1">
                  Published items are delivered immediately to the public portfolio upon approval.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          04 / SYSTEM DESIGN — Decoupled Architecture
          ════════════════════════════════════════════════════════════ */}
      <section id="architecture" className="space-y-12 pt-6 reveal">
        <div className="border-b border-white/[0.06] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gold-badge text-[11px] font-mono tracking-widest uppercase">
              04 / System Design
            </div>
            <h2 className="heading-serif text-3xl sm:text-4xl lg:text-5xl text-white">
              Decoupled Architecture.
            </h2>
          </div>
          <p className="text-sm text-gray-400 max-w-md leading-relaxed font-light">
            Content is managed through the CMS, persisted through the backend, and consumed by the public portfolio through the REST API.
          </p>
        </div>

        {/* Architecture Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { layer: 'LAYER 01', title: 'Custom CMS', desc: 'React 19 administrative portal with token authentication, modal editors, and validation guards.' },
            { layer: 'LAYER 02', title: 'Django REST API', desc: 'Central business logic, BasePublishViewSet queryset isolation, SimpleJWT, and media serving.' },
            { layer: 'LAYER 03', title: 'PostgreSQL', desc: 'Relational persistence layer storing profiles, projects, skills, history, and contact inquiries.' },
            { layer: 'LAYER 04', title: 'Public Portfolio', desc: 'High-performance React public interface consuming approved published data dynamically.' },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl space-y-2.5 hover-lift group">
              <div className="text-[10px] font-mono text-amber-400/70 uppercase tracking-widest">{item.layer}</div>
              <h3 className="text-sm font-bold text-white font-serif">{item.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">{item.desc}</p>
              <div className="w-6 h-px bg-gradient-to-r from-amber-400/30 to-transparent group-hover:w-12 transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Architectural Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {[
            { title: 'Zero Rebuild Deployments', desc: 'Updating a bio, adding a project, or writing a blog post never triggers a static site rebuild or Git commit.' },
            { title: 'ORM Query Isolation', desc: 'Unauthenticated endpoints automatically filter querysets to `state = PUBLISHED` directly at the database layer.' },
            { title: 'Stateless Token Lifecycle', desc: 'Protected operations are verified via short-lived access tokens with automated token refresh interceptors.' },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl glass-subtle hover:border-amber-400/15 transition-all duration-300 space-y-2">
              <h4 className="text-sm font-bold text-white font-serif">{item.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          05 / THE OUTPUT — From Content to Presence
          ════════════════════════════════════════════════════════════ */}
      <section id="output" className="space-y-12 pt-6 reveal">
        <div className="border-b border-white/[0.06] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gold-badge text-[11px] font-mono tracking-widest uppercase">
              05 / The Output
            </div>
            <h2 className="heading-serif text-3xl sm:text-4xl lg:text-5xl text-white">
              From Content to Presence.
            </h2>
          </div>
          <p className="text-sm text-gray-400 max-w-md leading-relaxed font-light">
            What you curate inside SCRIVA manifests as the public experience.
          </p>
        </div>

        {/* Live Output Preview */}
        <div className="glass-card p-8 rounded-2xl space-y-8 gold-glow">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-amber-400 font-bold uppercase tracking-wider">PUBLIC OUTPUT</span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-400">Managed via SCRIVA Engine</span>
            </div>
            <Link
              to="/projects"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
            >
              <span>Explore All Works</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Live Profile */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono gold-badge">
                LIVE PUBLISHED PROFILE
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-serif">
                {profileData?.name || 'Dhyey Patel'}
              </h3>
              <div className="text-sm font-medium text-amber-400 font-mono">
                {profileData?.title || 'Full-Stack Software Engineer'}
              </div>
              <p className="text-sm text-gray-300/80 leading-relaxed max-w-lg whitespace-pre-wrap font-light">
                {profileData?.bio ||
                  'Professional engineer delivering cloud applications and full-stack platforms with modern architecture.'}
              </p>

              {liveSkills.length > 0 && (
                <div className="pt-2">
                  <div className="text-[11px] font-mono text-gray-500 mb-2">CURATED COMPETENCIES:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {liveSkills.map(skill => (
                      <span
                        key={skill.id}
                        className="px-2.5 py-1 rounded-lg glass-subtle text-xs text-gray-300 font-mono hover:border-amber-400/20 transition-colors duration-300"
                      >
                        {skill.name} • {skill.proficiency}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Live Showcase Card */}
            <div className="lg:col-span-6">
              <TiltCard>
                <div className="glass-elevated p-6 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-400">PUBLISHED PROJECT SAMPLE</span>
                    <span className="text-emerald-400 font-bold">STATE = 'PUBLISHED'</span>
                  </div>
                  <h4 className="text-lg font-bold text-white font-serif">
                    {liveProject?.title || 'Distributed Application Architecture'}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 font-light">
                    {liveProject?.description ||
                      'High-performance backend systems built with Django REST Framework, PostgreSQL, and modern React client interfaces.'}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-white/[0.04]">
                    <span className="text-gray-500">ENDPOINT: /api/projects/</span>
                    <Link to="/projects" className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-sans font-medium transition-colors">
                      <span>Inspect</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>

          {/* Quick Route Strip */}
          <div className="pt-6 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs font-medium">
            {[
              { to: '/projects', label: 'Selected Works' },
              { to: '/experience', label: 'Career History' },
              { to: '/blog', label: 'Writing & Articles' },
              { to: '/testimonials', label: 'Testimonials' },
              { to: '/contact', label: 'Contact Form' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="p-3 rounded-xl glass-subtle hover:bg-white/[0.05] hover:border-amber-400/15 text-gray-300 hover:text-white transition-all duration-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          06 / THE STACK — Technical Strip
          ════════════════════════════════════════════════════════════ */}
      <section className="space-y-6 pt-4 reveal">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gold-badge text-[11px] font-mono tracking-widest uppercase mb-4">
            06 / The Technical Stack
          </div>
        </div>
        <div className="glass-card p-8 rounded-2xl flex flex-wrap items-center justify-around gap-8 text-xs font-mono text-gray-400">
          {[
            ['REACT 19', 'CLIENT INTERFACES'],
            ['TAILWIND 4', 'DESIGN SYSTEM'],
            ['DJANGO 5.2', 'BACKEND CORE'],
            ['DRF 3.18', 'REST API LAYER'],
            ['POSTGRESQL', 'NEON DATABASE'],
            ['SIMPLEJWT', 'AUTH LIFECYCLE'],
          ].map(([title, sub]) => (
            <div key={title} className="text-center group">
              <div className="text-white font-bold font-serif text-sm group-hover:text-amber-300 transition-colors duration-300">{title}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          07 / INITIATION — Final CTA
          ════════════════════════════════════════════════════════════ */}
      <section className="text-center max-w-2xl mx-auto space-y-8 pt-8 pb-10 reveal">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gold-badge text-[11px] font-mono tracking-widest uppercase">
          07 / Initiation
        </div>
        <h2 className="heading-serif text-4xl sm:text-5xl text-white leading-tight">
          YOUR CONTENT.
          <br />
          YOUR SYSTEM.
          <br />
          <span className="gold-text">YOUR PRESENCE.</span>
        </h2>
        <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed font-light">
          Create, curate, and publish your work without ever touching frontend source code again.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/projects"
            className="btn-primary px-7 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2"
          >
            <span>Explore Public Portfolio</span>
            <ArrowRight size={15} />
          </Link>
          <a
            href={CMS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary px-7 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
          >
            <span>Open CMS Portal</span>
            <ArrowUpRight size={15} className="text-amber-400/60" />
          </a>
          <Link
            to="/contact"
            className="px-5 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-amber-300 transition-colors duration-300"
          >
            Get In Touch
          </Link>
        </div>

        {/* Decorative bottom line */}
        <div className="line-gold mt-8" />
      </section>
    </div>
  );
};

export default Home;
