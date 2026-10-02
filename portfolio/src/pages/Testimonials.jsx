import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Loader, ErrorMessage, EmptyState } from '../components/UI';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get('testimonials/');
        // The backend BasePublishViewSet automatically filters for PUBLISHED testimonials
        setTestimonials(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load testimonials.');
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-4">Client Testimonials</h1>
        <p className="text-xl text-gray-400">
          What people I've worked with have to say about our collaborations.
        </p>
      </div>

      {testimonials.length === 0 ? (
        <EmptyState title="No Testimonials Yet" message="Check back later to see what clients are saying." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
              <Quote className="absolute top-6 right-8 text-white/5 w-16 h-16 transform group-hover:scale-110 transition-transform duration-500" />
              
              <div className="relative z-10 flex flex-col h-full">
                <p className="text-gray-300 text-lg leading-relaxed italic mb-8 flex-grow whitespace-pre-wrap">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/10">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{testimonial.name}</h4>
                    <p className="text-indigo-400 text-sm font-medium">
                      {testimonial.role} {testimonial.company && <span>at <span className="text-gray-300">{testimonial.company}</span></span>}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Testimonials;
