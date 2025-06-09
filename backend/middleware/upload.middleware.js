const multer = require("multer");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("../config/cloudinary.config");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and WebP files are allowed"), false);
    }
    cb(null, true);
  },
});

const uploadImage = (req, res, next) => {

  // Parse both 'image' and 'recipe' fields
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "recipe", maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: err.message || "Form data parsing failed",
      });
    }

    // Handle image upload if present
    if (req.files && req.files.image && req.files.image[0]) {
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "Qzene/ingredients/images",
              allowed_formats: ["jpg", "png", "webp"],
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          stream.end(req.files.image[0].buffer);
        });

        req.body.image = result.secure_url;
      } catch (error) {
        console.error("Upload Error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Error uploading image to Cloudinary",
        });
      }
    }

    next();
  });
};

module.exports = uploadImage;
