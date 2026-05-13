// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads/");
//     },
//     filename: function (req, file, cb) {
//         const uniqueName = Date.now() + "-" + file.originalname;
//         cb(null, uniqueName);
//     },
// });

// const fileFilter = (req, file, cb) => {
//     const allowedTypes = [".pdf"];
//     const ext = path.extname(file.originalname).toLocaleLowerCase();
//     if (allowedTypes.includes(ext)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only PDF files are allowed"), false);
//     }
// };

// const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 },
// });

// export default upload;

import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = [".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
