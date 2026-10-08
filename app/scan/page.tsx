"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

// API Response interfaces
interface Customer {
  name: string;
  mobile: string;
  email?: string;
  vehicleType?: string;
  registrationNumber?: string;
  emergencyContact?: string;
  vehicles?: any[];
}

interface QRData {
  id: string;
  status: "AVAILABLE" | "ASSIGNED" | "ACTIVATED";
  customer?: Customer;
}

function ScanPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [qrData, setQrData] = useState<QRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Registration Form State
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    vehicleType: "",
    registrationNumber: "",
  });
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing token.");
      setLoading(false);
      return;
    }

    const fetchQRStatus = async () => {
      try {
        const response = await axios.get(`https://api.vyraconnect.in/api/scan/${token}`);
        setQrData(response.data.qr);
      } catch (err: any) {
        console.error("Error fetching QR status:", err);
        setError(err.response?.data?.error || "Failed to fetch QR details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQRStatus();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setRegistering(true);
    try {
      const response = await axios.post(`https://api.vyraconnect.in/api/scan/${token}/register`, formData);
      // Assuming successful registration returns the updated QR data or we can switch status locally
      if (qrData) {
        setQrData({
          ...qrData,
          status: "ACTIVATED",
          customer: {
            ...qrData.customer,
            ...formData
          }
        });
      }
    } catch (err) {
      console.error("Error registering:", err);
      alert("Failed to register. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  const handleSendLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const message = `Emergency! I am near your vehicle. Here is my live location: ${googleMapsLink}`;
        const phone = qrData?.customer?.mobile || qrData?.customer?.emergencyContact;
        
        if (phone) {
          window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
        } else {
          alert("Owner phone number not found.");
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please check your browser permissions.");
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !qrData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-2xl shadow-xl text-center max-w-sm w-full">
          <div className="text-red-500 mb-4 bg-red-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600">{error || "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  const renderHeader = () => (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">Vyra<span className="text-gray-800">Connect</span></h1>
      <p className="text-sm text-gray-500 mt-1">Smart Vehicle Safety</p>
    </div>
  );

  if (qrData.status === "AVAILABLE" || qrData.status === "ASSIGNED") {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden md:max-w-xl p-6 sm:p-8 border border-gray-100">
          {renderHeader()}
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Register Your Tag</h2>
            <p className="text-gray-500 text-sm">Please fill in your details to activate your emergency tag.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" id="name" required value={formData.name} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50" placeholder="John Doe" />
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
              <input type="tel" name="mobile" id="mobile" required value={formData.mobile} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50" placeholder="+91 9876543210" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50" placeholder="john@example.com" />
            </div>
            
            <div>
              <label htmlFor="vehicleType" className="block text-sm font-semibold text-gray-700 mb-1">Vehicle Type</label>
              <select name="vehicleType" id="vehicleType" required value={formData.vehicleType} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50 appearance-none">
                <option value="" disabled>Select vehicle type</option>
                <option value="Two Wheeler">Two Wheeler</option>
                <option value="Four Wheeler">Four Wheeler</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-semibold text-gray-700 mb-1">Vehicle Registration No.</label>
              <input type="text" name="registrationNumber" id="registrationNumber" required value={formData.registrationNumber} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50 uppercase" placeholder="MH 01 AB 1234" />
            </div>

            <button type="submit" disabled={registering} className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition duration-150 ease-in-out mt-8">
              {registering ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Activating...
                </span>
              ) : 'Activate Tag'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ACTIVATED State
  const regNo = qrData?.customer?.vehicles?.[0]?.registration_number || qrData?.customer?.registrationNumber || 'UNKNOWN';
  const vType = qrData?.customer?.vehicles?.[0]?.vehicle_type || qrData?.customer?.vehicleType || 'Vehicle';

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-8 px-4 text-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">Vyra<span className="text-blue-200">Connect</span></h1>
            <div className="mt-5 bg-red-500/90 backdrop-blur-sm inline-flex items-center px-4 py-1.5 rounded-full text-white text-xs font-bold tracking-widest shadow-inner border border-red-400/50">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-2"></span>
              EMERGENCY PROFILE
            </div>
          </div>
        </div>
        
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8 bg-gray-50 rounded-2xl py-5 px-4 border border-gray-100 shadow-inner">
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Vehicle Identified</h2>
            <div className="text-3xl font-black text-gray-800 uppercase tracking-wide">
              {regNo}
            </div>
            <p className="text-blue-600 mt-1 capitalize font-semibold text-sm bg-blue-50 inline-block px-3 py-1 rounded-full">{vType}</p>
          </div>

          <div className="space-y-3.5">
            <a 
              href={`tel:${qrData.customer?.mobile || qrData.customer?.emergencyContact}`}
              className="w-full flex items-center justify-center py-4 px-4 rounded-2xl text-lg font-bold text-white bg-green-500 hover:bg-green-600 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.23)] transition-all active:scale-95"
            >
              <svg className="w-6 h-6 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              Call Owner
            </a>

            <a 
              href={`whatsapp://send?phone=${(qrData.customer?.mobile || '').replace(/[^0-9]/g, '')}&text=${encodeURIComponent("Hello, I am contacting you regarding your vehicle " + regNo)}`}
              className="w-full flex items-center justify-center py-4 px-4 rounded-2xl text-lg font-bold text-white bg-teal-500 hover:bg-teal-600 shadow-[0_4px_14px_0_rgba(20,184,166,0.39)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.23)] transition-all active:scale-95"
            >
              <svg className="w-6 h-6 mr-2.5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Message Owner
            </a>

            <button 
              onClick={handleSendLocation}
              className="w-full flex items-center justify-center py-4 px-4 rounded-2xl text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] transition-all active:scale-95 mt-2"
            >
              <svg className="w-6 h-6 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Send Live Location
            </button>
          </div>
          
          <div className="mt-8 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-medium flex items-center justify-center">
              <svg className="w-4 h-4 mr-1.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Secure Emergency Platform by Vyra Connect
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ScanPageContent />
    </Suspense>
  );
}
