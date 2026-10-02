import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Loader, ErrorMessage } from '../components/UI';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [profileRes, skillsRes] = await Promise.all([
          api.get('profile/'),
          api.get('skills/')
        ]);
        
        if (profileRes.data && profileRes.data.length > 0) {
          setProfile(profileRes.data[0]);
        }
        setSkills(skillsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load portfolio content.');
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  
  if (!profile) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-400">Welcome to Scriva Portfolio</h2>
      <p className="mt-4 text-gray-500">Please set up a profile in the CMS to view content here.</p>
    </div>
  );

  return (
    <div className="space-y-24 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-12 mt-10">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300">
            Available for opportunities
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{profile.first_name} {profile.last_name}</span>
          </h1>
          <h2 className="text-2xl md:text-3xl text-gray-400 font-medium">{profile.title}</h2>
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl whitespace-pre-wrap">
            {profile.bio}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/projects" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors gap-2">
              View Work <ArrowRight size={18} />
            </Link>
            {profile.resume_url && (
              <a href={profile.resume_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-6 py-3 rounded-xl glass-panel hover:bg-white/10 text-white font-semibold transition-colors gap-2">
                Resume <Download size={18} />
              </a>
            )}
          </div>
        </div>
        
        {profile.profile_image && (
          <div className="flex-shrink-0 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <img 
              src={profile.profile_image} 
              alt={`${profile.first_name} ${profile.last_name}`} 
              className="relative rounded-3xl w-72 h-72 md:w-96 md:h-96 object-cover border border-white/10 shadow-2xl"
            />
          </div>
        )}
      </section>

      {/* Skills Section */}
      <section className="space-y-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Technical Expertise</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">A comprehensive overview of the tools and technologies I use to build robust digital solutions.</p>
        </div>
        
        {skills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="glass-panel p-6 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors group">
                <div>
                  <h3 className="font-semibold text-gray-200">{skill.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{skill.category}</p>
                </div>
                <div className="text-indigo-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {skill.proficiency}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No skills added yet.</p>
        )}
      </section>
    </div>
  );
};

export default Home;
