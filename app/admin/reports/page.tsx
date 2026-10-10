"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { exportSingleSheetToExcel, exportMultiSheetToExcel } from "@/lib/excelExport";

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

  // Professional Excel Data Formatters
  const formatCustomersForExcel = () => {
    return customersData.map(c => ({
      "Customer ID": c.id,
      "Full Name": c.full_name || c.name || "N/A",
      "Mobile Number": c.mobile || "N/A",
      "Email Address": c.email || "N/A",
      "Account Status": c.status || "ACTIVE",
      "Registered Date": c.created_at ? new Date(c.created_at).toLocaleDateString() : "N/A"
    }));
  };

  const formatVehiclesForExcel = () => {
    return vehiclesData.map(v => {
      const owner = customersData.find(c => c.id === v.customer_id);
      return {
        "Vehicle ID": v.id,
        "Registration Number": v.registration_number || v.registrationNumber || "N/A",
        "Vehicle Type": v.vehicle_type || "CAR",
        "Make / Brand": v.make || "N/A",
        "Model": v.model || "N/A",
        "Status": v.status || "ACTIVE",
        "Owner ID": v.customer_id || "Unassigned",
        "Owner Name": owner ? owner.full_name || owner.mobile : "Unassigned",
        "Registered Date": v.created_at ? new Date(v.created_at).toLocaleDateString() : "N/A"
      };
    });
  };

  const formatQrsForExcel = () => {
    return qrsData.map(q => {
      const customer = customersData.find(c => c.id === q.customer_id);
      return {
        "QR Serial": q.qr_serial,
        "Product Type": q.product_type || "V",
        "Status": q.status || "AVAILABLE",
        "Assigned Customer ID": q.customer_id || "Not Assigned",
        "Customer Name": customer ? customer.full_name || customer.name : "Not Assigned",
        "Customer Mobile": customer ? customer.mobile : "N/A",
        "Batch ID": q.batch_id || "N/A",
        "Generated Date": q.generated_at || q.created_at ? new Date(q.generated_at || q.created_at).toLocaleDateString() : "N/A",
        "Activated Date": q.activated_at ? new Date(q.activated_at).toLocaleDateString() : "N/A",
        "Expiry Date": q.expires_at ? new Date(q.expires_at).toLocaleDateString() : "N/A",
        "Blocked Reason": q.blocked_reason || "None",
        "Public Scan URL": q.qr_url || `https://vyraconnect.in/scan?token=${q.qr_token || ''}`
      };
    });
  };

  // Export Individual Tab to Excel (.xlsx)
  const handleExportTabExcel = (tab: string) => {
    if (tab === 'customers') {
      exportSingleSheetToExcel(formatCustomersForExcel(), 'Vyra_Customers_Report', 'Customers');
    } else if (tab === 'vehicles') {
      exportSingleSheetToExcel(formatVehiclesForExcel(), 'Vyra_Vehicles_Report', 'Vehicles');
    } else if (tab === 'qrs') {
      exportSingleSheetToExcel(formatQrsForExcel(), 'Vyra_QR_Codes_Report', 'QR_Codes');
    }
  };

  // Export Complete Multi-Sheet Master Excel Workbook
  const handleExportMasterExcel = () => {
    const summarySheet = metrics ? [
      { Metric: "Total QR Tags Generated", Value: metrics.metrics.totalQRs },
      { Metric: "Total Sold / Assigned", Value: metrics.metrics.totalSold },
      { Metric: "Available Inventory", Value: metrics.metrics.available },
      { Metric: "Active Scannable QRs", Value: metrics.metrics.active },
      { Metric: "Pending Activation", Value: metrics.metrics.assignedPending },
      { Metric: "Blocked QR Tags", Value: metrics.metrics.blocked },
      { Metric: "Total Registered Customers", Value: metrics.metrics.totalCustomers },
      { Metric: "Total Registered Vehicles", Value: metrics.metrics.totalVehicles },
      { Metric: "Top Performing Batch", Value: metrics.topBatch?.batch_code || "N/A" },
      { Metric: "Top Batch QR Sales", Value: metrics.topBatch?.sold_count || 0 }
    ] : [];

    exportMultiSheetToExcel([
      { name: 'Executive Summary', data: summarySheet },
      { name: 'Customer Accounts', data: formatCustomersForExcel() },
      { name: 'Vehicle Garage', data: formatVehiclesForExcel() },
      { name: 'QR Inventory', data: formatQrsForExcel() }
    ], `Vyra_Connect_Master_Report_${new Date().toISOString().slice(0,10)}`);
  };

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-slate-500 space-y-3">
        <div className="text-4xl animate-bounce">📊</div>
        <div className="text-xl font-bold">Crunching Platform Metrics...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 pb-20 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">📈</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Platform Analytics & Reports</h1>
          </div>
          <p className="text-slate-500 font-medium text-xs sm:text-sm mt-1">
            Detailed performance reports, Excel spreadsheet downloads, and printable records.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleExportMasterExcel}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 print:hidden"
          >
            <span>📥</span> Export Master Excel (.xlsx)
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-1.5 print:hidden"
          >
            <span>🖨️</span> Print Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto print:hidden bg-slate-100 p-2 rounded-2xl">
        <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all ${activeTab === 'dashboard' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>📊 Overview</button>
        <button onClick={() => setActiveTab('customers')} className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all ${activeTab === 'customers' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>👥 Customers ({customersData.length})</button>
        <button onClick={() => setActiveTab('vehicles')} className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all ${activeTab === 'vehicles' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>🚘 Vehicles ({vehiclesData.length})</button>
        <button onClick={() => setActiveTab('qrs')} className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all ${activeTab === 'qrs' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>🔳 QR Codes ({qrsData.length})</button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'dashboard' && metrics && (
        <div className="space-y-8 animate-in fade-in">
          {/* Main QR Analytics */}
          <section>
            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center">
              <span>🔳</span> <span className="ml-2">QR Lifecycle Metrics</span>
            </h3>
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
            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center">
              <span>🌐</span> <span className="ml-2">Platform Growth</span>
            </h3>
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
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
          <div className="bg-slate-50 p-5 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-black text-slate-800 capitalize text-base sm:text-lg flex items-center gap-2">
              <span>{activeTab === 'customers' ? '👥' : activeTab === 'vehicles' ? '🚘' : '🔳'}</span> 
              <span>{activeTab} Data Log</span>
            </h3>
            <button 
              onClick={() => handleExportTabExcel(activeTab)} 
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center gap-1.5 print:hidden transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>📥</span> Export to Excel (.xlsx)
            </button>
          </div>
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 shadow-sm z-10">
                <tr>
                  {activeTab === 'customers' && ['ID', 'Name', 'Mobile', 'Email', 'Status', 'Registered'].map(h => <th key={h} className="p-4 font-black text-slate-500 text-xs uppercase tracking-wider border-b">{h}</th>)}
                  {activeTab === 'vehicles' && ['Reg Number', 'Type', 'Make/Model', 'Status', 'Added On'].map(h => <th key={h} className="p-4 font-black text-slate-500 text-xs uppercase tracking-wider border-b">{h}</th>)}
                  {activeTab === 'qrs' && ['Serial', 'Status', 'Product', 'Customer ID', 'Generated'].map(h => <th key={h} className="p-4 font-black text-slate-500 text-xs uppercase tracking-wider border-b">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeTab === 'customers' && customersData.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-500 font-bold">{c.id.substring(0,8)}</td>
                    <td className="p-4 font-bold text-slate-800">{c.full_name || 'N/A'}</td>
                    <td className="p-4 font-medium text-slate-600">{c.mobile || 'N/A'}</td>
                    <td className="p-4 text-slate-600">{c.email || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide ${c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>{c.status}</span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm font-medium">{c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
                {activeTab === 'vehicles' && vehiclesData.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-black text-slate-800 font-mono">{v.registration_number || v.registrationNumber || "-"}</td>
                    <td className="p-4 font-bold text-slate-600">{v.vehicle_type}</td>
                    <td className="p-4 font-bold text-slate-700 uppercase">{v.make || '-'} {v.model || ''}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide ${v.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>{v.status}</span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm font-medium">{v.created_at ? new Date(v.created_at).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
                {activeTab === 'qrs' && qrsData.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-black text-slate-800 font-mono">{q.qr_serial}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide 
                        ${q.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 
                          q.status === 'BLOCKED' ? 'bg-red-100 text-red-800 border border-red-200' : 
                          q.status === 'AVAILABLE' ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' : 'bg-slate-200 text-slate-700'}`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-600">{q.product_type}</td>
                    <td className="p-4 font-mono text-xs text-slate-500 font-bold">{q.customer_id ? q.customer_id.substring(0,8) : 'Not Assigned'}</td>
                    <td className="p-4 text-slate-500 text-sm font-medium">{new Date(q.generated_at || q.created_at).toLocaleDateString()}</td>
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
