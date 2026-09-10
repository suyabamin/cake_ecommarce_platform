import React, { useState, useEffect } from 'react';
import { 
  fetchCategories, createCategory, updateCategory, deleteCategory 
} from '../../firebase/services';
import { uploadImage } from '../../services/cloudinary';
import { useNotification } from '../../context/NotificationContext';
import Modal from '../../components/common/Modal';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    active: true
  });

  useEffect(() => {
    loadCats();
  }, []);

  async function loadCats() {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error('Cat load error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingCat(null);
    setFormData({ name: '', description: '', image: '', active: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
      active: cat.active !== undefined ? cat.active : true
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: url }));
      showToast('Category image uploaded!', 'success');
    } catch (err) {
      showToast('Upload failed.', 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      if (editingCat) {
        await updateCategory(editingCat.id, formData);
        showToast('Category updated.', 'success');
      } else {
        await createCategory(formData);
        showToast('Category created.', 'success');
      }
      setIsModalOpen(false);
      loadCats();
    } catch (err) {
      showToast('Error saving category.', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await deleteCategory(id);
      showToast('Category deleted.', 'success');
      loadCats();
    } catch (err) {
      showToast('Delete error.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif-title font-bold text-3xl text-gray-900">Cake Categories</h1>
          <p className="text-xs text-gray-500 mt-1">Organize shop products into seasonal & themed categories.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-full bg-rose-600 text-white font-bold text-xs shadow-lg hover:bg-rose-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="glass-card rounded-3xl p-5 border border-rose-100 flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-3">
              <img src={cat.image} alt="" className="w-14 h-14 rounded-2xl object-cover border border-rose-200" />
              <div>
                <h4 className="font-serif-title font-bold text-base text-gray-900">{cat.name}</h4>
                <p className="text-[11px] text-gray-500 line-clamp-2">{cat.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-rose-100 flex items-center justify-between text-xs">
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                cat.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {cat.active ? 'Active Category' : 'Inactive'}
              </span>

              <div className="flex gap-2">
                <button onClick={() => handleOpenEdit(cat)} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="p-1.5 bg-gray-100 text-gray-600 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Category Details">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Category Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Banner Image</label>
              <input type="file" onChange={handleImageUpload} className="text-xs" />
              {formData.image && <img src={formData.image} alt="" className="w-16 h-16 rounded-xl mt-2 object-cover" />}
            </div>

            <div className="pt-3 border-t border-rose-100 flex justify-end gap-2">
              <button type="submit" className="px-5 py-2 bg-rose-600 text-white font-bold text-xs rounded-full">
                Save Category
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
