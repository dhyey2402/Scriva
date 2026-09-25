import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, AlertCircle, CheckCircle2, X } from 'lucide-react';
import api from '../api/axios';

const Education = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({ institution: '', degree: '', description: '', year: new Date().getFullYear() });

  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('education/');
      setItems(response.data);
    } catch (error) { showMessage('error', 'Failed to load education.'); }
    finally { setIsLoading(false); }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const openModal = (item = null) => {
    if (item) { setCurrentItem(item); setIsEditing(true); }
    else { setCurrentItem({ institution: '', degree: '', description: '', year: new Date().getFullYear() }); setIsEditing(false); }
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
        await api.put(`education/${currentItem.id}/`, currentItem);
        showMessage('success', 'Education updated successfully!');
      } else {
        await api.post('education/', currentItem);
        showMessage('success', 'Education added successfully!');
      }
      closeModal();
      fetchItems();
    } catch (error) { showMessage('error', error.response?.data?.detail || 'Failed to save education.'); }
  };

  const confirmDelete = (item) => { setItemToDelete(item); setIsDeleting(true); };

  const handleDelete = async () => {
    try {
      await api.delete(`education/${itemToDelete.id}/`);
      showMessage('success', 'Education deleted successfully!');
      setIsDeleting(false); setItemToDelete(null); fetchItems();
    } catch (error) { showMessage('error', 'Failed to delete education.'); setIsDeleting(false); }
  };

  if (isLoading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Education Management</h1>
        <button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Add Education
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-start ${message.type === 'error' ? 'bg-red-900/50 border border-red-500' : 'bg-emerald-900/50 border border-emerald-500'}`}>
          <p className={message.type === 'error' ? 'text-red-200' : 'text-emerald-200'}>{message.text}</p>
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center text-gray-400">No education entries found.</div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 border-b border-gray-700 text-gray-400 text-sm">
                <th className="p-4 font-medium">Degree</th>
                <th className="p-4 font-medium">Institution</th>
                <th className="p-4 font-medium">Year</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-700/30">
                  <td className="p-4 text-white font-medium">{item.degree}</td>
                  <td className="p-4 text-gray-300">{item.institution}</td>
                  <td className="p-4 text-gray-400">{item.year}</td>
                  <td className="p-4 flex justify-end gap-3">
                    <button onClick={() => openModal(item)} className="text-gray-400 hover:text-indigo-400"><Edit2 size={18} /></button>
                    <button onClick={() => confirmDelete(item)} className="text-gray-400 hover:text-red-400"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-950/80 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg shadow-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white">{isEditing ? 'Edit Education' : 'Add Education'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Degree</label>
                <input type="text" name="degree" required value={currentItem.degree} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Institution</label>
                <input type="text" name="institution" required value={currentItem.institution} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Year</label>
                <input type="number" name="year" required value={currentItem.year} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
                <textarea name="description" rows="3" value={currentItem.description} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"></textarea>
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
            <h3 className="text-lg font-bold text-white mb-2">Delete Education?</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to delete this entry?</p>
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

export default Education;
