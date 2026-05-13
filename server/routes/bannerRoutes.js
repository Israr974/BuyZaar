import express from 'express';
import multer from 'multer';

import {
  getBanners,
  getAdminBanners,
  createBanner,
  deleteBanner,
} from '../controllers/bannerController.js';

const bannerRoutes = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

bannerRoutes.get('/banners', getBanners);

bannerRoutes.get('/admin/banners', getAdminBanners);

bannerRoutes.post('/admin/banners',upload.single('image'),createBanner);

bannerRoutes.delete('/admin/banners/:id',deleteBanner);

export default bannerRoutes;