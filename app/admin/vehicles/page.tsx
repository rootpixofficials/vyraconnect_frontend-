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
  makeModel?: string;
  status: string;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
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
      setEditingId(vehicle.id);
      setFormData({
        customer_id: vehicle.customer_id || '',
        vehicle_type: vehicle.vehicle_type || 'CAR',
        registration_number: vehicle.registration_number || vehicle.registrationNumber || '',
        make: vehicle.make || '',
        model: vehicle.model || ''
      });
    } else {
      setEditingId(null);
      setFormData({ customer_id: '', vehicle_type: 'CAR', registration_number: '', make: '', model: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.patch(`https://api.vyraconnect.in/api/admin/vehicles/${editingId}`, formData);
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
    if (!confirm(`Are you sure you want to ${newStatus === 'BLOCKED' ? 'block' : 'unblock'} this vehicle?`)) return;
    
    try {
      await axios.patch(`https://api.vyraconnect.in/api/admin/vehicles/${vehicle.id}/status`, { status: newStatus });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle? This action cannot be undone.")) return;
    try {
      await axios.delete(`https://api.vyraconnect.in/api/admin/vehicles/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete vehicle");
    }
  };

  if (loading) {
    return <div className="p-6">Loading vehicles...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vehicle Management</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
        >
          + Add Vehicle
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600 text-sm">
                <th className="p-4 font-semibold">Reg. Number</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Make</th>
                <th className="p-4 font-semibold">Model</th>
                <th className="p-4 font-semibold">Owner</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => {
                  const owner = customers.find(c => c.id === vehicle.customer_id);
                  return (
                    <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-900">{vehicle.registration_number || vehicle.registrationNumber || "-"}</td>
                      <td className="p-4 text-gray-600">{vehicle.vehicle_type}</td>
                      <td className="p-4 text-gray-600">{vehicle.make || "-"}</td>
                      <td className="p-4 text-gray-600">{vehicle.model || "-"}</td>
                      <td className="p-4 text-gray-600">{owner ? owner.full_name : "Unassigned"}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          vehicle.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {vehicle.status || "Unknown"}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleOpenModal(vehicle)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium px-2 py-1 bg-indigo-50 hover:bg-indigo-100 rounded">Edit</button>
                        <button onClick={() => handleToggleStatus(vehicle)} className={`${vehicle.status === 'ACTIVE' ? 'text-orange-600 bg-orange-50 hover:bg-orange-100' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'} text-sm font-medium px-2 py-1 rounded`}>
                          {vehicle.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                        </button>
                        <button onClick={() => handleDelete(vehicle.id)} className="text-red-600 hover:text-red-900 text-sm font-medium px-2 py-1 bg-red-50 hover:bg-red-100 rounded">Delete</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">No vehicles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                  <input type="text" value={formData.registration_number} onChange={e => setFormData({...formData, registration_number: e.target.value.toUpperCase()})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none uppercase" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Make (Brand)</label>
                    <input type="text" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} placeholder="e.g. Toyota" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} placeholder="e.g. Camry" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <select value={formData.vehicle_type} onChange={e => setFormData({...formData, vehicle_type: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" required>
                    <option value="CAR">Car</option>
                    <option value="BIKE">Bike</option>
                    <option value="TRUCK">Truck</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Customer</label>
                  <select value={formData.customer_id} onChange={e => setFormData({...formData, customer_id: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" required>
                    <option value="">Select a customer...</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.full_name || c.mobile}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">{editingId ? 'Save Changes' : 'Add Vehicle'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
