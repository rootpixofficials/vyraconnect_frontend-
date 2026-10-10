import * as XLSX from 'xlsx';

export const exportSingleSheetToExcel = (data: any[], fileName: string, sheetName = 'Data') => {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const exportMultiSheetToExcel = (sheets: { name: string; data: any[] }[], fileName: string) => {
  const wb = XLSX.utils.book_new();
  sheets.forEach(sheet => {
    const ws = XLSX.utils.json_to_sheet(sheet.data.length > 0 ? sheet.data : [{ Message: 'No Records' }]);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name.substring(0, 31));
  });
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
