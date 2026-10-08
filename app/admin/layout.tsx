"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://api.vyraconnect.in/api/admin/login', {
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
    <div className="flex h-screen bg-[#f4f7f9] text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col border-r border-gray-800 shadow-xl">
        <div className="p-6 pb-4 flex justify-center border-b border-gray-800">
          <img src="/vyra-logo.jpg" alt="Vyra Connect" className="w-48 object-contain mix-blend-screen" />
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className="block px-4 py-2.5 rounded-lg hover:bg-cyan-900/30 text-cyan-50 font-medium transition-colors border border-transparent hover:border-cyan-800/50 hover:text-cyan-400">Dashboard</Link>
          <Link href="/admin/qr" className="block px-4 py-2.5 rounded-lg hover:bg-cyan-900/30 text-cyan-50 font-medium transition-colors border border-transparent hover:border-cyan-800/50 hover:text-cyan-400">QR Management</Link>
          <Link href="/admin/customers" className="block px-4 py-2.5 rounded-lg hover:bg-cyan-900/30 text-cyan-50 font-medium transition-colors border border-transparent hover:border-cyan-800/50 hover:text-cyan-400">Customers</Link>
          <Link href="/admin/vehicles" className="block px-4 py-2.5 rounded-lg hover:bg-cyan-900/30 text-cyan-50 font-medium transition-colors border border-transparent hover:border-cyan-800/50 hover:text-cyan-400">Vehicles</Link>
          <Link href="/admin/reports" className="block px-4 py-2.5 rounded-lg hover:bg-cyan-900/30 text-cyan-50 font-medium transition-colors border border-transparent hover:border-cyan-800/50 hover:text-cyan-400">Reports</Link>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={() => {
              localStorage.removeItem('admin_auth');
              setIsAuthenticated(false);
            }}
            className="w-full py-2.5 text-sm text-gray-400 font-medium hover:text-white hover:bg-red-900/40 rounded-lg transition-colors border border-transparent hover:border-red-800/50"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">Super Admin</p>
              <p className="text-xs text-cyan-600">Online</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md p-0.5">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <span className="font-bold text-cyan-600 text-sm">SA</span>
              </div>
            </div>
          </div>
        </header>
        
        <div className="p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
