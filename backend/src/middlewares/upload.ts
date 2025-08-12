import multer, { Multer, StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const doctorDir = path.join(process.cwd(), 'uploads', 'doctor');
if (!fs.existsSync(doctorDir)) {
  fs.mkdirSync(doctorDir, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
  destination: (_req: Request, _file: any, cb: (error: Error | null, destination: string) => void) => cb(null, doctorDir),
  filename: (req: Request, file: any, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
    const idPart = (req.params.id || 'tmp');
    cb(null, `${idPart}-${Date.now()}${safeExt}`);
  },
});

function fileFilter(_req: Request, file: any, cb: multer.FileFilterCallback) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.mimetype)) return cb(new Error('UNSUPPORTED_TYPE'));
  cb(null, true);
}

export const uploadDoctorImage = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });
