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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, IndianRupee, QrCode, Users, Car, Layers, 
  CheckCircle2, Clock, Filter, ArrowUpRight, BarChart3, RefreshCw,
  Tag, Wallet, ShieldCheck
} from 'lucide-react';

interface BatchSummary {
  id: string;
  batch_code: string;
  product_type: string;
  total: number;
  sold: number;
  available: number;
  blocked?: number;
  revenue: number;
  status: string;
  created_at?: string;
}

export default function AdminDashboard() {
  const [data, setData] = useState({
    totalCustomers: 0,
    totalQRs: 0,
    activeQRs: 0,
    totalVehicles: 0,
    salesCount: 0,
    salesRevenue: 0,
    pricePerCard: 499,
    recentAssignments: [] as any[]
  });

  const [metrics, setMetrics] = useState({
    available: 0,
    active: 0,
    blocked: 0,
    assignedPending: 0,
    totalSold: 0,
    salesCount: 0,
    salesRevenue: 0,
    pricePerCard: 499,
    activeCustomers: 0,
    inactiveCustomers: 0
  });

  const [batchSummaries, setBatchSummaries] = useState<BatchSummary[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
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

      const batches = dashRes.data?.batchSummaries || repRes.data?.batchSummaries || [];
      setBatchSummaries(batches);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Selected batch filtering logic
  const selectedBatch = selectedBatchId === "ALL" 
    ? null 
    : batchSummaries.find(b => b.id === selectedBatchId || b.batch_code === selectedBatchId);

  // Active sales calculation: 1 active card = 1 sale = ₹499
  const PRICE_PER_CARD = 499;
  const globalActiveQRs = metrics.active || data.activeQRs || data.salesCount || 0;
  const globalTotalQRs = data.totalQRs || (metrics.available + globalActiveQRs) || 0;
  const globalAvailableQRs = metrics.available || Math.max(0, globalTotalQRs - globalActiveQRs);

  // Applied values depending on batch filter
  const displaySalesCount = selectedBatch ? selectedBatch.sold : globalActiveQRs;
  const displaySalesRevenue = selectedBatch ? selectedBatch.revenue : (globalActiveQRs * PRICE_PER_CARD);
  const displayTotalQRs = selectedBatch ? selectedBatch.total : globalTotalQRs;
  const displayAvailableQRs = selectedBatch ? selectedBatch.available : globalAvailableQRs;

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
  const qrPieData = [
    { name: 'Active (Sold)', value: Math.max(displaySalesCount, 1), color: '#10b981', emoji: '🟢' },
    { name: 'Available Inventory', value: Math.max(displayAvailableQRs, 1), color: '#06b6d4', emoji: '⚪' },
    ...(metrics.blocked > 0 && !selectedBatch ? [{ name: 'Blocked', value: metrics.blocked, color: '#ef4444', emoji: '🔴' }] : [])
  ];

  // Circle Chart 2: Platform Asset Ratio
  const platformPieData = [
    { name: 'Platform Users', value: Math.max(1, data.totalCustomers), color: '#6366f1', emoji: '👥' },
    { name: 'Fleet Vehicles', value: Math.max(1, data.totalVehicles), color: '#3b82f6', emoji: '🚘' },
    { name: 'Cards Sold', value: Math.max(1, displaySalesCount), color: '#10b981', emoji: '🏷️' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
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
              Live sales performance, active tag connections, vehicle records, and instant masked calling.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={fetchDashboard}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/admin/qr"
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              🔳 QR Inventory
            </Link>
            <Link
              href="/admin/customers"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all"
            >
              👥 Customers
            </Link>
            <Link
              href="/admin/reports"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all"
            >
              📊 Reports
            </Link>
          </div>
        </div>
      </div>

      {/* QR Batch Filter Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-600" />
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
            QR Batch Data View:
          </span>
          {selectedBatch && (
            <span className="text-xs font-mono font-black text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-md border border-cyan-200">
              {selectedBatch.batch_code}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSelectedBatchId("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              selectedBatchId === "ALL"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Batches (Global)
          </button>
          {batchSummaries.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBatchId(b.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedBatchId === b.id
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200/60"
              }`}
            >
              {b.batch_code}
            </button>
          ))}
        </div>
      </div>

      {/* Top 5 Metrics Cards - Improved Typography, Zero Overlap & Lucide Vector Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
        {/* Card 1: Total Sales Count */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-l-[6px] border-l-emerald-500 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[170px] group">
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 leading-tight">
                Total Sales Count
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0 group-hover:scale-110 transition-transform">
                <Tag className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-baseline mt-1 mb-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {loading ? '...' : displaySalesCount}
              </span>
              <span className="ml-2 text-xs font-bold text-slate-400">cards</span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500 text-[11px]">Active Cards</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200 shrink-0 whitespace-nowrap">
              ₹499 / card
            </span>
          </div>
        </div>

        {/* Card 2: Total Sales Revenue */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-l-[6px] border-l-teal-500 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[170px] group">
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 leading-tight">
                Total Sales Amount
              </span>
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 shrink-0 group-hover:scale-110 transition-transform">
                <IndianRupee className="w-4 h-4 text-teal-600" />
              </div>
            </div>
            <div className="flex items-baseline mt-1 mb-2">
              <span className="text-xl sm:text-2xl font-black text-teal-600 mr-0.5">₹</span>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {loading ? '...' : displaySalesRevenue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500 text-[11px]">Revenue</span>
            <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black border border-teal-200 shrink-0 whitespace-nowrap">
              Active Tags
            </span>
          </div>
        </div>

        {/* Card 3: Platform Users */}
        <Link
          href="/admin/customers"
          className="bg-white rounded-3xl p-5 sm:p-6 border-l-[6px] border-l-indigo-500 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[170px] group block"
        >
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 leading-tight">
                Platform Users
              </span>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
            <div className="flex items-baseline mt-1 mb-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {loading ? '...' : data.totalCustomers}
              </span>
              <span className="ml-2 text-xs font-bold text-slate-400">owners</span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500 text-[11px]">Verified accounts</span>
            <span className="text-indigo-600 group-hover:text-indigo-700 flex items-center gap-0.5 text-[11px] font-black whitespace-nowrap">
              <span>View list</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* Card 4: Total QR Inventory */}
        <Link
          href="/admin/qr"
          className="bg-white rounded-3xl p-5 sm:p-6 border-l-[6px] border-l-cyan-500 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[170px] group block"
        >
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-700 leading-tight">
                Total QR Codes
              </span>
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100 shrink-0 group-hover:scale-110 transition-transform">
                <QrCode className="w-4 h-4 text-cyan-600" />
              </div>
            </div>
            <div className="flex items-baseline mt-1 mb-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {loading ? '...' : displayTotalQRs}
              </span>
              <span className="ml-2 text-xs font-bold text-slate-400">codes</span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500 text-[11px]">Available: <strong className="text-cyan-800">{displayAvailableQRs}</strong></span>
            <span className="text-cyan-600 group-hover:text-cyan-700 flex items-center gap-0.5 text-[11px] font-black whitespace-nowrap">
              <span>Inventory</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* Card 5: Registered Vehicles */}
        <Link
          href="/admin/vehicles"
          className="bg-white rounded-3xl p-5 sm:p-6 border-l-[6px] border-l-blue-500 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[170px] group block"
        >
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 leading-tight">
                Fleet Garage
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0 group-hover:scale-110 transition-transform">
                <Car className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="flex items-baseline mt-1 mb-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {loading ? '...' : data.totalVehicles}
              </span>
              <span className="ml-2 text-xs font-bold text-slate-400">vehicles</span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500 text-[11px]">Connected Fleet</span>
            <span className="text-blue-600 group-hover:text-blue-700 flex items-center gap-0.5 text-[11px] font-black whitespace-nowrap">
              <span>Garage list</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </Link>
      </div>

      {/* QR Batch Performance & Sales Breakdown Table */}
      {batchSummaries.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📦</span>
                <h3 className="text-xl font-black text-slate-900">QR Batch Sales & Inventory Performance</h3>
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Batch-wise sales conversion based on active tags at ₹499/card
              </p>
            </div>
            <Link
              href="/admin/qr"
              className="text-xs font-black text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
            >
              <span>+ Generate New Batch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-black text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Batch Code</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Total QRs</th>
                  <th className="py-3 px-4">Cards Sold (Active)</th>
                  <th className="py-3 px-4">Available Stock</th>
                  <th className="py-3 px-4">Sales Revenue (₹499/card)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Filter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {batchSummaries.map((batch) => {
                  const isSelected = selectedBatchId === batch.id;
                  return (
                    <tr 
                      key={batch.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? "bg-cyan-50/60 font-bold" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                        🏷️ {batch.batch_code}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-600">
                        {batch.product_type || "Vehicle"}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {batch.total}
                      </td>
                      <td className="py-3.5 px-4 font-black text-emerald-700">
                        ✅ {batch.sold} sold
                      </td>
                      <td className="py-3.5 px-4 font-bold text-cyan-700">
                        📦 {batch.available} stock
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-teal-800 text-sm">
                        ₹{(batch.sold * 499).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                          {batch.status || "COMPLETED"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedBatchId(isSelected ? "ALL" : batch.id)}
                          className={`px-3 py-1.5 rounded-xl font-black text-[11px] transition-all cursor-pointer ${
                            isSelected
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-cyan-100 hover:text-cyan-900"
                          }`}
                        >
                          {isSelected ? "Active View" : "View Batch"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                {selectedBatch ? `Batch ${selectedBatch.batch_code} breakdown` : "Global active assigned tags vs available inventory"}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
              {displayTotalQRs} Total
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
              <span className="text-3xl font-black text-slate-800">{displaySalesCount}</span>
              <span className="text-[11px] font-black uppercase text-emerald-600 tracking-wider">Sold Active</span>
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

        {/* Circle Chart 2: Platform Asset Ratio */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-black text-slate-800">Platform Asset Ratio</h3>
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Correlation between platform customers, fleet, and cards sold
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">
              Live Ratio
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
                    <QrCode className="w-5 h-5 text-emerald-600" />
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