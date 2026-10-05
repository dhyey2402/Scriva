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
    <div className="space-y-12 animate-fade-in-up">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gold-badge text-[11px] font-mono tracking-widest uppercase">
          Career Timeline
        </div>
        <h1 className="heading-serif text-4xl sm:text-5xl text-white">
          Professional Experience
        </h1>
        <p className="text-lg text-gray-400 font-light leading-relaxed">
          My career journey and professional milestones across organizations and technologies.
        </p>
      </div>

      {experiences.length === 0 ? (
        <EmptyState title="No Experience Found" message="Timeline is currently empty." />
      ) : (
        <div className="relative ml-3 md:ml-6 space-y-10 py-8">
          {/* Timeline vertical line with gold gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-amber-400/30 via-amber-400/10 to-transparent" />

          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="relative pl-8 md:pl-12 group animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Timeline node */}
              <div className="absolute -left-[7px] top-2 w-[14px] h-[14px] rounded-full bg-[#080b14] border-[3px] border-amber-400/50 group-hover:border-amber-400 group-hover:shadow-[0_0_12px_rgba(201,168,76,0.3)] transition-all duration-300" />

              <div className="glass-card p-6 md:p-8 rounded-2xl hover:border-amber-400/20 hover-lift transition-all duration-300">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 font-serif">
                      <Briefcase size={18} className="text-amber-400/70 hidden sm:block" /> {exp.position}
                    </h3>
                    <h4 className="text-base font-medium text-amber-400/80 mt-1">{exp.company}</h4>
                  </div>
                  <div className="flex items-center text-xs font-medium text-gray-400 glass-subtle px-3.5 py-2 rounded-xl gap-2 shrink-0">
                    <Calendar size={14} className="text-amber-400/50" />
                    {exp.start_date} — {exp.is_current ? (
                      <span className="text-amber-400 font-bold">Present</span>
                    ) : exp.end_date}
                  </div>
                </div>

                <p className="text-gray-400 leading-relaxed whitespace-pre-wrap text-sm font-light">
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
