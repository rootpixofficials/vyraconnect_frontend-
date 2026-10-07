"use client";
import React, { useEffect, useState } from 'react';

import axios from 'axios';

export default function AdminDashboard() {
  const [data, setData] = useState({
    totalCustomers: 0,
    totalQRs: 0,
    activeQRs: 0,
    totalVehicles: 0,
    recentAssignments: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/dashboard')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {loading ? '...' : data.totalCustomers}
          </p>
        </div>
        
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total QR Codes Generated</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {loading ? '...' : data.totalQRs}
          </p>
        </div>
        
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Active QR Codes</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {loading ? '...' : data.activeQRs}
          </p>
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Registered Vehicles</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {loading ? '...' : data.totalVehicles}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent QR Assignments</h3>
          <div className="space-y-4">
            {loading && <p className="text-gray-500">Loading...</p>}
              {!loading && (!data.recentAssignments || data.recentAssignments.length === 0) && (
              <p className="text-gray-500">No recent assignments found.</p>
            )}
            {data.recentAssignments?.map((qr) => (
              <div key={qr.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{qr.customerName}</p>
                  <p className="text-sm text-gray-500">QR: {qr.serial}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">{qr.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border rounded-lg hover:bg-slate-50 flex flex-col items-center justify-center space-y-2 text-slate-700">
              <span className="text-2xl">📱</span>
              <span className="font-medium">Generate Single QR</span>
            </button>
            <button className="p-4 border rounded-lg hover:bg-slate-50 flex flex-col items-center justify-center space-y-2 text-slate-700">
              <span className="text-2xl">📦</span>
              <span className="font-medium">Bulk Generate QR</span>
            </button>
            <button className="p-4 border rounded-lg hover:bg-slate-50 flex flex-col items-center justify-center space-y-2 text-slate-700">
              <span className="text-2xl">👥</span>
              <span className="font-medium">Add Customer</span>
            </button>
            <button className="p-4 border rounded-lg hover:bg-slate-50 flex flex-col items-center justify-center space-y-2 text-slate-700">
              <span className="text-2xl">🚗</span>
              <span className="font-medium">Add Vehicle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
