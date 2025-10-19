import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import initializeMongoConnection from './config/database.js';
import creditReportRoutesV2 from './routes/creditReport.routes.js';
import cron from 'node-cron'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

initializeMongoConnection();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/credit-reports', creditReportRoutesV2);

cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

export default app;