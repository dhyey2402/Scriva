import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Layers,
  Database,
  Cpu,
  FolderGit2,
  BookOpen,
  Briefcase,
  MessageSquare,
  Sparkles,
  UploadCloud,
  CheckCircle,
  ExternalLink,
  Sliders,
  Eye,
  Lock,
  Globe,
  Server,
  FileText,
  User
} from 'lucide-react';
import api from '../api/axios';

const Home = () => {
  // Dynamic sample data fetched from existing backend API to demonstrate live "From CMS to Portfolio" integration
  const [profileData, setProfileData] = useState(null);
  const [sampleProject, setSampleProject] = useState(null);
  const [sampleSkills, setSampleSkills] = useState([]);
  const [cmsStats, setCmsStats] = useState({ projects: 0, blogs: 0, skills: 0 });
  const [workflowTab, setWorkflowTab] = useState('draft'); // 'draft' vs 'published'

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const [profileRes, projectsRes, skillsRes] = await Promise.allSettled([
          api.get('profile/'),
          api.get('projects/'),
          api.get('skills/')
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value.data?.length > 0) {
          setProfileData(profileRes.value.data[0]);
        }
        if (projectsRes.status === 'fulfilled' && projectsRes.value.data?.length > 0) {
          setSampleProject(projectsRes.value.data[0]);
          setCmsStats(prev => ({ ...prev, projects: projectsRes.value.data.length }));
        }
        if (skillsRes.status === 'fulfilled' && skillsRes.value.data?.length > 0) {
          setSampleSkills(skillsRes.value.data.slice(0, 6));
          setCmsStats(prev => ({ ...prev, skills: skillsRes.value.data.length }));
        }
      } catch (err) {
        // Fallback gracefully without blocking landing page
      }
    };

    fetchLiveData();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-32 animate-in fade-in duration-700">
      {/* ========================================================
          1. HERO SECTION (Product-Focused)
         ======================================================== */}
      <section className="relative pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Product Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-300">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              <span>Portfolio CMS & Publishing Platform</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight text-white leading-none">
                SCRIVA
              </h1>
              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 tracking-tight">
                Create. Curate. Publish.
              </h2>
            </div>

            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl font-normal">
              A custom portfolio CMS that gives you one dedicated place to manage your profile, projects, experience, blog, and more — then publish it dynamically through an API-driven public portfolio.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-3">
              <button
                onClick={() => scrollToSection('features')}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.02] gap-2 cursor-pointer"
              >
                <span>Explore SCRIVA</span>
                <ArrowRight size={16} />
              </button>
              <Link
                to="/projects"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl glass-panel hover:bg-white/10 text-gray-200 hover:text-white font-semibold text-sm border border-white/10 transition-all gap-2"
              >
                <Globe size={16} className="text-indigo-400" />
                <span>View Public Portfolio</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-white/5 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-400" />
                <span>Decoupled Architecture</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-400" />
                <span>Draft / Publish Engine</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-400" />
                <span>PostgreSQL Persistence</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-400" />
                <span>REST API Driven</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-End CMS Product Mockup Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 rounded-3xl blur-3xl opacity-60" />

              <div className="relative glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-[#0c0d14]/90 backdrop-blur-2xl">
                {/* Mockup Titlebar */}
                <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                    </div>
                    <span className="text-[11px] font-mono text-gray-400 pl-2">SCRIVA CMS — Control Center</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>API Connected</span>
                  </div>
                </div>

                {/* Mockup Dashboard Content */}
                <div className="p-5 space-y-4">
                  {/* Metric Counter Row */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                      <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Projects</div>
                      <div className="text-xl font-bold text-white mt-1">
                        {cmsStats.projects > 0 ? cmsStats.projects : '12'}
                      </div>
                      <span className="text-[10px] text-indigo-400 font-medium">Curated</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                      <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Blog Articles</div>
                      <div className="text-xl font-bold text-white mt-1">8</div>
                      <span className="text-[10px] text-purple-400 font-medium">Published</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                      <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Skills</div>
                      <div className="text-xl font-bold text-white mt-1">
                        {cmsStats.skills > 0 ? cmsStats.skills : '15'}
                      </div>
                      <span className="text-[10px] text-pink-400 font-medium">Ranked</span>
                    </div>
                  </div>

                  {/* Live Content Publishing Pipeline Card */}
                  <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                        <Sliders size={13} className="text-indigo-400" /> Content Queue
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">DRF BasePublishViewSet</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-900/60 border border-white/5">
                        <div className="space-y-0.5">
                          <div className="text-white font-medium text-xs">Distributed Cloud Architecture</div>
                          <div className="text-[10px] text-gray-400">Technical Blog Post</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          DRAFT (Hidden)
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-900/60 border border-white/5">
                        <div className="space-y-0.5">
                          <div className="text-white font-medium text-xs">Interactive Analytics Engine</div>
                          <div className="text-[10px] text-gray-400">Featured Showcase Project</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          PUBLISHED (Live)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Flow pipeline footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Lock size={12} className="text-purple-400" />
                      <span>JWT Protected CMS</span>
                    </span>
                    <span className="text-indigo-400 font-medium">
                      Publish to Portfolio →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. WHAT IS SCRIVA? (Problem vs Solution)
         ======================================================== */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <span>The Concept</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Stop editing code to update your portfolio.
          </h2>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Traditional portfolio websites force developers to edit source files, commit code, and trigger full rebuilds for routine content updates. SCRIVA decouples the content from the presentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Traditional Way */}
          <div className="glass-panel p-8 rounded-3xl border border-red-500/20 bg-red-950/5 space-y-4 relative overflow-hidden">
            <div className="text-xs font-bold uppercase tracking-wider text-red-400">Traditional Hardcoded Portfolio</div>
            <h3 className="text-xl font-bold text-white">Manual Code Edits & Rebuilds</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Modifying bio, skills, or projects requires touching JSX source files</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Requires Git commits, push cycles, and CI/CD bundle rebuilds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>No concept of draft states — everything in master is live immediately</span>
              </li>
            </ul>
          </div>

          {/* The SCRIVA Way */}
          <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 bg-indigo-950/10 space-y-4 relative overflow-hidden shadow-xl shadow-indigo-900/10">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">The SCRIVA Architecture</div>
            <h3 className="text-xl font-bold text-white">Decoupled CMS & Dynamic Delivery</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Dedicated administrative CMS control center with intuitive forms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Instant database updates via Django REST API without rebuilds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Complete draft-to-publish workflow isolating works in progress</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. FEATURE SECTION (Implemented Capabilities)
         ======================================================== */}
      <section id="features" className="space-y-12 pt-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <span>CMS Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Everything your portfolio needs. One place.
          </h2>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            SCRIVA covers every dimension of a software engineer’s public profile through dedicated management sections.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Profile */}
          <div className="glass-panel p-6 rounded-2xl space-y-3 group hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <User size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Profile & Identity</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Curate your professional bio, primary title, profile portrait, downloadable resume file, and contact email.
            </p>
          </div>

          {/* 2. Projects */}
          <div className="glass-panel p-6 rounded-2xl space-y-3 group hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <FolderGit2 size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Selected Works</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Showcase projects with cover images, GitHub source links, live demo URLs, featured flags, and draft states.
            </p>
          </div>

          {/* 3. Skills */}
          <div className="glass-panel p-6 rounded-2xl space-y-3 group hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Cpu size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Technical Skills</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Organize languages and frameworks by category, set proficiency ratings (1-100), and define display order.
            </p>
          </div>

          {/* 4. Experience */}
          <div className="glass-panel p-6 rounded-2xl space-y-3 group hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Briefcase size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Career Timeline</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Document your professional journey with company names, positions, start/end dates, and role accomplishments.
            </p>
          </div>

          {/* 5. Blog */}
          <div className="glass-panel p-6 rounded-2xl space-y-3 group hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20">
              <BookOpen size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Editorial Blog</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Publish technical writing, architecture deep-dives, and tutorials with cover images and publication timestamps.
            </p>
          </div>

          {/* 6. Testimonials */}
          <div className="glass-panel p-6 rounded-2xl space-y-3 group hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Client Testimonials</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Highlight social proof with client recommendations, corporate affiliations, roles, and approval toggles.
            </p>
          </div>

          {/* 7. Services & Education */}
          <div className="glass-panel p-6 rounded-2xl space-y-3 group hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Sparkles size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Services & Education</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Structure technical offerings, consulting capabilities, academic degrees, and institutional credentials.
            </p>
          </div>

          {/* 8. Media Vault */}
          <div className="glass-panel p-6 rounded-2xl space-y-3 group hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/20">
              <UploadCloud size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Central Media Vault</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Upload images and documents with server-side MIME type filtering, 5 MB file size checks, and persistent URLs.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. DRAFT → CURATE → PUBLISH WORKFLOW SECTION
         ======================================================== */}
      <section id="how-it-works" className="space-y-12 pt-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <span>Publishing Lifecycle</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            The Create. Curate. Publish. Engine.
          </h2>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            SCRIVA gives you complete control over your content before the public sees it.
          </p>
        </div>

        {/* 4-Step Pathway */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl relative space-y-3">
            <div className="text-xs font-mono font-bold text-indigo-400">STEP 01</div>
            <h3 className="text-xl font-bold text-white">Create</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Author your portfolio content inside the dedicated CMS using structured forms, image pickers, and metadata inputs.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative space-y-3">
            <div className="text-xs font-mono font-bold text-purple-400">STEP 02</div>
            <h3 className="text-xl font-bold text-white">Curate</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Refine descriptions, organize display orders, upload assets, and save as <strong>DRAFT</strong> without exposing unfinished work.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative space-y-3">
            <div className="text-xs font-mono font-bold text-pink-400">STEP 03</div>
            <h3 className="text-xl font-bold text-white">Publish</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Toggle the state to <strong>PUBLISHED</strong>. The Django REST API updates instantly, making the record visible to unauthenticated requests.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative space-y-3">
            <div className="text-xs font-mono font-bold text-emerald-400">STEP 04</div>
            <h3 className="text-xl font-bold text-white">Portfolio</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              The public React portfolio queries the published endpoint and renders the new content live with zero frontend rebuilds.
            </p>
          </div>
        </div>

        {/* Interactive State Toggle Demonstration */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 max-w-3xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">ORM-Enforced Visibility Demonstration</h3>
              <p className="text-xs text-gray-400">Toggle the state below to observe how SCRIVA handles content isolation</p>
            </div>
            <div className="inline-flex p-1 bg-white/5 border border-white/10 rounded-xl">
              <button
                onClick={() => setWorkflowTab('draft')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  workflowTab === 'draft'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                State: DRAFT
              </button>
              <button
                onClick={() => setWorkflowTab('published')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  workflowTab === 'published'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                State: PUBLISHED
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-950/60 border border-white/5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-gray-400 pb-2 border-b border-white/5">
              <span>GET /api/projects/</span>
              <span>Client: {workflowTab === 'draft' ? 'Unauthenticated Visitor' : 'Public Portfolio Visitor'}</span>
            </div>
            {workflowTab === 'draft' ? (
              <div className="space-y-1.5 text-amber-400/90">
                <p># Query filtered at ORM: `state = PublishState.PUBLISHED`</p>
                <p className="text-gray-400">Response: []</p>
                <p className="text-xs text-gray-500">
                  Result: Draft items remain completely invisible to the public. Only staff users authenticated with JWT Bearer tokens can view draft content inside the CMS.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 text-emerald-400">
                <p># Query matched: `state = PublishState.PUBLISHED`</p>
                <p className="text-gray-300">Response: [{`"id": 1, "title": "Interactive Analytics Engine", "state": "PUBLISHED"`}]</p>
                <p className="text-xs text-gray-400">
                  Result: Published content is returned cleanly and rendered on the public portfolio instantly.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. CMS + PORTFOLIO ARCHITECTURE SECTION
         ======================================================== */}
      <section id="architecture" className="space-y-12 pt-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <span>System Design</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Decoupled Architecture
          </h2>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Content is managed through the CMS, persisted through the backend, and consumed by the public portfolio through the REST API.
          </p>
        </div>

        {/* Visual Architecture Node Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {/* Node 1: Custom CMS */}
          <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400">01 LAYER</span>
              <Shield size={16} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Custom CMS</h3>
            <p className="text-xs text-gray-400">
              React 19 + Tailwind CSS administration console protected by SimpleJWT Bearer authentication.
            </p>
          </div>

          {/* Node 2: Django REST API */}
          <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 bg-purple-950/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-400">02 LAYER</span>
              <Server size={16} className="text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Django REST API</h3>
            <p className="text-xs text-gray-400">
              Central DRF application handling role permissions, queryset filtering, media parsing, and mail dispatch.
            </p>
          </div>

          {/* Node 3: PostgreSQL Database */}
          <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 bg-blue-950/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-400">03 LAYER</span>
              <Database size={16} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white">PostgreSQL</h3>
            <p className="text-xs text-gray-400">
              Relational persistence layer enforcing schema integrity across 10 distinct content models.
            </p>
          </div>

          {/* Node 4: Public Portfolio */}
          <div className="glass-panel p-6 rounded-2xl border border-pink-500/30 bg-pink-950/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-pink-400">04 LAYER</span>
              <Globe size={16} className="text-pink-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Public Portfolio</h3>
            <p className="text-xs text-gray-400">
              High-performance client surface rendering approved published content dynamically for visitors.
            </p>
          </div>
        </div>

        {/* Architecture Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-4">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <h4 className="text-base font-bold text-white">Zero Rebuild Deployments</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Updating a bio, adding an article, or changing job history updates PostgreSQL through REST endpoints immediately without requiring static site redeployments.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <h4 className="text-base font-bold text-white">ORM-Level Security Gate</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Public unauthenticated visitors are restricted strictly to published records directly at the database query level, preventing draft leaks.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <h4 className="text-base font-bold text-white">Stateless JWT Auth</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Administrative functions are secured via short-lived access tokens and refresh rotation, keeping backend resources protected.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. "SEE IT IN ACTION" SECTION (Live Portfolio Output)
         ======================================================== */}
      <section id="portfolio-preview" className="space-y-10 pt-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold uppercase tracking-wider">
            <span>Output Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            From CMS to Portfolio
          </h2>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Manage your content in SCRIVA. Publish it to a portfolio that reflects the latest approved content.
          </p>
        </div>

        {/* Live Output Card */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-b from-gray-900/60 to-gray-950/80">
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
                PUBLIC PORTFOLIO
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-400">Powered by SCRIVA Engine</span>
            </div>
            <Link
              to="/projects"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <span>Explore All Pages</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Live Profile Output */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                Live Managed Output
              </div>
              <h3 className="text-3xl font-black text-white">
                {profileData?.name || 'Dhyey Patel'}
              </h3>
              <h4 className="text-lg font-medium text-indigo-400">
                {profileData?.title || 'Full-Stack Software Engineer'}
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed max-w-xl whitespace-pre-wrap">
                {profileData?.bio ||
                  'Professional engineer delivering cloud applications and full-stack platforms with modern architecture.'}
              </p>

              {/* Skills Pills */}
              {sampleSkills.length > 0 && (
                <div className="pt-2">
                  <div className="text-xs font-semibold text-gray-400 mb-2">Curated Skills:</div>
                  <div className="flex flex-wrap gap-2">
                    {sampleSkills.map(skill => (
                      <span
                        key={skill.id}
                        className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300"
                      >
                        {skill.name} • {skill.proficiency}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Live Project Card Sample */}
            <div className="lg:col-span-6">
              <div className="p-6 rounded-2xl bg-[#0a0a0f] border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Sample Published Project</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Live Data
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white">
                  {sampleProject?.title || 'Distributed Application Architecture'}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                  {sampleProject?.description ||
                    'High-performance backend systems built with Django REST Framework, PostgreSQL, and modern React client interfaces.'}
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-white/5 text-xs">
                  <span className="text-gray-500">Fetched via GET /api/projects/</span>
                  <Link to="/projects" className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                    <span>View in Selected Works</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Portfolio Page Navigation Pills */}
          <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <Link
              to="/projects"
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 transition-all text-xs font-semibold text-gray-300 hover:text-white"
            >
              Selected Works
            </Link>
            <Link
              to="/experience"
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 transition-all text-xs font-semibold text-gray-300 hover:text-white"
            >
              Career History
            </Link>
            <Link
              to="/blog"
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 transition-all text-xs font-semibold text-gray-300 hover:text-white"
            >
              Writing & Articles
            </Link>
            <Link
              to="/testimonials"
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 transition-all text-xs font-semibold text-gray-300 hover:text-white"
            >
              Testimonials
            </Link>
            <Link
              to="/contact"
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 transition-all text-xs font-semibold text-gray-300 hover:text-white col-span-2 sm:col-span-1"
            >
              Contact Form
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. TECHNOLOGY STACK
         ======================================================== */}
      <section className="space-y-10 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold uppercase tracking-wider">
            <span>Technology</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Engineered With Proven Technologies
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="glass-panel p-5 rounded-2xl text-center space-y-1.5 hover:border-indigo-500/30 transition-all">
            <div className="text-indigo-400 font-bold text-base">React 19</div>
            <div className="text-xs text-gray-400">Frontend UI</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl text-center space-y-1.5 hover:border-indigo-500/30 transition-all">
            <div className="text-purple-400 font-bold text-base">Tailwind 4</div>
            <div className="text-xs text-gray-400">Design System</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl text-center space-y-1.5 hover:border-indigo-500/30 transition-all">
            <div className="text-emerald-400 font-bold text-base">Django 5.2</div>
            <div className="text-xs text-gray-400">Backend Core</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl text-center space-y-1.5 hover:border-indigo-500/30 transition-all">
            <div className="text-pink-400 font-bold text-base">DRF 3.18</div>
            <div className="text-xs text-gray-400">REST API</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl text-center space-y-1.5 hover:border-indigo-500/30 transition-all">
            <div className="text-blue-400 font-bold text-base">PostgreSQL</div>
            <div className="text-xs text-gray-400">Persistence</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl text-center space-y-1.5 hover:border-indigo-500/30 transition-all">
            <div className="text-amber-400 font-bold text-base">SimpleJWT</div>
            <div className="text-xs text-gray-400">Auth Token</div>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. PRODUCT FLOW SUMMARY TAGLINE
         ======================================================== */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-pink-950/40 border border-white/10 text-center space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 font-black tracking-widest text-lg sm:text-2xl text-white">
          <span className="text-indigo-400">CREATE</span>
          <span className="text-gray-600 hidden sm:inline">───►</span>
          <span className="text-purple-400">CURATE</span>
          <span className="text-gray-600 hidden sm:inline">───►</span>
          <span className="text-pink-400">PUBLISH</span>
        </div>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          From drafting projects to curating skills and publishing blog articles, SCRIVA streamlines portfolio administration into a reliable publishing pipeline.
        </p>
      </section>

      {/* ========================================================
          9. FINAL PRODUCT-FOCUSED CTA
         ======================================================== */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-4 pb-12">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Your portfolio. Your content.<br />
          Your publishing workflow.
        </h2>
        <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
          SCRIVA gives you a dedicated place to create, manage, and publish your portfolio without touching frontend source code.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/projects"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            <span>Explore Public Portfolio</span>
            <ArrowRight size={16} />
          </Link>
          <a
            href="http://localhost:5174/"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 rounded-xl glass-panel hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-all flex items-center gap-2"
          >
            <Shield size={16} className="text-purple-400" />
            <span>Open CMS Portal</span>
            <ExternalLink size={14} className="opacity-60" />
          </a>
          <Link
            to="/contact"
            className="px-6 py-4 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white font-medium text-sm transition-colors"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
