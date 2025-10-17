import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const xmlFileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/xml' || file.mimetype === 'application/xml') {
    cb(null, true);
  } else {
    cb(new Error('Only XML files are allowed'));
  }
};

const diskXmlUploadHandler = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 2 },
  fileFilter: xmlFileFilter,
});

export default diskXmlUploadHandler;
