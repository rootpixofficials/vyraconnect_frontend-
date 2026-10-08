const fs = require('fs');
let content = fs.readFileSync('app/admin/qr/page.tsx', 'utf8');

const activateHandler = `
  const handleActivate = async (id: string) => {
    if (!confirm('Are you sure you want to activate this QR code?')) return;
    try {
      await axios.post(\`https://api.vyraconnect.in/api/admin/qr/\${id}/activate\`);
      fetchQRs();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to activate QR code.');
    }
  };
`;

content = content.replace('const handleBlock = async', activateHandler + '\n  const handleBlock = async');

const activateBtn = `{qr.status === 'ASSIGNED' && (
                    <button onClick={() => handleActivate(qr.id)} className="text-indigo-700 hover:text-indigo-900 text-xs font-bold px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100">
                      Activate
                    </button>
                  )}`;

content = content.replace("{qr.status === 'AVAILABLE' && (", activateBtn + "\n                  {qr.status === 'AVAILABLE' && (");

fs.writeFileSync('app/admin/qr/page.tsx', content, 'utf8');
console.log('Added Activate button');
