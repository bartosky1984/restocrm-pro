
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Bell, UserCircle } from 'lucide-react';

export default function DashboardLayout() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 ml-64 flex flex-col min-h-screen">
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-8 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-slate-800">
                        {/* Dynamic Title Implementation would go here */}
                        Dashboard
                    </h1>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-slate-900">{user?.nombre || 'Usuario'}</p>
                                <p className="text-xs text-slate-500">{user?.rol || 'Rol'}</p>
                            </div>
                            <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                {user?.avatar_url ? (
                                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <UserCircle className="w-6 h-6" />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 flex-1 overflow-x-hidden">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
