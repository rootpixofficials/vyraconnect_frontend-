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
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  const [formData, setFormData] = useState({
    customer_id: '',
    vehicle_type: 'CAR',
    registration_number: '',
    make: '',
    model: ''
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
        customer_id: vehicle.customer_id || '',
        vehicle_type: vehicle.vehicle_type || 'CAR',
        registration_number: vehicle.registration_number || vehicle.registrationNumber || '',
        make: vehicle.make || '',
        model: vehicle.model || ''
      });
    } else {
      setSelectedVehicle(null);
      setFormData({ customer_id: '', vehicle_type: 'CAR', registration_number: '', make: '', model: '' });
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
    const newStatus = vehicle.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    if (!confirm(`Are you sure you want to ${newStatus === 'BLOCKED' ? 'block 🚫' : 'unblock ✅'} this vehicle?`)) return;
    try {
      await axios.patch(`https://api.vyraconnect.in/api/admin/vehicles/${vehicle.id}/status`, { status: newStatus });
      fetchData();
      setIsDetailsOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update status");
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

  if (loading) {
    return <div className="p-10 flex justify-center text-xl font-bold text-gray-500">⏳ Loading Vehicles...</div>;
  }

  const getVehicleEmoji = (type: string) => {
    if (!type) return '🚗';
    const t = type.toUpperCase();
    if (t.includes('BIKE') || t.includes('MOTOR')) return '🏍️';
    if (t.includes('TRUCK')) return '🚚';
    if (t.includes('BUS')) return '🚌';
    return '🚗';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">🚘 Vehicle Garage</h1>
          <p className="text-slate-500 font-medium mt-1">Manage all registered vehicles and their owners.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all transform hover:scale-105 active:scale-95">
          ✨ Add New Vehicle
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.length > 0 ? vehicles.map(vehicle => {
          const owner = customers.find(c => c.id === vehicle.customer_id);
          const vTypeEmoji = getVehicleEmoji(vehicle.vehicle_type);
          
          return (
            <div key={vehicle.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-full h-1.5 ${vehicle.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl border border-slate-200 shadow-inner">
                    {vTypeEmoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{vehicle.registration_number || vehicle.registrationNumber || "-"}</h3>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">{vehicle.make} {vehicle.model}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${vehicle.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                  {vehicle.status === 'ACTIVE' ? '✅ ACTIVE' : '🚫 BLOCKED'}
                </span>
              </div>
              <div className="space-y-3 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center text-sm">
                  <span className="w-6 text-center">👤</span> 
                  <span className="ml-2 font-bold text-slate-700">{owner ? owner.full_name || owner.mobile : "No Owner Assigned"}</span>
                </div>
              </div>
              <div className="flex space-x-2 pt-2 border-t border-slate-50">
                <button onClick={() => handleOpenDetails(vehicle)} className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 rounded-xl transition-colors">
                  📄 Details
                </button>
                <button onClick={() => handleOpenModal(vehicle)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2 rounded-xl transition-colors">
                  ✏️ Edit
                </button>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
            <p className="text-4xl mb-4">🚷</p>
            <h3 className="text-xl font-bold text-slate-700">No Vehicles Found</h3>
            <p className="text-slate-500 mt-2">Click the button above to register the first vehicle.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {isDetailsOpen && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDetailsOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-white relative">
              <button onClick={() => setIsDetailsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl">✖</button>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-4xl border border-white/20 shadow-inner">
                  {getVehicleEmoji(selectedVehicle.vehicle_type)}
                </div>
                <div>
                  <h2 className="text-2xl font-black">{selectedVehicle.registration_number || selectedVehicle.registrationNumber || "-"}</h2>
                  <p className="text-slate-300 font-bold text-sm mt-1 uppercase tracking-wider">{selectedVehicle.make} {selectedVehicle.model}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-lg text-xs font-black ${selectedVehicle.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                    {selectedVehicle.status === 'ACTIVE' ? '✅ Registration Active' : '🚫 Registration Blocked'}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-8 space-y-6 bg-slate-50">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                <div className="text-3xl">👤</div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Registered Owner</p>
                  <p className="font-black text-slate-700 text-lg">
                    {(() => {
                      const owner = customers.find(c => c.id === selectedVehicle.customer_id);
                      return owner ? owner.full_name || owner.mobile : 'No Owner Assigned';
                    })()}
                  </p>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">ID: {selectedVehicle.customer_id || 'N/A'}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center gap-3">
                <button onClick={() => { setIsDetailsOpen(false); handleOpenModal(selectedVehicle); }} className="px-5 py-2.5 bg-blue-100 text-blue-700 font-bold rounded-xl hover:bg-blue-200 transition-colors">
                  ✏️ Edit Vehicle
                </button>
                <div className="flex gap-2">
                  <button onClick={() => handleToggleStatus(selectedVehicle)} className={`px-5 py-2.5 font-bold rounded-xl transition-colors ${selectedVehicle.status === 'ACTIVE' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
                    {selectedVehicle.status === 'ACTIVE' ? '🚫 Block' : '✅ Unblock'}
                  </button>
                  <button onClick={() => handleDelete(selectedVehicle.id)} className="px-5 py-2.5 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200 transition-colors">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="bg-slate-50 p-6 border-b border-slate-100">
                <h3 className="text-xl font-black text-slate-800">{selectedVehicle ? '✏️ Edit Vehicle' : '✨ Register Vehicle'}</h3>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">🔢 Registration Number</label>
                  <input type="text" value={formData.registration_number} onChange={e => setFormData({...formData, registration_number: e.target.value.toUpperCase()})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:ring-0 outline-none uppercase font-mono font-bold" required placeholder="KA-01-AB-1234" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">🏭 Make (Brand)</label>
                    <input type="text" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} placeholder="Toyota" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:ring-0 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">🏷️ Model</label>
                    <input type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} placeholder="Camry" className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:ring-0 outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">🚙 Vehicle Type</label>
                  <select value={formData.vehicle_type} onChange={e => setFormData({...formData, vehicle_type: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:ring-0 outline-none" required>
                    <option value="CAR">🚗 Car</option>
                    <option value="BIKE">🏍️ Bike</option>
                    <option value="TRUCK">🚚 Truck</option>
                    <option value="OTHER">🚜 Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">👤 Assign Owner</label>
                  <div className="border-2 border-slate-200 rounded-xl overflow-hidden bg-white max-h-40 overflow-y-auto">
                    {customers.map(c => (
                      <label key={c.id} className={`flex items-center p-3 cursor-pointer transition-colors border-b last:border-b-0 ${formData.customer_id === c.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                        <input type="radio" name="owner" value={c.id} checked={formData.customer_id === c.id} onChange={(e) => setFormData({...formData, customer_id: e.target.value})} className="h-4 w-4 text-blue-600 focus:ring-blue-500" required />
                        <div className="ml-3">
                          <p className="text-sm font-bold text-slate-800">{c.full_name || 'No Name'}</p>
                          <p className="text-xs text-slate-500 font-mono">{c.mobile || c.email}</p>
                        </div>
                      </label>
                    ))}
                    {customers.length === 0 && <div className="p-4 text-sm text-slate-500 text-center">No customers available.</div>}
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-slate-700 font-bold hover:bg-slate-200 transition-colors">✖ Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">{selectedVehicle ? '💾 Save' : '🚀 Register'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
