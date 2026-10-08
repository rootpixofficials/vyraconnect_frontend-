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
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
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
      setSelectedCustomer(customer);
      setFormData({
        full_name: customer.full_name || customer.name || '',
        mobile: customer.mobile || '',
        email: customer.email || ''
      });
    } else {
      setSelectedCustomer(null);
      setFormData({ full_name: '', mobile: '', email: '' });
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
    const newStatus = customer.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    if (!confirm(`Are you sure you want to ${newStatus === 'BLOCKED' ? 'block 🚫' : 'unblock ✅'} this customer?`)) return;
    try {
      await axios.patch(`https://api.vyraconnect.in/api/admin/customers/${customer.id}/status`, { status: newStatus });
      fetchCustomers();
      setIsDetailsOpen(false);
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

  if (loading) {
    return <div className="p-10 flex justify-center text-xl font-bold text-gray-500">⏳ Loading Customers...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">👥 Customer Hub</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your platform's users seamlessly.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all transform hover:scale-105 active:scale-95">
          ✨ Add New Customer
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.length > 0 ? customers.map(customer => (
          <div key={customer.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-full h-1.5 ${customer.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl border border-slate-200">
                  🧑‍💻
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{customer.full_name || customer.name || "Unknown"}</h3>
                  <p className="text-xs font-mono text-slate-500">🆔 {customer.id.substring(0,8)}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${customer.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                {customer.status === 'ACTIVE' ? '✅ ACTIVE' : '🚫 BLOCKED'}
              </span>
            </div>
            <div className="space-y-2 mb-6 text-sm text-slate-600">
              <p className="flex items-center">📱 <span className="ml-2 font-medium">{customer.mobile}</span></p>
              <p className="flex items-center truncate">📧 <span className="ml-2">{customer.email || "No Email"}</span></p>
            </div>
            <div className="flex space-x-2 pt-4 border-t border-slate-50">
              <button onClick={() => handleOpenDetails(customer)} className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 rounded-xl transition-colors">
                📄 Details
              </button>
              <button onClick={() => handleOpenModal(customer)} className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2 rounded-xl transition-colors">
                ✏️ Edit
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
            <p className="text-4xl mb-4">📭</p>
            <h3 className="text-xl font-bold text-slate-700">No Customers Found</h3>
            <p className="text-slate-500 mt-2">Click the button above to add your first customer.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {isDetailsOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDetailsOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-white relative">
              <button onClick={() => setIsDetailsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl">✖</button>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-4xl border border-white/20 shadow-inner">
                  👤
                </div>
                <div>
                  <h2 className="text-2xl font-black">{selectedCustomer.full_name || selectedCustomer.name || "Unknown User"}</h2>
                  <p className="text-slate-300 font-mono text-sm mt-1">ID: {selectedCustomer.id}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-lg text-xs font-black ${selectedCustomer.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                    {selectedCustomer.status === 'ACTIVE' ? '✅ Account Active' : '🚫 Account Suspended'}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-8 space-y-6 bg-slate-50">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">📱 Mobile Number</p>
                  <p className="font-bold text-slate-700">{selectedCustomer.mobile}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">📧 Email Address</p>
                  <p className="font-bold text-slate-700 truncate">{selectedCustomer.email || "N/A"}</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-200 flex justify-between items-center gap-3">
                <button onClick={() => { setIsDetailsOpen(false); handleOpenModal(selectedCustomer); }} className="px-5 py-2.5 bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 transition-colors">
                  ✏️ Edit Profile
                </button>
                <div className="flex gap-2">
                  <button onClick={() => handleToggleStatus(selectedCustomer)} className={`px-5 py-2.5 font-bold rounded-xl transition-colors ${selectedCustomer.status === 'ACTIVE' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
                    {selectedCustomer.status === 'ACTIVE' ? '🚫 Suspend' : '✅ Activate'}
                  </button>
                  <button onClick={() => handleDelete(selectedCustomer.id)} className="px-5 py-2.5 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200 transition-colors">
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
                <h3 className="text-xl font-black text-slate-800">{selectedCustomer ? '✏️ Edit Customer Profile' : '✨ New Customer Profile'}</h3>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">👤 Full Name</label>
                  <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-0 outline-none transition-colors" required placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">📱 Mobile Number</label>
                  <input type="text" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-0 outline-none transition-colors" required placeholder="+1 234 567 8900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">📧 Email Address</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-0 outline-none transition-colors" placeholder="john@example.com" />
                </div>
              </div>
              <div className="p-6 pt-0 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-slate-700 font-bold hover:bg-slate-200 transition-colors">✖ Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">{selectedCustomer ? '💾 Save Changes' : '🚀 Create Profile'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
