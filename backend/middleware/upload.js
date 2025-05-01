const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "uploads/avatars",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}`);
    }
});

const upload = multer({storage});

module.exports = upload;