import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Loader, ErrorMessage, EmptyState } from '../components/UI';
import { Clock, ArrowUpRight } from 'lucide-react';

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
    <div className="space-y-12 animate-fade-in-up">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gold-badge text-[11px] font-mono tracking-widest uppercase">
          Editorial
        </div>
        <h1 className="heading-serif text-4xl sm:text-5xl text-white">
          Writing
        </h1>
        <p className="text-lg text-gray-400 font-light leading-relaxed">
          Thoughts on software engineering, design patterns, and industry trends.
        </p>
      </div>

      {blogs.length === 0 ? (
        <EmptyState title="No Posts Found" message="Check back later for new articles." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, idx) => (
            <article
              key={blog.id}
              className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full hover:border-amber-400/20 hover-lift animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {blog.image && (
                <div className="relative h-44 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080b14] via-transparent to-transparent z-10 opacity-60" />
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              )}
              <div className="p-7 flex flex-col flex-grow">
                <div className="flex items-center text-[11px] font-mono text-gray-500 mb-3 gap-2">
                  <Clock size={12} className="text-amber-400/50" />
                  {new Date(blog.created_at || Date.now()).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-amber-300 transition-colors duration-300 font-serif leading-snug">
                  {blog.title}
                </h3>
                <p className="text-gray-400 flex-grow text-sm leading-relaxed line-clamp-4 font-light">
                  {blog.content}
                </p>
                <div className="mt-5 pt-4 border-t border-white/[0.06]">
                  <span className="text-xs font-medium text-amber-400/80 group-hover:text-amber-300 transition-colors inline-flex items-center gap-1.5">
                    Read More <ArrowUpRight size={12} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
