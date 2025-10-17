import mongoose from "mongoose";

const financialAccountSnapshotSchema = new mongoose.Schema({
  accountNumber: String,
  bankName: String,
  currentBalance: Number,
  overdueAmount: Number,
  address: String,
});

const creditReportAggregateSchema = new mongoose.Schema({
  personalInfo: {
    fullName: String,
    phoneNumber: String,
    panNumber: String,
    creditScore: Number,
  },
  summaryDetails: {
    totalAccounts: Number,
    activeAccounts: Number,
    closedAccounts: Number,
    totalBalance: Number,
    securedAmount: Number,
    unsecuredAmount: Number,
    recentEnquiries: Number,
  },
  accountsList: [financialAccountSnapshotSchema],
  createdOn: { type: Date, default: Date.now },
});

export default mongoose.model("CreditReport", creditReportAggregateSchema);
