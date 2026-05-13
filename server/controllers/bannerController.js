import Banner from '../models/Banner.js';
import cloudinary from 'cloudinary';

const { v2 } = cloudinary;

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdminBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Image is required',
      });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await v2.uploader.upload(dataURI, {
      folder: 'banners',
    });

  
    const banner = await Banner.create({
      imageUrl: result.secure_url,
    });

    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({
      message: 'Deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};