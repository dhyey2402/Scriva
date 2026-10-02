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
    <div className="space-y-12 animate-in fade-in duration-700 max-w-4xl mx-auto w-full">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
        <p className="text-xl text-gray-400">
          Have a project in mind or want to explore an opportunity? Drop me a message.
        </p>
      </div>

      <div className="glass-panel p-8 md:p-12 rounded-3xl">
        {status.type === 'success' ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white">Thank You!</h3>
            <p className="text-gray-400">{status.message}</p>
            <button 
              onClick={() => setStatus({ type: 'idle', message: '' })}
              className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white font-semibold transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status.type === 'error' && (
              <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3">
                <XCircle size={20} />
                <p className="text-sm font-medium">{status.message}</p>
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
                  className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
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
                  className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
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
                className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
              />
            </div>
            
            <button
              type="submit"
              disabled={status.type === 'submitting'}
              className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 group"
            >
              {status.type === 'submitting' ? (
                <>Sending...</>
              ) : (
                <>Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
