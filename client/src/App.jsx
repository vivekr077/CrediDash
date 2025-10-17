import React, { useState, useEffect } from "react";
import {
  Upload,
  FileText,
  TrendingUp,
  CreditCard,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FileUpload = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".xml")) {
      setFile(droppedFile);
      setError("");
    } else {
      setError("Please upload a valid XML file");
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".xml")) {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please upload a valid XML file");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload/credit-xml`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("File uploaded successfully!");
        setFile(null);
        setTimeout(() => {
          onUploadSuccess();
          setSuccess("");
        }, 1500);
      } else {
        console.log(data);
        
        setError(data.message || "Duplicate file, Please check your file once!");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-3 border-dashed rounded-2xl p-12 transition-all duration-300 ${
          isDragging
            ? "border-blue-500 bg-blue-50 scale-105"
            : "border-gray-300 bg-white hover:border-gray-400"
        }`}
      >
        <input
          type="file"
          accept=".xml"
          onChange={handleFileInput}
          className="hidden"
          id="file-input"
        />

        <div className="text-center">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all ${
              isDragging
                ? "bg-blue-100"
                : "bg-gradient-to-br from-blue-100 to-purple-100"
            }`}
          >
            <Upload
              className={`w-10 h-10 transition-colors ${
                isDragging ? "text-blue-600" : "text-blue-500"
              }`}
            />
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Upload Credit Report XML
          </h3>
          <p className="text-gray-600 mb-6">
            Drag and drop your XML file here, or click to browse
          </p>

          {file && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg mb-4">
              <FileText className="w-5 h-5" />
              <span className="font-medium">{file.name}</span>
            </div>
          )}

          <label
            htmlFor="file-input"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold cursor-pointer hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Browse Files
          </label>
        </div>
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-6 h-6" />
              Upload & Process
            </>
          )}
        </button>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
};
const ReportCard = ({ report, onClick }) => {
  return (
    <div
      onClick={() => onClick(report._id)}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-100"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            {report.personalInfo.fullName}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(report.createdOn).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg">
          <TrendingUp className="w-5 h-5" />
          {report.personalInfo.creditScore}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
          <p className="text-xs text-blue-600 font-semibold mb-1">
            Total Accounts
          </p>
          <p className="text-2xl font-bold text-blue-700">
            {report.summaryDetails.totalAccounts}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3">
          <p className="text-xs text-green-600 font-semibold mb-1">
            Active Accounts
          </p>
          <p className="text-2xl font-bold text-green-700">
            {report.summaryDetails.activeAccounts}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          PAN:{" "}
          <span className="font-semibold text-gray-800">
            {report.personalInfo.panNumber}
          </span>
        </p>
      </div>
    </div>
  );
};
const ReportDetail = ({ reportId, onBack }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReportDetail();
  }, [reportId]);

  const fetchReportDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/credits/${reportId}`);
      console.log("response is: ", response);
      
      const data = await response.json();

      if (response.ok) {
        setReport(data);
      } else {
        setError("Failed to fetch report details");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-xl text-gray-700">{error || "Report not found"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md flex items-center gap-2"
      >
        ← Back to Reports
      </button>

      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 mb-6 text-white shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {report.personalInfo.fullName}
            </h1>
            <p className="text-blue-100 text-lg">Credit Report Details</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100 mb-1">Credit Score</p>
            <div className="text-6xl font-bold">
              {report.personalInfo.creditScore}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-sm text-blue-800 mb-1">Phone Number</p>
            <p className="text-lg font-semibold text-black">
              {report.personalInfo.phoneNumber}
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-sm text-blue-800 mb-1">PAN Number</p>
            <p className="text-lg font-semibold text-black">
              {report.personalInfo.panNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 mb-6 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FileText className="w-7 h-7 text-blue-600" />
          Report Summary
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
            <p className="text-sm text-blue-600 font-semibold mb-2">
              Total Accounts
            </p>
            <p className="text-3xl font-bold text-blue-700">
              {report.summaryDetails.totalAccounts}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5">
            <p className="text-sm text-green-600 font-semibold mb-2">
              Active Accounts
            </p>
            <p className="text-3xl font-bold text-green-700">
              {report.summaryDetails.activeAccounts}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5">
            <p className="text-sm text-red-600 font-semibold mb-2">
              Closed Accounts
            </p>
            <p className="text-3xl font-bold text-red-700">
              {report.summaryDetails.closedAccounts}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5">
            <p className="text-sm text-purple-600 font-semibold mb-2">
              Recent Enquiries
            </p>
            <p className="text-3xl font-bold text-purple-700">
              {report.summaryDetails.recentEnquiries}
            </p>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-5">
            <p className="text-sm text-teal-600 font-semibold mb-2">
              Total Balance
            </p>
            <p className="text-2xl font-bold text-teal-700">
              ₹{report.summaryDetails.totalBalance?.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-5">
            <p className="text-sm text-indigo-600 font-semibold mb-2">
              Secured Amount
            </p>
            <p className="text-2xl font-bold text-indigo-700">
              ₹{report.summaryDetails.securedAmount?.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5">
            <p className="text-sm text-orange-600 font-semibold mb-2">
              Unsecured Amount
            </p>
            <p className="text-2xl font-bold text-orange-700">
              ₹{report.summaryDetails.unsecuredAmount?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <CreditCard className="w-7 h-7 text-blue-600" />
          Credit Accounts ({report.accountsList.length})
        </h2>

        <div className="space-y-4">
          {report.accountsList.map((account, index) => (
            <div
              key={index}
              className="border-2 border-gray-100 rounded-2xl p-6 hover:border-blue-300 transition-all hover:shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {account.bankName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Account: {account.accountNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Current Balance</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{account.currentBalance?.toLocaleString()}
                  </p>
                </div>
              </div>

              {account.overdueAmount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-3">
                  <p className="text-sm text-red-600 font-semibold mb-1">
                    Overdue Amount
                  </p>
                  <p className="text-xl font-bold text-red-700">
                    ₹{account.overdueAmount?.toLocaleString()}
                  </p>
                </div>
              )}

              {account.address && (
                <div className="flex items-start gap-2 text-gray-600 mt-3">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{account.address}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ReportList = ({ onSelectReport }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/credits`);
      const data = await response.json();

      if (response.ok) {
        setReports(data);
      } else {
        setError("Failed to fetch reports");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-xl text-gray-700">{error}</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-20">
        <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-700 mb-2">
          No Reports Yet
        </h3>
        <p className="text-gray-500">
          Upload your first credit report XML to get started
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Search className="w-8 h-8 text-blue-600" />
        All Credit Reports ({reports.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <ReportCard
            key={report._id}
            report={report}
            onClick={onSelectReport}
          />
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [activeView, setActiveView] = useState("upload");
  const [selectedReportId, setSelectedReportId] = useState(null);

  const handleUploadSuccess = () => {
    setActiveView("list");
  };

  const handleSelectReport = (reportId) => {
    setSelectedReportId(reportId);
    setActiveView("detail");
  };

  const handleBackToList = () => {
    setActiveView("list");
    setSelectedReportId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CreditSea
                </h1>
                <p className="text-sm text-gray-500">Credit Report Manager</p>
              </div>
            </div>

            <nav className="flex gap-3">
              <button
                onClick={() => setActiveView("upload")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeView === "upload"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Upload
              </button>
              <button
                onClick={() => setActiveView("list")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeView === "list" || activeView === "detail"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Reports
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeView === "upload" && (
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        )}
        {activeView === "list" && (
          <ReportList onSelectReport={handleSelectReport} />
        )}
        {activeView === "detail" && selectedReportId && (
          <ReportDetail reportId={selectedReportId} onBack={handleBackToList} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-600">
          <p>© 2025 CreditSea. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
