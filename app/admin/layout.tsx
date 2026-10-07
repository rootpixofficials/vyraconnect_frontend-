"use client";
import React, { useState, useEffect } from 'react';

import axios from 'axios';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://api.vyraconnect.in/api/admin/login', {
        username,
        password
      });
      const data = res.data;
      
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_auth', 'true');
      } else {
        setError(data.message || 'Invalid password');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cannot connect to server');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Vyra Admin Login</h1>
            <p className="text-slate-500 mt-2">Enter your credentials to access the dashboard.</p>
            <p className="text-xs text-blue-500 mt-1">Hint: Use 'vyraconnectadmin' & 'vyraconnect@123'</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                placeholder="Admin Username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              type="submit" 
              className="w-full py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white">Vyra Admin</h2>
          <p className="text-slate-400 text-sm mt-1">Vehicle QR Platform</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <a href="/admin" className="block px-4 py-2 rounded bg-slate-800 text-white">Dashboard</a>
          <a href="/admin/qr" className="block px-4 py-2 rounded text-slate-300 hover:bg-slate-800">QR Management</a>
          <a href="/admin/customers" className="block px-4 py-2 rounded text-slate-300 hover:bg-slate-800">Customers</a>
          <a href="/admin/vehicles" className="block px-4 py-2 rounded text-slate-300 hover:bg-slate-800">Vehicles</a>
          <a href="/admin/reports" className="block px-4 py-2 rounded text-slate-300 hover:bg-slate-800">Reports</a>
        </nav>
        
        <div className="p-4">
          <button 
            onClick={() => {
              localStorage.removeItem('admin_auth');
              setIsAuthenticated(false);
            }}
            className="w-full py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Super Admin</span>
            <div className="w-8 h-8 rounded-full bg-slate-200"></div>
          </div>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
