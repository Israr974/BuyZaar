import React, { useState, useEffect } from "react";
import { Plus, Trash2, Upload, X, Edit, Camera } from "lucide-react";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import useMobile from "../hooks/useMobile";
import ConfirmBox from "./ConfirmBox";

const GallerySection = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  
  const user = useSelector((state) => state.user);
  const isAdmin = user?.role === "admin";
  const isMobile = useMobile(768);

  useEffect(() => { 
    fetchGalleryImages(); 
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const response = await Axios(summaryApi().getGalleryImages);
      if (response.data?.success && Array.isArray(response.data.data)) {
        setImages(response.data.data);
      } else { 
        setImages([]); 
      }
    } catch (error) { 
      toast.error(error)
      setImages([]); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }
    
    setUploading(true);
    const formData = new FormData();
    formData.append("image", imageFile);
    
    try {
      await Axios({ 
        ...summaryApi().createGalleryImage, 
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Image added successfully");
      await fetchGalleryImages();
      setShowModal(false);
      setImageFile(null);
    } catch (error) { 
      toast.error(error.response?.data?.message || "Failed to add image"); 
    } finally { 
      setUploading(false); 
    }
  };

  const handleDeleteClick = (id) => {
    setImageToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!imageToDelete) return;
    
    try {
      await Axios(summaryApi().deleteGalleryImage(imageToDelete));
      toast.success("Image deleted successfully");
      await fetchGalleryImages();
      setShowDeleteConfirm(false);
      setImageToDelete(null);
    } catch (error) { 
      toast.error("Failed to delete image",error); 
    }
  };

  if (loading) {
    return (
      <div className="py-6 md:py-8">
        <div className="text-center mb-6">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-40 md:h-56 bg-gray-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-6 md:py-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Follow Our Trends
            </h2>
            {isAdmin && (
              <button 
                onClick={() => setShowModal(true)} 
                className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition"
                aria-label="Add image"
              >
                <Plus size={isMobile ? 14 : 16} />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Inspired by modern lifestyle and fashion</p>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-2xl">
            <Camera size={40} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No images yet</p>
            {isAdmin && (
              <button 
                onClick={() => setShowModal(true)} 
                className="mt-3 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Add First Image
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {images.map((image) => (
              <div 
                key={image._id} 
                className="relative overflow-hidden rounded-2xl h-40 md:h-56 group"
              >
                <img 
                  src={image.imageUrl} 
                  alt="gallery" 
                  className="w-full h-full object-cover transition duration-500" 
                />
                {isAdmin && (
                  <button 
                    onClick={() => handleDeleteClick(image._id)} 
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition shadow-md"
                    aria-label="Delete image"
                  >
                    <Trash2 size={isMobile ? 14 : 14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-bold text-lg">Add Image</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Upload Image *</label>
                {imageFile ? (
                  <div className="relative">
                    <img 
                      src={URL.createObjectURL(imageFile)} 
                      alt="preview" 
                      className="w-full h-40 object-cover rounded-lg border border-gray-200" 
                    />
                    <button
                      type="button"
                      onClick={() => setImageFile(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition bg-gray-50">
                    <Upload size={isMobile ? 28 : 32} className="text-gray-400" />
                    <span className="text-xs sm:text-sm mt-2 text-gray-600">Click to upload image</span>
                    <span className="text-[10px] sm:text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                  </label>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading || !imageFile}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-sm font-medium"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </span>
                ) : (
                  "Add Image"
                )}
              </button>
            </form>
          </div>
        </div>
      )}


      {showDeleteConfirm && (
        <ConfirmBox
          title="Delete Image"
          message="Are you sure you want to delete this image? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="red"
          type="danger"
          confirm={handleDelete}
          cancel={() => {
            setShowDeleteConfirm(false);
            setImageToDelete(null);
          }}
          close={() => {
            setShowDeleteConfirm(false);
            setImageToDelete(null);
          }}
        />
      )}
    </>
  );
};

export default GallerySection;