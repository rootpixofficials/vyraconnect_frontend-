const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/admin/qr/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add states
const stateInjection = `
  // Block Modal State
  const [blockQrId, setBlockQrId] = useState<string | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);

  // Replace Modal State
  const [replaceQrId, setReplaceQrId] = useState<string | null>(null);
  const [replaceReason, setReplaceReason] = useState('');
  const [isReplacing, setIsReplacing] = useState(false);
`;
content = content.replace('  // Assign Modal State', stateInjection + '\n  // Assign Modal State');

// 2. Add Handlers
const handlersInjection = `
  const handleBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockQrId || !blockReason.trim()) return;
    try {
      setIsBlocking(true);
      await axios.post(\`https://api.vyraconnect.in/api/admin/qr/\${blockQrId}/block\`, { reason: blockReason.trim() });
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
      await axios.post(\`https://api.vyraconnect.in/api/admin/qr/\${id}/unblock\`);
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
      await axios.post(\`https://api.vyraconnect.in/api/admin/qr/\${replaceQrId}/replace\`, { reason: replaceReason.trim() });
      setReplaceQrId(null);
      setReplaceReason('');
      fetchQRs();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to replace QR code.');
    } finally {
      setIsReplacing(false);
    }
  };
`;

content = content.replace('  const handleAssign = async', handlersInjection + '\n  const handleAssign = async');

// 3. Update Card Buttons
const originalButtons = `                <div className="bg-slate-50 px-5 py-4 border-t border-cyan-50 flex justify-end space-x-3 items-center">
                  <button 
                    onClick={() => setAssignQrId(qr.id)}
                    className="text-cyan-700 hover:text-cyan-900 text-sm font-bold px-4 py-2 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-colors border border-cyan-100"
                  >
                    Assign Customer
                  </button>
                  <button 
                    onClick={() => setSelectedQr(qr)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-bold px-6 py-2 rounded-lg transition-colors shadow-md shadow-cyan-500/30"
                  >
                    View Details
                  </button>
                </div>`;

const newButtons = `                <div className="bg-slate-50 px-5 py-4 border-t border-cyan-50 flex justify-end space-x-2 items-center flex-wrap gap-y-2">
                  {qr.status === 'AVAILABLE' && (
                    <button onClick={() => setAssignQrId(qr.id)} className="text-cyan-700 hover:text-cyan-900 text-xs font-bold px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-colors border border-cyan-100">
                      Assign
                    </button>
                  )}
                  {qr.status === 'ACTIVE' && (
                    <button onClick={() => setBlockQrId(qr.id)} className="text-red-700 hover:text-red-900 text-xs font-bold px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100">
                      Block
                    </button>
                  )}
                  {qr.status === 'BLOCKED' && (
                    <button onClick={() => handleUnblock(qr.id)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-100">
                      Unblock
                    </button>
                  )}
                  {(qr.status === 'ACTIVE' || qr.status === 'BLOCKED' || qr.status === 'EXPIRED') && (
                    <button onClick={() => setReplaceQrId(qr.id)} className="text-orange-700 hover:text-orange-900 text-xs font-bold px-3 py-1.5 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100">
                      Replace
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedQr(qr)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors shadow-md shadow-cyan-500/30"
                  >
                    View
                  </button>
                </div>`;

content = content.replace(originalButtons, newButtons);

// 4. Inject Modals
const modalsInjection = `
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
`;

content = content.replace('{/* Assign Customer Modal */}', modalsInjection + '\n      {/* Assign Customer Modal */}');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully injected frontend UI');
