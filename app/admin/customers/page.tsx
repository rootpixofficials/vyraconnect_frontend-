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
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    mobile: '',
    email: ''
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
      setEditingId(customer.id);
      setFormData({
        full_name: customer.full_name || customer.name || '',
        mobile: customer.mobile || '',
        email: customer.email || ''
      });
    } else {
      setEditingId(null);
      setFormData({ full_name: '', mobile: '', email: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.patch(`https://api.vyraconnect.in/api/admin/customers/${editingId}`, formData);
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
    const newStatus = customer.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    if (!confirm(`Are you sure you want to ${newStatus === 'BLOCKED' ? 'block' : 'unblock'} this customer?`)) return;
    
    try {
      await axios.patch(`https://api.vyraconnect.in/api/admin/customers/${customer.id}/status`, { status: newStatus });
      fetchCustomers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer? This action cannot be undone.")) return;
    try {
      await axios.delete(`https://api.vyraconnect.in/api/admin/customers/${id}`);
      fetchCustomers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete customer");
    }
  };

  if (loading) {
    return <div className="p-6">Loading customers...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
        >
          + Add Customer
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600 text-sm">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Mobile</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{customer.full_name || customer.name || "Unknown"}</td>
                    <td className="p-4 text-gray-600">{customer.mobile}</td>
                    <td className="p-4 text-gray-600">{customer.email || "-"}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        customer.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.status || "Unknown"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleOpenModal(customer)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium px-2 py-1 bg-indigo-50 hover:bg-indigo-100 rounded">Edit</button>
                      <button onClick={() => handleToggleStatus(customer)} className={`${customer.status === 'ACTIVE' ? 'text-orange-600 bg-orange-50 hover:bg-orange-100' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'} text-sm font-medium px-2 py-1 rounded`}>
                        {customer.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                      </button>
                      <button onClick={() => handleDelete(customer.id)} className="text-red-600 hover:text-red-900 text-sm font-medium px-2 py-1 bg-red-50 hover:bg-red-100 rounded">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No customers found.</td>
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
                <h3 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Customer' : 'Add New Customer'}</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input type="text" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">{editingId ? 'Save Changes' : 'Create Customer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
