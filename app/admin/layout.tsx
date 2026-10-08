"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-[#f4f7f9] text-slate-800 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-black text-white flex flex-col border-r border-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 pb-4 flex justify-between items-center border-b border-gray-800">
          <img src="/vyra-logo.jpg" alt="Vyra Connect" className="w-32 object-contain mix-blend-screen" />
          <button onClick={closeMobileMenu} className="md:hidden text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link href="/admin" onClick={closeMobileMenu} className="block px-4 py-2.5 rounded-lg hover:bg-cyan-900/30 text-cyan-50 font-medium transition-colors border border-transparent hover:border-cyan-800/50 hover:text-cyan-400">Dashboard</Link>
          <Link href="/admin/qr" onClick={closeMobileMenu} className="block px-4 py-2.5 rounded-lg hover:bg-cyan-900/30 text-cyan-50 font-medium transition-colors border border-transparent hover:border-cyan-800/50 hover:text-cyan-400">QR Management</Link>
          <Link href="/admin/customers" onClick={closeMobileMenu} className="block px-4 py-2.5 rounded-lg hover:bg-cyan-900/30 text-cyan-50 font-medium transition-colors border border-transparent hover:border-cyan-800/50 hover:text-cyan-400">Customers</Link>
          <Link href="/admin/vehicles" onClick={closeMobileMenu} className="block px-4 py-2.5 rounded-lg hover:bg-cyan-900/30 text-cyan-50 font-medium transition-colors border border-transparent hover:border-cyan-800/50 hover:text-cyan-400">Vehicles</Link>
          <Link href="/admin/reports" onClick={closeMobileMenu} className="block px-4 py-2.5 rounded-lg hover:bg-cyan-900/30 text-cyan-50 font-medium transition-colors border border-transparent hover:border-cyan-800/50 hover:text-cyan-400">Reports</Link>
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
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b px-4 sm:px-8 py-4 flex justify-between items-center shadow-sm z-10 shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="md:hidden mr-4 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="text-right hidden sm:block">
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
        
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          <div className="max-w-[1600px] mx-auto pb-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
