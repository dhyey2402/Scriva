import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Loader, ErrorMessage, EmptyState } from '../components/UI';
import { Briefcase, Calendar } from 'lucide-react';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await api.get('experience/');
        // Sort descending by start_date ideally, assuming the API returns them unordered
        const sorted = res.data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
        setExperiences(sorted);
        setLoading(false);
      } catch (err) {
        setError('Failed to load experience timeline.');
        setLoading(false);
      }
    };
    fetchExperience();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-4">Professional Experience</h1>
        <p className="text-xl text-gray-400">
          My career journey and professional milestones.
        </p>
      </div>

      {experiences.length === 0 ? (
        <EmptyState title="No Experience Found" message="Timeline is currently empty." />
      ) : (
        <div className="relative border-l-2 border-indigo-500/20 ml-3 md:ml-6 space-y-12 py-8">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative pl-8 md:pl-12 group">
              <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-[#0a0a0f] border-4 border-indigo-500 group-hover:bg-indigo-500 transition-colors" />
              
              <div className="glass-panel p-6 md:p-8 rounded-2xl hover:border-indigo-500/30 transition-colors">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Briefcase size={20} className="text-indigo-400 hidden sm:block" /> {exp.position}
                    </h3>
                    <h4 className="text-lg font-medium text-indigo-400 mt-1">{exp.company}</h4>
                  </div>
                  <div className="flex items-center text-sm font-semibold text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg gap-2 shrink-0">
                    <Calendar size={16} />
                    {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                  </div>
                </div>
                
                <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Experience;
