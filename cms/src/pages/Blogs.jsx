import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, AlertCircle, CheckCircle2, X, Upload } from 'lucide-react';
import api from '../api/axios';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({
    title: '',
    content: '',
    state: 'DRAFT',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('blogs/');
      setBlogs(response.data);
    } catch (error) {
      showMessage('error', 'Failed to load blogs.');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const openModal = (blog = null) => {
    if (blog) {
      setCurrentBlog(blog);
      setIsEditing(true);
      setImagePreview(blog.image);
    } else {
      setCurrentBlog({
        title: '',
        content: '',
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
    const { name, value } = e.target;
    setCurrentBlog(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentBlog(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', currentBlog.title);
    formData.append('content', currentBlog.content);
    formData.append('state', currentBlog.state);
    
    if (currentBlog.image instanceof File) {
      formData.append('image', currentBlog.image);
    }

    try {
      if (isEditing) {
        await api.patch(`blogs/${currentBlog.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showMessage('success', 'Blog updated successfully!');
      } else {
        await api.post('blogs/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showMessage('success', 'Blog created successfully!');
      }
      closeModal();
      fetchBlogs();
    } catch (error) {
      showMessage('error', error.response?.data?.detail || 'Failed to save blog.');
    }
  };

  const confirmDelete = (blog) => {
    setBlogToDelete(blog);
    setIsDeleting(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`blogs/${blogToDelete.id}/`);
      showMessage('success', 'Blog deleted successfully!');
      setIsDeleting(false);
      setBlogToDelete(null);
      fetchBlogs();
    } catch (error) {
      showMessage('error', 'Failed to delete blog.');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="text-gray-400">Loading blogs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Blogs Management</h1>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Blog
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

      {blogs.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
          <h3 className="text-lg font-medium text-white mb-2">No blogs added yet</h3>
          <p className="text-gray-400 mb-4">Add your first blog post to share your thoughts.</p>
          <button
            onClick={() => openModal()}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            + Create your first blog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg flex flex-col md:flex-row h-auto md:h-48">
              {blog.image ? (
                <img src={blog.image} alt={blog.title} className="w-full md:w-48 h-48 md:h-full object-cover" />
              ) : (
                <div className="w-full md:w-48 h-48 md:h-full bg-gray-900 flex items-center justify-center">
                  <span className="text-gray-600">No Image</span>
                </div>
              )}
              
              <div className="p-5 flex-1 flex flex-col min-w-0">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="text-xl font-bold text-white truncate">{blog.title}</h3>
                  <div className="flex-shrink-0">
                    {blog.state === 'PUBLISHED' ? (
                      <span className="px-2 py-1 bg-emerald-900/50 text-emerald-400 text-xs rounded border border-emerald-500/30 font-medium">Published</span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 text-xs rounded border border-yellow-500/30 font-medium">Draft</span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-2">{blog.content}</p>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-700 mt-auto">
                  <span className="text-xs text-gray-500">{new Date(blog.created_at).toLocaleDateString()}</span>
                  <div className="flex gap-3">
                    <button onClick={() => openModal(blog)} className="text-gray-400 hover:text-indigo-400 transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => confirmDelete(blog)} className="text-gray-400 hover:text-red-400 transition-colors">
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
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-3xl shadow-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white">{isEditing ? 'Edit Blog' : 'Add Blog'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={currentBlog.title}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                <textarea
                  name="content"
                  required
                  rows="12"
                  value={currentBlog.content}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 custom-scrollbar"
                ></textarea>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex items-center gap-4">
                  <label className="block text-sm font-medium text-gray-300">State:</label>
                  <select
                    name="state"
                    value={currentBlog.state}
                    onChange={handleChange}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-indigo-500 text-sm"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <label className="block text-sm font-medium text-gray-300">Blog Image</label>
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
                  {isEditing ? 'Save Changes' : 'Create Blog'}
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
            <h3 className="text-lg font-bold text-white mb-2">Delete Blog?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete <span className="text-white font-medium">"{blogToDelete?.title}"</span>? This action cannot be undone.
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

export default Blogs;
