"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'qrs' | 'customers' | 'vehicles'>('dashboard');
  
  const [metrics, setMetrics] = useState<any>(null);
  const [qrsData, setQrsData] = useState<any[]>([]);
  const [customersData, setCustomersData] = useState<any[]>([]);
  const [vehiclesData, setVehiclesData] = useState<any[]>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [metricsRes, qrsRes, custRes, vehRes] = await Promise.all([
        axios.get("https://api.vyraconnect.in/api/admin/reports/dashboard"),
        axios.get("https://api.vyraconnect.in/api/admin/qr/list"),
        axios.get("https://api.vyraconnect.in/api/admin/customers"),
        axios.get("https://api.vyraconnect.in/api/admin/vehicles")
      ]);
      
      setMetrics(metricsRes.data);
      setQrsData(qrsRes.data?.qrs || qrsRes.data?.data || (Array.isArray(qrsRes.data) ? qrsRes.data : []));
      setCustomersData(custRes.data?.customers || custRes.data?.data || (Array.isArray(custRes.data) ? custRes.data : []));
      setVehiclesData(vehRes.data?.vehicles || vehRes.data?.data || (Array.isArray(vehRes.data) ? vehRes.data : []));
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert("No data available to download.");
      return;
    }
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row: any) => 
      Object.values(row).map(val => {
        if (typeof val === 'object') return '""';
        return `"${String(val || '').replace(/"/g, '""')}"`;
      }).join(",")
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printArea = () => {
    window.print();
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center font-bold text-gray-500">Loading Detailed Reports...</div>;
  }

  return (
    <div className="space-y-6 p-6 pb-20 max-w-7xl mx-auto" id="report-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-4">
        <h2 className="text-3xl font-black text-gray-800 tracking-tight">Detailed Analytics & Reports</h2>
        <div className="flex space-x-2">
          <button onClick={printArea} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 print:hidden">Print Report</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto print:hidden border-b pb-2">
        {['dashboard', 'customers', 'vehicles', 'qrs'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-t-lg font-bold capitalize transition-colors ${activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {tab === 'dashboard' ? 'Overview Stats' : `${tab} Data`}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && metrics && (
        <div className="space-y-8 animate-in fade-in">
          {/* Main QR Analytics */}
          <section>
            <h3 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-indigo-500 pl-3">QR Sales & Status Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Total Tags Sold</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{metrics.metrics.totalSold}</p>
                <p className="text-xs text-slate-500 mt-1">Assigned to customers</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active Tags</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{metrics.metrics.active}</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Active</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{metrics.metrics.assignedPending}</p>
                <p className="text-xs text-slate-500 mt-1">Assigned but not activated</p>
              </div>
              <div className="bg-red-50 border border-red-100 p-5 rounded-xl">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Blocked Tags</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{metrics.metrics.blocked}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available (Generated Not Assigned)</p>
                  <p className="text-3xl font-black text-slate-900 mt-2">{metrics.metrics.available}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Generated</p>
                  <p className="text-xl font-bold text-slate-700 mt-1">{metrics.metrics.totalQRs}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-5 rounded-xl flex justify-between items-center shadow-lg">
                <div>
                  <p className="text-xs font-bold text-cyan-100 uppercase tracking-wider">Most Sold Batch</p>
                  <p className="text-2xl font-black mt-2">{metrics.topBatch?.batch_code || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-cyan-100 uppercase tracking-wider">Batch Sales</p>
                  <p className="text-xl font-bold mt-1">{metrics.topBatch?.sold_count || 0} QRs</p>
                </div>
              </div>
            </div>
          </section>

          {/* Customer & Vehicle Analytics */}
          <section>
            <h3 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-blue-500 pl-3">Platform Growth</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2 mb-3">Customer Base</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-4xl font-black text-slate-800">{metrics.metrics.totalCustomers}</p>
                    <p className="text-sm text-gray-500 mt-1">Total Registered</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">{metrics.metrics.activeCustomers} Active</p>
                    <p className="text-sm font-bold text-gray-400">{metrics.metrics.inactiveCustomers} Inactive</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2 mb-3">Vehicle Fleet</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-4xl font-black text-slate-800">{metrics.metrics.totalVehicles}</p>
                    <p className="text-sm text-gray-500 mt-1">Total Registered Vehicles</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Data Tables */}
      {['customers', 'vehicles', 'qrs'].includes(activeTab) && (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden animate-in fade-in">
          <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-gray-800 capitalize">{activeTab} Detailed Data</h3>
            <button onClick={() => downloadExcel(activeTab === 'customers' ? customersData : activeTab === 'vehicles' ? vehiclesData : qrsData, `${activeTab}_report`)} className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-bold rounded shadow-sm hover:bg-emerald-700 print:hidden">Export Excel Data</button>
          </div>
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-gray-100 text-gray-600 sticky top-0 shadow-sm">
                <tr>
                  {activeTab === 'customers' && ['ID', 'Name', 'Mobile', 'Email', 'Status', 'Registered On'].map(h => <th key={h} className="p-3 font-semibold">{h}</th>)}
                  {activeTab === 'vehicles' && ['Reg Number', 'Type', 'Make', 'Model', 'Status', 'Added On'].map(h => <th key={h} className="p-3 font-semibold">{h}</th>)}
                  {activeTab === 'qrs' && ['Serial', 'Status', 'Product', 'Customer ID', 'Generated On'].map(h => <th key={h} className="p-3 font-semibold">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeTab === 'customers' && customersData.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs">{c.id.substring(0,8)}</td>
                    <td className="p-3 font-bold">{c.full_name || 'N/A'}</td>
                    <td className="p-3">{c.mobile || 'N/A'}</td>
                    <td className="p-3">{c.email || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{c.status}</span>
                    </td>
                    <td className="p-3">{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {activeTab === 'vehicles' && vehiclesData.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold">{v.registration_number}</td>
                    <td className="p-3">{v.vehicle_type}</td>
                    <td className="p-3">{v.make || 'N/A'}</td>
                    <td className="p-3">{v.model || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${v.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{v.status}</span>
                    </td>
                    <td className="p-3">{new Date(v.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {activeTab === 'qrs' && qrsData.map(q => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold">{q.qr_serial}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold 
                        ${q.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 
                          q.status === 'BLOCKED' ? 'bg-red-100 text-red-700' : 
                          q.status === 'AVAILABLE' ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-700'}`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3">{q.product_type}</td>
                    <td className="p-3 font-mono text-xs">{q.customer_id ? q.customer_id.substring(0,8) : 'Not Assigned'}</td>
                    <td className="p-3">{new Date(q.generated_at || q.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(activeTab === 'customers' && customersData.length === 0) ||
             (activeTab === 'vehicles' && vehiclesData.length === 0) ||
             (activeTab === 'qrs' && qrsData.length === 0) ? (
              <div className="p-8 text-center text-gray-500">No data found.</div>
             ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
