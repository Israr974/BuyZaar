import React, { useState, useEffect, useRef } from "react";
import { ImCross } from "react-icons/im";
import { 
  Upload, XCircle, Save, Camera, Trash2, Loader2, X, Layers, Tag,
  AlertCircle, FolderTree, CheckCircle, Image as ImageIcon
} from "lucide-react";
import Axios from "../utils/Axios";
import AxiosError from "../utils/AxiosToError";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";

const EditSubCategoryModel = ({ onClose, editData, onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Axios(summaryApi().getAllCategory);
        if (res.data?.success) {
          setCategories(res.data.data || []);
        }
      } catch (error) {
        AxiosError(error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Populate form with edit data
  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setDescription(editData.description || "");
      setImagePreview(editData.image || null);

      const initialSelected = Array.isArray(editData.category)
        ? editData.category.map((cat) =>
            typeof cat === "string" ? cat : cat._id
          )
        : editData.category
        ? [editData.category._id || editData.category]
        : [];
      setSelectedCategoryIds(initialSelected);
    }
  }, [editData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = "Subcategory name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (name.trim().length > 50) {
      newErrors.name = "Name cannot exceed 50 characters";
    }

    if (description && description.length > 200) {
      newErrors.description = "Description cannot exceed 200 characters";
    }

    if (selectedCategoryIds.length === 0) {
      newErrors.categories = "Please select at least one category";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.keys(newErrors)[0];
      const errorElement = document.getElementById(`error-${firstError}`);
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files (JPG, PNG, GIF, WebP) are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors(prev => ({ ...prev, image: null }));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleCategorySelect = (e) => {
    const value = e.target.value;
    if (value && !selectedCategoryIds.includes(value)) {
      setSelectedCategoryIds((prev) => [...prev, value]);
      setErrors(prev => ({ ...prev, categories: null }));
    }
  };

  const handleRemoveCategory = (id) => {
    setSelectedCategoryIds((prev) => prev.filter((catId) => catId !== id));
  };

  const getCategoryName = (id) => {
    const category = categories.find(c => c._id === id);
    return category?.name || "Unknown Category";
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);

      let imageUrl = imagePreview;

      if (imageFile && !imagePreview?.startsWith('http')) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        const uploadRes = await Axios({
          ...summaryApi().uploadImage,
          data: imageFormData,
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes?.data?.imageUrl || uploadRes?.data?.url;
        if (!imageUrl) {
          toast.error("Image upload failed");
          return;
        }
      }

      const subCategoryData = {
        name: name.trim(),
        ...(description && { description: description.trim() }),
        category: selectedCategoryIds,
        ...(imageUrl && { image: imageUrl })
      };

      const res = await Axios({
        ...summaryApi().updateSubCategory(editData._id),
        data: subCategoryData
      });

      if (res.data.success) {
        toast.success("Subcategory updated successfully! ");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(res.data.message || "Failed to update subcategory");
      }

    } catch (error) {
      AxiosError(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSaving) {
      e.preventDefault();
      handleUpdate();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <section 
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4 fade-in"
      onClick={(e) => e.target === e.currentTarget && !isSaving && onClose()}
    >
      <div 
        ref={modalRef}
        className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        onKeyDown={handleKeyPress}
        tabIndex={0}
        style={{ backgroundColor: "var(--color-card)" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold gradient-text">
                Edit Subcategory
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Update details for "{editData?.name || 'Subcategory'}"
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSaving}
              aria-label="Close modal"
              className="p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text disabled:opacity-50"
            >
              <ImCross size={16} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          <div className="space-y-5">
            {/* Subcategory Name */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Subcategory Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Smartphones, T-Shirts, Sofas"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors(prev => ({ ...prev, name: null }));
                }}
                disabled={isSaving}
                className={`input w-full ${errors.name ? 'border-error focus:ring-error/20' : ''}`}
                autoFocus
              />
              {errors.name && (
                <p id="error-name" className="mt-2 text-sm text-error flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Description <span className="text-text-muted text-xs font-normal">(Optional)</span>
              </label>
              <textarea
                placeholder="Brief description of the subcategory..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors(prev => ({ ...prev, description: null }));
                }}
                disabled={isSaving}
                rows={3}
                className={`input w-full resize-none ${errors.description ? 'border-error focus:ring-error/20' : ''}`}
              />
              <div className="flex justify-between mt-2">
                {errors.description && (
                  <p id="error-description" className="text-sm text-error flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.description}
                  </p>
                )}
                <span className={`text-xs ml-auto ${description.length > 180 ? 'text-error' : 'text-text-muted'}`}>
                  {description.length}/200
                </span>
              </div>
            </div>

            {/* Parent Categories */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Parent Categories <span className="text-error">*</span>
              </label>
              
              {/* Category Selector */}
              <div className="mb-3">
                <select
                  onChange={handleCategorySelect}
                  value=""
                  disabled={isSaving || categories.length === 0}
                  className={`input w-full ${errors.categories ? 'border-error' : ''}`}
                >
                  <option value="">
                    {categories.length === 0 ? "Loading categories..." : "+ Add a category"}
                  </option>
                  {categories
                    .filter((cat) => !selectedCategoryIds.includes(cat._id))
                    .map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
                {categories.length === 0 && (
                  <p className="mt-2 text-sm text-text-muted flex items-center gap-1">
                    <AlertCircle size={12} />
                    No categories available. Please create categories first.
                  </p>
                )}
              </div>

              {/* Selected Categories */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-text-muted">
                    Selected Categories ({selectedCategoryIds.length})
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 min-h-[60px]">
                  {selectedCategoryIds.map((id) => (
                    <div
                      key={id}
                      className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm border border-primary/20"
                    >
                      <FolderTree size={12} />
                      <span>{getCategoryName(id)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(id)}
                        disabled={isSaving}
                        className="text-primary hover:text-error transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  
                  {selectedCategoryIds.length === 0 && (
                    <div className="w-full py-4 text-center border-2 border-dashed border-border rounded-xl bg-bg-alt/50">
                      <Layers size={24} className="mx-auto text-text-muted mb-2" />
                      <p className="text-sm text-text-muted">No categories selected</p>
                    </div>
                  )}
                </div>

                {errors.categories && (
                  <p id="error-categories" className="mt-2 text-sm text-error flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.categories}
                  </p>
                )}
              </div>
            </div>

            {/* Subcategory Image */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Subcategory Image <span className="text-text-muted text-xs font-normal">(Optional)</span>
              </label>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
                disabled={isSaving}
              />

              <div className="space-y-3">
                {imagePreview ? (
                  <div className="relative group">
                    <div className="aspect-video rounded-xl overflow-hidden border border-border bg-bg-alt">
                      <img
                        src={imagePreview}
                        alt="Subcategory preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={handleUploadClick}
                        disabled={isSaving}
                        className="p-2.5 rounded-lg bg-white text-text hover:bg-primary hover:text-white transition-all transform hover:scale-110"
                        title="Replace image"
                      >
                        <Camera size={18} />
                      </button>
                      <button
                        onClick={handleRemoveImage}
                        disabled={isSaving}
                        className="p-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all transform hover:scale-110"
                        title="Remove image"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      {imagePreview?.startsWith('http') ? 'Current' : 'New'}
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={handleUploadClick}
                    className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary transition-all bg-bg-alt/50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-primary/5 group"
                  >
                    <div className="h-14 w-14 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all flex items-center justify-center">
                      <ImageIcon className="text-primary" size={26} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-text">
                        Click to upload image
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        PNG, JPG, GIF, WebP up to 2MB
                      </p>
                    </div>
                  </div>
                )}

                {errors.image && (
                  <p className="text-sm text-error flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.image}
                  </p>
                )}
              </div>
            </div>

            {/* Info Tip */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-text-muted flex items-center gap-2">
                <CheckCircle size={14} className="text-primary" />
                Subcategories help organize products within categories for better navigation
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-5">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="btn btn-outline px-5 py-2.5 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={isSaving}
              className="btn btn-primary px-5 py-2.5 rounded-xl flex items-center gap-2 min-w-[120px] justify-center"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Subcategory
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditSubCategoryModel;