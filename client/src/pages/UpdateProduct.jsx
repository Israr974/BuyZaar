import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  Upload,
  Save,
  XCircle,
  Loader2,
  ImageIcon,
  Package,
  DollarSign,
  Percent,
  Hash,
  FileText,
  Layers,
  Tag,
  Globe,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  ShoppingBag
} from "lucide-react";
import Axios from "../utils/Axios";
import AxiosError from "../utils/AxiosToError";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";

const UpdateProduct = ({ productId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [product, setProduct] = useState(null);
  const [data, setData] = useState({
    name: "",
    image: [],
    category: "",
    subCategory: "",
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: "",
    publish: true,
  });

  const abortControllerRef = useRef(null);
  const isMounted = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Fetch product by ID
  useEffect(() => {
    const fetchProductById = async () => {
      if (!productId) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        setProductLoading(true);
        const response = await Axios({
          ...summaryApi().getProductById(),
          data: { productId: productId },
          signal: abortControllerRef.current.signal,
        });

        if (!isMounted.current) return;

        if (response.data?.success) {
          const productData = response.data.data;
          setProduct(productData);

          setData({
            name: productData.name || "",
            image: productData.image || [],
            category: productData.category?._id || productData.category || "",
            subCategory: productData.sub_category?.[0]?._id || productData.sub_category?.[0] || "",
            unit: productData.unit || "",
            stock: productData.stock?.toString() || "",
            price: productData.price?.toString() || "",
            discount: productData.discount?.toString() || "",
            description: productData.description || "",
            more_details: productData.more_details || "",
            publish: productData.publish ?? true,
          });
        } else {
          toast.error(response.data?.message || "Failed to load product details");
          onClose?.();
        }
      } catch (error) {
        if (isMounted.current && error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
          AxiosError(error);
          toast.error("Error loading product");
          onClose?.();
        }
      } finally {
        if (isMounted.current) {
          setProductLoading(false);
        }
      }
    };

    fetchProductById();
  }, [productId, onClose]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Axios(summaryApi().getAllCategory);
        if (isMounted.current && res.data?.success) {
          setCategories(res.data.data || []);
        }
      } catch (error) {
        if (isMounted.current) {
          AxiosError(error);
          toast.error("Failed to load categories");
        }
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (!data.category) {
      setSubCategories([]);
      return;
    }

    const fetchSubCategories = async () => {
      try {
        const res = await Axios(summaryApi().getSubcategory);
        if (isMounted.current && res.data?.success) {
          const filtered = res.data.data?.filter((sub) =>
            sub.category?.some((c) => c._id === data.category)
          ) || [];
          setSubCategories(filtered);
        }
      } catch (error) {
        if (isMounted.current) {
          AxiosError(error);
        }
      }
    };
    fetchSubCategories();
  }, [data.category]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!data.name?.trim()) {
      newErrors.name = "Product name is required";
    } else if (data.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!data.category) {
      newErrors.category = "Please select a category";
    }

    if (!data.subCategory) {
      newErrors.subCategory = "Please select a subcategory";
    }

    const price = parseFloat(data.price);
    if (!data.price || isNaN(price) || price <= 0) {
      newErrors.price = "Please enter a valid price (greater than 0)";
    }

    const stock = parseInt(data.stock);
    if (!data.stock || isNaN(stock) || stock < 0) {
      newErrors.stock = "Please enter valid stock quantity (0 or more)";
    }

    if (data.discount) {
      const discount = parseFloat(data.discount);
      if (isNaN(discount) || discount < 0 || discount > 100) {
        newErrors.discount = "Discount must be between 0 and 100";
      }
    }

    if (!data.image || data.image.length === 0) {
      newErrors.image = "Please upload at least one product image";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.keys(newErrors)[0];
      const errorElement = document.getElementById(`error-${firstError}`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    return true;
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + data.image.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

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

    setData((prev) => ({ ...prev, image: [...prev.image, ...validFiles] }));
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: null }));
    }
  };

  const removeImage = (indexToRemove) => {
    setData((prev) => ({
      ...prev,
      image: prev.image.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    
    try {
      const uploadedUrls = [];

      // Upload new images
      for (const file of data.image) {
        if (typeof file === "string") {
          uploadedUrls.push(file);
          continue;
        }
        
        const formData = new FormData();
        formData.append("image", file);
        
        const res = await Axios({
          ...summaryApi().uploadImage,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
          signal: abortControllerRef.current.signal,
        });
        
        if (!isMounted.current) return;
        
        if (res.data?.imageUrl) {
          uploadedUrls.push(res.data.imageUrl);
        } else {
          toast.error(`Failed to upload image: ${file.name}`);
          setLoading(false);
          return;
        }
      }

      const payload = {
        id: productId,
        name: data.name.trim(),
        unit: data.unit?.trim() || "",
        stock: parseInt(data.stock),
        price: parseFloat(data.price),
        discount: data.discount ? parseFloat(data.discount) : 0,
        description: data.description?.trim() || "",
        more_details: data.more_details?.trim() || "",
        publish: data.publish,
        category: data.category,
        sub_category: [data.subCategory],
        image: uploadedUrls,
      };

      const res = await Axios({
        ...summaryApi().updateProductDetails,
        data: payload,
        signal: abortControllerRef.current.signal,
      });

      if (!isMounted.current) return;

      if (res.data?.success) {
        toast.success("Product updated successfully! 🎉");
        if (onSuccess) {
          onSuccess();
        } else {
          onClose?.();
        }
      } else {
        toast.error(res.data?.message || "Failed to update product");
      }
    } catch (error) {
      if (!isMounted.current) return;
      
      if (error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
        AxiosError(error);
        toast.error(error.response?.data?.message || "Failed to update product");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  if (productLoading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-card rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 border border-border">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="text-text">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-card rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-md text-center border border-border">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
            <XCircle size={32} className="text-error" />
          </div>
          <h3 className="text-xl font-display font-bold text-text">Product Not Found</h3>
          <p className="text-text-muted">The product you're trying to edit doesn't exist.</p>
          <button onClick={onClose} className="btn-primary px-6 py-2.5 rounded-xl mt-2">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-border">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" aria-hidden="true" />
                <h2 className="text-2xl font-display font-bold gradient-text">
                  Update Product
                </h2>
              </div>
              <p className="text-sm text-text-muted mt-1">
                Edit product details for "{product?.name || 'Product'}"
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text disabled:opacity-50"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Product Name */}
              <div>
                <label className="label flex items-center gap-2">
                  <Package size={16} className="text-primary" aria-hidden="true" />
                  Product Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={data.name}
                  onChange={handleChange}
                  disabled={loading}
                  className={`input w-full ${errors.name ? 'border-error' : ''}`}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p id="error-name" className="mt-1 text-xs text-error flex items-center gap-1">
                    <AlertCircle size={12} aria-hidden="true" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-2">
                    <Layers size={16} className="text-primary" aria-hidden="true" />
                    Category <span className="text-error">*</span>
                  </label>
                  <select
                    name="category"
                    value={data.category}
                    onChange={handleChange}
                    disabled={loading}
                    className={`input w-full ${errors.category ? 'border-error' : ''}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-xs text-error flex items-center gap-1">
                      <AlertCircle size={12} aria-hidden="true" />
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <Tag size={16} className="text-primary" aria-hidden="true" />
                    Subcategory <span className="text-error">*</span>
                  </label>
                  <select
                    name="subCategory"
                    value={data.subCategory}
                    onChange={handleChange}
                    disabled={loading || !data.category}
                    className={`input w-full ${errors.subCategory ? 'border-error' : ''}`}
                  >
                    <option value="">
                      {data.category ? "Select Subcategory" : "Select category first"}
                    </option>
                    {subCategories.map((sc) => (
                      <option key={sc._id} value={sc._id}>
                        {sc.name}
                      </option>
                    ))}
                  </select>
                  {errors.subCategory && (
                    <p className="mt-1 text-xs text-error flex items-center gap-1">
                      <AlertCircle size={12} aria-hidden="true" />
                      {errors.subCategory}
                    </p>
                  )}
                </div>
              </div>

              {/* Price, Discount, Stock */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label flex items-center gap-2">
                    <DollarSign size={16} className="text-primary" aria-hidden="true" />
                    Price (₹) <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={data.price}
                    onChange={handleChange}
                    disabled={loading}
                    className={`input w-full ${errors.price ? 'border-error' : ''}`}
                    min="0"
                    step="0.01"
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-error">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <Percent size={16} className="text-primary" aria-hidden="true" />
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    placeholder="0"
                    value={data.discount}
                    onChange={handleChange}
                    disabled={loading}
                    className={`input w-full ${errors.discount ? 'border-error' : ''}`}
                    min="0"
                    max="100"
                  />
                  {errors.discount && (
                    <p className="mt-1 text-xs text-error">{errors.discount}</p>
                  )}
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <Hash size={16} className="text-primary" aria-hidden="true" />
                    Stock <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="0"
                    value={data.stock}
                    onChange={handleChange}
                    disabled={loading}
                    className={`input w-full ${errors.stock ? 'border-error' : ''}`}
                    min="0"
                  />
                  {errors.stock && (
                    <p className="mt-1 text-xs text-error">{errors.stock}</p>
                  )}
                </div>
              </div>

              {/* Unit & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-2">
                    <Package size={16} className="text-primary" aria-hidden="true" />
                    Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    placeholder="e.g., piece, kg, dozen"
                    value={data.unit}
                    onChange={handleChange}
                    disabled={loading}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <Globe size={16} className="text-primary" aria-hidden="true" />
                    Status
                  </label>
                  <select
                    name="publish"
                    value={data.publish}
                    onChange={(e) => setData((prev) => ({ ...prev, publish: e.target.value === "true" }))}
                    disabled={loading}
                    className="input w-full"
                  >
                    <option value="true">✓ Published (Visible to customers)</option>
                    <option value="false">✗ Unpublished (Hidden from store)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Product Images */}
              <div>
                <label className="label flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={16} className="text-primary" aria-hidden="true" />
                    Product Images <span className="text-error">*</span>
                  </div>
                  <span className="text-xs text-text-muted">
                    ({data.image.length}/10 images)
                  </span>
                </label>

                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    disabled={loading}
                    className="hidden"
                    id="product-images-update"
                  />
                  <label
                    htmlFor="product-images-update"
                    className="flex items-center justify-center gap-3 border-2 border-dashed border-border hover:border-primary transition-colors rounded-xl p-5 cursor-pointer hover:bg-primary/5"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="text-primary" size={20} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">Click to upload images</p>
                      <p className="text-xs text-text-muted">JPG, PNG, WebP up to 5MB each</p>
                    </div>
                  </label>

                  {/* Image Grid */}
                  {data.image.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {data.image.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border border-border bg-bg-alt">
                            <img
                              src={typeof file === "string" ? file : URL.createObjectURL(file)}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            disabled={loading}
                            className="absolute -top-2 -right-2 h-6 w-6 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                            aria-label="Remove image"
                          >
                            <Trash2 size={12} aria-hidden="true" />
                          </button>
                          {typeof file === "string" && (
                            <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                              Current
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.image && (
                    <p className="text-xs text-error flex items-center gap-1">
                      <AlertCircle size={12} aria-hidden="true" />
                      {errors.image}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="label flex items-center gap-2">
                  <FileText size={16} className="text-primary" aria-hidden="true" />
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Product description..."
                  value={data.description}
                  onChange={handleChange}
                  disabled={loading}
                  rows={4}
                  className="input w-full resize-none"
                />
                <p className="text-xs text-text-muted mt-1">
                  {data.description?.length || 0}/500 characters
                </p>
              </div>

              {/* More Details */}
              <div>
                <label className="label flex items-center gap-2">
                  <FileText size={16} className="text-primary" aria-hidden="true" />
                  More Details (Optional)
                </label>
                <textarea
                  name="more_details"
                  placeholder="Additional details, features, specifications..."
                  value={data.more_details}
                  onChange={handleChange}
                  disabled={loading}
                  rows={3}
                  className="input w-full resize-none"
                />
                <p className="text-xs text-text-muted mt-1">
                  Add bullet points or detailed specifications here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-5">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="btn-outline px-6 py-2.5 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary px-6 py-2.5 rounded-xl flex items-center gap-2 min-w-[140px] justify-center"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Product
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;