"use client";

import { useState, useEffect } from "react";

interface Customer {
  id: string;
  name?: string;
  full_name?: string;
  mobile: string;
  email: string;
  status: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetch("https://api.vyraconnect.in/api/admin/customers");
        const data = await response.json();
        setCustomers(Array.isArray(data) ? data : data.customers || []);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="p-6">Loading customers...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 font-semibold text-gray-700">Name</th>
              <th className="p-4 font-semibold text-gray-700">Mobile</th>
              <th className="p-4 font-semibold text-gray-700">Email</th>
              <th className="p-4 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer, index) => (
                <tr key={customer.id || index} className="border-b hover:bg-gray-50">
                  <td className="p-4">{customer.full_name || customer.name || "Unknown"}</td>
                  <td className="p-4">{customer.mobile}</td>
                  <td className="p-4">{customer.email || "-"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.status || "Unknown"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
