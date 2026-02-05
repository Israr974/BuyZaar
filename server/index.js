import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/connectDb.js';


import userRoute from './routes/userRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import subCategoryRouter from './routes/subCategoryRoutes.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import addressRouter from './routes/addressRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRouter.js';
import paymentRouter from './routes/paymentRoutes.js'; // ✅ make sure this exists
import searchRoutes from './routes/searchRoutes.js';
dotenv.config();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTED_URL,
  credentials: true
}));
app.use(helmet({
  crossOriginResourcePolicy: false
}));


app.use("/api/user", userRoute);
app.use("/api/category", categoryRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/payment", paymentRouter); 
app.use('/api/search', searchRoutes);


app.get("/", (req, res) => {
  res.send("API is running");
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});


const PORT = process.env.PORT || 3030;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to DB:", err);
});
