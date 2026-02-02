
import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'pedidos', label: 'Pedidos y Caja', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { id: 'kds', label: 'Cocina (KDS)', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'menu', label: 'Carta Digital', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'clientes', label: 'Clientes (CRM)', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0' },
    { id: 'cupones', label: 'Marketing', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
    { id: 'config', label: 'Ajustes', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573' }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Sidebar - Pro Look */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0F172A] text-slate-300 shadow-2xl transition-all duration-300 border-r border-slate-800">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">RestoCRM</h1>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">Premium Pro</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto hide-scrollbar mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full gap-3.5 px-5 py-4 rounded-2xl transition-all duration-200 group ${
                activeTab === item.id 
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xl shadow-emerald-500/20' 
                : 'hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <svg className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-slate-950' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
          <div className="bg-slate-800/40 rounded-3xl p-4 flex items-center gap-4 border border-slate-700/50">
            <div className="relative">
                <img src={user.avatar_url} className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500/20" alt="user" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user.nombre}</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user.rol}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-6">
            <button className="lg:hidden p-2.5 text-slate-500 bg-white border border-slate-200 rounded-xl" onClick={() => setMobileMenuOpen(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <div>
                <h2 className="text-xl font-extrabold text-slate-900 capitalize tracking-tight">{activeTab}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sincronizado hace 1m</p>
                </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-4 pr-6 border-r border-slate-200">
                <button className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
                <button className="relative p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
            <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden md:block">
                    <p className="text-xs font-bold text-slate-900">Restaurante La Pizarra</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase">Abierto</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 hide-scrollbar animate-fade-in">
          {children}
        </section>
      </main>

      {/* Mobile Menu logic... similar but enhanced */}
    </div>
  );
};

export default Layout;
