## CrediDash

A simple credit report manager. Upload an XML credit report, the backend parses and stores it, and the frontend displays summaries and account-level details.

### Frontend (.env)
Create `client/.env` with:

```bash
VITE_API_BASE_URL=http://localhost:5000/api/credit-reports
```

- **VITE_API_BASE_URL**: Base URL for the backend API used by the React app.

### Backend (.env)
Create `server/.env` with:

```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/credidash
NODE_ENV=development
```

- **PORT**: Port for the Express server.
- **MONGODB_URI**: MongoDB connection string.
- **NODE_ENV**: Node environment.

### What this application does
- Accepts an XML upload of a credit report.
- Parses key fields (personal info, summary metrics, accounts) on the server.
- Persists parsed data to MongoDB.
- Lists all reports and shows a detailed view for a selected report in the React UI.


