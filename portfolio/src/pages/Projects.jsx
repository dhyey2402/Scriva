import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Loader, ErrorMessage, EmptyState } from '../components/UI';
import { ExternalLink, Github, Star } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('projects/');
        // The API returns published projects by default due to BasePublishViewSet filtering!
        // We ensure we sort by display_order
        const sorted = res.data.sort((a, b) => a.display_order - b.display_order);
        setProjects(sorted);
        setLoading(false);
      } catch (err) {
        setError('Failed to load projects.');
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gold-badge text-[11px] font-mono tracking-widest uppercase">
          Selected Works
        </div>
        <h1 className="heading-serif text-4xl sm:text-5xl text-white">
          Portfolio
        </h1>
        <p className="text-lg text-gray-400 font-light leading-relaxed">
          A curated collection of projects showcasing my experience in building scalable, production-grade applications.
        </p>
      </div>

      {projects.length === 0 ? (
        <EmptyState title="No Projects Found" message="Check back later for updates." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full hover:border-amber-400/20 hover-lift animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {project.image && (
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080b14] via-transparent to-transparent z-10 opacity-60" />
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {project.is_featured && (
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full gold-badge text-[10px] font-bold">
                      <Star size={10} fill="currentColor" />
                      Featured
                    </div>
                  )}
                </div>
              )}
              <div className="p-7 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors duration-300 font-serif">
                    {project.title}
                  </h3>
                  {!project.image && project.is_featured && (
                    <span className="flex items-center gap-1.5 px-3 py-1 gold-badge text-[10px] font-bold rounded-full shrink-0">
                      <Star size={10} fill="currentColor" />
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-gray-400 mb-6 flex-grow whitespace-pre-wrap text-sm font-light leading-relaxed">
                  {project.description}
                </p>
                <div className="flex gap-4 mt-auto pt-5 border-t border-white/[0.06]">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 gap-2"
                    >
                      <Github size={16} /> Source Code
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors duration-300 gap-2 ml-auto"
                    >
                      Live Demo <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
