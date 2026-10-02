import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Loader, ErrorMessage, EmptyState } from '../components/UI';
import { ExternalLink, Github } from 'lucide-react';

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
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-4">Selected Works</h1>
        <p className="text-xl text-gray-400">
          A collection of projects showcasing my experience in building scalable applications.
        </p>
      </div>

      {projects.length === 0 ? (
        <EmptyState title="No Projects Found" message="Check back later for updates." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="glass-panel rounded-3xl overflow-hidden group flex flex-col h-full hover:border-indigo-500/30 transition-colors">
              {project.image && (
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                  {project.is_featured && (
                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-gray-400 mb-6 flex-grow whitespace-pre-wrap">{project.description}</p>
                <div className="flex gap-4 mt-auto pt-6 border-t border-white/5">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center text-sm font-semibold text-gray-300 hover:text-white transition-colors gap-2">
                      <Github size={18} /> Source Code
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noreferrer" className="flex items-center text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors gap-2 ml-auto">
                      Live Demo <ExternalLink size={18} />
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
