import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, AlertCircle, CheckCircle2, X } from 'lucide-react';
import api from '../api/axios';

const Testimonials = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: '', role: '', company: '', content: '', state: 'DRAFT'
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('testimonials/');
      setItems(response.data);
    } catch (error) { showMessage('error', 'Failed to load testimonials.'); }
    finally { setIsLoading(false); }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const openModal = (item = null) => {
    if (item) { setCurrentItem(item); setIsEditing(true); }
    else { setCurrentItem({ name: '', role: '', company: '', content: '', state: 'DRAFT' }); setIsEditing(false); }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setIsEditing(false); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`testimonials/${currentItem.id}/`, currentItem);
        showMessage('success', 'Testimonial updated successfully!');
      } else {
        await api.post('testimonials/', currentItem);
        showMessage('success', 'Testimonial created successfully!');
      }
      closeModal();
      fetchItems();
    } catch (error) { showMessage('error', error.response?.data?.detail || 'Failed to save testimonial.'); }
  };

  const confirmDelete = (item) => { setItemToDelete(item); setIsDeleting(true); };

  const handleDelete = async () => {
    try {
      await api.delete(`testimonials/${itemToDelete.id}/`);
      showMessage('success', 'Testimonial deleted successfully!');
      setIsDeleting(false); setItemToDelete(null); fetchItems();
    } catch (error) { showMessage('error', 'Failed to delete testimonial.'); setIsDeleting(false); }
  };

  if (isLoading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Testimonials Management</h1>
        <button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-start ${message.type === 'error' ? 'bg-red-900/50 border border-red-500' : 'bg-emerald-900/50 border border-emerald-500'}`}>
          {message.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-400 mr-2" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-2" />}
          <p className={message.type === 'error' ? 'text-red-200' : 'text-emerald-200'}>{message.text}</p>
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center text-gray-400">No testimonials found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{item.name}</h3>
                  <p className="text-sm text-gray-400">{item.role} {item.company && `at ${item.company}`}</p>
                </div>
                {item.state === 'PUBLISHED' ? (
                  <span className="px-2 py-1 bg-emerald-900/50 text-emerald-400 text-xs rounded border border-emerald-500/30 font-medium">Published</span>
                ) : (
                  <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 text-xs rounded border border-yellow-500/30 font-medium">Draft</span>
                )}
              </div>
              <p className="text-gray-300 mb-6 flex-1 italic">"{item.content}"</p>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button onClick={() => openModal(item)} className="text-gray-400 hover:text-indigo-400 transition-colors"><Edit2 size={18} /></button>
                <button onClick={() => confirmDelete(item)} className="text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-950/80 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl shadow-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white">{isEditing ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input type="text" name="name" required value={currentItem.name} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                  <input type="text" name="role" required value={currentItem.role} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Company (Optional)</label>
                  <input type="text" name="company" value={currentItem.company} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                  <select name="state" value={currentItem.state} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                  <textarea name="content" required rows="4" value={currentItem.content} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleting && (
        <div className="fixed inset-0 bg-gray-950/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Delete Testimonial?</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to delete this testimonial? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsDeleting(false)} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700">Cancel</button>
              <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
