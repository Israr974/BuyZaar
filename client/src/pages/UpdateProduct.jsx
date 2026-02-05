import React, { useState, useEffect } from "react";
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
  EyeOff
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

  
  useEffect(() => {
    const fetchProductById = async () => {
      if (!productId) return;
      
      try {
        setProductLoading(true);
       
        const response = await Axios({
          ...summaryApi().getProductById(),
          data: { productId:productId } 
        });
        
        if (response.data.success) {
          const productData = response.data.data;
          setProduct(productData);
          
         
          setData({
            name: productData.name || "",
            image: productData.image || [],
            category: productData.category?._id || productData.category || "",
            subCategory: productData.sub_category?.[0]?._id || productData.sub_category?.[0] || "",
            unit: productData.unit || "",
            stock: productData.stock || "",
            price: productData.price || "",
            discount: productData.discount || "",
            description: productData.description || "",
            more_details: productData.more_details || "",
            publish: productData.publish ?? true,
          });
        } else {
          toast.error(response.data.message || "Failed to load product details");
          onClose?.();
        }
      } catch (error) {
        AxiosError(error);
        toast.error("Error loading product");
        onClose?.();
      } finally {
        setProductLoading(false);
      }
    };

    fetchProductById();
  }, [productId, onClose]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Axios(summaryApi().getAllCategory);
        setCategories(res.data.data || []);
      } catch (error) {
        AxiosError(error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  
  useEffect(() => {
    if (!data.category) return setSubCategories([]);
    const fetchSubCategories = async () => {
      try {
        const res = await Axios(summaryApi().getSubcategory);
        const filtered =
          res.data?.data?.filter((sub) =>
            sub.category.some((c) => c._id === data.category)
          ) || [];
        setSubCategories(filtered);
      } catch (error) {
        AxiosError(error);
      }
    };
    fetchSubCategories();
  }, [data.category]);

  const validateForm = () => {
    const newErrors = {};

    if (!data.name.trim()) {
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

    if (!data.price || parseFloat(data.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (!data.stock || parseInt(data.stock) < 0) {
      newErrors.stock = "Please enter valid stock quantity";
    }

    if (data.discount && (parseFloat(data.discount) < 0 || parseFloat(data.discount) > 100)) {
      newErrors.discount = "Discount must be between 0 and 100";
    }

    if (data.image.length === 0) {
      newErrors.image = "Please upload at least one product image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + data.image.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files (JPG, PNG, GIF, WebP) are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
    });

    setData((prev) => ({ ...prev, image: [...prev.image, ...files] }));
    setErrors(prev => ({ ...prev, image: null }));
  };

  const removeImage = (index) => {
    setData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const uploadedUrls = [];

     
      for (let file of data.image) {
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
        });
        if (res.data?.imageUrl) uploadedUrls.push(res.data.imageUrl);
        else {
          toast.error("Failed to upload image");
          return;
        }
      }

      const payload = {
        id: productId,
        name: data.name.trim(),
        unit: data.unit.trim(),
        stock: parseInt(data.stock),
        price: parseFloat(data.price),
        discount: data.discount ? parseFloat(data.discount) : 0,
        description: data.description.trim(),
        more_details: data.more_details.trim(),
        publish: data.publish,
        category: data.category,
        sub_category: [data.subCategory],
        image: uploadedUrls,
      };

      const res = await Axios({
        ...summaryApi().updateProductDetails,
        data: payload,
      });

      if (res.data.success) {
        toast.success(" Product updated successfully");
        

        if (onSuccess) {
          onSuccess();
        } else {
          onClose?.();
        }
      } else {
        toast.error(res.data.message || "Failed to update product");
      }
    } catch (error) {
      AxiosError(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (productLoading) {
    return (
      <section className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="text-text">Loading product details...</p>
        </div>
      </section>
    );
  }

  
  if (!product) {
    return (
      <section className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4">
          <XCircle size={48} className="text-red-500" />
          <h3 className="text-xl font-bold text-text">Product Not Found</h3>
          <p className="text-text-muted">The product you're trying to edit doesn't exist.</p>
          <button
            onClick={onClose}
            className="btn-outline px-6 py-2.5 rounded-xl mt-4"
          >
            Close
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
       
        <div className="sticky top-0 z-10 bg-white border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Update Product
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Edit product details for "{product?.name || 'Product'}"
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              aria-label="Close modal"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text-muted hover:text-text disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        </div>

       
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           
            <div className="space-y-6">
             
              <div>
                <label className="label flex items-center gap-2">
                  <Package size={16} />
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={data.name}
                  onChange={handleChange}
                  disabled={loading}
                  className={`input w-full ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <XCircle size={14} />
                    {errors.name}
                  </p>
                )}
              </div>

              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-2">
                    <Layers size={16} />
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={data.category}
                    onChange={handleChange}
                    disabled={loading}
                    className={`input w-full ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <XCircle size={14} />
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <Tag size={16} />
                    Subcategory <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subCategory"
                    value={data.subCategory}
                    onChange={handleChange}
                    disabled={loading || !data.category}
                    className={`input w-full ${errors.subCategory ? 'border-red-500 focus:ring-red-500' : ''}`}
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
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <XCircle size={14} />
                      {errors.subCategory}
                    </p>
                  )}
                </div>
              </div>

              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label flex items-center gap-2">
                    <DollarSign size={16} />
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={data.price}
                    onChange={handleChange}
                    disabled={loading}
                    className={`input w-full ${errors.price ? 'border-red-500 focus:ring-red-500' : ''}`}
                    min="0"
                    step="0.01"
                  />
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <XCircle size={14} />
                      {errors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <Percent size={16} />
                    Discount %
                  </label>
                  <input
                    type="number"
                    name="discount"
                    placeholder="0"
                    value={data.discount}
                    onChange={handleChange}
                    disabled={loading}
                    className={`input w-full ${errors.discount ? 'border-red-500 focus:ring-red-500' : ''}`}
                    min="0"
                    max="100"
                  />
                  {errors.discount && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <XCircle size={14} />
                      {errors.discount}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <Hash size={16} />
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="0"
                    value={data.stock}
                    onChange={handleChange}
                    disabled={loading}
                    className={`input w-full ${errors.stock ? 'border-red-500 focus:ring-red-500' : ''}`}
                    min="0"
                  />
                  {errors.stock && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <XCircle size={14} />
                      {errors.stock}
                    </p>
                  )}
                </div>
              </div>

             
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-2">
                    <Package size={16} />
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
                    <Globe size={16} />
                    Status
                  </label>
                  <select
                    name="publish"
                    value={data.publish}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, publish: e.target.value === "true" }))
                    }
                    disabled={loading}
                    className="input w-full"
                  >
                    <option value="true">
                      <span className="flex items-center gap-2">
                        <Eye size={14} />
                        Published
                      </span>
                    </option>
                    <option value="false">
                      <span className="flex items-center gap-2">
                        <EyeOff size={14} />
                        Unpublished
                      </span>
                    </option>
                  </select>
                </div>
              </div>
            </div>

           
            <div className="space-y-6">
              
              <div>
                <label className="label flex items-center gap-2">
                  <ImageIcon size={16} />
                  Product Images <span className="text-red-500">*</span>
                  <span className="text-xs text-text-muted ml-auto">
                    ({data.image.length}/10 images)
                  </span>
                </label>

                <div className="space-y-4">
                 
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      disabled={loading}
                      className="hidden"
                      id="product-images"
                    />
                    <label
                      htmlFor="product-images"
                      className="flex items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary transition-colors rounded-xl p-6 cursor-pointer hover:bg-gray-50/50"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="text-primary" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">
                          Click to upload images
                        </p>
                        <p className="text-xs text-text-muted">
                          JPG, PNG, WebP up to 5MB each
                        </p>
                      </div>
                    </label>
                  </div>

                  
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {data.image.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border bg-gray-50">
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
                          className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                          aria-label="Remove image"
                        >
                          <Trash2 size={12} />
                        </button>
                        {typeof file === "string" && (
                          <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            Current
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {errors.image && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle size={14} />
                      {errors.image}
                    </p>
                  )}
                </div>
              </div>

             
              <div>
                <label className="label flex items-center gap-2">
                  <FileText size={16} />
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
              </div>

             
              <div>
                <label className="label flex items-center gap-2">
                  <FileText size={16} />
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
                <p className="text-xs text-text-muted mt-2">
                  You can add bullet points or detailed specifications here
                </p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="sticky bottom-0 bg-white border-t p-6">
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
    </section>
  );
};

export default UpdateProduct;