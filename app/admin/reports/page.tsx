"use client";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">System Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">QR Generation Report</h3>
          <p className="text-gray-500 mb-4">View metrics on QR batches generated over time.</p>
          <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors">
            Download CSV
          </button>
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Customer Activation Report</h3>
          <p className="text-gray-500 mb-4">Export list of customers who have activated vehicles recently.</p>
          <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors">
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}
