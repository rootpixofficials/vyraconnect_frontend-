"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function ReportsPage() {
  const [stats, setStats] = useState({ customers: 0, vehicles: 0, qrs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [custRes, vehRes, qrRes] = await Promise.all([
          axios.get("https://api.vyraconnect.in/api/admin/customers"),
          axios.get("https://api.vyraconnect.in/api/admin/vehicles"),
          axios.get("https://api.vyraconnect.in/api/admin/qr/list")
        ]);
        
        setStats({
          customers: custRes.data?.customers?.length || custRes.data?.length || 0,
          vehicles: vehRes.data?.vehicles?.length || vehRes.data?.length || 0,
          qrs: qrRes.data?.qrs?.length || qrRes.data?.length || 0
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const downloadReport = async (type: 'customers' | 'vehicles' | 'qrs') => {
    try {
      const endpoints = {
        customers: "https://api.vyraconnect.in/api/admin/customers",
        vehicles: "https://api.vyraconnect.in/api/admin/vehicles",
        qrs: "https://api.vyraconnect.in/api/admin/qr/list"
      };

      const res = await axios.get(endpoints[type]);
      const rawData = res.data[type] || res.data;
      const data = Array.isArray(rawData) ? rawData : [];

      if (data.length === 0) {
        alert("No data available to download.");
        return;
      }

      // Convert to CSV
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map((row: any) => 
        Object.values(row).map(val => \`"\${String(val || '').replace(/"/g, '""')}"\`).join(",")
      );
      const csv = [headers, ...rows].join("\\n");

      // Trigger Download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", \`\${type}_report.csv\`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download:", err);
      alert("Failed to download report.");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-800">System Reports & Analytics</h2>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Total Customers</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{loading ? '...' : stats.customers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Total Vehicles</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{loading ? '...' : stats.vehicles}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Total QRs Generated</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{loading ? '...' : stats.qrs}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">QR Generation Report</h3>
            <p className="text-gray-500 mb-6 text-sm">Download a complete list of all QR codes generated, including their serials, assignment status, and types.</p>
          </div>
          <button 
            onClick={() => downloadReport('qrs')}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
          >
            Download QR CSV
          </button>
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Customer Activation Report</h3>
            <p className="text-gray-500 mb-6 text-sm">Export a complete list of all registered customers, their contact information, and activation status.</p>
          </div>
          <button 
            onClick={() => downloadReport('customers')}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-medium hover:bg-emerald-100 transition-colors"
          >
            Download Customers CSV
          </button>
        </div>
        
        <div className="bg-white rounded-xl border p-6 shadow-sm flex flex-col justify-between md:col-span-2">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Vehicle Registry Report</h3>
            <p className="text-gray-500 mb-6 text-sm">Export a comprehensive log of all registered vehicles, types, and model details connected to your platform.</p>
          </div>
          <button 
            onClick={() => downloadReport('vehicles')}
            className="w-full sm:w-auto px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-medium hover:bg-blue-100 transition-colors"
          >
            Download Vehicles CSV
          </button>
        </div>
      </div>
    </div>
  );
}
