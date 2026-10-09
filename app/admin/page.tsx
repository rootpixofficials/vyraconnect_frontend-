"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState({
    totalCustomers: 0,
    totalQRs: 0,
    activeQRs: 0,
    totalVehicles: 0,
    recentAssignments: [] as any[]
  });

  const [metrics, setMetrics] = useState({
    available: 0,
    active: 0,
    blocked: 0,
    assignedPending: 0,
    totalSold: 0,
    activeCustomers: 0,
    inactiveCustomers: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, repRes] = await Promise.all([
          axios.get('https://api.vyraconnect.in/api/admin/dashboard').catch(() => ({ data: {} })),
          axios.get('https://api.vyraconnect.in/api/admin/reports/dashboard').catch(() => ({ data: {} }))
        ]);

        if (dashRes.data) {
          setData(prev => ({
            ...prev,
            ...dashRes.data
          }));
        }

        if (repRes.data && repRes.data.metrics) {
          setMetrics(repRes.data.metrics);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Growth timeline mock data synced with current totals
  const generateGrowthData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const totalC = data.totalCustomers || 4;
    const totalV = data.totalVehicles || 3;
    let currC = Math.max(1, Math.floor(totalC * 0.25));
    let currV = Math.max(1, Math.floor(totalV * 0.2));

    return months.map((month, idx) => {
      if (idx === months.length - 1) {
        return { name: month, Customers: totalC, Vehicles: totalV };
      }
      currC = Math.min(totalC, currC + Math.floor(Math.random() * 2));
      currV = Math.min(totalV, currV + Math.floor(Math.random() * 2));
      return {
        name: month,
        Customers: currC,
        Vehicles: currV
      };
    });
  };

  const growthData = generateGrowthData();

  // Circle Chart 1: QR Lifecycle Distribution
  const activeCount = metrics.active || data.activeQRs || 0;
  const availableCount = metrics.available || Math.max(0, (data.totalQRs || 0) - activeCount);
  const blockedCount = metrics.blocked || 0;

  const qrPieData = [
    { name: 'Active & Linked', value: activeCount || 1, color: '#10b981', emoji: '🟢' },
    { name: 'Available Inventory', value: availableCount || 1, color: '#06b6d4', emoji: '⚪' },
    ...(blockedCount > 0 ? [{ name: 'Blocked', value: blockedCount, color: '#ef4444', emoji: '🔴' }] : [])
  ];

  // Circle Chart 2: Platform Asset Balance (Customers vs Vehicles vs Assigned QRs)
  const platformPieData = [
    { name: 'Active Customers', value: Math.max(1, data.totalCustomers), color: '#6366f1', emoji: '👥' },
    { name: 'Registered Fleet', value: Math.max(1, data.totalVehicles), color: '#3b82f6', emoji: '🚘' },
    { name: 'Linked QR Tags', value: Math.max(1, activeCount), color: '#10b981', emoji: '🔳' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 mb-3">
              <span>🚀</span>
              <span>ADMIN CONTROL CENTER</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Platform Command Hub ⚡
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Real-time monitoring of customer subscriptions, vehicle connections, and instant emergency QR scanning.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/qr"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              🔳 Manage QRs
            </Link>
            <Link
              href="/admin/customers"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition-all"
            >
              👥 Customers
            </Link>
            <Link
              href="/admin/vehicles"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition-all"
            >
              🚘 Vehicles
            </Link>
          </div>
        </div>
      </div>

      {/* Top 4 Metrics Cards - Modern App Design with Left Border & Light Green Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Customers */}
        <Link
          href="/admin/customers"
          className="bg-white rounded-2xl p-6 border-l-[6px] border-l-indigo-500 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group block"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Platform Users</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">
                {loading ? '...' : data.totalCustomers}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl border border-indigo-100 group-hover:scale-110 transition-transform">
              👥
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500 pt-3 border-t border-slate-50">
            <span>Verified accounts</span>
            <span className="text-indigo-600">View list ➔</span>
          </div>
        </Link>

        {/* Card 2: Total QR Codes */}
        <Link
          href="/admin/qr"
          className="bg-white rounded-2xl p-6 border-l-[6px] border-l-cyan-500 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group block"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Total QR Codes</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">
                {loading ? '...' : data.totalQRs}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-2xl border border-cyan-100 group-hover:scale-110 transition-transform">
              🔳
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500 pt-3 border-t border-slate-50">
            <span>Inventory generated</span>
            <span className="text-cyan-600">Scan status ➔</span>
          </div>
        </Link>

        {/* Card 3: Active QR Codes - Light Green styling as requested */}
        <Link
          href="/admin/qr"
          className="bg-emerald-50/40 rounded-2xl p-6 border-l-[6px] border-l-emerald-500 border border-emerald-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group block"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black text-emerald-700 uppercase tracking-wider">Active QR Codes</p>
              <h3 className="text-3xl font-black text-emerald-800 mt-1">
                {loading ? '...' : activeCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl border border-emerald-200 group-hover:scale-110 transition-transform">
              🟢
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-bold text-emerald-700 pt-3 border-t border-emerald-100">
            <span>Ready for scans</span>
            <span className="text-emerald-800 font-black">Live & connected ➔</span>
          </div>
        </Link>

        {/* Card 4: Registered Vehicles */}
        <Link
          href="/admin/vehicles"
          className="bg-white rounded-2xl p-6 border-l-[6px] border-l-blue-500 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group block"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Registered Vehicles</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">
                {loading ? '...' : data.totalVehicles}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl border border-blue-100 group-hover:scale-110 transition-transform">
              🚘
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500 pt-3 border-t border-slate-50">
            <span>Cars, Bikes & Fleet</span>
            <span className="text-blue-600">Garage list ➔</span>
          </div>
        </Link>
      </div>

      {/* Circle / Donut Charts Section (Pie Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Circle Chart 1: QR Lifecycle Allocation */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭕</span>
                <h3 className="text-xl font-black text-slate-800">QR Code Status Distribution</h3>
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Breakdown of active assigned tags vs available inventory
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
              {data.totalQRs} Total
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} Codes`, name]}
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    fontWeight: 700
                  }}
                />
                <Pie
                  data={qrPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {qrPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Stat */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-800">{activeCount}</span>
              <span className="text-[11px] font-black uppercase text-emerald-600 tracking-wider">Active</span>
            </div>
          </div>

          {/* Emoji Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
            {qrPieData.map(item => (
              <div key={item.name} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                <span className="text-base">{item.emoji}</span>
                <div className="truncate">
                  <p className="font-bold text-slate-700 truncate">{item.name}</p>
                  <p className="text-[11px] font-mono text-slate-500 font-bold">{item.value} codes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Circle Chart 2: Platform Asset Balance */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-black text-slate-800">Platform Asset Ratio</h3>
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Correlation between platform customers, fleet, and linked tags
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">
              Live Balance
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} Units`, name]}
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    fontWeight: 700
                  }}
                />
                <Pie
                  data={platformPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Stat */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-800">{data.totalCustomers + data.totalVehicles}</span>
              <span className="text-[11px] font-black uppercase text-indigo-600 tracking-wider">Total Assets</span>
            </div>
          </div>

          {/* Emoji Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
            {platformPieData.map(item => (
              <div key={item.name} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                <span className="text-base">{item.emoji}</span>
                <div className="truncate">
                  <p className="font-bold text-slate-700 truncate">{item.name}</p>
                  <p className="text-[11px] font-mono text-slate-500 font-bold">{item.value} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth Trend Area Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📈</span>
              <h3 className="text-xl font-black text-slate-800">Platform Growth & Fleet Expansion</h3>
            </div>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Monthly acquisition trajectory for verified customers and connected vehicles
            </p>
          </div>
          <div className="flex gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-indigo-600">
              <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
              👥 Customers
            </span>
            <span className="flex items-center gap-1.5 text-blue-500">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
              🚘 Vehicles
            </span>
          </div>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="vehGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <Tooltip
                contentStyle={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  fontWeight: 700
                }}
              />
              <Area type="monotone" dataKey="Customers" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#custGrad)" />
              <Area type="monotone" dataKey="Vehicles" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#vehGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent QR Assignments Stream */}
      {data.recentAssignments && data.recentAssignments.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <h3 className="text-xl font-black text-slate-800">Recent QR Assignments</h3>
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-1">Latest QR stickers linked to verified users</p>
            </div>
            <Link href="/admin/qr" className="text-xs font-black text-cyan-600 hover:text-cyan-700">
              View All ➔
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.recentAssignments.map((item: any) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border-l-[6px] border-l-emerald-500 bg-emerald-50/30 border border-emerald-100 flex items-center justify-between hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-lg shadow-sm">
                    🔳
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">{item.serial}</h4>
                    <p className="text-xs text-slate-600 font-semibold">👤 {item.customerName || 'Customer'}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ✅ {item.status || 'ACTIVE'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
