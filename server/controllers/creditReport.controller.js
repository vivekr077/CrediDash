import CreditReportDocument from '../models/CreditReport.model.js';
import extractCreditData  from '../helper/parseReport.js';
import fs from 'fs/promises';

export const handleXmlCreditReportUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const xmlFilePath = req.file.path;
        const xmlContentBuffer = await fs.readFile(xmlFilePath);
        const parsedReportPayload = await extractCreditData(xmlContentBuffer);

        const savedReport = await CreditReportDocument.create(parsedReportPayload);

        res.json({ message: 'Report processed and saved', id: savedReport._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (req?.file?.path) {
            try { await fs.unlink(req.file.path); } catch (_) {}
        }
    }
};

export const listAllCreditReports = async (req, res) => {
    try {
        const reports = await CreditReportDocument.find().sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const fetchSingleCreditReportById = async (req, res) => {
    try {
        console.log(req.params);
        
        const report = await CreditReportDocument.findById(req.params.reportId);
        if (!report) return res.status(404).json({ error: 'Report not found' });
        res.json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}