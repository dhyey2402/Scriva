import React, { useState } from 'react';
import { Send, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setStatus({ type: 'submitting', message: '' });

    try {
      await api.post('contact/', formData);
      setStatus({ type: 'success', message: 'Message sent successfully! I will get back to you soon.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (status.type === 'error') setStatus({ type: 'idle', message: '' });
  };

  return (
    <div className="space-y-12 animate-fade-in-up max-w-4xl mx-auto w-full">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gold-badge text-[11px] font-mono tracking-widest uppercase">
          Get Connected
        </div>
        <h1 className="heading-serif text-4xl sm:text-5xl text-white">
          Get in Touch
        </h1>
        <p className="text-lg text-gray-400 font-light max-w-lg mx-auto">
          Have a project in mind or want to explore an opportunity? Drop me a message.
        </p>
      </div>

      <div className="glass-card p-8 md:p-12 rounded-2xl gold-glow">
        {status.type === 'success' ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-5 animate-scale-in">
            <div className="h-18 w-18 bg-emerald-400/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-400/20 p-4">
              <CheckCircle size={36} />
            </div>
            <h3 className="text-2xl font-bold text-white font-serif">Thank You!</h3>
            <p className="text-gray-400 font-light">{status.message}</p>
            <button
              onClick={() => setStatus({ type: 'idle', message: '' })}
              className="mt-4 btn-secondary px-6 py-2.5 rounded-xl text-sm font-semibold"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status.type === 'error' && (
              <div className="glass-subtle rounded-xl p-4 flex items-center gap-3 border-red-400/20 animate-fade-in">
                <XCircle size={18} className="text-red-400 shrink-0" />
                <p className="text-sm font-medium text-red-300">{status.message}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-300 ml-1">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  maxLength={100}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 focus:bg-white/[0.05] transition-all duration-300 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300 ml-1">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  maxLength={254}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 focus:bg-white/[0.05] transition-all duration-300 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-300 ml-1">Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                maxLength={2000}
                value={formData.message}
                onChange={handleChange}
                placeholder="How can I help you?"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 focus:bg-white/[0.05] transition-all duration-300 resize-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={status.type === 'submitting'}
              className="w-full md:w-auto btn-primary px-8 py-4 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {status.type === 'submitting' ? (
                <>Sending...</>
              ) : (
                <>Send Message <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
