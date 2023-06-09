const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { nanoid } = require('nanoid');

const { HttpError } = require('../helpers');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const { USER_AVATAR_PARAMS } = require('../models/');
const { USER_RECIPE_PIC_PARAMS } = require('../models');

const multerConfigAvatar = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const avatarName = `${req.user._id}_avatar`;
    return {
      folder: 'soyummy/assets/avatars',
      allowed_formats: USER_AVATAR_PARAMS.acceptableFileTypes,
      public_id: avatarName,
      transformation: [
        {
          height: USER_AVATAR_PARAMS.dimensions.height,

          width: USER_AVATAR_PARAMS.dimensions.width,

          crop: 'fill',
        },
      ],
      bytes: USER_AVATAR_PARAMS.maxFileSize,
    };
  },
});

const multerConfiRecipe = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const { _id } = req.user;
    const imgID = nanoid(5);
    const recipeName = `${_id}_${imgID}_recipe`;
    return {
      folder: 'soyummy/assets/own_recipes_photos',
      allowed_formats: USER_RECIPE_PIC_PARAMS.acceptableFileTypes,
      public_id: recipeName,
      transformation: [
        {
          height: USER_RECIPE_PIC_PARAMS.dimensions.height,
          width: USER_RECIPE_PIC_PARAMS.dimensions.width,
          crop: 'fill',
        },
      ],
    };
  },
});

function fileFilter(req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(
      HttpError(
        415,
        'Unsupported image format. Choose file with extention jpeg or png'
      )
    );
  }
}

const uploadCloudAvatar = multer({
  storage: multerConfigAvatar,
  fileFilter,
});

const uploadCloudRecipe = multer({
  storage: multerConfiRecipe,
  fileFilter,
});

const ingredientsParser = (req, res, next) => {
  const { ingredients } = req.body;
  try {
    const parsedData = JSON.parse(ingredients);
    req.body.ingredients = parsedData;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadCloudRecipe: uploadCloudRecipe.single('picture'),
  uploadCloudAvatar: uploadCloudAvatar.single('picture'),
  ingredientsParser: ingredientsParser,
};
