const multer = require('multer');
const path = require('path');

// Set up multer storage and file filter
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads')); // Upload destination folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original file name
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only PNG files
  if (file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only PNG files are allowed.'), false);
  }
};

// Create a Multer instance with the specified storage and file filter options
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;