"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Customer {
  id: string;
  full_name?: string;
  name?: string;
  mobile: string;
  email: string;
  status: string;
  created_at?: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BLOCKED">("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    mobile: "",
    email: ""
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
      setFormData({
        full_name: customer.full_name || customer.name || "",
        mobile: customer.mobile || "",
        email: customer.email || ""
      });
    } else {
      setSelectedCustomer(null);
      setFormData({ full_name: "", mobile: "", email: "" });
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
      if (selectedCustomer) {
        await axios.patch(`https://api.vyraconnect.in/api/admin/customers/${selectedCustomer.id}`, formData);
      } else {
        await axios.post(`https://api.vyraconnect.in/api/admin/customers`, formData);
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

  // Filtered customer list
  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      (c.full_name || c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.mobile || "").includes(searchTerm) ||
      (c.email || "").toLowerCase().includes(searchTerm.toLowerCase());

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
        <div className="text-4xl animate-bounce">⏳</div>
        <div className="text-lg font-bold">Loading Customer Accounts...</div>
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
            Connected users, vehicle owners, and emergency notification settings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => handleOpenModal()}
            className="flex-1 md:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-2xl font-black text-sm shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            ✨ Add Customer
          </button>
        </div>
      </div>

      {/* Modern Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="🔍 Search name, phone, or email..."
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

        {/* Status Filters */}
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              statusFilter === "ALL"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({customers.length})
          </button>
          <button
            onClick={() => setStatusFilter("ACTIVE")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              statusFilter === "ACTIVE"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            ✅ Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter("BLOCKED")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              statusFilter === "BLOCKED"
                ? "bg-red-600 text-white shadow-sm"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            🚫 Blocked ({blockedCount})
          </button>
        </div>
      </div>

      {/* Customer Cards Grid with Left-Side Color Bar and Red/Light-Green Theming */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map(customer => {
            const isBlocked = customer.status === "BLOCKED";

            return (
              <div
                key={customer.id}
                className={`rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between border-l-[6px] ${
                  isBlocked
                    ? "border-l-red-500 bg-red-50/50 border border-red-200 hover:border-red-300"
                    : "border-l-emerald-500 bg-emerald-50/20 border border-emerald-100 hover:border-emerald-300"
                }`}
              >
                <div>
                  {/* Top Row: Avatar + Name + Status Pill */}
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shadow-sm ${
                          isBlocked
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-emerald-100 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        {isBlocked ? "🚫" : "🧑‍💻"}
                      </div>
                      <div>
                        <h3
                          className={`font-black text-lg line-clamp-1 ${
                            isBlocked ? "text-red-950" : "text-slate-900"
                          }`}
                        >
                          {customer.full_name || customer.name || "Unnamed Customer"}
                        </h3>
                        <p
                          className={`text-xs font-mono font-bold ${
                            isBlocked ? "text-red-500" : "text-slate-400"
                          }`}
                        >
                          🆔 {customer.id.substring(0, 8)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black border shrink-0 ${
                        isBlocked
                          ? "bg-red-100 text-red-700 border-red-300"
                          : "bg-emerald-100 text-emerald-800 border-emerald-300"
                      }`}
                    >
                      {isBlocked ? "🚫 BLOCKED" : "✅ ACTIVE"}
                    </span>
                  </div>

                  {/* Customer Information Badges */}
                  <div
                    className={`space-y-2 mb-5 p-3 rounded-2xl border text-sm ${
                      isBlocked
                        ? "bg-red-100/60 border-red-200/80 text-red-950"
                        : "bg-white/80 border-slate-100 text-slate-700"
                    }`}
                  >
                    <p className="flex items-center">
                      <span className="text-base mr-2">📱</span>
                      <span className={`font-black ${isBlocked ? "text-red-900" : "text-slate-800"}`}>
                        {customer.mobile || "No Mobile"}
                      </span>
                    </p>
                    <p className="flex items-center truncate">
                      <span className="text-base mr-2">📧</span>
                      <span className={`truncate font-medium ${isBlocked ? "text-red-800" : "text-slate-600"}`}>
                        {customer.email || "No Email"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Bottom Action Buttons (Clean App Ergonomics) */}
                <div
                  className={`flex items-center gap-2 pt-3 border-t ${
                    isBlocked ? "border-red-200" : "border-slate-100"
                  }`}
                >
                  <button
                    onClick={() => handleOpenDetails(customer)}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm ${
                      isBlocked
                        ? "bg-white hover:bg-red-100 text-red-800 border border-red-200"
                        : "bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    📄 Details
                  </button>

                  <button
                    onClick={() => handleOpenModal(customer)}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm ${
                      isBlocked
                        ? "bg-red-100 hover:bg-red-200 text-red-900 border border-red-300"
                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200"
                    }`}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => handleToggleStatus(customer)}
                    title={isBlocked ? "Unblock account" : "Block account"}
                    className={`px-3 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm ${
                      isBlocked
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200"
                    }`}
                  >
                    {isBlocked ? "✅ Unblock" : "🚫 Block"}
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

      {/* Details Modal */}
      {isDetailsOpen && selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setIsDetailsOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in zoom-in-95"
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
                className="absolute top-4 right-4 text-white/60 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                ✖
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-3xl border border-white/20 shadow-inner">
                  {selectedCustomer.status === "BLOCKED" ? "🚫" : "👤"}
                </div>
                <div>
                  <h2 className="text-2xl font-black">{selectedCustomer.full_name || selectedCustomer.name || "Customer"}</h2>
                  <p className="text-white/70 font-mono text-xs mt-0.5">ID: {selectedCustomer.id}</p>
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
            <div className="p-6 space-y-5 bg-slate-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">📱 Mobile Number</p>
                  <p className="font-black text-slate-800 text-base">{selectedCustomer.mobile}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">📧 Email Address</p>
                  <p className="font-bold text-slate-800 text-sm truncate">{selectedCustomer.email || "N/A"}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center gap-3">
                <button
                  onClick={() => {
                    setIsDetailsOpen(false);
                    handleOpenModal(selectedCustomer);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors"
                >
                  ✏️ Edit Profile
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(selectedCustomer)}
                    className={`px-4 py-2.5 font-bold rounded-xl text-xs transition-colors ${
                      selectedCustomer.status === "ACTIVE"
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    }`}
                  >
                    {selectedCustomer.status === "ACTIVE" ? "🚫 Block Customer" : "✅ Unblock Customer"}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedCustomer.id)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900">
                  {selectedCustomer ? "✏️ Edit Customer Profile" : "✨ New Customer Profile"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✖
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    👤 Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-emerald-500 focus:ring-0 outline-none transition-colors"
                    required
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    📱 Mobile Number
                  </label>
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-emerald-500 focus:ring-0 outline-none transition-colors"
                    required
                    placeholder="e.g. +91 98765 43210"
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
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-emerald-500 focus:ring-0 outline-none transition-colors"
                    placeholder="customer@example.com"
                  />
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-slate-700 font-bold hover:bg-slate-200 transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition-all text-xs"
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
