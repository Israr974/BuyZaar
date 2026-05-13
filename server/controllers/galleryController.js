import Gallery from '../models/Gallery.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const getGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find({ isActive: true }).sort('order');
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort('order');
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createGalleryImage = async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl;
    
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'gallery'
      });
      imageUrl = result.secure_url;
    }
    
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "Image URL or file is required" });
    }
    
    const gallery = new Gallery({
      imageUrl,
      title: req.body.title || "",
      link: req.body.link || "",
      order: req.body.order || 0
    });
    
    await gallery.save();
    res.json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateGalleryImage = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'gallery'
      });
      updateData.imageUrl = result.secure_url;
    }
    
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteGalleryImage = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};