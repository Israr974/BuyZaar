import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Upload, X } from "lucide-react";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import ConfirmBox from "./ConfirmBox";

const HeroBanner = ({ autoPlay = true, interval = 5000, isAdmin = false }) => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, interval);
    return () => clearInterval(timer);
  }, [banners.length, autoPlay, interval]);

  const fetchBanners = async () => {
    try {
      const response = await Axios({
        ...summaryApi().getBanners,
        headers: { 'Content-Type': 'application/json' }
      });
      setBanners(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching banners:", error);
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }
    
    setUploading(true);
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("link", link);
    
    try {
      await Axios({
        ...summaryApi().uploadBanner,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Banner uploaded successfully");
      await fetchBanners();
      setShowUpload(false);
      setImageFile(null);
      setLink("");
    } catch (error) {
      toast.error("Failed to upload banner");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setBannerToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    
    try {
      await Axios({
        ...summaryApi().deleteBanner,
        url: summaryApi().deleteBanner.url + bannerToDelete
      });
      toast.success("Banner deleted successfully");
      await fetchBanners();
      if (currentSlide >= banners.length - 1) {
        setCurrentSlide(Math.max(0, banners.length - 2));
      }
      setShowDeleteConfirm(false);
      setBannerToDelete(null);
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  if (loading) {
    return (
      <div className="h-[300px] md:h-[400px] lg:h-[500px] bg-gray-200 animate-pulse rounded-2xl"></div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        {isAdmin && (
          <button
            onClick={() => setShowUpload(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-lg"
          >
            <Plus size={20} />
            Add First Slide
          </button>
        )}
        {!isAdmin && (
          <p className="text-gray-400 text-lg">No banners available</p>
        )}
        {showUpload && (
          <UploadModal
            imageFile={imageFile}
            link={link}
            uploading={uploading}
            onImageChange={handleImageChange}
            onLinkChange={setLink}
            onSubmit={handleUpload}
            onClose={() => setShowUpload(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl group">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={banner._id} className="w-full flex-shrink-0 relative">
            {banner.link ? (
              <a href={banner.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={banner.imageUrl}
                  alt="banner"
                  className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
                />
              </a>
            ) : (
              <img
                src={banner.imageUrl}
                alt="banner"
                className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
              />
            )}
            {isAdmin && (
              <button
                onClick={() => handleDeleteClick(banner._id)}
                className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition z-10"
                aria-label="Delete slide"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
      </div>

      {isAdmin && banners.length > 0 && (
        <button
          onClick={() => setShowUpload(true)}
          className="absolute top-4 right-20 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition z-10"
          aria-label="Add slide"
        >
          <Plus size={20} />
        </button>
      )}

      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? "bg-white w-6" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {showUpload && (
        <UploadModal
          imageFile={imageFile}
          link={link}
          uploading={uploading}
          onImageChange={handleImageChange}
          onLinkChange={setLink}
          onSubmit={handleUpload}
          onClose={() => setShowUpload(false)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmBox
          title="Delete Banner"
          message="Are you sure you want to delete this banner? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="red"
          type="danger"
          confirm={handleDelete}
          cancel={() => {
            setShowDeleteConfirm(false);
            setBannerToDelete(null);
          }}
          close={() => {
            setShowDeleteConfirm(false);
            setBannerToDelete(null);
          }}
        />
      )}
    </div>
  );
};

const UploadModal = ({ imageFile, uploading, onImageChange, onLinkChange, onSubmit, onClose }) => {
  const previewUrl = imageFile ? URL.createObjectURL(imageFile) : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Add New Slide</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Banner Image</label>
            {previewUrl ? (
              <div className="relative">
                <img src={previewUrl} alt="preview" className="w-full h-40 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => onImageChange({ target: { files: [] } })}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition">
                <Upload size={32} className="text-gray-400" />
                <span className="text-sm mt-1 text-gray-600">Click to upload image</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  className="hidden"
                  required
                />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading || !imageFile}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {uploading ? "Uploading..." : "Upload Slide"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeroBanner;