"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'vehicles' | 'qrs'>('dashboard');
  
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
        return \`"\${String(val || '').replace(/"/g, '""')}"\`;
      }).join(",")
    );
    const csv = [headers, ...rows].join("\\n");
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", \`\${filename}.csv\`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="p-10 flex flex-col items-center justify-center text-gray-500 space-y-3">
      <div className="text-4xl animate-bounce">📊</div>
      <div className="text-xl font-bold">Crunching Numbers...</div>
    </div>;
  }

  return (
    <div className="p-6 pb-20 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">📈 Platform Analytics</h1>
          <p className="text-slate-500 font-medium mt-1">Detailed reports, statistics, and data exports.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => window.print()} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors shadow-sm flex items-center print:hidden">
            🖨️ Print Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto print:hidden bg-slate-100 p-2 rounded-2xl">
        <button onClick={() => setActiveTab('dashboard')} className={\`px-6 py-2.5 rounded-xl font-bold transition-all \${activeTab === 'dashboard' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}>📊 Overview</button>
        <button onClick={() => setActiveTab('customers')} className={\`px-6 py-2.5 rounded-xl font-bold transition-all \${activeTab === 'customers' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}>👥 Customers</button>
        <button onClick={() => setActiveTab('vehicles')} className={\`px-6 py-2.5 rounded-xl font-bold transition-all \${activeTab === 'vehicles' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}>🚘 Vehicles</button>
        <button onClick={() => setActiveTab('qrs')} className={\`px-6 py-2.5 rounded-xl font-bold transition-all \${activeTab === 'qrs' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}>🔳 QR Codes</button>
      </div>

      {activeTab === 'dashboard' && metrics && (
        <div className="space-y-8 animate-in fade-in">
          {/* Main QR Analytics */}
          <section>
            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center">🔳 <span className="ml-2">QR Lifecycle Metrics</span></h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 p-6 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Total Sold 🏷️</p>
                <p className="text-4xl font-black text-slate-900">{metrics.metrics.totalSold}</p>
                <p className="text-xs text-indigo-600/70 mt-2 font-medium">Assigned to accounts</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 p-6 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Active Tags ✅</p>
                <p className="text-4xl font-black text-slate-900">{metrics.metrics.active}</p>
                <p className="text-xs text-emerald-600/70 mt-2 font-medium">Ready for scans</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 p-6 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Pending Active ⏳</p>
                <p className="text-4xl font-black text-slate-900">{metrics.metrics.assignedPending}</p>
                <p className="text-xs text-amber-600/70 mt-2 font-medium">Awaiting activation</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 p-6 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Blocked Tags 🚫</p>
                <p className="text-4xl font-black text-slate-900">{metrics.metrics.blocked}</p>
                <p className="text-xs text-red-600/70 mt-2 font-medium">Suspended</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex justify-between items-center relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-8xl opacity-5">📦</div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Inventory Available</p>
                  <p className="text-4xl font-black text-slate-800">{metrics.metrics.available}</p>
                  <p className="text-sm font-bold text-slate-400 mt-2">Total Generated: <span className="text-slate-600">{metrics.metrics.totalQRs}</span></p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-8xl opacity-10">🔥</div>
                <div>
                  <p className="text-xs font-bold text-cyan-200 uppercase tracking-wider mb-2">Top Selling Batch</p>
                  <p className="text-3xl font-black font-mono">{metrics.topBatch?.batch_code || 'N/A'}</p>
                  <p className="text-sm font-bold text-cyan-100 mt-2">Total Sales: <span className="text-white">{metrics.topBatch?.sold_count || 0} QRs</span></p>
                </div>
              </div>
            </div>
          </section>

          {/* Customer & Vehicle Analytics */}
          <section>
            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center">🌐 <span className="ml-2">Platform Growth</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Customers</p>
                  <p className="text-4xl font-black text-slate-800">{metrics.metrics.totalCustomers}</p>
                </div>
                <div className="text-5xl">👥</div>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Vehicles</p>
                  <p className="text-4xl font-black text-slate-800">{metrics.metrics.totalVehicles}</p>
                </div>
                <div className="text-5xl">🚘</div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Data Tables */}
      {['customers', 'vehicles', 'qrs'].includes(activeTab) && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
          <div className="bg-slate-50 p-5 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 capitalize text-lg flex items-center">
              {activeTab === 'customers' ? '👥 ' : activeTab === 'vehicles' ? '🚘 ' : '🔳 '} 
              {activeTab} Data Log
            </h3>
            <button 
              onClick={() => downloadExcel(activeTab === 'customers' ? customersData : activeTab === 'vehicles' ? vehiclesData : qrsData, \`\${activeTab}_report\`)} 
              className="px-4 py-2 bg-emerald-100 text-emerald-800 font-bold rounded-xl shadow-sm hover:bg-emerald-200 transition-colors flex items-center print:hidden"
            >
              📥 Export CSV
            </button>
          </div>
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 shadow-sm z-10">
                <tr>
                  {activeTab === 'customers' && ['ID', 'Name', 'Mobile', 'Email', 'Status', 'Registered'].map(h => <th key={h} className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider border-b">{h}</th>)}
                  {activeTab === 'vehicles' && ['Reg Number', 'Type', 'Make/Model', 'Status', 'Added On'].map(h => <th key={h} className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider border-b">{h}</th>)}
                  {activeTab === 'qrs' && ['Serial', 'Status', 'Product', 'Customer ID', 'Generated'].map(h => <th key={h} className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider border-b">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeTab === 'customers' && customersData.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-500">{c.id.substring(0,8)}</td>
                    <td className="p-4 font-bold text-slate-800">{c.full_name || 'N/A'}</td>
                    <td className="p-4 font-medium text-slate-600">{c.mobile || 'N/A'}</td>
                    <td className="p-4 text-slate-600">{c.email || 'N/A'}</td>
                    <td className="p-4">
                      <span className={\`px-2 py-1 rounded text-[10px] font-black tracking-wide \${c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}\`}>{c.status}</span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm">{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {activeTab === 'vehicles' && vehiclesData.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-black text-slate-800">{v.registration_number || v.registrationNumber || "-"}</td>
                    <td className="p-4 font-medium text-slate-600">{v.vehicle_type}</td>
                    <td className="p-4 font-bold text-slate-700 uppercase">{v.make || '-'} {v.model || ''}</td>
                    <td className="p-4">
                      <span className={\`px-2 py-1 rounded text-[10px] font-black tracking-wide \${v.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}\`}>{v.status}</span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm">{new Date(v.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {activeTab === 'qrs' && qrsData.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-black text-slate-800">{q.qr_serial}</td>
                    <td className="p-4">
                      <span className={\`px-2 py-1 rounded text-[10px] font-black tracking-wide 
                        \${q.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 
                          q.status === 'BLOCKED' ? 'bg-red-100 text-red-700' : 
                          q.status === 'AVAILABLE' ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-200 text-slate-700'}\`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-600">{q.product_type}</td>
                    <td className="p-4 font-mono text-xs text-slate-500">{q.customer_id ? q.customer_id.substring(0,8) : 'Not Assigned'}</td>
                    <td className="p-4 text-slate-500 text-sm">{new Date(q.generated_at || q.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(activeTab === 'customers' && customersData.length === 0) ||
             (activeTab === 'vehicles' && vehiclesData.length === 0) ||
             (activeTab === 'qrs' && qrsData.length === 0) ? (
              <div className="p-16 flex flex-col items-center justify-center text-slate-400">
                <span className="text-4xl mb-3">📭</span>
                <span className="font-bold">No Data Found</span>
              </div>
             ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
