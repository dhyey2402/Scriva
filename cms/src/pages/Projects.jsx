import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, AlertCircle, CheckCircle2, X, Upload, ExternalLink, Code } from 'lucide-react';
import api from '../api/axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    title: '',
    description: '',
    github_url: '',
    live_url: '',
    featured: false,
    display_order: 0,
    state: 'DRAFT',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('projects/');
      setProjects(response.data);
    } catch (error) {
      showMessage('error', 'Failed to load projects.');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const openModal = (project = null) => {
    if (project) {
      setCurrentProject(project);
      setIsEditing(true);
      setImagePreview(project.image);
    } else {
      setCurrentProject({
        title: '',
        description: '',
        github_url: '',
        live_url: '',
        featured: false,
        display_order: 0,
        state: 'DRAFT',
        image: null
      });
      setIsEditing(false);
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentProject(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentProject(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', currentProject.title);
    formData.append('description', currentProject.description);
    if (currentProject.github_url) formData.append('github_url', currentProject.github_url);
    if (currentProject.live_url) formData.append('live_url', currentProject.live_url);
    formData.append('featured', currentProject.featured);
    formData.append('display_order', currentProject.display_order);
    formData.append('state', currentProject.state);
    
    if (currentProject.image instanceof File) {
      formData.append('image', currentProject.image);
    }

    try {
      if (isEditing) {
        await api.patch(`projects/${currentProject.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showMessage('success', 'Project updated successfully!');
      } else {
        await api.post('projects/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showMessage('success', 'Project created successfully!');
      }
      closeModal();
      fetchProjects();
    } catch (error) {
      showMessage('error', error.response?.data?.detail || 'Failed to save project.');
    }
  };

  const confirmDelete = (project) => {
    setProjectToDelete(project);
    setIsDeleting(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`projects/${projectToDelete.id}/`);
      showMessage('success', 'Project deleted successfully!');
      setIsDeleting(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (error) {
      showMessage('error', 'Failed to delete project.');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="text-gray-400">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Projects Management</h1>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Project
        </button>
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

      {projects.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
          <h3 className="text-lg font-medium text-white mb-2">No projects added yet</h3>
          <p className="text-gray-400 mb-4">Add your first project to showcase your work.</p>
          <button
            onClick={() => openModal()}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            + Create your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg flex flex-col">
              {project.image ? (
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-900 flex items-center justify-center">
                  <span className="text-gray-600">No Image</span>
                </div>
              )}
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  <div className="flex gap-2">
                    {project.state === 'PUBLISHED' ? (
                      <span className="px-2 py-1 bg-emerald-900/50 text-emerald-400 text-xs rounded border border-emerald-500/30 font-medium">Published</span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 text-xs rounded border border-yellow-500/30 font-medium">Draft</span>
                    )}
                    {project.featured && (
                      <span className="px-2 py-1 bg-indigo-900/50 text-indigo-400 text-xs rounded border border-indigo-500/30 font-medium">Featured</span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3">{project.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                      <Code size={18} />
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-700 mt-auto">
                  <span className="text-xs text-gray-500">Order: {project.display_order}</span>
                  <div className="flex gap-3">
                    <button onClick={() => openModal(project)} className="text-gray-400 hover:text-indigo-400 transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => confirmDelete(project)} className="text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-950/80 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl shadow-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white">{isEditing ? 'Edit Project' : 'Add Project'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={currentProject.title}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    value={currentProject.description}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    name="github_url"
                    value={currentProject.github_url || ''}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Live URL</label>
                  <input
                    type="url"
                    name="live_url"
                    value={currentProject.live_url || ''}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="md:col-span-2 flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={currentProject.featured}
                        onChange={handleChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500 focus:ring-offset-gray-900"
                      />
                      <span className="text-sm font-medium text-gray-300">Featured</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <label className="block text-sm font-medium text-gray-300">State:</label>
                    <select
                      name="state"
                      value={currentProject.state}
                      onChange={handleChange}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-indigo-500 text-sm"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    name="display_order"
                    value={currentProject.display_order}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="md:col-span-2 space-y-4 pt-2">
                  <label className="block text-sm font-medium text-gray-300">Project Image</label>
                  <div className="flex items-center gap-6">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-32 h-20 object-cover rounded-lg border border-gray-600" />
                    ) : (
                      <div className="w-32 h-20 rounded-lg bg-gray-900 border-2 border-dashed border-gray-600 flex items-center justify-center">
                        <span className="text-gray-500 text-xs text-center px-2">No image</span>
                      </div>
                    )}
                    <div>
                      <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors inline-block">
                        <Upload size={16} />
                        Choose Image
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                  {isEditing ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-gray-950/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Delete Project?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete <span className="text-white font-medium">"{projectToDelete?.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
