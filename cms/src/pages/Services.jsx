import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, AlertCircle, CheckCircle2, X, Upload } from 'lucide-react';
import api from '../api/axios';

const Services = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({ title: '', description: '', icon: null });
  const [iconPreview, setIconPreview] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('services/');
      setItems(response.data);
    } catch (error) { showMessage('error', 'Failed to load services.'); }
    finally { setIsLoading(false); }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const openModal = (item = null) => {
    if (item) { setCurrentItem(item); setIsEditing(true); setIconPreview(item.icon); }
    else { setCurrentItem({ title: '', description: '', icon: null }); setIsEditing(false); setIconPreview(null); }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setIsEditing(false); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentItem(prev => ({ ...prev, icon: file }));
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', currentItem.title);
    formData.append('description', currentItem.description);
    if (currentItem.icon instanceof File) { formData.append('icon', currentItem.icon); }

    try {
      if (isEditing) {
        await api.patch(`services/${currentItem.id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
        showMessage('success', 'Service updated successfully!');
      } else {
        await api.post('services/', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
        showMessage('success', 'Service created successfully!');
      }
      closeModal();
      fetchItems();
    } catch (error) { showMessage('error', error.response?.data?.detail || 'Failed to save service.'); }
  };

  const confirmDelete = (item) => { setItemToDelete(item); setIsDeleting(true); };

  const handleDelete = async () => {
    try {
      await api.delete(`services/${itemToDelete.id}/`);
      showMessage('success', 'Service deleted successfully!');
      setIsDeleting(false); setItemToDelete(null); fetchItems();
    } catch (error) { showMessage('error', 'Failed to delete service.'); setIsDeleting(false); }
  };

  if (isLoading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Services Management</h1>
        <button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Add Service
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-start ${message.type === 'error' ? 'bg-red-900/50 border border-red-500' : 'bg-emerald-900/50 border border-emerald-500'}`}>
          <p className={message.type === 'error' ? 'text-red-200' : 'text-emerald-200'}>{message.text}</p>
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center text-gray-400">No services found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col">
              {item.icon && <img src={item.icon} alt={item.title} className="w-12 h-12 mb-4 object-contain" />}
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-6 flex-1">{item.description}</p>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button onClick={() => openModal(item)} className="text-gray-400 hover:text-indigo-400"><Edit2 size={18} /></button>
                <button onClick={() => confirmDelete(item)} className="text-gray-400 hover:text-red-400"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-950/80 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md shadow-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white">{isEditing ? 'Edit Service' : 'Add Service'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input type="text" name="title" required value={currentItem.title} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea name="description" required rows="4" value={currentItem.description} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Icon Image</label>
                <div className="flex items-center gap-4">
                  {iconPreview ? <img src={iconPreview} alt="Preview" className="w-12 h-12 object-contain bg-gray-700 rounded p-1" /> : <div className="w-12 h-12 bg-gray-700 rounded"></div>}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-gray-400" />
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
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-white mb-2">Delete Service?</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to delete this service?</p>
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

export default Services;
