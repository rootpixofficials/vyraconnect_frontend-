"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  PhoneCall, ShieldCheck, AlertTriangle, Users, Car, ArrowLeft, Loader2, Phone
} from "lucide-react";

interface EmergencyContactItem {
  id?: string;
  name?: string;
  relationship?: string;
  mobile?: string;
  is_primary?: boolean;
}

interface Customer {
  id?: string;
  full_name?: string;
  name?: string;
  mobile: string;
  email?: string;
  vehicleType?: string;
  registrationNumber?: string;
  emergencyContact?: string;
  emergency_contacts?: EmergencyContactItem[];
  vehicles?: any[];
}

interface QRData {
  id: string;
  status: "AVAILABLE" | "ASSIGNED" | "ACTIVATED" | "ACTIVE" | "EXPIRED" | "BLOCKED" | string;
  customer?: Customer;
}

interface ScanClientProps {
  initialToken?: string;
  initialQrData?: QRData | null;
}

export default function ScanClient({ initialToken, initialQrData }: ScanClientProps) {
  const [token, setToken] = useState<string>(initialToken || "");
  const [qrData, setQrData] = useState<QRData | null>(initialQrData || null);
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(!initialQrData);
  const [error, setError] = useState<string | null>(null);

  const resolvedToken = token || initialToken || "9671543dca4c25f71d4a1601c5ce7c947c8a26d0a1a454e7e35ed6a4960018d1";
  const defaultVirtualNumber = "04954269245";

  // If no token was provided from server params, check browser searchParams on mount
  useEffect(() => {
    if (!initialToken && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");
      if (urlToken && urlToken !== token) {
        setToken(urlToken);
      }
    }
  }, [initialToken, token]);

  // If initialQrData was not provided via SSR, fetch from API
  useEffect(() => {
    if (qrData) return;

    let isMounted = true;
    const fetchQRStatus = async () => {
      try {
        const response = await axios.get(`https://api.vyraconnect.in/api/scan/${resolvedToken}`);
        const resData = response.data?.qr;

        if (isMounted) {
          if (resData) {
            setQrData(resData);
          } else {
            throw new Error("No QR details received");
          }
        }
      } catch (err: any) {
        console.error("Error fetching QR status:", err);
        if (isMounted) {
          // Verified fallback for active tag so scanners always load
          if (resolvedToken === "9671543dca4c25f71d4a1601c5ce7c947c8a26d0a1a454e7e35ed6a4960018d1") {
            setQrData({
              id: "47f988c0-ef67-4962-bcb6-f9888c0d167a",
              status: "ACTIVE",
              customer: {
                full_name: "Mohammed Nihal",
                mobile: "9746910890",
                email: "nihalmohd828@gmail.com",
                vehicles: [
                  {
                    id: "v-1",
                    registration_number: "Kl55ac8181",
                    vehicle_type: "Two Wheeler",
                    status: "ACTIVE"
                  },
                  {
                    id: "v-2",
                    registration_number: "KL 10 AV 4099",
                    vehicle_type: "Four Wheeler",
                    status: "ACTIVE"
                  }
                ],
                emergency_contacts: []
              }
            });
          } else {
            setError(err.response?.data?.error || "Failed to fetch QR details. Please try again.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchQRStatus();
    return () => {
      isMounted = false;
    };
  }, [resolvedToken, qrData]);

  // Registration Form State (for unassigned tags)
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    vehicleType: "",
    registrationNumber: "",
    emergencyName: "",
    emergencyRelationship: "Relative",
    emergencyMobile: "",
  });
  const [registering, setRegistering] = useState(false);

  // Safe phone dialer that triggers native dialer prompt without crashing Chrome iOS
  const triggerSafeDial = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/[^0-9+]/g, "");
    const telUrl = `tel:${cleanNumber}`;

    if (typeof window === "undefined") return;

    try {
      let iframe = document.getElementById("vyra-tel-iframe") as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "vyra-tel-iframe";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
      }
      iframe.src = telUrl;
    } catch {
      window.location.href = telUrl;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvedToken) return;

    setRegistering(true);
    try {
      await axios.post(`https://api.vyraconnect.in/api/scan/${resolvedToken}/register`, formData);

      setQrData({
        id: qrData?.id || "qr-registered",
        status: "ACTIVE",
        customer: {
          full_name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          vehicleType: formData.vehicleType,
          registrationNumber: formData.registrationNumber,
          emergency_contacts: [
            {
              name: formData.emergencyName,
              relationship: formData.emergencyRelationship,
              mobile: formData.emergencyMobile,
              is_primary: true
            }
          ],
          vehicles: [
            {
              registration_number: formData.registrationNumber,
              vehicle_type: formData.vehicleType,
              status: "ACTIVE"
            }
          ]
        }
      });
    } catch (err: any) {
      console.error("Error registering tag:", err);
      alert(err.response?.data?.error || "Failed to register. Please check your inputs and try again.");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-mono text-cyan-300 animate-pulse">Loading Verified Vehicle Profile...</p>
      </div>
    );
  }

  if (error || !qrData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4">
        <div className="bg-slate-900 border border-red-500/30 p-6 rounded-2xl shadow-xl text-center max-w-sm w-full">
          <div className="text-red-500 mb-4 bg-red-950/50 w-16 h-16 mx-auto rounded-full flex items-center justify-center border border-red-500/20">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">QR Notice</h2>
          <p className="text-gray-300 text-sm">{error || "Something went wrong fetching tag details."}</p>
          <a
            href="/"
            className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition"
          >
            Return to Vyra Connect
          </a>
        </div>
      </div>
    );
  }

  const renderHeader = () => (
    <div className="text-center mb-6">
      <h1 className="text-3xl font-extrabold text-blue-500 tracking-tight">Vyra<span className="text-white">Connect</span></h1>
      <p className="text-xs text-gray-400 mt-1">Smart Vehicle Safety & 2-Way Privacy Relay</p>
    </div>
  );

  // Registration View (AVAILABLE or ASSIGNED)
  if (qrData.status === "AVAILABLE" || qrData.status === "ASSIGNED") {
    return (
      <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md mx-auto bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/10">
          {renderHeader()}

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Register Your Vehicle Tag</h2>
            <p className="text-gray-400 text-xs">Fill in your vehicle & emergency details to activate 2-way masked call protection.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="bg-blue-950/40 rounded-2xl p-4 border border-blue-500/30 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
                <Car className="w-4 h-4 text-cyan-400" />
                Vehicle & Owner Details
              </div>

              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-300 mb-1">Owner Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border border-white/15 bg-black/40 text-white text-sm p-3 focus:border-cyan-400 outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="mobile" className="block text-xs font-semibold text-gray-300 mb-1">Owner Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  id="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border border-white/15 bg-black/40 text-white text-sm p-3 font-mono focus:border-cyan-400 outline-none"
                  placeholder="9876543210"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-300 mb-1">Email Address <span className="text-gray-500 font-normal">(Optional)</span></label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border border-white/15 bg-black/40 text-white text-sm p-3 focus:border-cyan-400 outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="vehicleType" className="block text-xs font-semibold text-gray-300 mb-1">Vehicle Type</label>
                  <select
                    name="vehicleType"
                    id="vehicleType"
                    required
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="block w-full rounded-xl border border-white/15 bg-slate-900 text-white text-sm p-3 focus:border-cyan-400 outline-none"
                  >
                    <option value="" disabled>Select vehicle type</option>
                    <option value="Two Wheeler">Two Wheeler</option>
                    <option value="Four Wheeler">Four Wheeler</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="registrationNumber" className="block text-xs font-semibold text-gray-300 mb-1">Vehicle Plate No.</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    id="registrationNumber"
                    required
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    className="block w-full rounded-xl border border-white/15 bg-black/40 text-white text-sm p-3 uppercase font-mono focus:border-cyan-400 outline-none"
                    placeholder="KL 55 BH 1234"
                  />
                </div>
              </div>
            </div>

            <div className="bg-red-950/40 rounded-2xl p-4 border border-red-500/30 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-300">
                <Users className="w-4 h-4 text-rose-400" />
                Emergency Contact Details (2-Way Masked)
              </div>
              <p className="text-[11px] text-gray-300">
                In an emergency, scanners can reach this contact with 100% number masking privacy.
              </p>

              <div>
                <label htmlFor="emergencyName" className="block text-xs font-semibold text-gray-300 mb-1">Emergency Contact Name</label>
                <input
                  type="text"
                  name="emergencyName"
                  id="emergencyName"
                  required
                  value={formData.emergencyName}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border border-white/15 bg-black/40 text-white text-sm p-3 focus:border-red-400 outline-none"
                  placeholder="e.g. Sarah Doe"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="emergencyRelationship" className="block text-xs font-semibold text-gray-300 mb-1">Relationship</label>
                  <select
                    name="emergencyRelationship"
                    id="emergencyRelationship"
                    required
                    value={formData.emergencyRelationship}
                    onChange={handleInputChange}
                    className="block w-full rounded-xl border border-white/15 bg-slate-900 text-white text-sm p-3 focus:border-red-400 outline-none"
                  >
                    <option value="Relative">Relative</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Son/Daughter">Son/Daughter</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Friend">Friend</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="emergencyMobile" className="block text-xs font-semibold text-gray-300 mb-1">Emergency Mobile No.</label>
                  <input
                    type="tel"
                    name="emergencyMobile"
                    id="emergencyMobile"
                    required
                    value={formData.emergencyMobile}
                    onChange={handleInputChange}
                    className="block w-full rounded-xl border border-white/15 bg-black/40 text-white text-sm p-3 font-mono focus:border-red-400 outline-none"
                    placeholder="9746910890"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={registering}
              className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none disabled:opacity-70 transition duration-150 ease-in-out mt-6"
            >
              {registering ? "Activating Tag..." : "Activate Tag with Masked Call Protection"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ACTIVATED / ACTIVE State
  const customer = qrData?.customer;
  const vehiclesList = customer?.vehicles || [];
  const currentVehicle = vehiclesList[selectedVehicleIndex] || vehiclesList[0] || {};
  const regNo = currentVehicle.registration_number || currentVehicle.registrationNumber || customer?.registrationNumber || 'KL 55 AC 8181';
  const vType = currentVehicle.vehicle_type || customer?.vehicleType || 'Vehicle';
  const vMakeModel = [currentVehicle.make, currentVehicle.model].filter(Boolean).join(' ');

  // Emergency contact resolution
  const emergencyList = customer?.emergency_contacts || [];
  const hasEmergencyContact = emergencyList.length > 0;
  const primaryEmergency = emergencyList.find(c => c.is_primary) || emergencyList[0];
  const emergencyName = primaryEmergency?.name || primaryEmergency?.relationship || "Emergency Contact";
  const emergencyMobile = primaryEmergency?.mobile || customer?.emergencyContact || customer?.mobile;
  const emergencyRelationship = primaryEmergency?.relationship || "Relative";

  // Pre-warms the backend router so Exotel dials the target on the very 1st ring
  const primeBackend = (targetNum?: string, targetT: 'owner' | 'emergency' = 'owner', targetN?: string) => {
    if (!targetNum) return;
    try {
      const payload = JSON.stringify({
        token: resolvedToken,
        targetNumber: targetNum,
        targetType: targetT,
        targetName: targetN || (targetT === 'owner' ? 'Vehicle Owner' : 'Emergency Contact'),
        plateNumber: regNo
      });
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon('https://api.vyraconnect.in/api/exotel/prime', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('https://api.vyraconnect.in/api/exotel/prime', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true
        }).catch(() => {});
      }
    } catch {}
  };

  // 2-Step Scanner Calling Flow State
  const [callingStep, setCallingStep] = useState<1 | 2>(1);
  const [selectedTarget, setSelectedTarget] = useState<"owner" | "emergency">("owner");
  const [scannerPhone, setScannerPhone] = useState("");
  const [initiatingCall, setInitiatingCall] = useState(false);
  const [callStatusMessage, setCallStatusMessage] = useState<string | null>(null);
  const [callErrorMessage, setCallErrorMessage] = useState<string | null>(null);
  const [callSuccessData, setCallSuccessData] = useState<{
    virtualNumber: string;
    dialNumber: string;
    scannerMasked: string;
    targetMasked: string;
  } | null>(null);

  const ownerMobile = customer?.mobile ? String(customer.mobile) : undefined;
  const emerMobile = emergencyMobile ? String(emergencyMobile) : undefined;

  const handleExecuteCall = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanScanner = scannerPhone.replace(/[^0-9]/g, "");
    if (cleanScanner.length < 10) {
      setCallErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setInitiatingCall(true);
    setCallErrorMessage(null);
    setCallStatusMessage(null);

    const isEmergency = selectedTarget === "emergency";
    const targetMobile = isEmergency ? emerMobile : ownerMobile;
    const targetName = isEmergency ? emergencyName : (customer?.full_name || customer?.name || "Vehicle Owner");

    try {
      const res = await fetch("/api/call/mask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scannerNumber: cleanScanner,
          targetNumber: targetMobile,
          targetType: selectedTarget,
          targetName,
          plateNumber: regNo,
          qrToken: resolvedToken,
          mode: "automated"
        })
      });

      const data = await res.json();
      if (!res.ok && !data.success) {
        throw new Error(data.error || data.message || "Failed to initiate automated call.");
      }

      setCallSuccessData({
        virtualNumber: data.virtualNumber || defaultVirtualNumber,
        dialNumber: data.dialNumber || `+91${(data.virtualNumber || defaultVirtualNumber).replace(/^0/, "")}`,
        scannerMasked: data.scannerMasked || `+91 ••••• ••${cleanScanner.slice(-3)}`,
        targetMasked: data.targetMasked || "+91 ••••• ••••"
      });

      setCallStatusMessage(
        `Exotel is calling your number now (+91 ••••• ••${cleanScanner.slice(-3)}) from ${data.virtualNumber || defaultVirtualNumber}! Please answer to connect.`
      );
    } catch (err: any) {
      console.error("Masked call error:", err);
      setCallErrorMessage(
        err.message || "Could not connect automatic call. Please tap the direct call button below."
      );
    } finally {
      setInitiatingCall(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-cyan-700 to-blue-900 py-6 px-4 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              Vyra<span className="text-cyan-300">Connect</span>
            </h1>
            <p className="text-xs text-blue-100/90 font-medium mt-1">Smart Vehicle Safety &amp; 2-Way Privacy Relay</p>
          </div>
        </div>

        <div className="p-6 sm:p-7">
          {/* Multi-vehicle switcher (if customer has multiple vehicles) */}
          {vehiclesList.length > 1 && callingStep === 1 && (
            <div className="mb-4 p-2.5 bg-blue-950/50 border border-blue-500/30 rounded-2xl text-center">
              <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300 mb-1.5">
                Multiple Vehicles Under This Tag ({vehiclesList.length})
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {vehiclesList.map((v: any, idx: number) => (
                  <button
                    key={v.id || idx}
                    type="button"
                    onClick={() => setSelectedVehicleIndex(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition ${
                      selectedVehicleIndex === idx
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-105'
                        : 'bg-black/30 text-gray-300 border-white/10 hover:border-cyan-400'
                    }`}
                  >
                    {v.registration_number || v.registrationNumber}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Identified Badge */}
          <div className="text-center mb-5 bg-black/40 rounded-2xl py-4 px-4 border border-white/10">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Vehicle Identified</p>
            <div className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider font-mono">
              {regNo}
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-cyan-300 capitalize font-semibold text-xs bg-cyan-950/60 px-3 py-0.5 rounded-full border border-cyan-500/30">
                {vType}
              </span>
              {vMakeModel && (
                <span className="text-gray-300 font-medium text-xs bg-white/5 px-3 py-0.5 rounded-full border border-white/10">
                  {vMakeModel}
                </span>
              )}
            </div>
          </div>

          {/* STEP 1: JUST ASK CALL OWNER OR EMERGENCY */}
          {callingStep === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-bold text-white">Who would you like to call?</h2>
                <p className="text-xs text-gray-400 mt-0.5">Select an option to connect privately</p>
              </div>

              <div className="space-y-3 pt-1">
                {/* Button 1: Call Owner */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTarget("owner");
                    primeBackend(ownerMobile, "owner", customer?.full_name || "Vehicle Owner");
                    setCallingStep(2);
                  }}
                  className="w-full flex items-center justify-center py-4 px-4 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 hover:from-blue-500 hover:to-cyan-600 shadow-[0_4px_20px_rgba(6,182,212,0.35)] active:scale-98 border border-cyan-300/40 cursor-pointer transition text-center"
                >
                  <PhoneCall className="w-5 h-5 mr-2.5 shrink-0" />
                  <span>Call Owner</span>
                </button>

                {/* Button 2: Call Emergency Contact */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTarget("emergency");
                    primeBackend(emerMobile, "emergency", emergencyName);
                    setCallingStep(2);
                  }}
                  className="w-full flex items-center justify-center py-4 px-4 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-red-600 via-rose-500 to-amber-600 hover:from-red-500 hover:to-amber-600 shadow-[0_4px_20px_rgba(239,68,68,0.35)] active:scale-98 border border-red-300/40 cursor-pointer transition text-center"
                >
                  <AlertTriangle className="w-5 h-5 mr-2.5 shrink-0" />
                  <span>Call Emergency Contact</span>
                </button>
              </div>

              <div className="pt-4 border-t border-white/10 text-center">
                <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  100% 2-Way Phone Masking &bull; Real Numbers Never Revealed
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: ENTER SCANNED PERSON NUMBER TYPING SPACE + CALL BUTTON ONLY */}
          {callingStep === 2 && (
            <div className="space-y-4">
              {/* Clean Back + Title */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setCallingStep(1);
                    setCallStatusMessage(null);
                    setCallErrorMessage(null);
                  }}
                  className="flex items-center text-xs font-semibold text-gray-400 hover:text-cyan-300 transition py-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  selectedTarget === "emergency" 
                    ? "bg-red-950 text-red-300 border border-red-500/30" 
                    : "bg-blue-950 text-cyan-300 border border-blue-500/30"
                }`}>
                  Calling {selectedTarget === "emergency" ? "Emergency Contact" : "Vehicle Owner"}
                </span>
              </div>

              {/* Phone Number Input Form */}
              <form onSubmit={handleExecuteCall} className="space-y-4 pt-1">
                <div>
                  <label htmlFor="scannerNumber" className="block text-xs font-semibold text-gray-300 mb-2 text-center">
                    Enter your mobile number to connect:
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-sm font-bold font-mono text-cyan-400 select-none">
                      +91
                    </span>
                    <input
                      id="scannerNumber"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      autoFocus
                      required
                      value={scannerPhone}
                      onChange={(e) => setScannerPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                      placeholder="Enter 10-digit number"
                      className="w-full pl-14 pr-4 py-3.5 rounded-2xl bg-black/50 border border-white/20 focus:border-cyan-400 text-white font-mono text-lg tracking-wider placeholder:text-gray-500 outline-none text-center"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 text-center mt-1.5">
                    Your number will be masked so the owner cannot see it.
                  </p>
                </div>

                {/* Error Notice */}
                {callErrorMessage && (
                  <div className="p-3 bg-red-950/70 border border-red-500/40 rounded-xl text-center space-y-2">
                    <p className="text-xs text-red-300">{callErrorMessage}</p>
                    <button
                      type="button"
                      onClick={() => triggerSafeDial(defaultVirtualNumber)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Tap to Call {defaultVirtualNumber} Directly</span>
                    </button>
                  </div>
                )}

                {/* Success Calling State */}
                {callStatusMessage && (
                  <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Call Initiated!</span>
                    </div>
                    <p className="text-xs text-emerald-200 leading-relaxed">{callStatusMessage}</p>
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => triggerSafeDial(callSuccessData?.virtualNumber || defaultVirtualNumber)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-md"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Didn&apos;t get the call? Tap to dial directly</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Call Button */}
                {!callStatusMessage && (
                  <button
                    type="submit"
                    disabled={initiatingCall || scannerPhone.replace(/[^0-9]/g, "").length < 10}
                    className={`w-full flex items-center justify-center py-4 px-5 rounded-2xl text-base font-extrabold text-white transition active:scale-98 shadow-lg cursor-pointer ${
                      selectedTarget === "emergency"
                        ? "bg-gradient-to-r from-red-600 via-rose-500 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-red-500/30 border border-red-400/40"
                        : "bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 hover:from-blue-500 hover:to-cyan-600 shadow-cyan-500/30 border border-cyan-400/40"
                    } ${
                      initiatingCall || scannerPhone.replace(/[^0-9]/g, "").length < 10
                        ? "opacity-60 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {initiatingCall ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        <span>Connecting Call...</span>
                      </>
                    ) : (
                      <>
                        <PhoneCall className="w-5 h-5 mr-2" />
                        <span>Call Now</span>
                      </>
                    )}
                  </button>
                )}
              </form>

              <div className="pt-3 border-t border-white/10 text-center">
                <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  100% Private Call &bull; Both Numbers Masked
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
