"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Vehicle {
  id: string;
  customer_id?: string;
  vehicle_type: string;
  registration_number: string;
  registrationNumber?: string;
  make: string;
  model: string;
  status: string;
  created_at?: string;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BLOCKED">("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [formData, setFormData] = useState({
    customer_id: "",
    vehicle_type: "CAR",
    registration_number: "",
    make: "",
    model: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vehRes, custRes] = await Promise.all([
        axios.get("https://api.vyraconnect.in/api/admin/vehicles"),
        axios.get("https://api.vyraconnect.in/api/admin/customers")
      ]);
      setVehicles(Array.isArray(vehRes.data) ? vehRes.data : vehRes.data.vehicles || []);
      setCustomers(Array.isArray(custRes.data) ? custRes.data : custRes.data.customers || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setFormData({
        customer_id: vehicle.customer_id || "",
        vehicle_type: vehicle.vehicle_type || "CAR",
        registration_number: vehicle.registration_number || vehicle.registrationNumber || "",
        make: vehicle.make || "",
        model: vehicle.model || ""
      });
    } else {
      setSelectedVehicle(null);
      setFormData({ customer_id: "", vehicle_type: "CAR", registration_number: "", make: "", model: "" });
    }
    setIsModalOpen(true);
  };

  const handleOpenDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedVehicle) {
        await axios.patch(`https://api.vyraconnect.in/api/admin/vehicles/${selectedVehicle.id}`, formData);
      } else {
        await axios.post(`https://api.vyraconnect.in/api/admin/vehicles`, formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to save vehicle");
    }
  };

  const handleToggleStatus = async (vehicle: Vehicle) => {
    const newStatus = vehicle.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    const actionLabel = newStatus === "BLOCKED" ? "Block 🚫" : "Unblock ✅";
    if (!confirm(`Are you sure you want to ${actionLabel} this vehicle?`)) return;

    try {
      await axios.patch(`https://api.vyraconnect.in/api/admin/vehicles/${vehicle.id}/status`, {
        status: newStatus
      });
      fetchData();
      if (selectedVehicle && selectedVehicle.id === vehicle.id) {
        setSelectedVehicle({ ...selectedVehicle, status: newStatus });
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update vehicle status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete 🗑️ this vehicle? This action cannot be undone.")) return;
    try {
      await axios.delete(`https://api.vyraconnect.in/api/admin/vehicles/${id}`);
      fetchData();
      setIsDetailsOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete vehicle");
    }
  };

  const getVehicleEmoji = (type: string) => {
    if (!type) return "🚗";
    const t = type.toUpperCase();
    if (t.includes("BIKE") || t.includes("MOTOR")) return "🏍️";
    if (t.includes("TRUCK")) return "🚚";
    if (t.includes("BUS")) return "🚌";
    return "🚗";
  };

  // Filtered vehicle list
  const filteredVehicles = vehicles.filter(v => {
    const reg = (v.registration_number || v.registrationNumber || "").toLowerCase();
    const make = (v.make || "").toLowerCase();
    const model = (v.model || "").toLowerCase();
    const owner = customers.find(c => c.id === v.customer_id);
    const ownerName = (owner?.full_name || owner?.name || "").toLowerCase();
    const ownerMobile = (owner?.mobile || "").toLowerCase();

    const matchesSearch =
      reg.includes(searchTerm.toLowerCase()) ||
      make.includes(searchTerm.toLowerCase()) ||
      model.includes(searchTerm.toLowerCase()) ||
      ownerName.includes(searchTerm.toLowerCase()) ||
      ownerMobile.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && v.status === "ACTIVE") ||
      (statusFilter === "BLOCKED" && v.status === "BLOCKED");

    return matchesSearch && matchesStatus;
  });

  const activeCount = vehicles.filter(v => v.status === "ACTIVE").length;
  const blockedCount = vehicles.filter(v => v.status === "BLOCKED").length;

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-slate-500 space-y-3">
        <div className="text-4xl animate-bounce">⏳</div>
        <div className="text-lg font-bold">Loading Registered Fleet...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🚘</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Vehicle Management</h1>
          </div>
          <p className="text-slate-500 font-medium text-xs sm:text-sm mt-1">
            Connected cars, two-wheelers, trucks, and license plate registrations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => handleOpenModal()}
            className="flex-1 md:flex-initial bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl font-black text-sm shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            ✨ Register Vehicle
          </button>
        </div>
      </div>

      {/* Modern Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="🔍 Search reg no, make, model, owner..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all uppercase placeholder:normal-case"
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
            All ({vehicles.length})
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

      {/* Vehicles Grid with Left-Side Color Bar and Red/Light-Green Theming */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map(vehicle => {
            const isBlocked = vehicle.status === "BLOCKED";
            const owner = customers.find(c => c.id === vehicle.customer_id);
            const vEmoji = getVehicleEmoji(vehicle.vehicle_type);

            return (
              <div
                key={vehicle.id}
                className={`rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between border-l-[6px] ${
                  isBlocked
                    ? "border-l-red-500 bg-red-50/50 border border-red-200 hover:border-red-300"
                    : "border-l-emerald-500 bg-emerald-50/20 border border-emerald-100 hover:border-emerald-300"
                }`}
              >
                <div>
                  {/* Top Row: Vehicle Icon + Reg No + Status Badge */}
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shadow-sm ${
                          isBlocked
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-emerald-100 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        {isBlocked ? "🚫" : vEmoji}
                      </div>
                      <div>
                        <h3
                          className={`font-black text-lg font-mono tracking-tight line-clamp-1 ${
                            isBlocked ? "text-red-950" : "text-slate-900"
                          }`}
                        >
                          {vehicle.registration_number || vehicle.registrationNumber || "NO REG"}
                        </h3>
                        <p
                          className={`text-xs font-bold uppercase tracking-wider ${
                            isBlocked ? "text-red-600" : "text-slate-400"
                          }`}
                        >
                          {vehicle.make} {vehicle.model}
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

                  {/* Registered Owner Box */}
                  <div
                    className={`space-y-1.5 mb-5 p-3 rounded-2xl border text-sm ${
                      isBlocked
                        ? "bg-red-100/60 border-red-200/80 text-red-950"
                        : "bg-white/80 border-slate-100 text-slate-700"
                    }`}
                  >
                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Owner Linked</p>
                    <div className="flex items-center justify-between">
                      <span className={`font-black text-sm truncate ${isBlocked ? "text-red-900" : "text-slate-800"}`}>
                        👤 {owner ? owner.full_name || owner.mobile : "No Owner Assigned"}
                      </span>
                      {owner?.mobile && (
                        <span className="text-xs font-mono font-bold text-slate-500 ml-2">
                          {owner.mobile}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons (Clean Web App Ergonomics) */}
                <div
                  className={`flex items-center gap-2 pt-3 border-t ${
                    isBlocked ? "border-red-200" : "border-slate-100"
                  }`}
                >
                  <button
                    onClick={() => handleOpenDetails(vehicle)}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm ${
                      isBlocked
                        ? "bg-white hover:bg-red-100 text-red-800 border border-red-200"
                        : "bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    📄 Details
                  </button>

                  <button
                    onClick={() => handleOpenModal(vehicle)}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm ${
                      isBlocked
                        ? "bg-red-100 hover:bg-red-200 text-red-900 border border-red-300"
                        : "bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200"
                    }`}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => handleToggleStatus(vehicle)}
                    title={isBlocked ? "Unblock vehicle" : "Block vehicle"}
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
            <p className="text-5xl mb-3">🚷</p>
            <h3 className="text-lg font-black text-slate-800">No Vehicles Found</h3>
            <p className="text-slate-400 text-xs mt-1">Try adjusting your search query or status filter.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {isDetailsOpen && selectedVehicle && (
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
                selectedVehicle.status === "BLOCKED"
                  ? "bg-gradient-to-br from-red-800 via-rose-900 to-red-950"
                  : "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
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
                  {selectedVehicle.status === "BLOCKED" ? "🚫" : getVehicleEmoji(selectedVehicle.vehicle_type)}
                </div>
                <div>
                  <h2 className="text-2xl font-black font-mono">
                    {selectedVehicle.registration_number || selectedVehicle.registrationNumber || "NO REG"}
                  </h2>
                  <p className="text-white/70 font-bold uppercase text-xs tracking-wider mt-0.5">
                    {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.vehicle_type})
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-black border ${
                      selectedVehicle.status === "BLOCKED"
                        ? "bg-red-500/30 text-red-200 border-red-500/40"
                        : "bg-emerald-500/30 text-emerald-200 border-emerald-500/40"
                    }`}
                  >
                    {selectedVehicle.status === "BLOCKED" ? "🚫 Vehicle Blocked" : "✅ Registration Active"}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 bg-slate-50">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className="text-3xl">👤</div>
                <div className="truncate">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-0.5">Linked Owner</p>
                  <p className="font-black text-slate-800 text-base truncate">
                    {(() => {
                      const owner = customers.find(c => c.id === selectedVehicle.customer_id);
                      return owner ? owner.full_name || owner.mobile : "No Owner Assigned";
                    })()}
                  </p>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    Customer ID: {selectedVehicle.customer_id || "None"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center gap-3">
                <button
                  onClick={() => {
                    setIsDetailsOpen(false);
                    handleOpenModal(selectedVehicle);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors"
                >
                  ✏️ Edit Vehicle
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(selectedVehicle)}
                    className={`px-4 py-2.5 font-bold rounded-xl text-xs transition-colors ${
                      selectedVehicle.status === "ACTIVE"
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    }`}
                  >
                    {selectedVehicle.status === "ACTIVE" ? "🚫 Block Vehicle" : "✅ Unblock Vehicle"}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedVehicle.id)}
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

      {/* Register/Edit Modal */}
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
                  {selectedVehicle ? "✏️ Edit Vehicle Information" : "✨ Register New Vehicle"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✖
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    🔢 License Plate / Reg Number
                  </label>
                  <input
                    type="text"
                    value={formData.registration_number}
                    onChange={e => setFormData({ ...formData, registration_number: e.target.value.toUpperCase() })}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-black uppercase focus:border-blue-500 focus:ring-0 outline-none transition-colors"
                    required
                    placeholder="e.g. KL-07-CD-1234"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      🏭 Brand / Make
                    </label>
                    <input
                      type="text"
                      value={formData.make}
                      onChange={e => setFormData({ ...formData, make: e.target.value })}
                      placeholder="e.g. Hyundai"
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-blue-500 focus:ring-0 outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      🏷️ Model
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={e => setFormData({ ...formData, model: e.target.value })}
                      placeholder="e.g. Creta"
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-blue-500 focus:ring-0 outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    🚙 Vehicle Category
                  </label>
                  <select
                    value={formData.vehicle_type}
                    onChange={e => setFormData({ ...formData, vehicle_type: e.target.value })}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-blue-500 focus:ring-0 outline-none transition-colors bg-white"
                    required
                  >
                    <option value="CAR">🚗 Four Wheeler / Car</option>
                    <option value="BIKE">🏍️ Two Wheeler / Bike</option>
                    <option value="TRUCK">🚚 Commercial / Truck</option>
                    <option value="BUS">🚌 Bus / Van</option>
                    <option value="OTHER">🚜 Other Machinery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    👤 Registered Owner
                  </label>
                  <div className="border-2 border-slate-200 rounded-2xl overflow-hidden bg-slate-50 max-h-40 overflow-y-auto divide-y divide-slate-100">
                    {customers.map(c => (
                      <label
                        key={c.id}
                        className={`flex items-center p-3 cursor-pointer transition-colors ${
                          formData.customer_id === c.id ? "bg-blue-50 font-black" : "hover:bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="owner"
                          value={c.id}
                          checked={formData.customer_id === c.id}
                          onChange={e => setFormData({ ...formData, customer_id: e.target.value })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          required
                        />
                        <div className="ml-3 truncate">
                          <p className="text-xs font-black text-slate-800 truncate">{c.full_name || "Unnamed"}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{c.mobile || c.email}</p>
                        </div>
                      </label>
                    ))}
                    {customers.length === 0 && (
                      <div className="p-4 text-xs text-slate-400 text-center font-bold">No customers available.</div>
                    )}
                  </div>
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
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all text-xs"
                >
                  {selectedVehicle ? "💾 Save Changes" : "🚀 Register Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
