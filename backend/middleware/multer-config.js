const multer = require('multer'), Mime_types = { 'image/jpg': 'jpg', 'image/jpeg': 'jpg', 'images/png' : 'png'};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    fillname: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = Mime_types[file.mimetypes];
        callback(null, name + Date.now() + '.' + extension);
    },
});

module.exports = multer({ storage }).single('image');