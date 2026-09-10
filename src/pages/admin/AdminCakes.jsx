import React, { useState, useEffect } from 'react';
import { 
  fetchCakes, fetchCategories, createCake, updateCake, deleteCake 
} from '../../firebase/services';
import { uploadImage } from '../../services/cloudinary';
import { useNotification } from '../../context/NotificationContext';
import Modal from '../../components/common/Modal';
import RatingStars from '../../components/common/RatingStars';
import { 
  Plus, Edit, Trash2, Image, Sparkles, Check, X, Search, Cake 
} from 'lucide-react';

export default function AdminCakes() {
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useNotification();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCake, setEditingCake] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    price: '',
    discountPrice: '',
    thumbnail: '',
    images: [],
    availability: 'in-stock',
    stock: 10,
    featured: false,
    ingredients: '',
    flavor: '',
    weight: '1.5 kg',
    size: '8 inches',
    preparationTime: '24 Hours'
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [cakesData, catData] = await Promise.all([
        fetchCakes(),
        fetchCategories()
      ]);
      setCakes(cakesData);
      setCategories(catData);
    } catch (err) {
      console.error('Admin cakes load error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAddModal = () => {
    setEditingCake(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      description: '',
      price: '',
      discountPrice: '',
      thumbnail: '',
      images: [],
      availability: 'in-stock',
      stock: 10,
      featured: false,
      ingredients: '',
      flavor: '',
      weight: '1.5 kg',
      size: '8 inches',
      preparationTime: '24 Hours'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cake) => {
    setEditingCake(cake);
    setFormData({
      name: cake.name || '',
      categoryId: cake.categoryId || categories[0]?.id || '',
      description: cake.description || '',
      price: cake.price || '',
      discountPrice: cake.discountPrice || '',
      thumbnail: cake.thumbnail || '',
      images: cake.images || [],
      availability: cake.availability || 'in-stock',
      stock: cake.stock || 10,
      featured: !!cake.featured,
      ingredients: cake.ingredients || '',
      flavor: cake.flavor || '',
      weight: cake.weight || '1.5 kg',
      size: cake.size || '8 inches',
      preparationTime: cake.preparationTime || '24 Hours'
    });
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setFormData(prev => ({
        ...prev,
        thumbnail: url,
        images: prev.images.includes(url) ? prev.images : [url, ...prev.images]
      }));
      showToast('Image uploaded and compressed successfully!', 'success');
    } catch (err) {
      showToast('Failed to upload image.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveCake = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showToast('Name and price are required fields.', 'error');
      return;
    }

    const categoryObj = categories.find(c => c.id === formData.categoryId);
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
      stock: parseInt(formData.stock) || 0,
      categoryName: categoryObj?.name || 'General Boutique',
      thumbnail: formData.thumbnail || 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80',
      images: formData.images.length ? formData.images : [formData.thumbnail || 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80']
    };

    try {
      if (editingCake) {
        await updateCake(editingCake.id, payload);
        showToast(`Updated cake "${formData.name}"`, 'success');
      } else {
        await createCake(payload);
        showToast(`Added new cake "${formData.name}"`, 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Error saving cake.', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete cake "${name}"?`)) return;
    try {
      await deleteCake(id);
      showToast(`Deleted "${name}"`, 'success');
      loadData();
    } catch (err) {
      showToast('Error deleting cake.', 'error');
    }
  };

  const filteredCakes = cakes.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-title font-bold text-3xl text-gray-900">Manage Boutique Cakes</h1>
          <p className="text-xs text-gray-500 mt-1">Add, edit, publish, and upload photos for artisan cakes.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-full bg-rose-600 text-white font-bold text-xs shadow-lg hover:bg-rose-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Cake
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Filter by cake name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-rose-500"
        />
        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Cakes Table */}
      <div className="glass-card rounded-3xl p-6 border border-rose-100 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-rose-100 text-gray-400 font-bold uppercase text-[10px]">
              <th className="py-3 px-2">Cake</th>
              <th className="py-3 px-2">Category</th>
              <th className="py-3 px-2">Price</th>
              <th className="py-3 px-2">Stock</th>
              <th className="py-3 px-2">Featured</th>
              <th className="py-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50">
            {filteredCakes.map((c) => (
              <tr key={c.id} className="hover:bg-rose-50/50 transition">
                <td className="py-3 px-2 flex items-center gap-3">
                  <img src={c.thumbnail} alt="" className="w-10 h-10 rounded-xl object-cover border border-rose-100" />
                  <div>
                    <strong className="text-gray-900 block">{c.name}</strong>
                    <span className="text-[10px] text-gray-400">{c.size || '8 inches'}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-gray-600">{c.categoryName}</td>
                <td className="py-3 px-2 font-bold text-gray-900">
                  ${c.price.toFixed(2)}
                  {c.discountPrice && <span className="text-[10px] text-rose-600 block">${c.discountPrice.toFixed(2)} sale</span>}
                </td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    c.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {c.stock > 0 ? `${c.stock} in stock` : 'Out of stock'}
                  </span>
                </td>
                <td className="py-3 px-2">
                  {c.featured ? (
                    <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                      <Sparkles className="w-3 h-3" /> Yes
                    </span>
                  ) : <span className="text-gray-400">No</span>}
                </td>
                <td className="py-3 px-2 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(c)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                    title="Edit Cake"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-rose-100 hover:text-rose-600"
                    title="Delete Cake"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Cake Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCake ? `Edit "${editingCake.name}"` : 'Add New Artisan Cake'}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveCake} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Cake Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 text-xs"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Regular Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Discount Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Stock Count</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 text-xs"
                />
              </div>
            </div>

            {/* Image Upload Area */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Upload Photo (Cloudinary / Storage)</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-100 file:text-rose-700"
                />
                {uploadingImage && <span className="text-xs text-rose-600 animate-pulse">Compressing & Uploading...</span>}
              </div>
              {formData.thumbnail && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={formData.thumbnail} alt="" className="w-12 h-12 rounded-xl object-cover border border-rose-200" />
                  <span className="text-[10px] text-gray-400 truncate max-w-xs">{formData.thumbnail}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="accent-rose-600"
                />
                Mark as Featured Product
              </label>
            </div>

            <div className="pt-3 border-t border-rose-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-full border text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-rose-600 text-white rounded-full text-xs font-bold shadow-md hover:bg-rose-700"
              >
                Save Cake
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
