import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories } from '../../store/productSlice';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, X, Loader2, Sparkles } from 'lucide-react';

const ProductsAdminPage = () => {
  const dispatch = useDispatch();
  const { products, categories, loading } = useSelector((state) => state.product);
  const { userInfo } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [images, setImages] = useState('');
  const [stock, setStock] = useState('10');
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setOriginalPrice('');
    setDescription('');
    setCategory(categories[0]?._id || '');
    setBrand('Generic');
    setImages('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80');
    setStock('15');
    setIsFeatured(false);
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || p.price);
    setDescription(p.description);
    setCategory(p.category?._id || p.category);
    setBrand(p.brand || '');
    setImages(p.images ? p.images.join(', ') : '');
    setStock(p.stock);
    setIsFeatured(Boolean(p.isFeatured));
    setShowModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const payload = {
      name,
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      description,
      category,
      brand,
      images: images.split(',').map(i => i.trim()).filter(Boolean),
      stock: Number(stock),
      isFeatured
    };

    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, payload, config);
      } else {
        await axios.post('/api/products', payload, config);
      }
      setShowModal(false);
      dispatch(fetchProducts());
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/products/${id}`, config);
        dispatch(fetchProducts());
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Product Catalog Management</h1>
          <p className="text-xs text-slate-400">Create, update stock, edit pricing, and configure featured products</p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">Product Info</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Featured</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 text-slate-300">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-slate-900/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img src={p.images?.[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-slate-800" />
                    <div>
                      <p className="font-bold text-white line-clamp-1">{p.name}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-400 font-semibold">{p.category?.name || 'Uncategorized'}</td>
                <td className="p-4 font-extrabold text-indigo-400">${p.price.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    p.stock > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {p.stock} units
                  </span>
                </td>
                <td className="p-4">
                  {p.isFeatured && (
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center w-fit">
                      <Sparkles className="w-3 h-3 mr-1" /> Featured
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => openEditModal(p)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold">{editingProduct ? 'Edit Product' : 'Create Product'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Image URLs (comma separated)</label>
                <input
                  type="text"
                  required
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="featured" className="text-xs font-bold text-slate-300">Feature this product on Homepage Spotlight</label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-800">
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductsAdminPage;
