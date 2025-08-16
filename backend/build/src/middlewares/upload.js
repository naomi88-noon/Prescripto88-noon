"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDoctorImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const doctorDir = path_1.default.join(process.cwd(), 'uploads', 'doctor');
if (!fs_1.default.existsSync(doctorDir)) {
    fs_1.default.mkdirSync(doctorDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, doctorDir),
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
        const idPart = (req.params.id || 'tmp');
        cb(null, `${idPart}-${Date.now()}${safeExt}`);
    },
});
function fileFilter(_req, file, cb) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.mimetype))
        return cb(new Error('UNSUPPORTED_TYPE'));
    cb(null, true);
}
exports.uploadDoctorImage = (0, multer_1.default)({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });
