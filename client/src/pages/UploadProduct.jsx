import React, { useState, useEffect } from "react";
import Axios from "../utils/Axios";
import AxiosError from "../utils/AxiosToError";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Tag, 
  Package, 
  DollarSign, 
  Percent, 
  Hash, 
  Grid3x3,
  Layers,
  CheckCircle,
  Plus,
  Trash2,
  AlertCircle,
  Info,
  Ruler,
  Weight
} from "lucide-react";

const UploadProduct = ({ onClose, fetchProducts, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [isFetching, setIsFetching] = useState(false);

  const [data, setData] = useState({
    name: "",
    image: [],
    category: "",
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: "",
    publish: true,
    sku: "",
    brand: "",
    weight: "",
    dimensions: "",
  });

  const resetForm = () => {
    setData({
      name: "",
      image: [],
      category: "",
      subCategory: [],
      unit: "",
      stock: "",
      price: "",
      discount: "",
      description: "",
      more_details: "",
      publish: true,
      sku: "",
      brand: "",
      weight: "",
      dimensions: "",
    });
    setSelectedSubCategory("");
    setErrors({});
    setUploadProgress(0);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsFetching(true);
        const res = await Axios(summaryApi().getAllCategory);
        setCategories(res.data?.data || []);
      } catch (error) {
        AxiosError(error);
        toast.error("Failed to load categories");
      } finally {
        setIsFetching(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await Axios(summaryApi().getSubcategory);
        setAllSubCategories(res.data?.data || []);
      } catch (error) {
        AxiosError(error);
      }
    };
    fetchSubCategories();
  }, []);

  useEffect(() => {
    if (!data.category) {
      setAvailableSubCategories([]);
      return;
    }
    const filtered = allSubCategories.filter((sub) =>
      sub.category.some((c) => c._id === data.category)
    );
    setAvailableSubCategories(filtered);
    setSelectedSubCategory("");
  }, [data.category, allSubCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith("image/")) {
        toast.error(`File ${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });
    
    if (data.image.length + validFiles.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    
    setData(prev => ({ 
      ...prev, 
      image: [...prev.image, ...validFiles]
    }));
    setErrors(prev => ({ ...prev, image: null }));
  };

  const removeImage = (index) => {
    setData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  };

  const addSubCategory = () => {
    if (!selectedSubCategory) {
      toast.error("Please select a subcategory");
      return;
    }
    if (data.subCategory.includes(selectedSubCategory)) {
      toast.error("This subcategory is already added");
      return;
    }
    if (data.subCategory.length >= 5) {
      toast.error("Maximum 5 subcategories allowed");
      return;
    }
    setData(prev => ({
      ...prev,
      subCategory: [...prev.subCategory, selectedSubCategory],
    }));
    setSelectedSubCategory("");
    setErrors(prev => ({ ...prev, subCategory: null }));
  };

  const removeSubCategory = (subCatId) => {
    setData(prev => ({
      ...prev,
      subCategory: prev.subCategory.filter((id) => id !== subCatId),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!data.name.trim()) newErrors.name = "Product name is required";
    
    const price = parseFloat(data.price);
    if (!data.price || isNaN(price) || price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    
    const stock = parseInt(data.stock);
    if (data.stock === "" || isNaN(stock) || stock < 0) {
      newErrors.stock = "Stock cannot be negative";
    }
    
    const discount = parseFloat(data.discount);
    if (data.discount && (isNaN(discount) || discount < 0 || discount > 100)) {
      newErrors.discount = "Discount must be between 0 and 100";
    }
    
    if (!data.category) newErrors.category = "Select a category";
    if (data.subCategory.length === 0) newErrors.subCategory = "Add at least one subcategory";
    if (data.image.length === 0) newErrors.image = "Upload at least one image";
    if (!data.unit.trim()) newErrors.unit = "Unit is required";
    if (!data.description.trim()) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.keys(newErrors)[0];
      const errorElement = document.getElementById(`error-${firstError}`);
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setUploadProgress(0);

      const uploadedUrls = [];
      const totalImages = data.image.length;
      
      for (let i = 0; i < data.image.length; i++) {
        const file = data.image[i];
        
        if (typeof file === "string") {
          uploadedUrls.push(file);
          setUploadProgress(((i + 1) / totalImages) * 100);
          continue;
        }
        
        const formData = new FormData();
        formData.append("image", file);

        const res = await Axios({
          ...summaryApi().uploadImage,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data?.imageUrl) {
          uploadedUrls.push(res.data.imageUrl);
        } else {
          toast.error(`Failed to upload image: ${file.name}`);
          return;
        }
        
        setUploadProgress(((i + 1) / totalImages) * 100);
      }

      const payload = {
        ...data,
        sub_category: data.subCategory,
        image: uploadedUrls,
        price: parseFloat(data.price) || 0,
        stock: parseInt(data.stock) || 0,
        discount: parseFloat(data.discount) || 0,
      };

      const productRes = await Axios({
        ...summaryApi().addProduct,
        data: payload,
      });

      if (productRes.data.success) {
        toast.success("Product uploaded successfully!");
        resetForm();
        fetchProducts?.();
        onSuccess?.();
        onClose?.();
      } else {
        toast.error(productRes.data.message || "Failed to upload product");
      }
    } catch (error) {
      console.error("Upload error:", error);
      AxiosError(error);
      toast.error(error.response?.data?.message || "Failed to upload product");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => file.type.startsWith("image/"));
    if (validFiles.length) {
      handleFileChange({ target: { files: validFiles } });
    } else {
      toast.error("Please drop image files only");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getSubCategoryName = (id) => {
    const sub = allSubCategories.find(s => s._id === id);
    return sub?.name || id;
  };

  if (isFetching && categories.length === 0) {
    return (
      <div className="w-full max-w-6xl p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mb-4"></div>
          <p className="text-text-muted">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl p-6 md:p-8 overflow-y-auto max-h-[90vh] custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border bg-card z-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold gradient-text">
            Add New Product
          </h2>
          <p className="text-text-muted text-sm mt-1">
            Fill in the details below to add a new product to your catalog
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text"
          disabled={loading}
        >
          <X size={24} />
        </button>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 text-center">
            <div className="spinner w-12 h-12 mb-4"></div>
            <p className="text-text">Uploading product...</p>
            <p className="text-text-muted text-sm mt-2">{Math.round(uploadProgress)}%</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic Information */}
<div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
    <Tag className="text-primary" size={20} />
    <h3 className="text-lg font-semibold text-text">Basic Information</h3>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="label flex items-center gap-1">
        Product Name <span className="text-error">*</span>
      </label>
      <div className="relative">
        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
        <input
          type="text"
          name="name"
          placeholder="Enter product name"
          value={data.name}
          onChange={handleChange}
          className={`input pl-10 w-full ${errors.name ? 'border-error' : ''}`}
        />
      </div>
      {errors.name && (
        <p id="error-name" className="mt-1 text-xs text-error flex items-center gap-1">
          <AlertCircle size={12} />
          {errors.name}
        </p>
      )}
    </div>
    
    <div>
      <label className="label">SKU (Optional)</label>
      <div className="relative">
        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
        <input
          type="text"
          name="sku"
          placeholder="Enter SKU"
          value={data.sku}
          onChange={handleChange}
          className="input pl-10 w-full"
        />
      </div>
    </div>
    
    <div>
      <label className="label">Brand (Optional)</label>
      <input
        type="text"
        name="brand"
        placeholder="Enter brand name"
        value={data.brand}
        onChange={handleChange}
        className="input w-full"
      />
    </div>
    
    <div>
      <label className="label flex items-center gap-1">
        Unit <span className="text-error">*</span>
      </label>
      <div className="relative">
        <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
        <input
          type="text"
          name="unit"
          placeholder="e.g., kg, piece, liter"
          value={data.unit}
          onChange={handleChange}
          className={`input pl-10 w-full ${errors.unit ? 'border-error' : ''}`}
        />
      </div>
      {errors.unit && (
        <p className="mt-1 text-xs text-error flex items-center gap-1">
          <AlertCircle size={12} />
          {errors.unit}
        </p>
      )}
    </div>
  </div>
</div>
{/* Pricing & Inventory */}
<div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
    <DollarSign className="text-primary" size={20} />
    <h3 className="text-lg font-semibold text-text">Pricing & Inventory</h3>
  </div>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Price */}
    <div>
      <label className="label flex items-center gap-1">
        Price <span className="text-error">*</span>
      </label>
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted z-10" size={18} />
        <input
          type="text"
          name="price"
          placeholder="Enter price"
          value={data.price}
          onChange={handleChange}
          className={`input w-full pl-8 ${errors.price ? 'border-error' : ''}`}
          style={{ paddingLeft: '2rem' }}
        />
      </div>
      {errors.price && (
        <p className="mt-1 text-xs text-error">{errors.price}</p>
      )}
    </div>
    
    {/* Discount */}
    <div>
      <label className="label">Discount (%)</label>
      <div className="relative">
        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted z-10" size={18} />
        <input
          type="text"
          name="discount"
          placeholder="Enter discount"
          value={data.discount}
          onChange={handleChange}
          className={`input w-full pl-8 ${errors.discount ? 'border-error' : ''}`}
          style={{ paddingLeft: '2rem' }}
        />
      </div>
      {errors.discount && (
        <p className="mt-1 text-xs text-error">{errors.discount}</p>
      )}
    </div>
    
    {/* Stock */}
    <div>
      <label className="label flex items-center gap-1">
        Stock <span className="text-error">*</span>
      </label>
      <div className="relative">
        <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted z-10" size={18} />
        <input
          type="text"
          name="stock"
          placeholder="Enter stock quantity"
          value={data.stock}
          onChange={handleChange}
          className={`input w-full pl-8 ${errors.stock ? 'border-error' : ''}`}
          style={{ paddingLeft: '2rem' }}
        />
      </div>
      {errors.stock && (
        <p className="mt-1 text-xs text-error">{errors.stock}</p>
      )}
    </div>
    
    {/* Status */}
    <div>
      <label className="label">Status</label>
      <select
        name="publish"
        value={data.publish}
        onChange={(e) =>
          setData((prev) => ({ ...prev, publish: e.target.value === "true" }))
        }
        className="input w-full"
      >
        <option value="true">Published</option>
        <option value="false">Draft</option>
      </select>
    </div>
  </div>
</div>

          {/* Categories */}
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
              <Layers className="text-primary" size={20} />
              <h3 className="text-lg font-semibold text-text">Categories</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label flex items-center gap-1">
                  Main Category <span className="text-error">*</span>
                </label>
                <select
                  name="category"
                  value={data.category}
                  onChange={handleChange}
                  className={`input ${errors.category ? 'border-error' : ''}`}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-error">{errors.category}</p>
                )}
              </div>
              
              <div>
                <label className="label flex items-center gap-1">
                  Sub-categories <span className="text-error">*</span>
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <select
                      value={selectedSubCategory}
                      onChange={(e) => setSelectedSubCategory(e.target.value)}
                      className="input flex-1"
                      disabled={!data.category || availableSubCategories.length === 0}
                    >
                      <option value="">
                        {!data.category ? "Select main category first" : 
                         availableSubCategories.length === 0 ? "No subcategories available" : 
                         "Select Sub Category"}
                      </option>
                      {availableSubCategories.map((sc) => (
                        <option key={sc._id} value={sc._id}>
                          {sc.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={addSubCategory}
                      className="btn-primary px-4 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!selectedSubCategory}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3 min-h-[60px]">
                    {data.subCategory.map((subCatId) => (
                      <div
                        key={subCatId}
                        className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm border border-primary/20"
                      >
                        <Grid3x3 size={12} />
                        <span>{getSubCategoryName(subCatId)}</span>
                        <button
                          type="button"
                          onClick={() => removeSubCategory(subCatId)}
                          className="hover:text-error transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {data.subCategory.length === 0 && (
                      <p className="text-text-muted text-sm">No sub-categories added yet</p>
                    )}
                  </div>
                  {errors.subCategory && (
                    <p className="text-xs text-error">{errors.subCategory}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
              <CheckCircle className="text-primary" size={20} />
              <h3 className="text-lg font-semibold text-text">Descriptions</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="label flex items-center gap-1">
                  Short Description <span className="text-error">*</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Brief description of the product..."
                  value={data.description}
                  onChange={handleChange}
                  className={`input min-h-[100px] ${errors.description ? 'border-error' : ''}`}
                  rows="3"
                />
                <div className="flex justify-between mt-1">
                  {errors.description && (
                    <p className="text-xs text-error">{errors.description}</p>
                  )}
                  <span className={`text-xs ml-auto ${data.description.length > 450 ? 'text-error' : 'text-text-muted'}`}>
                    {data.description.length}/500 characters
                  </span>
                </div>
              </div>
              
              <div>
                <label className="label">Detailed Description</label>
                <textarea
                  name="more_details"
                  placeholder="More details about the product (features, specifications, etc.)..."
                  value={data.more_details}
                  onChange={handleChange}
                  className="input min-h-[120px]"
                  rows="4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Images & Actions */}
        <div className="space-y-6">
          {/* Product Images */}
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
              <ImageIcon className="text-primary" size={20} />
              <h3 className="text-lg font-semibold text-text">Product Images</h3>
              {errors.image && <span className="text-error text-xs ml-auto">* Required</span>}
            </div>
            
            <div
              onDrop={handleImageDrop}
              onDragOver={handleDragOver}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                errors.image ? 'border-error bg-error/5' : 'border-border hover:border-primary hover:bg-primary/5'
              }`}
            >
              <Upload className="mx-auto text-text-muted mb-3" size={32} />
              <p className="text-text font-medium mb-2">Drop images here or click to upload</p>
              <p className="text-text-muted text-sm mb-4">Supports JPG, PNG up to 5MB each</p>
              
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="product-images"
              />
              <label
                htmlFor="product-images"
                className="btn-outline inline-flex items-center gap-2 cursor-pointer"
              >
                <Upload size={16} />
                Browse Files
              </label>
              
              <p className="text-xs text-text-muted mt-3">
                {data.image.length} / 10 images selected
              </p>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-text-muted mb-1">
                  <span>Uploading images...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="h-2 bg-bg-alt rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {data.image.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-text">Selected Images</h4>
                  <span className="text-xs text-text-muted">First image will be featured</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {data.image.map((file, index) => {
                    const src = typeof file === "string" ? file : URL.createObjectURL(file);
                    return (
                      <div key={index} className="relative group">
                        <img
                          src={src}
                          alt="preview"
                          className="h-20 w-full object-cover rounded-lg border border-border"
                        />
                        {index === 0 && (
                          <div className="absolute top-1 left-1 bg-primary text-white px-1.5 py-0.5 rounded text-xs">
                            Featured
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

         {/* Specifications */}
<div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
    <Info className="text-primary" size={20} />
    <h3 className="text-lg font-semibold text-text">Specifications</h3>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="label flex items-center gap-1">
        <Weight size={14} />
        Weight
      </label>
      <input
        type="text"
        name="weight"
        placeholder="e.g., 1.5 kg"
        value={data.weight}
        onChange={handleChange}
        className="input w-full"
      />
    </div>
    
    <div>
      <label className="label flex items-center gap-1">
        <Ruler size={14} />
        Dimensions
      </label>
      <input
        type="text"
        name="dimensions"
        placeholder="e.g., 10x5x3 inches"
        value={data.dimensions}
        onChange={handleChange}
        className="input w-full"
      />
    </div>
  </div>
</div>
          {/* Actions */}
          <div className="bg-card rounded-xl border border-border p-5 sticky top-6">
            <h3 className="text-lg font-semibold text-text mb-4">Actions</h3>
            
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading Product...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Upload Product
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="btn-outline w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              
              <div className="text-xs text-text-muted pt-3 border-t border-border">
                <p className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-success" />
                  Fields marked with <span className="text-error">*</span> are required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProduct;