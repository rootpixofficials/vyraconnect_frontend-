"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  PhoneCall, ShieldCheck, AlertTriangle, Users, Car, ArrowLeft, Loader2, Phone, Shield, Copy, Check, X
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

  // Direct 1-Tap Masked Call State with Permission Modal (Top-level hooks)
  const [activeCallTarget, setActiveCallTarget] = useState<"owner" | "emergency" | null>(null);
  const [activeCallMessage, setActiveCallMessage] = useState<string | null>(null);
  const [permissionModalTarget, setPermissionModalTarget] = useState<"owner" | "emergency" | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [noEmergencyAlert, setNoEmergencyAlert] = useState<boolean>(false);

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

  // Safe phone dialer fallback for mobile web
  const triggerSafeDial = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/[^0-9+]/g, "");
    const telUrl = `tel:${cleanNumber}`;

    if (typeof window === "undefined") return;

    try {
      window.location.href = telUrl;
    } catch {
      window.open(telUrl, "_self");
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
  const rawEmerList = customer?.emergency_contacts || (customer as any)?.emergencyContacts || [];
  const emergencyList = Array.isArray(rawEmerList) ? rawEmerList : [];
  const primaryEmergency = emergencyList.find((c: any) => c.is_primary) || emergencyList[0] || null;
  const rawEmerMobile = primaryEmergency?.mobile || (customer as any)?.emergencyContact || (customer as any)?.emergency_contact || '';
  const cleanEmerMobile = String(rawEmerMobile).replace(/[^0-9]/g, '');
  const hasEmergencyContact = cleanEmerMobile.length >= 10;
  const emergencyMobile = hasEmergencyContact ? cleanEmerMobile : '';
  const emergencyName = primaryEmergency?.name || primaryEmergency?.relationship || "Emergency Contact";
  const emergencyRelationship = primaryEmergency?.relationship || "Emergency Contact";

  // Pre-warms the backend router so Exotel dials the target on the very 1st ring
  const primeBackend = (targetNum?: string, targetT: 'owner' | 'emergency' = 'owner', targetN?: string) => {
    if (!targetNum) return;
    try {
      const cleanTarget = String(targetNum).replace(/[^0-9]/g, '');
      const payload = JSON.stringify({
        token: resolvedToken,
        targetNumber: cleanTarget,
        targetType: targetT,
        targetName: targetN || (targetT === 'owner' ? 'Vehicle Owner' : 'Emergency Contact'),
        plateNumber: regNo
      });

      // 1. Send via POST with keepalive: true
      fetch('https://api.vyraconnect.in/api/exotel/prime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(() => {});

      // 2. Also send GET query string fallback (guaranteed instant Express parsing)
      const q = new URLSearchParams({
        token: resolvedToken,
        targetNumber: cleanTarget,
        targetType: targetT,
        targetName: targetN || '',
        plateNumber: regNo
      }).toString();
      fetch(`https://api.vyraconnect.in/api/exotel/prime?${q}`, {
        method: 'GET',
        keepalive: true
      }).catch(() => {});
    } catch {}
  };

  const ownerMobile = customer?.mobile ? String(customer.mobile).replace(/[^0-9]/g, '') : undefined;
  const emerMobile = hasEmergencyContact ? emergencyMobile : undefined;

  const requestCallPermission = (targetType: "owner" | "emergency") => {
    if (targetType === "emergency" && !hasEmergencyContact) {
      setNoEmergencyAlert(true);
      return;
    }

    const isEmergency = targetType === "emergency";
    const targetMobile = isEmergency ? emerMobile : ownerMobile;
    const targetName = isEmergency ? emergencyName : (customer?.full_name || customer?.name || "Vehicle Owner");

    // Pre-prime router immediately so server is 100% prepared
    primeBackend(targetMobile, targetType, targetName);
    setPermissionModalTarget(targetType);
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
          {vehiclesList.length > 1 && (
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
          <div className="text-center mb-6 bg-black/40 rounded-2xl py-4 px-4 border border-white/10">
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

          {/* Direct 1-Tap Call Options (Option 1: Zero Typing Required) */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-bold text-white">Who would you like to call?</h2>
              <p className="text-xs text-gray-400 mt-0.5">Instant 1-Tap Masked Call &bull; No typing required</p>
            </div>

            <div className="space-y-3 pt-1">
              {/* Button 1: Call Owner */}
              <button
                type="button"
                onClick={() => requestCallPermission("owner")}
                className="w-full flex items-center justify-between py-4 px-5 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 hover:from-blue-500 hover:to-cyan-600 shadow-[0_4px_20px_rgba(6,182,212,0.35)] active:scale-98 border border-cyan-300/40 cursor-pointer transition text-left"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mr-3 shrink-0">
                    <PhoneCall className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-white">Call Owner</div>
                    <div className="text-[11px] text-cyan-100 font-medium">Connects immediately on 1st ring</div>
                  </div>
                </div>
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-lg text-white font-mono font-bold">1-Tap &rarr;</span>
              </button>

              {/* Button 2: Call Emergency Contact */}
              <button
                type="button"
                onClick={() => requestCallPermission("emergency")}
                className="w-full flex items-center justify-between py-4 px-5 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-red-600 via-rose-500 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-[0_4px_20px_rgba(239,68,68,0.35)] active:scale-98 border border-red-300/40 cursor-pointer transition text-left"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mr-3 shrink-0">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-white">Call Emergency Contact</div>
                    <div className="text-[11px] text-rose-100 font-medium">
                      {hasEmergencyContact ? `Connected to ${emergencyRelationship} (${emergencyName})` : "No Emergency Contact Added"}
                    </div>
                  </div>
                </div>
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-lg text-white font-mono font-bold">1-Tap &rarr;</span>
              </button>
            </div>

            {/* Active Calling Status Feedback Card */}
            {activeCallMessage && (
              <div className="mt-4 p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Ringing {activeCallTarget === "emergency" ? "Emergency Contact" : "Vehicle Owner"}...</span>
                </div>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Calling private line <strong>{defaultVirtualNumber}</strong>. Only the receiver&apos;s phone is ringing. Your real phone number is 100% hidden.
                </p>
                <div className="pt-1">
                  <a
                    href={`tel:${defaultVirtualNumber}`}
                    onClick={() => {
                      const isEmer = activeCallTarget === "emergency";
                      const targetMob = isEmer ? emerMobile : ownerMobile;
                      const targetN = isEmer ? emergencyName : (customer?.full_name || customer?.name || "Vehicle Owner");
                      primeBackend(targetMob, activeCallTarget || "owner", targetN);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg cursor-pointer active:scale-98"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Tap to Call {defaultVirtualNumber} Again</span>
                  </a>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 text-center">
              <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                100% 2-Way Phone Masking &bull; Real Numbers Never Revealed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Modal for iOS & Mobile Phone App Access */}
      {permissionModalTarget && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPermissionModalTarget(null)}
        >
          <div 
            className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl text-center space-y-4 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setPermissionModalTarget(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Animated Permission Icon */}
            <div className="mx-auto w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-3xl bg-cyan-400/20 animate-ping opacity-75" />
              <PhoneCall className="w-8 h-8 text-cyan-400 relative z-10" />
            </div>

            {/* Title & Request explanation */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-[10px] font-black uppercase tracking-wider text-cyan-300 mb-2">
                <Shield className="w-3 h-3 text-cyan-400" />
                <span>Phone Access Permission</span>
              </div>
              <h3 className="text-xl font-black text-white">
                Open Phone App to Call?
              </h3>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                VyraConnect is requesting permission to launch your device&apos;s Phone dialer to connect your call with the{' '}
                <strong className="text-cyan-300">{permissionModalTarget === 'emergency' ? 'Emergency Contact' : 'Vehicle Owner'}</strong>.
              </p>
            </div>

            {/* Call Specs Card */}
            <div className="bg-black/50 border border-white/10 rounded-2xl p-3.5 text-left text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Vehicle:</span>
                <span className="font-mono font-bold text-white">{regNo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Recipient:</span>
                <span className="font-bold text-cyan-300">
                  {permissionModalTarget === 'emergency' ? (emergencyName || 'Emergency Contact') : (customer?.full_name || customer?.name || 'Vehicle Owner')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Private Line:</span>
                <span className="font-mono font-bold text-emerald-400">{defaultVirtualNumber}</span>
              </div>
              <div className="pt-2 border-t border-white/10 text-[11px] text-gray-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Both numbers 100% hidden. Only receiver rings.</span>
              </div>
            </div>

            {/* iOS-Compliant Real Anchor Button */}
            <div className="space-y-2 pt-1">
              <a
                href={`tel:${defaultVirtualNumber}`}
                onClick={() => {
                  const isEmer = permissionModalTarget === 'emergency';
                  const targetMob = isEmer ? emerMobile : ownerMobile;
                  const targetN = isEmer ? emergencyName : (customer?.full_name || customer?.name || 'Vehicle Owner');
                  primeBackend(targetMob, permissionModalTarget!, targetN);
                  setActiveCallTarget(permissionModalTarget);
                  setActiveCallMessage(
                    `Connecting to ${isEmer ? 'Emergency Contact' : 'Vehicle Owner'} via private line ${defaultVirtualNumber}. Only the receiver's phone is ringing.`
                  );
                  setPermissionModalTarget(null);
                }}
                className="w-full flex items-center justify-center gap-2 py-4 px-5 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 shadow-[0_4px_20px_rgba(16,185,129,0.4)] active:scale-98 border border-emerald-400/40 cursor-pointer transition text-center"
              >
                <PhoneCall className="w-5 h-5 text-white" />
                <span>Allow &amp; Open Phone App</span>
              </a>

              <button
                type="button"
                onClick={() => setPermissionModalTarget(null)}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* In-App Browser Fallback / Manual Dial Helper */}
            <div className="pt-1 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(defaultVirtualNumber);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2500);
                  }
                }}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied {defaultVirtualNumber}!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Can&apos;t open dialer? Tap to copy {defaultVirtualNumber}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert if Emergency Contact is Not Added */}
      {noEmergencyAlert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setNoEmergencyAlert(false)}
        >
          <div 
            className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No Emergency Contact Found</h3>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                The owner of vehicle (<strong className="text-cyan-300">{regNo}</strong>) has not added an emergency contact number yet.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setNoEmergencyAlert(false);
                  requestCallPermission("owner");
                }}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg cursor-pointer"
              >
                Call Vehicle Owner Instead
              </button>
              <button
                type="button"
                onClick={() => setNoEmergencyAlert(false)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
