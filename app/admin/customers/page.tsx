"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Users, Search, Filter, Plus, Edit2, Trash2, Eye, ShieldAlert, 
  Phone, Mail, Car, AlertTriangle, Check, Copy, UserCheck, X,
  LayoutGrid, Table as TableIcon, HeartHandshake, QrCode, Tag
} from "lucide-react";

interface EmergencyContactItem {
  id?: string;
  name: string;
  relationship: string;
  mobile: string;
  is_primary?: boolean;
}

interface VehicleItem {
  id?: string;
  registration_number: string;
  vehicle_type?: string;
  make?: string;
  model?: string;
}

interface QrCodeItem {
  id: string;
  qr_serial: string;
  qr_token?: string;
  status?: string;
  product_type?: string;
  activated_at?: string;
}

interface Customer {
  id: string;
  customer_code?: string;
  full_name?: string;
  name?: string;
  mobile: string;
  email?: string;
  status: string;
  created_at?: string;
  emergency_contacts?: EmergencyContactItem[];
  vehicles?: VehicleItem[];
  qr_codes?: QrCodeItem[];
}

// Generate customer initials avatar text: first letters of first two words, or first two letters of single word
function getCustomerInitials(fullName?: string): string {
  if (!fullName || !fullName.trim()) return "VC";
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  if (words.length === 1) {
    const word = words[0];
    return word.length >= 2 ? word.substring(0, 2).toUpperCase() : word[0].toUpperCase();
  }
  return "VC";
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BLOCKED">("ALL");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    mobile: "",
    email: "",
    emergencyName: "",
    emergencyMobile: "",
    emergencyRelationship: "Relative",
    emergencyContactId: "",
    vehicleId: "",
    vehiclePlate: "",
    vehicleType: "Four Wheeler"
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("https://api.vyraconnect.in/api/admin/customers");
      setCustomers(Array.isArray(response.data) ? response.data : response.data.customers || []);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setSelectedCustomer(customer);
      const primaryEmer = customer.emergency_contacts?.find(e => e.is_primary) || customer.emergency_contacts?.[0];
      const primaryVeh = customer.vehicles?.[0];
      setFormData({
        full_name: customer.full_name || customer.name || "",
        mobile: customer.mobile || "",
        email: customer.email || "",
        emergencyName: primaryEmer?.name || "",
        emergencyMobile: primaryEmer?.mobile || "",
        emergencyRelationship: primaryEmer?.relationship || "Relative",
        emergencyContactId: primaryEmer?.id || "",
        vehicleId: primaryVeh?.id || "",
        vehiclePlate: primaryVeh?.registration_number || "",
        vehicleType: primaryVeh?.vehicle_type || "Four Wheeler"
      });
    } else {
      setSelectedCustomer(null);
      setFormData({
        full_name: "",
        mobile: "",
        email: "",
        emergencyName: "",
        emergencyMobile: "",
        emergencyRelationship: "Relative",
        emergencyContactId: "",
        vehicleId: "",
        vehiclePlate: "",
        vehicleType: "Four Wheeler"
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        vehiclePlate: formData.vehiclePlate ? formData.vehiclePlate.trim().toUpperCase() : undefined
      };
      if (selectedCustomer) {
        await axios.patch(`https://api.vyraconnect.in/api/admin/customers/${selectedCustomer.id}`, payload);
      } else {
        await axios.post(`https://api.vyraconnect.in/api/admin/customers`, payload);
      }
      setIsModalOpen(false);
      fetchCustomers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to save customer");
    }
  };

  const handleToggleStatus = async (customer: Customer) => {
    const newStatus = customer.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    const actionLabel = newStatus === "BLOCKED" ? "Block 🚫" : "Unblock ✅";
    if (!confirm(`Are you sure you want to ${actionLabel} this customer?`)) return;

    try {
      await axios.patch(`https://api.vyraconnect.in/api/admin/customers/${customer.id}/status`, {
        status: newStatus
      });
      fetchCustomers();
      if (selectedCustomer && selectedCustomer.id === customer.id) {
        setSelectedCustomer({ ...selectedCustomer, status: newStatus });
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete 🗑️ this customer? This action cannot be undone.")) return;
    try {
      await axios.delete(`https://api.vyraconnect.in/api/admin/customers/${id}`);
      fetchCustomers();
      setIsDetailsOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete customer");
    }
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedNumber(text);
      setTimeout(() => setCopiedNumber(null), 2000);
    }
  };

  // Filtered customer list
  const filteredCustomers = customers.filter(c => {
    const primaryEmer = c.emergency_contacts?.find(e => e.is_primary) || c.emergency_contacts?.[0];
    const qrSerials = (c.qr_codes || []).map(q => q.qr_serial).join(" ");
    const vehiclePlates = (c.vehicles || []).map(v => v.registration_number).join(" ");
    
    const matchesSearch =
      (c.full_name || c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.mobile || "").includes(searchTerm) ||
      (c.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (primaryEmer?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (primaryEmer?.mobile || "").includes(searchTerm) ||
      qrSerials.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiclePlates.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && c.status === "ACTIVE") ||
      (statusFilter === "BLOCKED" && c.status === "BLOCKED");

    return matchesSearch && matchesStatus;
  });

  const activeCount = customers.filter(c => c.status === "ACTIVE").length;
  const blockedCount = customers.filter(c => c.status === "BLOCKED").length;

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-slate-500 space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-sm font-bold">Loading Customer Accounts...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">👥</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Customer Management</h1>
          </div>
          <p className="text-slate-500 font-medium text-xs sm:text-sm mt-1">
            Registered vehicle owners, assigned QR scanner cards, and emergency safety contacts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => handleOpenModal()}
            className="flex-1 md:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-2xl font-black text-sm shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Filter, Search & View Switcher Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <input
            type="text"
            placeholder="🔍 Search name, phone, plate, QR..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✖
            </button>
          )}
        </div>

        {/* Status Filters + View Switcher */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          {/* Status Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({customers.length})
            </button>
            <button
              onClick={() => setStatusFilter("ACTIVE")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                statusFilter === "ACTIVE"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              ✅ Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter("BLOCKED")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                statusFilter === "BLOCKED"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              🚫 Blocked ({blockedCount})
            </button>
          </div>

          {/* View Mode Toggle (Card vs Table) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode("card")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                viewMode === "card"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Tabular Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: Customer Cards Grid */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map(customer => {
              const isBlocked = customer.status === "BLOCKED";
              const primaryEmer = customer.emergency_contacts?.find(e => e.is_primary) || customer.emergency_contacts?.[0];
              const vehicles = customer.vehicles || [];
              const qrCodes = customer.qr_codes || [];
              const initials = getCustomerInitials(customer.full_name || customer.name);

              return (
                <div
                  key={customer.id}
                  className={`rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between border-l-[6px] ${
                    isBlocked
                      ? "border-l-red-500 bg-red-50/40 border border-red-200 hover:border-red-300"
                      : "border-l-emerald-500 bg-white border border-slate-100 hover:border-emerald-300"
                  }`}
                >
                  <div>
                    {/* Top Row: Avatar with Customer Initials + Name + Status Pill */}
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm tracking-wider border shadow-sm shrink-0 select-none ${
                            isBlocked
                              ? "bg-gradient-to-br from-red-600 to-rose-800 text-white border-red-400/40 shadow-red-200"
                              : "bg-gradient-to-br from-emerald-600 to-teal-800 text-white border-emerald-400/40 shadow-emerald-200"
                          }`}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3
                            className={`font-black text-base sm:text-lg leading-tight truncate ${
                              isBlocked ? "text-red-950" : "text-slate-900"
                            }`}
                            title={customer.full_name || customer.name || "Customer"}
                          >
                            {customer.full_name || customer.name || "Customer"}
                          </h3>
                          <p
                            className={`text-xs font-mono font-bold mt-1 ${
                              isBlocked ? "text-red-500" : "text-slate-400"
                            }`}
                          >
                            🆔 {customer.customer_code || customer.id.substring(0, 8)}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black border shrink-0 uppercase tracking-wider ${
                          isBlocked
                            ? "bg-red-100 text-red-700 border-red-300"
                            : "bg-emerald-100 text-emerald-800 border-emerald-300"
                        }`}
                      >
                        {isBlocked ? "BLOCKED" : "ACTIVE"}
                      </span>
                    </div>

                    {/* Registered Card / Scanner Section */}
                    <div className="mb-3 p-3 rounded-2xl bg-cyan-50/70 border border-cyan-200/70 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-800">
                          <QrCode className="w-3.5 h-3.5 text-cyan-600" />
                          <span>Registered Tag / Card</span>
                        </span>
                        {qrCodes.length > 0 && (
                          <span className="text-[10px] font-black bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full border border-cyan-200">
                            {qrCodes[0].status || "ACTIVE"}
                          </span>
                        )}
                      </div>
                      <div className="pt-0.5">
                        {qrCodes.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {qrCodes.map((qr) => (
                              <span
                                key={qr.id || qr.qr_serial}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-cyan-950 font-mono font-black text-xs border border-cyan-200 shadow-2xs"
                              >
                                <Tag className="w-3 h-3 text-cyan-600" />
                                <span>{qr.qr_serial}</span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No Scanner Card Linked</span>
                        )}
                      </div>
                    </div>

                    {/* Customer Information Badges */}
                    <div
                      className={`space-y-2 mb-3 p-3 rounded-2xl border text-xs ${
                        isBlocked
                          ? "bg-red-100/60 border-red-200/80 text-red-950"
                          : "bg-slate-50 border-slate-100 text-slate-700"
                      }`}
                    >
                      <p className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-black text-slate-800">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{customer.mobile || "No Mobile"}</span>
                        </span>
                        <button
                          onClick={() => copyToClipboard(customer.mobile)}
                          className="text-[10px] text-slate-400 hover:text-emerald-600 font-bold cursor-pointer"
                          title="Copy phone"
                        >
                          {copiedNumber === customer.mobile ? "✓ Copied" : "Copy"}
                        </button>
                      </p>
                      <p className="flex items-center gap-1.5 truncate text-slate-500 font-medium">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{customer.email || "No Email"}</span>
                      </p>
                    </div>

                    {/* Emergency Contact Badge */}
                    {primaryEmer ? (
                      <div className="mb-3 p-3 bg-red-50 border border-red-200/70 rounded-2xl text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-red-600">
                            <HeartHandshake className="w-3.5 h-3.5" />
                            <span>Emergency Contact</span>
                          </span>
                          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                            {primaryEmer.relationship || "Relative"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-0.5">
                          <span className="font-bold text-slate-800 truncate">{primaryEmer.name}</span>
                          <span className="font-mono font-black text-red-700 text-xs">{primaryEmer.mobile}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3 p-2.5 bg-amber-50/80 border border-amber-200/60 rounded-2xl flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          <span>No Emergency Contact</span>
                        </span>
                        <button
                          onClick={() => handleOpenModal(customer)}
                          className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                        >
                          + Add Contact
                        </button>
                      </div>
                    )}

                    {/* Vehicles Tags */}
                    {vehicles.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {vehicles.map((v, i) => (
                          <span
                            key={v.id || i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-mono font-bold border border-slate-200"
                          >
                            <Car className="w-3 h-3 text-slate-400" />
                            <span>{v.registration_number}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Buttons */}
                  <div
                    className={`flex items-center gap-2 pt-3 border-t ${
                      isBlocked ? "border-red-200" : "border-slate-100"
                    }`}
                  >
                    <button
                      onClick={() => handleOpenDetails(customer)}
                      className="flex-1 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => handleOpenModal(customer)}
                      className="flex-1 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleToggleStatus(customer)}
                      title={isBlocked ? "Unblock account" : "Block account"}
                      className={`px-3 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm cursor-pointer ${
                        isBlocked
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200"
                      }`}
                    >
                      {isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white p-12 text-center rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-5xl mb-3">📭</p>
              <h3 className="text-lg font-black text-slate-800">No Customers Found</h3>
              <p className="text-slate-400 text-xs mt-1">Try adjusting your search query or status filter.</p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: Tabular Table View */}
      {viewMode === "table" && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-3.5 px-5 text-left font-black text-xs text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="py-3.5 px-4 text-left font-black text-xs text-slate-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="py-3.5 px-4 text-left font-black text-xs text-slate-500 uppercase tracking-wider">
                    Registered Tag / Card
                  </th>
                  <th className="py-3.5 px-4 text-left font-black text-xs text-slate-500 uppercase tracking-wider">
                    Emergency Contact
                  </th>
                  <th className="py-3.5 px-4 text-left font-black text-xs text-slate-500 uppercase tracking-wider">
                    Vehicles
                  </th>
                  <th className="py-3.5 px-4 text-left font-black text-xs text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3.5 px-5 text-right font-black text-xs text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(customer => {
                    const isBlocked = customer.status === "BLOCKED";
                    const primaryEmer = customer.emergency_contacts?.find(e => e.is_primary) || customer.emergency_contacts?.[0];
                    const vehicles = customer.vehicles || [];
                    const qrCodes = customer.qr_codes || [];
                    const initials = getCustomerInitials(customer.full_name || customer.name);

                    return (
                      <tr
                        key={customer.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isBlocked ? "bg-red-50/20" : ""
                        }`}
                      >
                        {/* Customer */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border shrink-0 ${
                                isBlocked
                                  ? "bg-red-600 text-white border-red-500"
                                  : "bg-emerald-600 text-white border-emerald-500"
                              }`}
                            >
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-slate-900 leading-tight">
                                {customer.full_name || customer.name || "Customer"}
                              </p>
                              <p className="text-[11px] font-mono font-bold text-slate-400 mt-0.5">
                                🆔 {customer.customer_code || customer.id.substring(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="py-4 px-4">
                          <div className="space-y-0.5 text-xs">
                            <p className="font-mono font-bold text-slate-800 flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{customer.mobile || "N/A"}</span>
                            </p>
                            {customer.email && (
                              <p className="text-slate-400 text-[11px] truncate max-w-[150px]">
                                {customer.email}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Registered Tag / Card */}
                        <td className="py-4 px-4">
                          {qrCodes.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {qrCodes.map((q) => (
                                <span
                                  key={q.id || q.qr_serial}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-50 text-cyan-900 font-mono font-black text-xs border border-cyan-200"
                                >
                                  <Tag className="w-3 h-3 text-cyan-600" />
                                  <span>{q.qr_serial}</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs italic">No Tag</span>
                          )}
                        </td>

                        {/* Emergency Contact */}
                        <td className="py-4 px-4">
                          {primaryEmer ? (
                            <div className="text-xs">
                              <p className="font-bold text-slate-900 flex items-center gap-1">
                                <HeartHandshake className="w-3 h-3 text-red-500" />
                                <span>{primaryEmer.name}</span>
                                <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                  ({primaryEmer.relationship || "Relative"})
                                </span>
                              </p>
                              <p className="font-mono font-bold text-red-700 text-[11px] mt-0.5">
                                {primaryEmer.mobile}
                              </p>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs italic">None</span>
                          )}
                        </td>

                        {/* Vehicles */}
                        <td className="py-4 px-4">
                          {vehicles.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {vehicles.map((v, i) => (
                                <span
                                  key={v.id || i}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-mono font-bold border border-slate-200"
                                >
                                  <Car className="w-3 h-3 text-slate-400" />
                                  <span>{v.registration_number}</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">No vehicles</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              isBlocked
                                ? "bg-red-100 text-red-700 border-red-300"
                                : "bg-emerald-100 text-emerald-800 border-emerald-300"
                            }`}
                          >
                            {customer.status || "ACTIVE"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenDetails(customer)}
                              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenModal(customer)}
                              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-pointer"
                              title="Edit Customer, Vehicle & Emergency Contact"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(customer)}
                              className={`p-2 rounded-xl text-xs font-bold border cursor-pointer ${
                                isBlocked
                                  ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                                  : "bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-700 border-slate-200"
                              }`}
                              title={isBlocked ? "Unblock account" : "Block account"}
                            >
                              {isBlocked ? "Unblock" : "Block"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                      No matching customer accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsOpen && selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsDetailsOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`p-7 text-white relative ${
                selectedCustomer.status === "BLOCKED"
                  ? "bg-gradient-to-br from-red-800 via-rose-900 to-red-950"
                  : "bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900"
              }`}
            >
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-xl font-black border border-white/20 shadow-inner">
                  {getCustomerInitials(selectedCustomer.full_name || selectedCustomer.name)}
                </div>
                <div>
                  <h2 className="text-2xl font-black">{selectedCustomer.full_name || selectedCustomer.name || "Customer"}</h2>
                  <p className="text-white/70 font-mono text-xs mt-0.5">ID: {selectedCustomer.customer_code || selectedCustomer.id}</p>
                  <span
                    className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-black border ${
                      selectedCustomer.status === "BLOCKED"
                        ? "bg-red-500/30 text-red-200 border-red-500/40"
                        : "bg-emerald-500/30 text-emerald-200 border-emerald-500/40"
                    }`}
                  >
                    {selectedCustomer.status === "BLOCKED" ? "🚫 Account Blocked" : "✅ Account Active"}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 bg-slate-50 max-h-[75vh] overflow-y-auto">
              {/* Registered Tag / Card in Details */}
              <div className="bg-white p-4 rounded-2xl border border-cyan-200/80 shadow-sm space-y-2">
                <p className="text-xs font-black text-cyan-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <QrCode className="w-4 h-4 text-cyan-600" />
                  <span>Registered Scanner Card / Tag</span>
                </p>
                {selectedCustomer.qr_codes && selectedCustomer.qr_codes.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    {selectedCustomer.qr_codes.map((qr) => (
                      <div key={qr.id || qr.qr_serial} className="flex justify-between items-center text-xs">
                        <span className="font-mono font-black text-cyan-900 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200">
                          🏷️ {qr.qr_serial}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {qr.status || "ACTIVE"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs italic py-1">No scanner tag has been linked yet.</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Mobile Number</span>
                  </p>
                  <p className="font-black text-slate-800 text-base font-mono">{selectedCustomer.mobile}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Address</span>
                  </p>
                  <p className="font-bold text-slate-800 text-sm truncate">{selectedCustomer.email || "N/A"}</p>
                </div>
              </div>

              {/* Emergency Contact Card in Details */}
              <div className="bg-white p-4 rounded-2xl border border-red-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-black text-red-600 uppercase tracking-wider flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-red-500" />
                    <span>Emergency Safety Contact</span>
                  </span>
                  <button
                    onClick={() => {
                      setIsDetailsOpen(false);
                      handleOpenModal(selectedCustomer);
                    }}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                  >
                    Edit Contact
                  </button>
                </div>

                {selectedCustomer.emergency_contacts && selectedCustomer.emergency_contacts.length > 0 ? (
                  selectedCustomer.emergency_contacts.map((emer, idx) => (
                    <div key={emer.id || idx} className="flex justify-between items-center text-xs pt-1">
                      <div>
                        <p className="font-black text-slate-900">{emer.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{emer.relationship || "Relative"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-black text-red-600 text-sm">{emer.mobile}</p>
                        <button
                          onClick={() => copyToClipboard(emer.mobile)}
                          className="text-[10px] text-slate-400 hover:text-emerald-600 font-bold cursor-pointer"
                        >
                          {copiedNumber === emer.mobile ? "✓ Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-2 text-center text-slate-400 text-xs">
                    <p>No emergency contact has been configured for this customer.</p>
                  </div>
                )}
              </div>

              {/* Vehicles Card in Details */}
              {selectedCustomer.vehicles && selectedCustomer.vehicles.length > 0 && (
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <Car className="w-4 h-4" />
                    <span>Registered Vehicles ({selectedCustomer.vehicles.length})</span>
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedCustomer.vehicles.map((v, i) => (
                      <span
                        key={v.id || i}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-mono font-black border border-slate-200"
                      >
                        {v.registration_number} ({v.vehicle_type || "Vehicle"})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center gap-3">
                <button
                  onClick={() => {
                    setIsDetailsOpen(false);
                    handleOpenModal(selectedCustomer);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  ✏️ Edit Profile
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(selectedCustomer)}
                    className={`px-4 py-2.5 font-bold rounded-xl text-xs transition-colors cursor-pointer ${
                      selectedCustomer.status === "ACTIVE"
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    }`}
                  >
                    {selectedCustomer.status === "ACTIVE" ? "🚫 Block Customer" : "✅ Unblock Customer"}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedCustomer.id)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal (With Vehicle & Emergency Contact Fields) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-black text-slate-900">
                  {selectedCustomer ? "✏️ Edit Customer Profile" : "✨ New Customer Profile"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                {/* Basic Customer Info */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    👤 Customer Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-emerald-500 focus:ring-0 outline-none transition-colors"
                    required
                    placeholder="e.g. Shanavas"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    📱 Mobile Number (Owner)
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-emerald-500 focus:ring-0 outline-none transition-colors font-mono"
                    required
                    placeholder="e.g. 9645910890"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    📧 Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-emerald-500 focus:ring-0 outline-none transition-colors"
                    placeholder="customer@example.com"
                  />
                </div>

                {/* Vehicle Details Fieldset */}
                <div className="pt-2 border-t border-slate-200 space-y-3">
                  <div className="flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-black text-blue-700 uppercase tracking-wider">
                      Vehicle Details
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Vehicle Registration Plate No.
                    </label>
                    <input
                      type="text"
                      value={formData.vehiclePlate}
                      onChange={e => setFormData({ ...formData, vehiclePlate: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold focus:border-blue-400 focus:ring-0 outline-none transition-colors font-mono uppercase"
                      placeholder="e.g. KL55AC1818 or 24BH1245"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Vehicle Type
                    </label>
                    <select
                      value={formData.vehicleType}
                      onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:border-blue-400 focus:ring-0 outline-none transition-colors bg-white"
                    >
                      <option value="Four Wheeler">Four Wheeler</option>
                      <option value="Two Wheeler">Two Wheeler</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Heavy Vehicle">Heavy Vehicle</option>
                    </select>
                  </div>
                </div>

                {/* Emergency Contact Fieldset */}
                <div className="pt-2 border-t border-slate-200 space-y-3">
                  <div className="flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-black text-red-600 uppercase tracking-wider">
                      Emergency Contact Settings
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyName}
                      onChange={e => setFormData({ ...formData, emergencyName: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold focus:border-red-400 focus:ring-0 outline-none transition-colors"
                      placeholder="e.g. Muhammad Muneer"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Emergency Mobile No.
                      </label>
                      <input
                        type="tel"
                        value={formData.emergencyMobile}
                        onChange={e => setFormData({ ...formData, emergencyMobile: e.target.value })}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold focus:border-red-400 focus:ring-0 outline-none transition-colors font-mono"
                        placeholder="e.g. 9539230000"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Relationship
                      </label>
                      <select
                        value={formData.emergencyRelationship}
                        onChange={e => setFormData({ ...formData, emergencyRelationship: e.target.value })}
                        className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:border-red-400 focus:ring-0 outline-none transition-colors bg-white"
                      >
                        <option value="Spouse">Spouse</option>
                        <option value="Parent">Parent</option>
                        <option value="Son/Daughter">Son/Daughter</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Friend">Friend</option>
                        <option value="Relative">Relative</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-3 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-100 transition-colors text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition-all text-xs cursor-pointer"
                >
                  {selectedCustomer ? "💾 Save Changes" : "🚀 Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}