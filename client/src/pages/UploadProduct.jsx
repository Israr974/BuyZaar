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
  Trash2
} from "lucide-react";

const UploadProduct = ({ onClose, fetchProducts, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

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
    const fetchCategories = async () => {
      try {
        const res = await Axios(summaryApi().getAllCategory);
        setCategories(res.data?.data || []);
      } catch (error) {
        AxiosError(error);
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
  }, [data.category, allSubCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });
    
    setData((prev) => ({ 
      ...prev, 
      image: [...prev.image, ...validFiles].slice(0, 10) // Limit to 10 images
    }));
  };

  const removeImage = (index) => {
    setData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  };

  const addSubCategory = () => {
    if (!selectedSubCategory) return toast.error("Please select a subcategory");
    if (data.subCategory.includes(selectedSubCategory)) {
      return toast.error("This subcategory is already added");
    }
    if (data.subCategory.length >= 5) {
      return toast.error("Maximum 5 subcategories allowed");
    }
    setData((prev) => ({
      ...prev,
      subCategory: [...prev.subCategory, selectedSubCategory],
    }));
    setSelectedSubCategory("");
  };

  const removeSubCategory = (subCatId) => {
    setData((prev) => ({
      ...prev,
      subCategory: prev.subCategory.filter((id) => id !== subCatId),
    }));
  };

  const validateForm = () => {
    if (!data.name.trim()) return "Product name is required";
    if (data.price <= 0) return "Price must be greater than 0";
    if (data.stock < 0) return "Stock cannot be negative";
    if (data.discount < 0 || data.discount > 100)
      return "Discount must be between 0 and 100";
    if (!data.category) return "Select a category";
    if (!data.subCategory.length) return "Add at least one subcategory";
    if (!data.image.length) return "Upload at least one image";
    return null;
  };

  const handleSubmit = async () => {
    const errorMsg = validateForm();
    if (errorMsg) return toast.error(errorMsg);

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
      };

      const productRes = await Axios({
        ...summaryApi().addProduct,
        data: payload,
      });

      if (productRes.data.success) {
        toast.success(" Product uploaded successfully!");
        fetchProducts?.();
        onSuccess?.();
        onClose?.();
      }
    } catch (error) {
      AxiosError(error);
      toast.error("Failed to upload product");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileChange({ target: { files } });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full max-w-6xl p-8">
   
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Add New Product
          </h2>
          <p className="text-text-muted mt-2">
            Fill in the details below to add a new product to your catalog
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text-muted hover:text-text"
          disabled={loading}
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="text-primary" size={20} />
              <h3 className="text-lg font-semibold text-text">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Product Name *</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    value={data.name}
                    onChange={handleChange}
                    className="input pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="label">SKU (Optional)</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="text"
                    name="sku"
                    placeholder="Product SKU"
                    value={data.sku}
                    onChange={handleChange}
                    className="input pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="label">Brand (Optional)</label>
                <input
                  type="text"
                  name="brand"
                  placeholder="Brand name"
                  value={data.brand}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              
              <div>
                <label className="label">Unit *</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="text"
                    name="unit"
                    placeholder="e.g., kg, piece, liter"
                    value={data.unit}
                    onChange={handleChange}
                    className="input pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="text-primary" size={20} />
              <h3 className="text-lg font-semibold text-text">Pricing & Inventory</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="label">Price *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={data.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="input pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="label">Discount (%)</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="number"
                    name="discount"
                    placeholder="0-100"
                    value={data.discount}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="input pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="label">Stock Quantity *</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="number"
                    name="stock"
                    placeholder="Available stock"
                    value={data.stock}
                    onChange={handleChange}
                    min="0"
                    className="input pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="label">Status</label>
                <select
                  name="publish"
                  value={data.publish}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, publish: e.target.value === "true" }))
                  }
                  className="input"
                >
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
                </select>
              </div>
            </div>
          </div>

          
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="text-primary" size={20} />
              <h3 className="text-lg font-semibold text-text">Categories</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Main Category *</label>
                <select
                  name="category"
                  value={data.category}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="label">Sub-categories *</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <select
                      value={selectedSubCategory}
                      onChange={(e) => setSelectedSubCategory(e.target.value)}
                      className="input flex-1"
                      disabled={!data.category || availableSubCategories.length === 0}
                    >
                      <option value="">Select Sub Category</option>
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
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {data.subCategory.map((subCatId) => {
                      const subCat = allSubCategories.find((sc) => sc._id === subCatId);
                      return (
                        <div
                          key={subCatId}
                          className="badge-primary flex items-center gap-2 px-3 py-2"
                        >
                          <Grid3x3 size={14} />
                          <span>{subCat?.name || subCatId}</span>
                          <button
                            type="button"
                            onClick={() => removeSubCategory(subCatId)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                    {data.subCategory.length === 0 && (
                      <p className="text-text-muted text-sm">No sub-categories added yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="text-primary" size={20} />
              <h3 className="text-lg font-semibold text-text">Descriptions</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="label">Short Description *</label>
                <textarea
                  name="description"
                  placeholder="Brief description of the product..."
                  value={data.description}
                  onChange={handleChange}
                  className="input min-h-[100px]"
                  rows="3"
                  required
                />
                <p className="text-xs text-text-muted mt-1">
                  {data.description.length}/500 characters
                </p>
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
         
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="text-primary" size={20} />
              <h3 className="text-lg font-semibold text-text">Product Images *</h3>
            </div>
            
            <div
              onDrop={handleImageDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors"
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
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

           
            {data.image.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-text">Selected Images</h4>
                  <span className="text-sm text-text-muted">
                    First image will be featured
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {data.image.map((file, index) => {
                    const src = typeof file === "string" ? file : URL.createObjectURL(file);
                    return (
                      <div key={index} className="relative group">
                        <img
                          src={src}
                          alt="preview"
                          className="h-24 w-full object-cover rounded-lg border border-border"
                        />
                        {index === 0 && (
                          <div className="absolute top-1 left-1 bg-primary text-white px-2 py-1 rounded text-xs">
                            Featured
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="text-primary" size={20} />
              <h3 className="text-lg font-semibold text-text">Specifications</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="label">Weight</label>
                <div className="relative">
                  <input
                    type="text"
                    name="weight"
                    placeholder="e.g., 1.5 kg"
                    value={data.weight}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
              
              <div>
                <label className="label">Dimensions</label>
                <div className="relative">
                  <input
                    type="text"
                    name="dimensions"
                    placeholder="e.g., 10x5x3 inches"
                    value={data.dimensions}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>

          
          <div className="card p-6">
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
                    <div className="spinner border-white" />
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
              
              <div className="text-xs text-text-muted pt-4 border-t border-border">
                <p className="flex items-center gap-1">
                  <CheckCircle size={12} />
                  Fields marked with * are required
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