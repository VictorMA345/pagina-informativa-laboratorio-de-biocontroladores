const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("No se acepta ese tipo de archivo"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 30000000, files: 15 } 
});

module.exports = { upload };