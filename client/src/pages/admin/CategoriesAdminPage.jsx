import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../store/productSlice';
import axios from 'axios';
import { Plus, Edit2, Trash2, FolderTree, X } from 'lucide-react';

const CategoriesAdminPage = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.product);
  const { userInfo } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');
    setDescription('');
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setImage(cat.image);
    setDescription(cat.description || '');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const payload = { name, image, description };

    try {
      if (editingCategory) {
        await axios.put(`/api/categories/${editingCategory._id}`, payload, config);
      } else {
        await axios.post('/api/categories', payload, config);
      }
      setShowModal(false);
      dispatch(fetchCategories());
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/categories/${id}`, config);
        dispatch(fetchCategories());
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Category Taxonomy Management</h1>
          <p className="text-xs text-slate-400">Organize catalog items into structured shopping categories</p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center space-x-4">
              <img src={cat.image} alt={cat.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-800" />
              <div>
                <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                <p className="text-[10px] text-indigo-400 font-mono">/slug/{cat.slug}</p>
                <span className="text-[11px] text-slate-500 font-bold">{cat.productCount || 0} Products</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2">{cat.description || 'No description provided.'}</p>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-900">
              <button onClick={() => openEditModal(cat)} className="p-2 text-slate-400 hover:text-white rounded-lg">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(cat._id)} className="p-2 text-slate-400 hover:text-rose-400 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold">{editingCategory ? 'Edit Category' : 'Create Category'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Banner Image URL</label>
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CategoriesAdminPage;
