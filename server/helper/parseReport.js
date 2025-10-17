import xml2js from "xml2js";

async function extractCreditData(xmlInput) {
  try {
    const xmlContent = Buffer.isBuffer(xmlInput)
      ? xmlInput.toString("utf8")
      : xmlInput;

    const parser = new xml2js.Parser({ explicitArray: false });
    const parsed = await parser.parseStringPromise(xmlContent);

    const response = parsed.INProfileResponse;
    const applicant = response.Current_Application.Current_Application_Details.Current_Applicant_Details;
    const scoreInfo = response.SCORE;

    const accountData = response.CAIS_Account.CAIS_Account_DETAILS
      ? Array.isArray(response.CAIS_Account.CAIS_Account_DETAILS)
        ? response.CAIS_Account.CAIS_Account_DETAILS
        : [response.CAIS_Account.CAIS_Account_DETAILS]
      : [];

    const accountsList = accountData.map((item) => ({
      accountNumber: item.Account_Number || "",
      bankName: item.Subscriber_Name || "",
      currentBalance: Number(item.Current_Balance || 0),
      overdueAmount: Number(item.Amount_Past_Due || 0),
      address: item.CAIS_Holder_Address_Details
        ? [
            item.CAIS_Holder_Address_Details.First_Line_Of_Address_non_normalized,
            item.CAIS_Holder_Address_Details.Second_Line_Of_Address_non_normalized,
            item.CAIS_Holder_Address_Details.Third_Line_Of_Address_non_normalized,
            item.CAIS_Holder_Address_Details.City_non_normalized,
          ]
            .filter((line) => line && line.trim() !== "")
            .join(", ")
        : "",
    }));

    return {
      personalInfo: {
        fullName: `${(applicant.First_Name || "")} ${(applicant.Last_Name || "")}`.trim(),
        phoneNumber: applicant.MobilePhoneNumber || "",
        panNumber: accountData[0]?.CAIS_Holder_Details?.Income_TAX_PAN || "",
        creditScore: Number(scoreInfo.BureauScore || 0),
      },
      summaryDetails: {
        totalAccounts: Number(response.CAIS_Account.CAIS_Summary.Credit_Account.CreditAccountTotal || 0),
        activeAccounts: Number(response.CAIS_Account.CAIS_Summary.Credit_Account.CreditAccountActive || 0),
        closedAccounts: Number(response.CAIS_Account.CAIS_Summary.Credit_Account.CreditAccountClosed || 0),
        totalBalance: Number(response.CAIS_Account.CAIS_Summary.Total_Outstanding_Balance.Outstanding_Balance_All || 0),
        securedAmount: Number(response.CAIS_Account.CAIS_Summary.Total_Outstanding_Balance.Outstanding_Balance_Secured || 0),
        unsecuredAmount: Number(response.CAIS_Account.CAIS_Summary.Total_Outstanding_Balance.Outstanding_Balance_UnSecured || 0),
        recentEnquiries: Number(response.TotalCAPS_Summary.TotalCAPSLast7Days || 0),
      },
      accountsList,
    };
  } catch (err) {
    throw new Error(`XML parsing failed: ${err.message}`);
  }
}

export default extractCreditData;
