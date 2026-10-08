"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface QRCode {
  id: string;
  qr_serial: string;
  qr_url?: string;
  qr_image_base64?: string;
  customer_id?: string;
  product_type: string;
  status: string;
  blocked_reason?: string;
  created_at?: string;
}

export default function QRManagementPage() {
  const [qrs, setQrs] = useState<QRCode[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
    fetchQRs();
    fetchCustomers();
  }, []);

  
  const fetchCustomers = async () => {
    try {
      const response = await axios.get('https://api.vyraconnect.in/api/admin/customers');
      setCustomers(response.data?.customers || response.data?.data || (Array.isArray(response.data) ? response.data : []));
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  };
  
  const fetchQRs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.vyraconnect.in/api/admin/qr/list');
      setQrs(response.data?.qrs || response.data?.data || (Array.isArray(response.data) ? response.data : []));
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch QRs:', err);
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
      fetchQRs(); // Refresh the list
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
      fetchQRs();
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
      fetchQRs();
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
      fetchQRs();
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
      fetchQRs();
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
      fetchQRs(); // Refresh the list
    } catch (err: any) {
      console.error('Failed to assign QR:', err);
      alert(err.response?.data?.error || 'Failed to assign QR code.');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">QR Code Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
        >
          + Generate QR Batch
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-100">
          {error}
        </div>
      )}

      {/* QR Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : qrs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No QR Codes</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by generating a new batch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {qrs.map((qr, idx) => (
            <div key={qr.id || idx} className="bg-white rounded-2xl shadow-lg shadow-cyan-900/5 border border-cyan-100 overflow-hidden flex flex-col hover:shadow-cyan-900/10 hover:-translate-y-1 transition-all duration-300">
              
              {/* Card Body - Flex Row */}
              <div className="flex flex-row p-5 flex-1 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-full opacity-50 pointer-events-none"></div>
                {/* Left Side - Image */}
                <div className="w-1/3 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-100 p-3 mr-6 shadow-sm z-10">
                  {qr.qr_image_base64 ? (
                    <img src={qr.qr_image_base64} alt={qr.qr_serial} className="w-full object-contain mix-blend-multiply drop-shadow-sm" />
                  ) : (
                    <div className="text-xs text-gray-400 text-center">No Image</div>
                  )}
                </div>
                
                {/* Right Side - Details */}
                <div className="w-2/3 flex flex-col justify-center space-y-3 z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-cyan-600 font-bold uppercase tracking-widest">{qr.product_type} CODE</p>
                      <h3 className="text-2xl font-black text-slate-800 mt-1">{qr.qr_serial}</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${qr.status === 'ACTIVATED' ? 'bg-emerald-500' : 'bg-cyan-500'}`}></div>
                      <p className="text-sm font-semibold text-gray-600">
                        {qr.status === 'ACTIVATED' ? 'Active & Linked' : 'Available for Assignment'}
                      </p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 mt-2">
                      <p className="text-xs text-gray-500 mb-0.5">Assigned Customer</p>
                      {qr.customer_id ? (
                        <p className="text-sm font-bold text-cyan-700 font-mono">{qr.customer_id}</p>
                      ) : (
                        <p className="text-sm font-medium text-gray-400 italic">Not Assigned</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer - Action Buttons */}
                <div className="bg-slate-50 px-3 py-3 border-t border-cyan-50 flex justify-between items-center flex-wrap gap-2">
                  {qr.status === 'AVAILABLE' && (
                    <button onClick={() => setAssignQrId(qr.id)} className="text-cyan-700 hover:text-cyan-900 text-xs font-bold px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 rounded border border-cyan-100">
                      Assign
                    </button>
                  )}
                  {qr.status === 'ASSIGNED' && (
                    <button onClick={() => handleActivate(qr.id)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-100">
                      Activate
                    </button>
                  )}
                  {qr.status === 'ACTIVE' && (
                    <>
                      <button onClick={() => setBlockQrId(qr.id)} className="text-orange-700 hover:text-orange-900 text-xs font-bold px-3 py-1.5 bg-orange-50 hover:bg-orange-100 rounded border border-orange-100">
                        Block
                      </button>
                      <button onClick={() => setReplaceQrId(qr.id)} className="text-red-700 hover:text-red-900 text-xs font-bold px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded border border-red-100">
                        Replace
                      </button>
                    </>
                  )}
                  {qr.status === 'BLOCKED' && (
                    <button onClick={() => handleUnblock(qr.id)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-100">
                      Unblock
                    </button>
                  )}
                  <button onClick={() => setSelectedQr(qr)} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded transition-colors shadow-md ml-auto">
                    View
                  </button>
                </div>
            </div>
          ))}
        </div>
      )}

      {/* View QR Modal (Large Popup) */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => setSelectedQr(null)}></div>

            <div className="inline-block bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full relative z-10">
              <div className="absolute top-4 right-4">
                <button onClick={() => setSelectedQr(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedQr.qr_serial}</h3>
                  <p className="text-sm text-gray-500 mt-1">{selectedQr.product_type} QR Code</p>
                </div>
                
                <div className="flex justify-center mb-6 bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-inner">
                  {selectedQr.qr_image_base64 ? (
                    <img src={selectedQr.qr_image_base64} alt={selectedQr.qr_serial} className="w-64 h-64 object-contain mix-blend-multiply" />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center text-gray-400">No Image Available</div>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 font-medium">Status</span>
                    <span className={`px-2 rounded-full text-xs font-bold ${
                      selectedQr.status === 'ACTIVATED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedQr.status}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-sm text-gray-500 font-medium">Internal ID</span>
                    <span className="text-sm font-mono text-gray-700">{selectedQr.id}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-sm text-gray-500 font-medium">Assigned Customer</span>
                    <span className="text-sm font-mono text-gray-700">{selectedQr.customer_id || 'Not Assigned'}</span>
                  </div>
                  {selectedQr.qr_url && (
                    <div className="flex flex-col border-t pt-3">
                      <span className="text-sm text-gray-500 font-medium mb-1">Target URL</span>
                      <a href={selectedQr.qr_url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline break-all">
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
            <div className="inline-block bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm w-full relative z-10">
              <form onSubmit={handleBlock}>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Block QR Code</h3>
                  <p className="text-sm text-gray-500 mb-4">Temporarily disable this QR code. Public scans will be blocked.</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Blocking</label>
                    <input type="text" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="e.g. Lost, Stolen, Suspended" className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm" required />
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
                  <button type="button" onClick={() => setBlockQrId(null)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">Cancel</button>
                  <button type="submit" disabled={isBlocking} className="px-4 py-2 bg-red-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50">{isBlocking ? 'Blocking...' : 'Block QR'}</button>
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
            <div className="inline-block bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm w-full relative z-10">
              <form onSubmit={handleReplace}>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Replace QR Code</h3>
                  <p className="text-sm text-gray-500 mb-4">Generate a new QR mapped to the same customer. The old QR will be permanently marked as replaced.</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Replacement</label>
                    <input type="text" value={replaceReason} onChange={(e) => setReplaceReason(e.target.value)} placeholder="e.g. Damaged, Lost" className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" required />
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
                  <button type="button" onClick={() => setReplaceQrId(null)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">Cancel</button>
                  <button type="submit" disabled={isReplacing} className="px-4 py-2 bg-orange-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50">{isReplacing ? 'Replacing...' : 'Replace QR'}</button>
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
  
              <div className="inline-block bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full relative z-10">
                <form onSubmit={handleAssign}>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Assign to Customer</h3>
                    <p className="text-sm text-gray-500 mb-4">Select a customer below to instantly assign this QR code to their account.</p>
                    
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50 space-y-2">
                      {customers.map((c: any) => (
                        <label key={c.id} className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${assignCustomerId === c.id ? 'bg-indigo-50 border-indigo-200 border' : 'bg-white border-transparent border hover:bg-gray-100'}`}>
                          <input type="radio" name="customer" value={c.id} checked={assignCustomerId === c.id} onChange={(e) => setAssignCustomerId(e.target.value)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                          <div className="ml-3 flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{c.full_name || 'No Name'}</span>
                            <span className="text-xs text-gray-500">{c.mobile || c.email || 'No contact info'}</span>
                          </div>
                        </label>
                      ))}
                      {customers.length === 0 && (
                        <div className="text-center p-4 text-sm text-gray-500">No customers found.</div>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setAssignQrId(null)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAssigning}
                    className="px-4 py-2 bg-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isAssigning ? 'Assigning...' : 'Assign'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Generate Batch Modal (Existing) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>

            <div className="inline-block bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full relative z-10">
              <form onSubmit={handleGenerateBatch}>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6" id="modal-title">
                    Generate New QR Batch
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity to Generate</label>
                      <input
                        type="number"
                        id="quantity"
                        min="1"
                        max="1000"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">This will automatically generate standard V-Series QR codes (e.g. V-00001).</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
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
