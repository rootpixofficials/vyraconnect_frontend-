import querystring from "querystring";

export interface InitiateMaskedCallParams {
  scannerNumber: string;
  ownerNumber?: string;
  callerId?: string;
  customField?: string;
}

export interface ExotelCallResult {
  success: boolean;
  status?: string;
  callSid?: string;
  callerId?: string;
  scannerMasked?: string;
  ownerMasked?: string;
  message: string;
  kycPending?: boolean;
  raw?: any;
}

/**
 * Normalizes phone numbers for Exotel API.
 * Exotel requires Indian mobile numbers in 10-digit format prefixed with '0' (e.g. '09746910890')
 * or international format without '+'.
 */
export function formatExotelNumber(phone: string): string {
  const clean = phone.replace(/[^0-9]/g, "");
  if (clean.length === 10) {
    return `0${clean}`;
  }
  if (clean.length === 12 && clean.startsWith("91")) {
    return `0${clean.slice(2)}`;
  }
  return clean;
}

/**
 * Formats a phone number for user-facing privacy display (e.g. "+91 ••••• ••890")
 */
export function maskDisplayNumber(phone: string): string {
  const clean = phone.replace(/[^0-9]/g, "");
  if (clean.length < 4) return "+91 ••••• ••••";
  const last3 = clean.slice(-3);
  return `+91 ••••• ••${last3}`;
}

/**
 * Initiates a 2-way masked call connecting Scanner and Vehicle Owner through Exotel
 */
export async function initiateMaskedCall({
  scannerNumber,
  ownerNumber = process.env.DEFAULT_OWNER_NUMBER || "+919746910890",
  callerId = process.env.EXOTEL_CALLER_ID || "08047190000",
  customField = "vyra-qr-scan"
}: InitiateMaskedCallParams): Promise<ExotelCallResult> {
  const accountSid = process.env.EXOTEL_ACCOUNT_SID;
  const apiKey = process.env.EXOTEL_API_KEY;
  const apiToken = process.env.EXOTEL_API_TOKEN;
  const subdomain = process.env.EXOTEL_SUBDOMAIN || "api.exotel.com";

  if (!accountSid || !apiKey || !apiToken) {
    return {
      success: false,
      message: "Exotel API credentials are not configured in server environment."
    };
  }

  const formattedFrom = formatExotelNumber(scannerNumber);
  const formattedTo = formatExotelNumber(ownerNumber);
  const formattedCallerId = formatExotelNumber(callerId);

  const auth = Buffer.from(`${apiKey}:${apiToken}`).toString("base64");
  const postData = querystring.stringify({
    From: formattedFrom,
    To: formattedTo,
    CallerId: formattedCallerId,
    TimeLimit: "300", // 5 minutes max duration
    TimeOut: "30",    // 30 seconds ring timeout
    CustomField: customField
  });

  const url = `https://${subdomain}/v1/Accounts/${accountSid}/Calls/connect.json`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData).toString()
      },
      body: postData
    });

    const data = await response.json();

    if (response.ok && data?.Call) {
      return {
        success: true,
        status: data.Call.Status || "queued",
        callSid: data.Call.Sid,
        callerId: formattedCallerId,
        scannerMasked: maskDisplayNumber(scannerNumber),
        ownerMasked: maskDisplayNumber(ownerNumber),
        message: "Masked call initiated! Exotel is dialing your phone now.",
        raw: data.Call
      };
    }

    // Handle missing / invalid CallerId (ExoPhone not attached or placeholder)
    if (data?.RestException?.Message?.includes("CallerId")) {
      return {
        success: false,
        callerId: formattedCallerId,
        scannerMasked: maskDisplayNumber(scannerNumber),
        ownerMasked: maskDisplayNumber(ownerNumber),
        message: "Your Exotel KYC verification is completed! To place live calls, please link your active ExoPhone (Virtual Number) from your Exotel Dashboard to EXOTEL_CALLER_ID.",
        raw: data
      };
    }

    // Handle KYC Pending status returned by Exotel
    if (data?.RestException?.Message?.includes("KYC")) {
      return {
        success: false,
        kycPending: true,
        callerId: formattedCallerId,
        scannerMasked: maskDisplayNumber(scannerNumber),
        ownerMasked: maskDisplayNumber(ownerNumber),
        message: "Exotel credentials are active! However, your Exotel account KYC verification is currently under review by their team. Once KYC is approved, calls will ring automatically.",
        raw: data
      };
    }

    // Handle negative credits / balance
    if (data?.RestException?.Message?.includes("credit") || data?.RestException?.Message?.includes("balance")) {
      return {
        success: false,
        message: "Exotel account has insufficient credits. Please add trial credits to make live calls.",
        raw: data
      };
    }

    return {
      success: false,
      message: data?.RestException?.Message || "Failed to initiate call via Exotel.",
      raw: data
    };
  } catch (error: any) {
    console.error("[EXOTEL CALL ERROR]", error);
    return {
      success: false,
      message: error.message || "Network error connecting to Exotel."
    };
  }
}

/**
 * Checks Exotel account information and verification readiness
 */
export async function getExotelAccountStatus() {
  const accountSid = process.env.EXOTEL_ACCOUNT_SID;
  const apiKey = process.env.EXOTEL_API_KEY;
  const apiToken = process.env.EXOTEL_API_TOKEN;
  const subdomain = process.env.EXOTEL_SUBDOMAIN || "api.exotel.com";

  if (!accountSid || !apiKey || !apiToken) {
    return { configured: false, error: "Credentials missing" };
  }

  const auth = Buffer.from(`${apiKey}:${apiToken}`).toString("base64");

  try {
    const res = await fetch(`https://${subdomain}/v1/Accounts/${accountSid}.json`, {
      headers: { Authorization: `Basic ${auth}` }
    });
    const data = await res.json();
    return {
      configured: true,
      statusCode: res.status,
      account: data?.Account || data
    };
  } catch (err: any) {
    return { configured: true, error: err.message };
  }
}
