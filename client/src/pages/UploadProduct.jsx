import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [dataFetched, setDataFetched] = useState(false);

  const abortControllerRef = useRef(null);
  const isMounted = useRef(true);

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

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const resetForm = useCallback(() => {
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
  }, []);

  // Fetch categories - Fixed version
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsFetching(true);
        
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to add products");
          return;
        }

        const res = await Axios({
          ...summaryApi().getAllCategory,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (isMounted.current && res.data?.success) {
          setCategories(res.data.data || []);
          setDataFetched(true);
        } else {
          toast.error(res.data?.message || "Failed to load categories");
        }
      } catch (error) {
        if (isMounted.current) {
      
          toast.error(error.response?.data?.message || "Failed to load categories");
        }
      } finally {
        if (isMounted.current) {
          setIsFetching(false);
        }
      }
    };
    
    fetchCategories();
  }, []);

 
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await Axios({
          ...summaryApi().getSubcategory,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (isMounted.current && res.data?.success) {
          setAllSubCategories(res.data.data || []);
        }
      } catch (error) {
        if (isMounted.current) {
          console.error("Fetch subcategories error:", error);
        }
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
      sub.category?.some((c) => c?._id === data.category)
    );
    setAvailableSubCategories(filtered);
    setSelectedSubCategory("");
  }, [data.category, allSubCategories]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const handleFileChange = useCallback((e) => {
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
  }, [data.image.length]);

  const removeImage = useCallback((indexToRemove) => {
    setData(prev => ({
      ...prev,
      image: prev.image.filter((_, index) => index !== indexToRemove),
    }));
  }, []);

  const addSubCategory = useCallback(() => {
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
  }, [selectedSubCategory, data.subCategory]);

  const removeSubCategory = useCallback((subCatId) => {
    setData(prev => ({
      ...prev,
      subCategory: prev.subCategory.filter((id) => id !== subCatId),
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!data.name?.trim()) newErrors.name = "Product name is required";
    if (data.name?.trim().length < 2) newErrors.name = "Name must be at least 2 characters";
    
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
    if (!data.unit?.trim()) newErrors.unit = "Unit is required";
    if (!data.description?.trim()) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.keys(newErrors)[0];
      const errorElement = document.getElementById(`error-${firstError}`);
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  }, [data]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to upload products");
        setLoading(false);
        return;
      }

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
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!isMounted.current) return;

        if (res.data?.imageUrl) {
          uploadedUrls.push(res.data.imageUrl);
        } else {
          toast.error(`Failed to upload image: ${file.name}`);
          setLoading(false);
          return;
        }
        
        setUploadProgress(((i + 1) / totalImages) * 100);
      }

      const payload = {
        name: data.name.trim(),
        unit: data.unit.trim(),
        stock: parseInt(data.stock),
        price: parseFloat(data.price),
        discount: data.discount ? parseFloat(data.discount) : 0,
        description: data.description.trim(),
        more_details: data.more_details?.trim() || "",
        publish: data.publish,
        category: data.category,
        sub_category: data.subCategory,
        image: uploadedUrls,
        ...(data.sku && { sku: data.sku.trim() }),
        ...(data.brand && { brand: data.brand.trim() }),
        ...(data.weight && { weight: data.weight.trim() }),
        ...(data.dimensions && { dimensions: data.dimensions.trim() }),
      };

      const productRes = await Axios({
        ...summaryApi().addProduct,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!isMounted.current) return;

      if (productRes.data?.success) {
        toast.success("Product uploaded successfully!");
        resetForm();
        fetchProducts?.();
        onSuccess?.();
        onClose?.();
      } else {
        toast.error(productRes.data?.message || "Failed to upload product");
      }
    } catch (error) {
      if (!isMounted.current) return;
      
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload product");
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setUploadProgress(0);
      }
    }
  }, [data, validateForm, resetForm, fetchProducts, onSuccess, onClose]);

  const handleImageDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => file.type.startsWith("image/"));
    if (validFiles.length) {
      handleFileChange({ target: { files: validFiles } });
    } else {
      toast.error("Please drop image files only");
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const getSubCategoryName = useCallback((id) => {
    const sub = allSubCategories.find(s => s._id === id);
    return sub?.name || id;
  }, [allSubCategories]);

  if (isFetching && categories.length === 0 && dataFetched === false) {
    return (
      <div className="w-full max-w-6xl p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl p-6 md:p-8 overflow-y-auto max-h-[90vh] custom-scrollbar">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
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
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 text-center border border-border">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text font-medium">Uploading product...</p>
            <p className="text-text-muted text-sm mt-2">{Math.round(uploadProgress)}%</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
              <Tag className="text-primary" size={20} aria-hidden="true" />
              <h3 className="text-lg font-semibold text-text">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label flex items-center gap-1">
                  Product Name <span className="text-error">*</span>
                </label>
                <div className="relative">
            
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    value={data.name}
                    onChange={handleChange}
                    className={`input w-full pl-10 ${errors.name ? 'border-error' : ''}`}
                    aria-invalid={!!errors.name}
                  />
                </div>
                {errors.name && (
                  <p id="error-name" className="mt-1 text-xs text-error flex items-center gap-1">
                    <AlertCircle size={12} aria-hidden="true" />
                    {errors.name}
                  </p>
                )}
              </div>
          
              <div>
                <label className="label">SKU (Optional)</label>
                <div className="relative">
                  
                  <input
                    type="text"
                    name="sku"
                    placeholder="Enter SKU"
                    value={data.sku}
                    onChange={handleChange}
                    className="input w-full pl-10"
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
              
              <div className="md:col-span-2">
                <label className="label flex items-center gap-1">
                  Unit <span className="text-error">*</span>
                </label>
                <div className="relative">
                  
                  <input
                    type="text"
                    name="unit"
                    placeholder="e.g., kg, piece, liter"
                    value={data.unit}
                    onChange={handleChange}
                    className={`input w-full pl-10 ${errors.unit ? 'border-error' : ''}`}
                  />
                </div>
                {errors.unit && (
                  <p className="mt-1 text-xs text-error flex items-center gap-1">
                    <AlertCircle size={12} aria-hidden="true" />
                    {errors.unit}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
              <DollarSign className="text-primary" size={20} aria-hidden="true" />
              <h3 className="text-lg font-semibold text-text">Pricing & Inventory</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="label flex items-center gap-1">
                  Price (₹) <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={data.price}
                  onChange={handleChange}
                  className={`input w-full ${errors.price ? 'border-error' : ''}`}
                  min="0"
                  step="0.01"
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-error">{errors.price}</p>
                )}
              </div>
              
              <div>
                <label className="label">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  placeholder="0"
                  value={data.discount}
                  onChange={handleChange}
                  className={`input w-full ${errors.discount ? 'border-error' : ''}`}
                  min="0"
                  max="100"
                />
                {errors.discount && (
                  <p className="mt-1 text-xs text-error">{errors.discount}</p>
                )}
              </div>
              
              <div>
                <label className="label flex items-center gap-1">
                  Stock <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  placeholder="0"
                  value={data.stock}
                  onChange={handleChange}
                  className={`input w-full ${errors.stock ? 'border-error' : ''}`}
                  min="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-xs text-error">{errors.stock}</p>
                )}
              </div>
              
              <div>
                <label className="label">Status</label>
                <select
                  name="publish"
                  value={data.publish}
                  onChange={(e) => setData((prev) => ({ ...prev, publish: e.target.value === "true" }))}
                  className="input w-full"
                >
                  <option value="true">✓ Published (Visible)</option>
                  <option value="false">✗ Draft (Hidden)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
              <Layers className="text-primary" size={20} aria-hidden="true" />
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
                      aria-label="Add subcategory"
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
                        <Grid3x3 size={12} aria-hidden="true" />
                        <span>{getSubCategoryName(subCatId)}</span>
                        <button
                          type="button"
                          onClick={() => removeSubCategory(subCatId)}
                          className="hover:text-error transition-colors"
                          aria-label="Remove subcategory"
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

          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
              <CheckCircle className="text-primary" size={20} aria-hidden="true" />
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
                  maxLength="500"
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

        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
              <ImageIcon className="text-primary" size={20} aria-hidden="true" />
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
              <Upload className="mx-auto text-text-muted mb-3" size={32} aria-hidden="true" />
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

            {data.image.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-text">Selected Images</h4>
                  <span className="text-xs text-text-muted">First image will be featured</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {data.image.map((file, index) => {
                    const previewUrl = typeof file === "string" ? file : URL.createObjectURL(file);
                    return (
                      <div key={index} className="relative group">
                        <img
                          src={previewUrl}
                          alt={`Product preview ${index + 1}`}
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
                          className="absolute top-1 right-1 p-1 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/80"
                          aria-label="Remove image"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {errors.image && (
              <p className="mt-2 text-xs text-error flex items-center gap-1">
                <AlertCircle size={12} aria-hidden="true" />
                {errors.image}
              </p>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
              <Info className="text-primary" size={20} aria-hidden="true" />
              <h3 className="text-lg font-semibold text-text">Specifications</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-1">
                  <Weight size={14} aria-hidden="true" />
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
                  <Ruler size={14} aria-hidden="true" />
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
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                  <CheckCircle size={12} className="text-success" aria-hidden="true" />
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