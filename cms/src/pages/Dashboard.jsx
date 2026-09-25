import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, FileText, Wrench, Briefcase, MessageSquare, Award 
} from 'lucide-react';
import api from '../api/axios';

const DashboardCard = ({ title, count, icon: Icon, colorClass }) => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex items-center justify-between shadow-lg">
    <div>
      <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white">{count !== null ? count : '...'}</h3>
    </div>
    <div className={`p-4 rounded-lg ${colorClass}`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: null,
    blogs: null,
    skills: null,
    experience: null,
    testimonials: null,
    services: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('dashboard/stats/');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Total Projects" 
          count={stats.projects} 
          icon={FolderKanban} 
          colorClass="bg-blue-600/80" 
        />
        <DashboardCard 
          title="Blog Posts" 
          count={stats.blogs} 
          icon={FileText} 
          colorClass="bg-purple-600/80" 
        />
        <DashboardCard 
          title="Skills" 
          count={stats.skills} 
          icon={Wrench} 
          colorClass="bg-emerald-600/80" 
        />
        <DashboardCard 
          title="Experience Entries" 
          count={stats.experience} 
          icon={Briefcase} 
          colorClass="bg-orange-600/80" 
        />
        <DashboardCard 
          title="Testimonials" 
          count={stats.testimonials} 
          icon={MessageSquare} 
          colorClass="bg-pink-600/80" 
        />
        <DashboardCard 
          title="Services" 
          count={stats.services} 
          icon={Award} 
          colorClass="bg-yellow-600/80" 
        />
      </div>
      
      <div className="mt-12 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Welcome to SCRIVA CMS</h2>
        <p className="text-gray-400">
          This is your personal portfolio command center. Use the sidebar navigation to manage your content.
          Changes you publish here will immediately reflect on your public portfolio.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
