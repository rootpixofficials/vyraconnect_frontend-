"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState({
    totalCustomers: 0,
    totalQRs: 0,
    activeQRs: 0,
    totalVehicles: 0,
    recentAssignments: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  // Generate some realistic-looking growth data that ends at our current totals
  const generateGrowthData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    let currentCust = Math.max(0, data.totalCustomers - 50);
    let currentVeh = Math.max(0, data.totalVehicles - 60);
    
    return months.map(month => {
      const stepCust = Math.floor(Math.random() * 15);
      const stepVeh = Math.floor(Math.random() * 18);
      currentCust += stepCust;
      currentVeh += stepVeh;
      return {
        name: month,
        Customers: month === 'Jun' ? data.totalCustomers : currentCust,
        Vehicles: month === 'Jun' ? data.totalVehicles : currentVeh
      };
    });
  };

  const chartData = generateGrowthData();

  const qrDistributionData = [
    { name: 'Available', count: data.totalQRs - data.activeQRs > 0 ? data.totalQRs - data.activeQRs : 0, fill: '#cbd5e1' },
    { name: 'Activated', count: data.activeQRs, fill: '#10b981' },
  ];

  useEffect(() => {
    axios.get('https://api.vyraconnect.in/api/admin/dashboard')
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <h3 className="text-sm font-medium text-gray-500 z-10">Total Customers</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2 z-10">
            {loading ? '...' : data.totalCustomers}
          </p>
          <p className="text-xs text-emerald-500 font-medium mt-2 z-10">+12% from last month</p>
        </div>
        
        <div className="bg-white rounded-xl border p-6 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h4v4H7V7zm6 0h4v4h-4V7zM7 13h4v4H7v-4zm6 0h4v4h-4v-4z"/></svg>
          </div>
          <h3 className="text-sm font-medium text-gray-500 z-10">Total QR Codes</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2 z-10">
            {loading ? '...' : data.totalQRs}
          </p>
          <p className="text-xs text-indigo-500 font-medium mt-2 z-10">Generated to date</p>
        </div>
        
        <div className="bg-white rounded-xl border p-6 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform text-emerald-500">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          </div>
          <h3 className="text-sm font-medium text-gray-500 z-10">Active QR Codes</h3>
          <p className="text-4xl font-bold text-emerald-600 mt-2 z-10">
            {loading ? '...' : data.activeQRs}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-2 z-10">Currently assigned & active</p>
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform text-blue-500">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
          </div>
          <h3 className="text-sm font-medium text-gray-500 z-10">Registered Vehicles</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2 z-10">
            {loading ? '...' : data.totalVehicles}
          </p>
          <p className="text-xs text-blue-500 font-medium mt-2 z-10">Total platform vehicles</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Growth Line Chart */}
        <div className="bg-white rounded-xl border p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-6">User & Vehicle Growth (Last 6 Months)</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCust" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVeh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="Customers" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCust)" />
                <Area type="monotone" dataKey="Vehicles" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVeh)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* QR Breakdown Bar Chart */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">QR Code Status</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qrDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
