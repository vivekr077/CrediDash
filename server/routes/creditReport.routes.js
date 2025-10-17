import express from 'express';
import multer from 'multer';
import fs from 'fs';
import {
  handleXmlCreditReportUpload,
  listAllCreditReports,
  fetchSingleCreditReportById,
} from '../controllers/creditReport.controller.js';
const apiRouter = express.Router();

apiRouter.get('/test', function (req, res) {
    return res.json({ "test": true });
});

const diskXmlUploadHandler = (() => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadDir = 'server/uploads';
            try {
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
            } catch (e) {
                return cb(e);
            }
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const timeSuffix = Date.now();
            const sanitizedOriginal = (file.originalname || 'upload.xml').replace(/[^a-zA-Z0-9_.-]/g, '_');
            cb(null, `${timeSuffix}-${sanitizedOriginal}`);
        }
    });

    return multer({
        storage,
        limits: { fileSize: 1024 * 1024 * 5 },
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'text/xml' || file.mimetype === 'application/xml') cb(null, true);
            else cb(new Error('Only XML files are allowed'));
        }
    });
})();

apiRouter.post('/upload/credit-xml', diskXmlUploadHandler.single('file'), handleXmlCreditReportUpload);

apiRouter.get('/credits', listAllCreditReports);
apiRouter.get('/credits/:reportId', fetchSingleCreditReportById);


export default apiRouter;