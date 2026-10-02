import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Loader, ErrorMessage, EmptyState } from '../components/UI';
import { Clock } from 'lucide-react';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('blogs/');
        // Backend filters published state automatically
        const sorted = res.data.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        setBlogs(sorted);
        setLoading(false);
      } catch (err) {
        setError('Failed to load blog posts.');
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-4">Writing</h1>
        <p className="text-xl text-gray-400">
          Thoughts on software engineering, design patterns, and industry trends.
        </p>
      </div>

      {blogs.length === 0 ? (
        <EmptyState title="No Posts Found" message="Check back later for new articles." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article key={blog.id} className="glass-panel rounded-3xl overflow-hidden group flex flex-col h-full hover:border-purple-500/30 transition-colors">
              {blog.image && (
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gray-900/30 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center text-xs font-semibold text-gray-500 mb-3 gap-2">
                  <Clock size={14} /> {new Date(blog.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-gray-400 flex-grow text-sm leading-relaxed line-clamp-4">
                  {blog.content}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
