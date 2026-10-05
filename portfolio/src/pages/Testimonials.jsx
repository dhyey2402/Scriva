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
    <div className="space-y-12 animate-fade-in-up">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gold-badge text-[11px] font-mono tracking-widest uppercase">
          Social Proof
        </div>
        <h1 className="heading-serif text-4xl sm:text-5xl text-white">
          Client Testimonials
        </h1>
        <p className="text-lg text-gray-400 font-light leading-relaxed">
          What people I've worked with have to say about our collaborations.
        </p>
      </div>

      {testimonials.length === 0 ? (
        <EmptyState title="No Testimonials Yet" message="Check back later to see what clients are saying." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={testimonial.id}
              className="glass-card p-8 rounded-2xl relative overflow-hidden group hover:border-amber-400/20 hover-lift animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Decorative quote mark */}
              <div className="absolute top-6 right-6 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500">
                <Quote className="w-20 h-20 text-amber-400" />
              </div>

              {/* Decorative gold line accent */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col h-full">
                <p className="text-gray-300/90 text-base leading-relaxed mb-8 flex-grow whitespace-pre-wrap font-light italic font-serif">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/[0.06]">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400/15 to-amber-600/5 border border-amber-400/20 flex items-center justify-center text-amber-300 font-bold text-lg font-serif">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{testimonial.name}</h4>
                    <p className="text-amber-400/70 text-xs font-medium">
                      {testimonial.role}{' '}
                      {testimonial.company && (
                        <span>
                          at <span className="text-gray-300">{testimonial.company}</span>
                        </span>
                      )}
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
