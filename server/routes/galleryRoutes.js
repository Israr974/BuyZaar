import express from 'express';
import multer from 'multer';
import {
  getGalleryImages,
  getAllGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage
} from '../controllers/galleryController.js';
import auth from '../middleware/auth.js';

const galleryRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

galleryRouter.get('/', getGalleryImages);
galleryRouter.get('/all', auth, getAllGalleryImages);
galleryRouter.post('/upload', auth, upload.single('image'), createGalleryImage);
galleryRouter.put('/:id', auth, upload.single('image'), updateGalleryImage);
galleryRouter.delete('/:id', auth, deleteGalleryImage);

export default galleryRouter;