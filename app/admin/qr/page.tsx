"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { printQrStickers, PrintableQR } from '@/lib/stickerPrint';
import { exportSingleSheetToExcel } from '@/lib/excelExport';

interface QRCode {
  id: string;
  qr_serial: string;
  qr_token?: string;
  qr_url?: string;
  qr_image_base64?: string;
  customer_id?: string;
  product_type: string;
  status: string;
  batch_id?: string;
  blocked_reason?: string;
  generated_at?: string;
  activated_at?: string;
  expires_at?: string;
  created_at?: string;
}

interface Batch {
  id: string;
  batch_code: string;
  product_type: string;
  quantity: number;
  generated_count: number;
  pdf_path?: string;
  status: string;
  created_at: string;
}

export default function QRManagementPage() {
  const [qrs, setQrs] = useState<QRCode[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Batch View State
  const [selectedBatchId, setSelectedBatchId] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'AVAILABLE' | 'BLOCKED'>('ALL');
  const [selectedQrIds, setSelectedQrIds] = useState<string[]>([]);
  
  // Generate Batch Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  // View Modal State
  const [selectedQr, setSelectedQr] = useState<QRCode | null>(null);

  // Block Modal State
  const [blockQrId, setBlockQrId] = useState<string | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);

  // Replace Modal State
  const [replaceQrId, setReplaceQrId] = useState<string | null>(null);
  const [replaceReason, setReplaceReason] = useState('');
  const [isReplacing, setIsReplacing] = useState(false);

  // Assign Modal State
  const [assignQrId, setAssignQrId] = useState<string | null>(null);
  const [assignCustomerId, setAssignCustomerId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [qrRes, batchRes, custRes] = await Promise.all([
        axios.get('https://api.vyraconnect.in/api/admin/qr/list'),
        axios.get('https://api.vyraconnect.in/api/admin/qr-batches/list').catch(() => ({ data: { batches: [] } })),
        axios.get('https://api.vyraconnect.in/api/admin/customers')
      ]);

      setQrs(qrRes.data?.qrs || qrRes.data?.data || (Array.isArray(qrRes.data) ? qrRes.data : []));
      setBatches(batchRes.data?.batches || (Array.isArray(batchRes.data) ? batchRes.data : []));
      setCustomers(custRes.data?.customers || custRes.data?.data || (Array.isArray(custRes.data) ? custRes.data : []));
      setError(null);
    } catch (err: any) {
      console.error('Failed to load QR management data:', err);
      setError('Failed to load QR codes.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      await axios.post('https://api.vyraconnect.in/api/admin/qr-batches/bulk-generate', {
        quantity: Number(quantity),
        productType: 'V'
      });
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error('Failed to generate batch:', err);
      alert('Failed to generate QR batch.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleActivate = async (id: string) => {
    if (!confirm('Are you sure you want to activate this QR code?')) return;
    try {
      await axios.post(`https://api.vyraconnect.in/api/admin/qr/${id}/activate`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to activate QR code.');
    }
  };

  const handleBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockQrId || !blockReason.trim()) return;
    try {
      setIsBlocking(true);
      await axios.post(`https://api.vyraconnect.in/api/admin/qr/${blockQrId}/block`, { reason: blockReason.trim() });
      setBlockQrId(null);
      setBlockReason('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to block QR code.');
    } finally {
      setIsBlocking(false);
    }
  };

  const handleUnblock = async (id: string) => {
    if (!confirm('Are you sure you want to unblock this QR code?')) return;
    try {
      await axios.post(`https://api.vyraconnect.in/api/admin/qr/${id}/unblock`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to unblock QR code.');
    }
  };

  const handleReplace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replaceQrId || !replaceReason.trim()) return;
    try {
      setIsReplacing(true);
      await axios.post(`https://api.vyraconnect.in/api/admin/qr/${replaceQrId}/replace`, { reason: replaceReason.trim() });
      setReplaceQrId(null);
      setReplaceReason('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to replace QR code.');
    } finally {
      setIsReplacing(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignQrId || !assignCustomerId.trim()) return;
    
    try {
      setIsAssigning(true);
      await axios.post('https://api.vyraconnect.in/api/admin/qr/assign', {
        qrId: assignQrId,
        customerId: assignCustomerId.trim()
      });
      setAssignQrId(null);
      setAssignCustomerId('');
      fetchData();
    } catch (err: any) {
      console.error('Failed to assign QR:', err);
      alert(err.response?.data?.error || 'Failed to assign QR code.');
    } finally {
      setIsAssigning(false);
    }
  };

  // Helper to enrich a QR code with customer details for printing and excel
  const enrichQr = (qr: QRCode): PrintableQR => {
    const c = customers.find(cust => cust.id === qr.customer_id);
    return {
      ...qr,
      customerName: c ? (c.full_name || c.name) : undefined,
      customerMobile: c ? c.mobile : undefined
    };
  };

  // Printing Functions
  const handlePrintSingle = (qr: QRCode) => {
    printQrStickers([enrichQr(qr)], `Vyra Sticker - ${qr.qr_serial}`);
  };

  const handlePrintSelected = () => {
    const selectedQrs = qrs.filter(q => selectedQrIds.includes(q.id)).map(enrichQr);
    if (selectedQrs.length === 0) {
      alert('Please select at least one QR code to print.');
      return;
    }
    printQrStickers(selectedQrs, `Vyra Bulk Stickers (${selectedQrs.length})`);
  };

  const handlePrintBatch = (batchId: string) => {
    const batchQrs = qrs.filter(q => q.batch_id === batchId).map(enrichQr);
    if (batchQrs.length === 0) {
      alert('No QR codes found in this batch.');
      return;
    }
    const currentBatch = batches.find(b => b.id === batchId);
    printQrStickers(batchQrs, `Batch ${currentBatch?.batch_code || batchId} Stickers (${batchQrs.length})`);
  };

  const handlePrintAllVisible = () => {
    if (filteredQrs.length === 0) {
      alert('No QR codes to print.');
      return;
    }
    printQrStickers(filteredQrs.map(enrichQr), `Vyra Stickers Sheet (${filteredQrs.length})`);
  };

  // Excel Export Functions
  const handleExportExcel = (qrsToExport: QRCode[], filename: string) => {
    if (qrsToExport.length === 0) {
      alert('No data to export.');
      return;
    }
    const rows = qrsToExport.map(q => {
      const c = customers.find(cust => cust.id === q.customer_id);
      const b = batches.find(batch => batch.id === q.batch_id);
      return {
        "QR Serial": q.qr_serial,
        "Batch Code": b ? b.batch_code : (q.batch_id || "N/A"),
        "Status": q.status,
        "Product Type": q.product_type || "V",
        "Assigned Customer ID": q.customer_id || "Unassigned",
        "Customer Name": c ? (c.full_name || c.name) : "Unassigned",
        "Customer Mobile": c ? c.mobile : "N/A",
        "Generated Date": q.generated_at || q.created_at ? new Date(q.generated_at || q.created_at || '').toLocaleDateString() : "N/A",
        "Activated Date": q.activated_at ? new Date(q.activated_at).toLocaleDateString() : "N/A",
        "Expiry Date": q.expires_at ? new Date(q.expires_at).toLocaleDateString() : "N/A",
        "Blocked Reason": q.blocked_reason || "None",
        "Public Scan URL": q.qr_url || `https://vyraconnect.in/scan?token=${q.qr_token || ''}`
      };
    });
    exportSingleSheetToExcel(rows, filename, 'QR_Codes');
  };

  // Selection Checkbox Handlers
  const handleToggleSelectQr = (id: string) => {
    setSelectedQrIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = () => {
    const visibleIds = filteredQrs.map(q => q.id);
    const allSelected = visibleIds.every(id => selectedQrIds.includes(id));
    if (allSelected) {
      setSelectedQrIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedQrIds(prev => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  // Filtered QRs based on Selected Batch, Search, and Status
  const filteredQrs = qrs.filter(q => {
    const matchesBatch = selectedBatchId === 'ALL' || q.batch_id === selectedBatchId;

    const c = customers.find(cust => cust.id === q.customer_id);
    const matchesSearch =
      q.qr_serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.customer_id && q.customer_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c && ((c.full_name || c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (c.mobile || '').includes(searchTerm)));

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && (q.status === 'ACTIVE' || q.status === 'ACTIVATED')) ||
      (statusFilter === 'AVAILABLE' && q.status === 'AVAILABLE') ||
      (statusFilter === 'BLOCKED' && q.status === 'BLOCKED');

    return matchesBatch && matchesSearch && matchesStatus;
  });

  const activeBatchObj = batches.find(b => b.id === selectedBatchId);
  const activeBatchQrs = selectedBatchId === 'ALL' ? [] : qrs.filter(q => q.batch_id === selectedBatchId);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🔳</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">QR Code Scanner Hub</h1>
          </div>
          <p className="text-slate-500 font-medium text-xs sm:text-sm mt-1">
            Batch-wise sticker management, high-resolution sticker printing, and Excel data exports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-initial bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-cyan-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            ✨ + Generate QR Batch
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-200 text-sm font-bold flex items-center gap-2">
          <span>⚠️</span> <span>{error}</span>
        </div>
      )}

      {/* Batch-Wise Selection Tabs Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">📦</span>
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Select Batch View</h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {batches.length} {batches.length === 1 ? 'Batch' : 'Batches'} generated
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedBatchId('ALL')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs shrink-0 transition-all ${
              selectedBatchId === 'ALL'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🌐 All QR Codes ({qrs.length})
          </button>

          {batches.map(batch => {
            const countInBatch = qrs.filter(q => q.batch_id === batch.id).length;
            const isSelected = selectedBatchId === batch.id;

            return (
              <button
                key={batch.id}
                onClick={() => setSelectedBatchId(batch.id)}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs shrink-0 transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>📦</span>
                <span>{batch.batch_code}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isSelected ? 'bg-cyan-700 text-cyan-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {countInBatch || batch.generated_count || batch.quantity}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Batch Summary Card (when a batch is selected) */}
      {selectedBatchId !== 'ALL' && activeBatchObj && (
        <div className="bg-gradient-to-r from-cyan-900 via-slate-900 to-cyan-950 text-white p-6 rounded-3xl shadow-lg border border-cyan-800/40 relative overflow-hidden animate-in fade-in">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 mb-2">
                <span>🏷️</span>
                <span>BATCH CODE: {activeBatchObj.batch_code}</span>
              </div>
              <h2 className="text-2xl font-black text-white">
                Batch #{activeBatchObj.batch_code} Overview
              </h2>
              <p className="text-slate-300 text-xs mt-1">
                Generated on {new Date(activeBatchObj.created_at).toLocaleDateString()} • {activeBatchQrs.length} scannable sticker tags
              </p>

              {/* Quick stats in batch */}
              <div className="flex flex-wrap gap-2 mt-4 text-xs font-bold">
                <span className="px-3 py-1 rounded-xl bg-white/10 text-slate-200">
                  Total: {activeBatchQrs.length}
                </span>
                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active: {activeBatchQrs.filter(q => q.status === 'ACTIVE' || q.status === 'ACTIVATED').length}
                </span>
                <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
                  Available: {activeBatchQrs.filter(q => q.status === 'AVAILABLE').length}
                </span>
                <span className="px-3 py-1 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30">
                  Blocked: {activeBatchQrs.filter(q => q.status === 'BLOCKED').length}
                </span>
              </div>
            </div>

            {/* Batch Level Action Buttons: Print Entire Batch & Export Batch Excel */}
            <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
              <button
                onClick={() => handlePrintBatch(activeBatchObj.id)}
                className="flex-1 lg:flex-initial px-5 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>🖨️</span>
                <span>Print Entire Batch</span>
              </button>

              <button
                onClick={() => handleExportExcel(activeBatchQrs, `Vyra_${activeBatchObj.batch_code}_Report`)}
                className="flex-1 lg:flex-initial px-5 py-3 bg-white/15 hover:bg-white/25 text-white font-black rounded-2xl text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <span>📥</span>
                <span>Export Batch (.xlsx)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Filter, Search, and Bulk Print Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="🔍 Search serial, ID, customer..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold outline-none focus:border-cyan-500 focus:bg-white transition-all uppercase placeholder:normal-case"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✖
              </button>
            )}
          </div>

          {/* Status Filter Pills */}
          <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                statusFilter === 'ACTIVE'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('AVAILABLE')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                statusFilter === 'AVAILABLE'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
              }`}
            >
              Available
            </button>
            <button
              onClick={() => setStatusFilter('BLOCKED')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                statusFilter === 'BLOCKED'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Blocked
            </button>
          </div>
        </div>

        {/* Global Print & Excel Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          <button
            onClick={handleSelectAllVisible}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            {filteredQrs.length > 0 && filteredQrs.every(q => selectedQrIds.includes(q.id))
              ? 'Deselect All'
              : 'Select All'}
          </button>

          {selectedQrIds.length > 0 && (
            <button
              onClick={handlePrintSelected}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>🖨️</span> Print Selected ({selectedQrIds.length})
            </button>
          )}

          <button
            onClick={handlePrintAllVisible}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
          >
            <span>🖨️</span> Print Visible ({filteredQrs.length})
          </button>

          <button
            onClick={() => handleExportExcel(filteredQrs, `Vyra_QR_Export_${selectedBatchId}`)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1"
          >
            <span>📥</span> Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* QR Cards Grid */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-slate-500 space-y-3">
          <div className="text-4xl animate-bounce">⏳</div>
          <div className="text-base font-bold">Loading QR Scanners...</div>
        </div>
      ) : filteredQrs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200 p-8">
          <p className="text-5xl mb-3">📭</p>
          <h3 className="text-lg font-black text-slate-800">No QR Codes Found</h3>
          <p className="text-slate-400 text-xs mt-1">Try switching batches or generating a new batch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredQrs.map((qr, idx) => {
            const isBlocked = qr.status === 'BLOCKED';
            const isActive = qr.status === 'ACTIVE' || qr.status === 'ACTIVATED';
            const isAssigned = qr.status === 'ASSIGNED';
            const isSelected = selectedQrIds.includes(qr.id);
            const customer = customers.find(c => c.id === qr.customer_id);

            return (
              <div
                key={qr.id || idx}
                className={`rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col justify-between border-l-[6px] relative ${
                  isBlocked
                    ? 'border-l-red-500 bg-red-50/50 border border-red-200 hover:border-red-300'
                    : isActive
                    ? 'border-l-emerald-500 bg-emerald-50/20 border border-emerald-100 hover:border-emerald-300'
                    : isAssigned
                    ? 'border-l-amber-500 bg-amber-50/20 border border-amber-100 hover:border-amber-300'
                    : 'border-l-cyan-500 bg-white border border-cyan-100 hover:border-cyan-300'
                }`}
              >
                {/* Checkbox for Bulk Selection (Top-Right) */}
                <div className="absolute top-4 right-4 z-20">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelectQr(qr.id)}
                    className="w-5 h-5 rounded-lg text-cyan-600 focus:ring-cyan-500 border-slate-300 cursor-pointer"
                  />
                </div>

                {/* Card Body - Flex Row */}
                <div className="flex flex-row p-5 flex-1 relative overflow-hidden">
                  {/* Left Side - Image with Print Trigger */}
                  <div
                    onClick={() => handlePrintSingle(qr)}
                    title="Click to print this single QR sticker"
                    className={`w-1/3 flex flex-col items-center justify-center rounded-2xl border p-3 mr-5 shadow-sm z-10 cursor-pointer group transition-all ${
                      isBlocked ? 'bg-red-100/50 border-red-200' : 'bg-slate-50 border-slate-100 hover:border-cyan-300'
                    }`}
                  >
                    {qr.qr_image_base64 ? (
                      <img
                        src={qr.qr_image_base64}
                        alt={qr.qr_serial}
                        className="w-full object-contain mix-blend-multiply drop-shadow-sm group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="text-xs text-gray-400 text-center">No Image</div>
                    )}
                    <span className="text-[10px] font-black text-cyan-700 mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>🖨️</span> Print Sticker
                    </span>
                  </div>
                  
                  {/* Right Side - Details */}
                  <div className="w-2/3 flex flex-col justify-center space-y-2.5 z-10 pr-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-[11px] font-black uppercase tracking-widest ${isBlocked ? 'text-red-600' : 'text-cyan-600'}`}>
                          {qr.product_type} CODE
                        </p>
                        <h3 className={`text-2xl font-black mt-0.5 tracking-tight ${isBlocked ? 'text-red-950' : 'text-slate-800'}`}>
                          {qr.qr_serial}
                        </h3>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                        isBlocked
                          ? 'bg-red-100 text-red-700 border-red-300'
                          : isActive
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isAssigned
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                      }`}>
                        {isBlocked ? '🚫 BLOCKED' : isActive ? '✅ ACTIVE' : isAssigned ? '⏳ ASSIGNED' : '⚪ AVAILABLE'}
                      </span>
                    </div>

                    {isBlocked && qr.blocked_reason && (
                      <div className="p-2 rounded-xl bg-red-100 border border-red-200 text-xs font-bold text-red-800">
                        ⚠️ Reason: {qr.blocked_reason}
                      </div>
                    )}
                    
                    <div className={`rounded-xl p-2.5 border text-xs ${
                      isBlocked ? 'bg-red-100/60 border-red-200/80' : 'bg-slate-50/90 border-slate-100'
                    }`}>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">Assigned Customer</p>
                      {qr.customer_id ? (
                        <div className="flex flex-col">
                          {customer ? (
                            <>
                              <p className={`text-xs font-black truncate ${isBlocked ? 'text-red-900' : 'text-slate-800'}`}>
                                👤 {customer.full_name || customer.name || 'No Name'}
                              </p>
                              <p className={`text-[11px] font-mono mt-0.5 ${isBlocked ? 'text-red-700 font-bold' : 'text-slate-500'}`}>
                                📱 {customer.mobile}
                              </p>
                            </>
                          ) : (
                            <p className={`text-xs font-mono font-bold truncate ${isBlocked ? 'text-red-700' : 'text-cyan-700'}`}>
                              🆔 {qr.customer_id}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs font-medium text-slate-400 italic">Available (Not Assigned)</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer - Action Buttons with Dedicated Print Option */}
                <div className={`px-4 py-3 border-t flex justify-between items-center flex-wrap gap-2 ${
                  isBlocked ? 'bg-red-100/40 border-red-200' : 'bg-slate-50/80 border-slate-100'
                }`}>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Dedicated Single Print Button */}
                    <button
                      onClick={() => handlePrintSingle(qr)}
                      className="text-slate-800 hover:text-black text-xs font-black px-3 py-1.5 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1 transition-colors"
                    >
                      <span>🖨️</span> Print
                    </button>

                    {qr.status === 'AVAILABLE' && (
                      <button
                        onClick={() => setAssignQrId(qr.id)}
                        className="text-cyan-700 hover:text-cyan-900 text-xs font-bold px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 rounded-xl border border-cyan-100 transition-colors"
                      >
                        Assign
                      </button>
                    )}
                    {qr.status === 'ASSIGNED' && (
                      <button
                        onClick={() => handleActivate(qr.id)}
                        className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-100 transition-colors"
                      >
                        Activate
                      </button>
                    )}
                    {qr.status === 'ACTIVE' && (
                      <>
                        <button
                          onClick={() => setBlockQrId(qr.id)}
                          className="text-orange-700 hover:text-orange-900 text-xs font-bold px-3 py-1.5 bg-orange-50 hover:bg-orange-100 rounded-xl border border-orange-100 transition-colors"
                        >
                          Block
                        </button>
                        <button
                          onClick={() => setReplaceQrId(qr.id)}
                          className="text-red-700 hover:text-red-900 text-xs font-bold px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 transition-colors"
                        >
                          Replace
                        </button>
                      </>
                    )}
                    {qr.status === 'BLOCKED' && (
                      <button
                        onClick={() => handleUnblock(qr.id)}
                        className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-100 transition-colors"
                      >
                        Unblock
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedQr(qr)}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-black px-4 py-1.5 rounded-xl transition-all shadow-sm ml-auto"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View QR Modal (Large Popup with Print Option) */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => setSelectedQr(null)}></div>

            <div className="inline-block bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full relative z-10">
              <div className="absolute top-4 right-4">
                <button onClick={() => setSelectedQr(null)} className="text-gray-400 hover:text-gray-600 p-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-black text-gray-900">{selectedQr.qr_serial}</h3>
                  <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mt-1">{selectedQr.product_type} Series Tag</p>
                </div>
                
                <div className="flex flex-col items-center justify-center mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                  {selectedQr.qr_image_base64 ? (
                    <img src={selectedQr.qr_image_base64} alt={selectedQr.qr_serial} className="w-56 h-56 object-contain mix-blend-multiply drop-shadow-sm" />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center text-gray-400">No Image Available</div>
                  )}

                  {/* Print Sticker Button in Modal */}
                  <button
                    onClick={() => handlePrintSingle(selectedQr)}
                    className="mt-4 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <span>🖨️</span> Print Printable Sticker
                  </button>
                </div>
                
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-bold">Status</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-black ${
                      selectedQr.status === 'ACTIVATED' || selectedQr.status === 'ACTIVE' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : selectedQr.status === 'BLOCKED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-cyan-100 text-cyan-800'
                    }`}>
                      {selectedQr.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-gray-500 font-bold">Internal UUID</span>
                    <span className="font-mono text-gray-700">{selectedQr.id.substring(0, 16)}...</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-gray-500 font-bold">Assigned Customer</span>
                    <span className="font-mono text-gray-700">{selectedQr.customer_id || 'Not Assigned'}</span>
                  </div>
                  {selectedQr.qr_url && (
                    <div className="flex flex-col border-t pt-2">
                      <span className="text-gray-500 font-bold mb-1">Target Scan URL</span>
                      <a href={selectedQr.qr_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline break-all">
                        {selectedQr.qr_url}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block Modal */}
      {blockQrId && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => setBlockQrId(null)}></div>
            <div className="inline-block bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm w-full relative z-10">
              <form onSubmit={handleBlock}>
                <div className="p-6">
                  <h3 className="text-lg font-black text-gray-900 mb-2">Block QR Code</h3>
                  <p className="text-xs text-gray-500 mb-4">Temporarily disable this QR code. Public scans will be blocked immediately.</p>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Reason for Blocking</label>
                    <input type="text" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="e.g. Lost, Stolen, Suspended" className="w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 sm:text-xs" required />
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-2">
                  <button type="button" onClick={() => setBlockQrId(null)} className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={isBlocking} className="px-4 py-2 bg-red-600 rounded-xl shadow-sm text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50">{isBlocking ? 'Blocking...' : 'Block QR'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Replace Modal */}
      {replaceQrId && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => setReplaceQrId(null)}></div>
            <div className="inline-block bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm w-full relative z-10">
              <form onSubmit={handleReplace}>
                <div className="p-6">
                  <h3 className="text-lg font-black text-gray-900 mb-2">Replace QR Code</h3>
                  <p className="text-xs text-gray-500 mb-4">Generate a replacement QR mapped to the same customer. The old QR will be permanently decommissioned.</p>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Reason for Replacement</label>
                    <input type="text" value={replaceReason} onChange={(e) => setReplaceReason(e.target.value)} placeholder="e.g. Damaged, Lost" className="w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-xs" required />
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-2">
                  <button type="button" onClick={() => setReplaceQrId(null)} className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={isReplacing} className="px-4 py-2 bg-orange-600 rounded-xl shadow-sm text-xs font-bold text-white hover:bg-orange-700 disabled:opacity-50">{isReplacing ? 'Replacing...' : 'Replace QR'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Customer Modal */}
      {assignQrId && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => setAssignQrId(null)}></div>

            <div className="inline-block bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full relative z-10">
              <form onSubmit={handleAssign}>
                <div className="p-6">
                  <h3 className="text-lg font-black text-gray-900 mb-2">Assign to Customer</h3>
                  <p className="text-xs text-gray-500 mb-4">Select a customer below to instantly link this QR sticker to their vehicles & emergency profile.</p>
                  
                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-2xl p-2 bg-gray-50 space-y-2">
                    {customers.map((c: any) => (
                      <label key={c.id} className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${assignCustomerId === c.id ? 'bg-cyan-50 border-cyan-300 border' : 'bg-white border-transparent border hover:bg-gray-100'}`}>
                        <input type="radio" name="customer" value={c.id} checked={assignCustomerId === c.id} onChange={(e) => setAssignCustomerId(e.target.value)} className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300" />
                        <div className="ml-3 flex flex-col">
                          <span className="text-xs font-black text-gray-900">{c.full_name || 'No Name'}</span>
                          <span className="text-[11px] text-gray-500 font-mono">{c.mobile || c.email || 'No contact info'}</span>
                        </div>
                      </label>
                    ))}
                    {customers.length === 0 && (
                      <div className="text-center p-4 text-xs text-gray-500">No customers found.</div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setAssignQrId(null)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAssigning}
                    className="px-5 py-2 bg-cyan-600 rounded-xl shadow-sm text-xs font-black text-white hover:bg-cyan-500 disabled:opacity-50"
                  >
                    {isAssigning ? 'Assigning...' : 'Assign QR'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Generate Batch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>

            <div className="inline-block bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full relative z-10">
              <form onSubmit={handleGenerateBatch}>
                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-2">
                    Generate New QR Batch
                  </h3>
                  <p className="text-xs text-gray-500 mb-5">
                    Batch generation creates unique serials and cryptographic tokens for public vehicle stickers.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="quantity" className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">Quantity to Generate</label>
                      <input
                        type="number"
                        id="quantity"
                        min="1"
                        max="1000"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full border-2 border-gray-200 rounded-xl py-2.5 px-3 focus:outline-none focus:border-cyan-500 font-bold text-sm"
                        required
                      />
                      <p className="text-[11px] text-gray-400 mt-1.5">Automatically assigns V-Series serial format (e.g., V-000013).</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-xs rounded-xl shadow-md hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Batch'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
