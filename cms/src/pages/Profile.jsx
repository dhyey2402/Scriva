import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import api from '../api/axios';

const Profile = () => {
  const [profile, setProfile] = useState({
    id: null,
    name: '',
    title: '',
    bio: '',
    contact_email: '',
    image: null,
    resume: null,
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('profiles/');
      if (response.data && response.data.length > 0) {
        const p = response.data[0];
        setProfile(p);
        if (p.image) setImagePreview(p.image);
        if (p.resume) setResumePreview(p.resume);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      showMessage('error', 'Failed to load profile data.');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'image') {
        setProfile(prev => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
      } else if (type === 'resume') {
        setProfile(prev => ({ ...prev, resume: file }));
        setResumePreview(file.name);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('title', profile.title);
    formData.append('bio', profile.bio);
    formData.append('contact_email', profile.contact_email);
    
    if (profile.image instanceof File) {
      formData.append('image', profile.image);
    }
    
    if (profile.resume instanceof File) {
      formData.append('resume', profile.resume);
    }

    try {
      if (profile.id) {
        await api.patch(`profiles/${profile.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        const res = await api.post('profiles/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setProfile(prev => ({ ...prev, id: res.data.id }));
      }
      showMessage('success', 'Profile saved successfully!');
    } catch (error) {
      console.error("Error saving profile:", error);
      showMessage('error', error.response?.data?.detail || 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-gray-400">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Profile Management</h1>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-start ${message.type === 'error' ? 'bg-red-900/50 border border-red-500' : 'bg-emerald-900/50 border border-emerald-500'}`}>
          {message.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-2 mt-0.5" />
          )}
          <p className={message.type === 'error' ? 'text-red-200' : 'text-emerald-200'}>{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-700 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              required
              value={profile.name}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              required
              value={profile.title}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Bio</label>
          <textarea
            name="bio"
            required
            rows="5"
            value={profile.bio}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Contact Email</label>
          <input
            type="email"
            name="contact_email"
            required
            value={profile.contact_email}
            onChange={handleChange}
            className="w-full md:w-1/2 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-700">
          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">Profile Image</label>
            <div className="flex items-center gap-6">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-900 border-2 border-dashed border-gray-600 flex items-center justify-center">
                  <span className="text-gray-500 text-xs text-center px-2">No image</span>
                </div>
              )}
              <div>
                <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors inline-block">
                  <Upload size={16} />
                  Choose Image
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
                </label>
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">Resume (PDF)</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Upload size={16} />
                Choose File
                <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileChange(e, 'resume')} />
              </label>
              {resumePreview && (
                <span className="text-sm text-indigo-400 max-w-[200px] truncate block">
                  {typeof resumePreview === 'string' ? resumePreview.split('/').pop() : resumePreview}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                Saving...
              </span>
            ) : (
              <>
                <Save size={18} />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
