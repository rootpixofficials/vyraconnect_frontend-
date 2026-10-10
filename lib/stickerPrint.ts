export interface PrintableQR {
  id: string;
  qr_serial: string;
  qr_image_base64?: string;
  status: string;
  product_type?: string;
  customer_id?: string;
  customerName?: string;
  customerMobile?: string;
}

export const printQrStickers = (qrs: PrintableQR[], title = 'Vyra Connect QR Stickers') => {
  if (!qrs || qrs.length === 0) {
    alert('No QR codes selected for printing.');
    return;
  }

  const printWindow = window.open('', '_blank', 'width=950,height=800');
  if (!printWindow) {
    alert('Please allow popups in your browser to print QR stickers.');
    return;
  }

  const isSingle = qrs.length === 1;

  const stickersHtml = qrs.map(qr => `
    <div class="sticker-card">
      <div class="sticker-header">
        <div class="brand-title">VYRA CONNECT</div>
        <div class="brand-tagline">VEHICLE SAFETY & EMERGENCY SCANNER</div>
      </div>
      
      <div class="qr-image-container">
        ${qr.qr_image_base64 
          ? `<img src="${qr.qr_image_base64}" alt="${qr.qr_serial}" class="qr-img" />`
          : `<div class="no-img">NO QR IMAGE</div>`}
      </div>

      <div class="sticker-footer">
        <div class="serial-badge">${qr.qr_serial}</div>
        <div class="scan-instruction">Scan with any smartphone camera in an emergency</div>
        ${qr.customerName ? `<div class="customer-tag">👤 Linked: ${qr.customerName}</div>` : ''}
        <div class="platform-url">www.vyraconnect.in • Smart Vehicle Protection</div>
      </div>
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm 10mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #ffffff;
            color: #0f172a;
            padding: 12px;
          }
          .print-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #0f172a;
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            font-size: 14px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
          }
          .print-btn {
            background: #06b6d4;
            color: #0f172a;
            font-weight: 800;
            border: none;
            padding: 8px 18px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
          }
          .print-btn:hover {
            background: #22d3ee;
          }
          .stickers-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12mm 10mm;
            justify-content: center;
          }
          ${isSingle ? `
            .stickers-grid {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 80vh;
            }
            .sticker-card {
              width: 95mm !important;
              max-width: 95mm !important;
            }
          ` : ''}
          .sticker-card {
            border: 2px dashed #94a3b8;
            border-radius: 18px;
            padding: 16px 14px;
            background: #ffffff;
            text-align: center;
            break-inside: avoid;
            page-break-inside: avoid;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            position: relative;
          }
          .sticker-header {
            margin-bottom: 8px;
            width: 100%;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 6px;
          }
          .brand-title {
            font-size: 18px;
            font-weight: 900;
            letter-spacing: 1.5px;
            color: #0f172a;
          }
          .brand-tagline {
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 1px;
            color: #0284c7;
            margin-top: 2px;
          }
          .qr-image-container {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 8px 0;
          }
          .qr-img {
            width: 52mm;
            height: 52mm;
            object-fit: contain;
            image-rendering: pixelated;
          }
          .sticker-footer {
            width: 100%;
            margin-top: 6px;
            border-top: 1px solid #e2e8f0;
            padding-top: 6px;
          }
          .serial-badge {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 20px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: 1.5px;
            margin-bottom: 4px;
          }
          .scan-instruction {
            font-size: 9px;
            font-weight: 700;
            color: #475569;
            margin-bottom: 4px;
          }
          .customer-tag {
            font-size: 9px;
            font-weight: 800;
            color: #059669;
            background: #ecfdf5;
            padding: 2px 6px;
            border-radius: 4px;
            display: inline-block;
            margin-bottom: 4px;
          }
          .platform-url {
            font-size: 7.5px;
            font-weight: 700;
            color: #94a3b8;
            letter-spacing: 0.5px;
          }
          @media print {
            .print-toolbar {
              display: none !important;
            }
            body {
              padding: 0 !important;
            }
            .sticker-card {
              box-shadow: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-toolbar">
          <div>
            <strong>Vyra Connect Sticker Sheet</strong> — ${qrs.length} ${qrs.length === 1 ? 'Sticker' : 'Stickers'} ready to print
          </div>
          <button class="print-btn" onclick="window.print()">🖨️ Print Now</button>
        </div>

        <div class="stickers-grid">
          ${stickersHtml}
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};
