import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No image file uploaded",
        success: false,
        error: true,
      });
    }

    
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        message: "Only JPG, PNG, JPEG, WEBP images are allowed",
        success: false,
        error: true,
      });
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return res.status(400).json({
        message: "Image size must be less than 5MB",
        success: false,
        error: true,
      });
    }


    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "categories", 
          resource_type: "image",
          quality: "auto",
          fetch_format: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(file.buffer);
    });

    return res.status(200).json({
      message: "Image uploaded successfully",
      success: true,
      error: false,
      imageUrl: result.secure_url,
      public_id: result.public_id, 
    });

  } catch (error) {
    console.error(" Upload Error:", error);
    return res.status(500).json({
      message: error.message || "Image upload failed",
      success: false,
      error: true,
    });
  }
};
