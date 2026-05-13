import React, { useState, useEffect, useRef } from "react";
import { ImCross } from "react-icons/im";
import { 
  Upload, Image as ImageIcon, CheckCircle, XCircle, Save, Edit3,
  Camera, Trash2, Loader2, X, AlertCircle, FolderTree
} from "lucide-react";
import Axios from "../utils/Axios";
import AxiosError from "../utils/AxiosToError";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";

const UploadSubCategoryModel = ({ onClose, editData, onSuccess }) => {
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
    } else {
      resetForm();
    }
  }, [editData]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setSelectedCategoryIds([]);
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
  };

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

  const handleSubmit = async () => {
    if (!validateForm()) {
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

      const subCategoryData = {
        name: name.trim(),
        ...(description && { description: description.trim() }),
        category: selectedCategoryIds,
        ...(imageUrl && { image: imageUrl })
      };

      const apiConfig = editData 
        ? summaryApi().updateSubCategory(editData._id)
        : summaryApi().createSubcategory;

      const res = await Axios({
        ...apiConfig,
        data: subCategoryData
      });

      if (res.data.success) {
        toast.success(
          editData 
            ? "Subcategory updated successfully!" 
            : "Subcategory added successfully!"
        );
        
        if (onSuccess) onSuccess();
        resetForm();
        onClose();
      } else {
        toast.error(res.data.message || "Failed to save subcategory");
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
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && !isSaving && onClose()}
    >
      <div 
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        onKeyDown={handleKeyPress}
        tabIndex={0}
      >
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {editData ? "Edit Subcategory" : "Add New Subcategory"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {editData ? "Update subcategory details" : "Create a new product subcategory"}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSaving}
              aria-label="Close modal"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800 disabled:opacity-50"
            >
              <ImCross size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Subcategory Name <span className="text-red-600">*</span>
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
                className={`w-full px-4 py-3 border rounded-lg outline-none transition focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                  errors.name ? 'border-red-600 focus:ring-red-200' : 'border-gray-200'
                }`}
                autoFocus
              />
              {errors.name && (
                <p id="error-name" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Description <span className="text-gray-500 text-xs font-normal">(Optional)</span>
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
                className={`w-full px-4 py-3 border rounded-lg outline-none transition resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                  errors.description ? 'border-red-600 focus:ring-red-200' : 'border-gray-200'
                }`}
              />
              <div className="flex justify-between mt-2">
                {errors.description && (
                  <p id="error-description" className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.description}
                  </p>
                )}
                <span className={`text-xs ml-auto ${description.length > 180 ? 'text-red-600' : 'text-gray-500'}`}>
                  {description.length}/200
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Parent Categories <span className="text-red-600">*</span>
              </label>
              
              <div className="mb-3">
                <select
                  onChange={handleCategorySelect}
                  value=""
                  disabled={isSaving || categories.length === 0}
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                    errors.categories ? 'border-red-600' : 'border-gray-200'
                  }`}
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
                  <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    No categories available. Please create categories first.
                  </p>
                )}
              </div>

              {selectedCategoryIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedCategoryIds.map((id) => (
                    <div
                      key={id}
                      className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm"
                    >
                      <FolderTree size={12} />
                      <span>{getCategoryName(id)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(id)}
                        disabled={isSaving}
                        className="text-blue-700 hover:text-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errors.categories && (
                <p id="error-categories" className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.categories}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Subcategory Image <span className="text-gray-500 text-xs font-normal">(Optional)</span>
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
                    <div className="aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
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
                        className="p-2.5 rounded-lg bg-white text-gray-800 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
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
                    className="aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-600 transition-all bg-gray-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-blue-50 group"
                  >
                    <div className="h-14 w-14 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-all flex items-center justify-center">
                      <Upload className="text-blue-600" size={26} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-800">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF, WebP up to 2MB
                      </p>
                    </div>
                  </div>
                )}

                {errors.image && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.image}
                  </p>
                )}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50">
              <p className="text-xs text-gray-600 flex items-center gap-2">
                <CheckCircle size={14} className="text-blue-600" />
                Subcategories help organize products within categories for better navigation
              </p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-5">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:border-blue-600 hover:text-blue-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium flex items-center gap-2 min-w-[120px] justify-center hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : editData ? (
                <>
                  <Save size={18} />
                  Update Subcategory
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Create Subcategory
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadSubCategoryModel;