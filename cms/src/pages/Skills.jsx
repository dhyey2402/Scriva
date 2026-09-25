import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, AlertCircle, CheckCircle2, X, Wrench } from 'lucide-react';
import api from '../api/axios';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState({
    name: '',
    category: '',
    proficiency: 50,
    display_order: 0
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get('skills/');
      setSkills(response.data);
    } catch (error) {
      showMessage('error', 'Failed to load skills.');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const openModal = (skill = null) => {
    if (skill) {
      setCurrentSkill(skill);
      setIsEditing(true);
    } else {
      setCurrentSkill({ name: '', category: '', proficiency: 50, display_order: 0 });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSkill({ name: '', category: '', proficiency: 50, display_order: 0 });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentSkill(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`skills/${currentSkill.id}/`, currentSkill);
        showMessage('success', 'Skill updated successfully!');
      } else {
        await api.post('skills/', currentSkill);
        showMessage('success', 'Skill created successfully!');
      }
      closeModal();
      fetchSkills();
    } catch (error) {
      showMessage('error', error.response?.data?.detail || 'Failed to save skill.');
    }
  };

  const confirmDelete = (skill) => {
    setSkillToDelete(skill);
    setIsDeleting(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`skills/${skillToDelete.id}/`);
      showMessage('success', 'Skill deleted successfully!');
      setIsDeleting(false);
      setSkillToDelete(null);
      fetchSkills();
    } catch (error) {
      showMessage('error', 'Failed to delete skill.');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="text-gray-400">Loading skills...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Skills Management</h1>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Skill
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

      {skills.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
          <Wrench className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No skills added yet</h3>
          <p className="text-gray-400 mb-4">Add your first skill to showcase your expertise.</p>
          <button
            onClick={() => openModal()}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            + Create your first skill
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 border-b border-gray-700 text-gray-400 text-sm">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Proficiency</th>
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="p-4 text-white font-medium">{skill.name}</td>
                  <td className="p-4 text-gray-300">{skill.category}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-700 rounded-full h-2.5 max-w-[100px]">
                        <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${skill.proficiency}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-400 w-8">{skill.proficiency}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{skill.display_order}</td>
                  <td className="p-4 flex justify-end gap-3">
                    <button onClick={() => openModal(skill)} className="text-gray-400 hover:text-indigo-400 transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => confirmDelete(skill)} className="text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-950/80 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md shadow-2xl my-8 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white">{isEditing ? 'Edit Skill' : 'Add Skill'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={currentSkill.name}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  required
                  value={currentSkill.category}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Frontend, Backend, Tools"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Proficiency ({currentSkill.proficiency}%)</label>
                <input
                  type="range"
                  name="proficiency"
                  min="0"
                  max="100"
                  value={currentSkill.proficiency}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  value={currentSkill.display_order}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  {isEditing ? 'Save Changes' : 'Add Skill'}
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
            <h3 className="text-lg font-bold text-white mb-2">Delete Skill?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete <span className="text-white font-medium">"{skillToDelete?.name}"</span>? This action cannot be undone.
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

export default Skills;
