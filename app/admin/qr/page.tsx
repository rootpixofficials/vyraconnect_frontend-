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
  created_at?: string;
}

export default function QRManagementPage() {
  const [qrs, setQrs] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Generate Batch Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(10);
  const [productType, setProductType] = useState('STICKER');
  const [isGenerating, setIsGenerating] = useState(false);

  // View Modal State
  const [selectedQr, setSelectedQr] = useState<QRCode | null>(null);

  // Assign Modal State
  const [assignQrId, setAssignQrId] = useState<string | null>(null);
  const [assignCustomerId, setAssignCustomerId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    fetchQRs();
  }, []);

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
        productType: productType
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrs.map((qr, idx) => (
            <div key={qr.id || idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              
              {/* Card Body - Flex Row */}
              <div className="flex flex-row p-4 flex-1">
                {/* Left Side - Image */}
                <div className="w-1/3 flex items-center justify-center bg-gray-50 rounded-lg border p-2 mr-4">
                  {qr.qr_image_base64 ? (
                    <img src={qr.qr_image_base64} alt={qr.qr_serial} className="w-full object-contain mix-blend-multiply" />
                  ) : (
                    <div className="text-xs text-gray-400 text-center">No Image</div>
                  )}
                </div>
                
                {/* Right Side - Details */}
                <div className="w-2/3 flex flex-col justify-center space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{qr.product_type}</p>
                      <h3 className="text-lg font-bold text-gray-900">{qr.qr_serial}</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-700">Status: </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold inline-block ml-1 ${
                        qr.status === 'ACTIVATED' ? 'bg-green-100 text-green-800' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {qr.status}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-700">Customer: </span> 
                      {qr.customer_id ? <span className="text-indigo-600 font-medium" title={qr.customer_id}>{qr.customer_id.substring(0, 8)}...</span> : <span className="text-gray-400 italic">Unassigned</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer - Action Buttons */}
              <div className="bg-gray-50 px-4 py-3 border-t flex justify-end space-x-3">
                <button 
                  onClick={() => setAssignQrId(qr.id)}
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium px-3 py-1.5 border border-indigo-200 hover:bg-indigo-50 rounded transition-colors"
                >
                  Assign to Customer
                </button>
                <button 
                  onClick={() => setSelectedQr(qr)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-1.5 rounded transition-colors shadow-sm"
                >
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

      {/* Assign Customer Modal */}
      {assignQrId && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => setAssignQrId(null)}></div>

            <div className="inline-block bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm w-full relative z-10">
              <form onSubmit={handleAssign}>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Assign to Customer</h3>
                  <p className="text-sm text-gray-500 mb-4">Enter the Customer ID to manually assign this QR code.</p>
                  
                  <div>
                    <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                    <input
                      type="text"
                      id="customerId"
                      value={assignCustomerId}
                      onChange={(e) => setAssignCustomerId(e.target.value)}
                      placeholder="e.g. CUST-123456 or UUID"
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
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
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                      <select
                        id="productType"
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                      >
                        <option value="STICKER">Sticker</option>
                        <option value="CARD">Card</option>
                        <option value="KEYCHAIN">Keychain</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-5 py-2 bg-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
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
