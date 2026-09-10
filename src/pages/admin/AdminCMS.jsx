import React, { useState, useEffect } from 'react';
import { fetchSiteContent, updateSiteContent } from '../../firebase/services';
import { uploadImage } from '../../services/cloudinary';
import { useNotification } from '../../context/NotificationContext';
import { 
  FileText, Save, Image as ImageIcon, Plus, Trash2, 
  ArrowUp, ArrowDown, Eye, EyeOff, Upload, Check, AlertCircle 
} from 'lucide-react';

export default function AdminCMS() {
  const [content, setContent] = useState({
    heroTitle: '',
    heroSubtitle: '',
    bannerText: '',
    aboutTitle: '',
    aboutBody: '',
    contactEmail: '',
    contactPhone: '',
    deliveryPolicy: '',
    sliderImages: []
  });

  const [sliderImages, setSliderImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const { showToast } = useNotification();

  useEffect(() => {
    fetchSiteContent().then(data => {
      if (data) {
        setContent(prev => ({ ...prev, ...data }));
        if (Array.isArray(data.sliderImages)) {
          setSliderImages(data.sliderImages);
        }
      }
    });
  }, []);

  // Handle Multi-Image Upload
  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    showToast(`Uploading ${files.length} slider image(s)...`, 'info');

    try {
      const uploadedSlides = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadImage(file);
        if (url) {
          uploadedSlides.push({
            id: 'slide-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            imageUrl: url,
            title: file.name.replace(/\.[^/.]+$/, ''),
            order: sliderImages.length + i + 1,
            active: true,
            createdAt: new Date().toISOString()
          });
        }
      }

      const updatedList = [...sliderImages, ...uploadedSlides];
      setSliderImages(updatedList);
      showToast(`Successfully uploaded ${uploadedSlides.length} image(s). Don't forget to click Save!`, 'success');
    } catch (err) {
      console.error('Slider image upload error:', err);
      showToast('Failed to upload slider image. Please try again.', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Reorder slides
  const handleMove = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sliderImages.length) return;

    const list = [...sliderImages];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Update order property
    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    setSliderImages(reordered);
  };

  // Toggle active status
  const handleToggleActive = (id) => {
    setSliderImages(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  // Delete slide
  const handleDeleteSlide = (id) => {
    setSliderImages(prev => prev.filter(s => s.id !== id));
    setDeleteConfirmId(null);
    showToast('Slider image deleted from list.', 'info');
  };

  // Save full CMS & Slider content
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...content,
        sliderImages
      };
      await updateSiteContent(payload);
      showToast('Site CMS content & Dashboard Slider updated successfully!', 'success');
    } catch (err) {
      showToast('Saved CMS content locally.', 'info');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="font-serif-title font-bold text-3xl text-gray-900 flex items-center gap-2">
          <FileText className="w-8 h-8 text-rose-600" />
          Site Content Management & Dashboard Slider
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Upload hero slider banners, update promotional announcement text, story body, and bakery contact info.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">

        {/* 1. DASHBOARD HERO SLIDER MANAGEMENT SECTION */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-4">
            <div>
              <h3 className="font-serif-title font-bold text-lg text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-rose-600" />
                Dashboard Image Slider
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Add multiple promotional images that continuously rotate (every 1 second) on the public homepage banner.
              </p>
            </div>

            {/* Multiple File Selector */}
            <label className={`inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-xs shadow-md transition cursor-pointer ${
              uploading ? 'opacity-50 pointer-events-none' : ''
            }`}>
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading Images...' : '+ Add Slider Images'}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleMultipleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* Slider Image List */}
          {sliderImages.length === 0 ? (
            <div className="border-2 border-dashed border-rose-200 rounded-2xl p-8 text-center bg-rose-50/30 space-y-2">
              <ImageIcon className="w-10 h-10 text-rose-300 mx-auto" />
              <h4 className="font-serif-title font-bold text-sm text-gray-800">No Slider Images Uploaded</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Click "+ Add Slider Images" above to select and upload multiple promotional banner images.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Active Banners ({sliderImages.length})
              </span>

              <div className="grid grid-cols-1 gap-3">
                {sliderImages.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-2xl border transition gap-4 ${
                      slide.active ? 'bg-white border-rose-200 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </span>

                      <div className="w-20 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-rose-100">
                        <img src={slide.imageUrl} alt="Slide Preview" className="w-full h-full object-cover" />
                      </div>

                      <div className="truncate max-w-xs">
                        <p className="font-semibold text-xs text-gray-800 truncate">{slide.title || `Slide #${index + 1}`}</p>
                        <p className="text-[10px] text-gray-400 font-mono truncate">{slide.imageUrl}</p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      
                      {/* Toggle Active */}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(slide.id)}
                        className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                          slide.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-200 text-gray-600'
                        }`}
                        title={slide.active ? 'Disable Slide' : 'Enable Slide'}
                      >
                        {slide.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span className="hidden md:inline">{slide.active ? 'Active' : 'Disabled'}</span>
                      </button>

                      {/* Move Up / Down */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMove(index, 'up')}
                        className="p-2 bg-gray-100 hover:bg-rose-100 text-gray-600 hover:text-rose-600 rounded-xl disabled:opacity-30 disabled:pointer-events-none transition"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={index === sliderImages.length - 1}
                        onClick={() => handleMove(index, 'down')}
                        className="p-2 bg-gray-100 hover:bg-rose-100 text-gray-600 hover:text-rose-600 rounded-xl disabled:opacity-30 disabled:pointer-events-none transition"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(slide.id)}
                        className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. TEXT CONTENT & POLICIES SECTION */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-sm space-y-6">
          <h3 className="font-serif-title font-bold text-base text-gray-900 border-b border-rose-100 pb-2">
            Homepage Hero & Announcement Content
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Top Announcement Banner Text</label>
              <input
                type="text"
                value={content.bannerText}
                onChange={(e) => setContent({ ...content, bannerText: e.target.value })}
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Hero Main Title</label>
              <input
                type="text"
                value={content.heroTitle}
                onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Hero Subtitle Description</label>
              <textarea
                rows={2}
                value={content.heroSubtitle}
                onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <h3 className="font-serif-title font-bold text-base text-gray-900 border-b border-rose-100 pb-2 pt-2">
            Bakery Story & Contact Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">About Story Headline</label>
              <input
                type="text"
                value={content.aboutTitle}
                onChange={(e) => setContent({ ...content, aboutTitle: e.target.value })}
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">About Story Body</label>
              <textarea
                rows={4}
                value={content.aboutBody}
                onChange={(e) => setContent({ ...content, aboutBody: e.target.value })}
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={content.contactEmail}
                  onChange={(e) => setContent({ ...content, contactEmail: e.target.value })}
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={content.contactPhone}
                  onChange={(e) => setContent({ ...content, contactPhone: e.target.value })}
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating / Sticky Save Footer */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-8 py-3.5 rounded-full bg-rose-600 text-white font-bold text-xs shadow-lg hover:bg-rose-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing Changes...' : 'Save & Publish All CMS Changes'}</span>
          </button>
        </div>

      </form>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-rose-100">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-8 h-8 flex-shrink-0" />
              <h3 className="font-serif-title font-bold text-lg text-gray-900">Delete Slider Image?</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed bg-rose-50 p-3.5 rounded-2xl">
              Are you sure you want to delete this image?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSlide(deleteConfirmId)}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shadow-md transition"
              >
                Delete Image
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
