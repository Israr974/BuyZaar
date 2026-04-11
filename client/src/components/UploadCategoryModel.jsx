import React, { useState, useRef, useEffect } from "react";
import { ImCross } from "react-icons/im";
import {  
  Upload, Image as ImageIcon, CheckCircle, XCircle, Save, Edit3,
  Camera, Trash2, Loader2, AlertCircle
} from "lucide-react";
import Axios from "../utils/Axios";
import AxiosError from "../utils/AxiosToError";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";

const UploadCategoryModel = ({ onClose, editData, onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setDescription(editData.description || "");
      setImagePreview(editData.image || null);
    } else {
      resetForm();
    }
  }, [editData]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = "Category name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (name.trim().length > 50) {
      newErrors.name = "Name cannot exceed 50 characters";
    }

    if (description && description.length > 200) {
      newErrors.description = "Description cannot exceed 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

    const img = new Image();
    img.onload = function() {
      if (this.width > 2000 || this.height > 2000) {
        toast.error("Image dimensions should not exceed 2000x2000 pixels");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: null }));
    };
    img.src = URL.createObjectURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleSubmit = async () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const errorElement = document.getElementById(`error-${firstError}`);
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

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

      const categoryData = { 
        name: name.trim(), 
        ...(description && { description: description.trim() }),
        ...(imageUrl && { image: imageUrl })
      };

      let res;
      if (editData) {
        res = await Axios({
          ...summaryApi().updateCategory(editData._id),
          data: categoryData,
        });

        if (res.data.success) {
          toast.success("Category updated successfully! ");
          if (onSuccess) onSuccess();
          onClose();
        }
      } else {
        res = await Axios({
          ...summaryApi().addCategory,
          data: categoryData,
        });

        if (res.data.success) {
          toast.success("Category added successfully! ");
          if (onSuccess) onSuccess();
          resetForm();
          onClose();
        }
      }

      if (!res.data.success) {
        toast.error(res.data.message || "Failed to save category");
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
      handleSubmit();
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
                {editData ? "Edit Category" : "Add New Category"}
              </h2>
              <p className="text-sm text-text-muted mt-1">
                {editData ? "Update category details" : "Create a new product category"}
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          <div className="space-y-5">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Category Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Electronics, Clothing, Home Decor"
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
                placeholder="Brief description of the category..."
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

            {/* Category Image */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Category Image <span className="text-text-muted text-xs font-normal">(Optional)</span>
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
                        alt="Category preview"
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
                  </div>
                ) : (
                  <div 
                    onClick={handleUploadClick}
                    className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary transition-all bg-bg-alt/50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-primary/5 group"
                  >
                    <div className="h-14 w-14 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all flex items-center justify-center">
                      <Upload className="text-primary" size={26} />
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
                Categories help organize products for better customer experience
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
              onClick={handleSubmit}
              disabled={isSaving}
              className="btn btn-primary px-5 py-2.5 rounded-xl flex items-center gap-2 min-w-[120px] justify-center"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : editData ? (
                <>
                  <Save size={18} />
                  Update Category
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Create Category
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadCategoryModel;