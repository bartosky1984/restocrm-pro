
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    ChefHat,
    Users,
    Utensils,
    Ticket,
    Truck,
    BarChart3,
    Settings,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

export default function Sidebar() {
    const { signOut, user } = useAuth();

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'GERENTE'] },
        { to: '/orders', icon: ShoppingBag, label: 'Pedidos', roles: ['ADMIN', 'GERENTE', 'CAJERO'] },
        { to: '/kds', icon: ChefHat, label: 'Cocina (KDS)', roles: ['ADMIN', 'GERENTE', 'COCINA'] },
        { to: '/menu', icon: Utensils, label: 'Menú', roles: ['ADMIN', 'GERENTE'] },
        { to: '/customers', icon: Users, label: 'Clientes', roles: ['ADMIN', 'GERENTE', 'CAJERO'] },
        { to: '/coupons', icon: Ticket, label: 'Cupones', roles: ['ADMIN', 'GERENTE'] },
        { to: '/delivery', icon: Truck, label: 'Reparto', roles: ['ADMIN', 'GERENTE', 'REPARTO'] },
        { to: '/reports', icon: BarChart3, label: 'Reportes', roles: ['ADMIN', 'GERENTE'] },
        { to: '/settings', icon: Settings, label: 'Configuración', roles: ['ADMIN'] },
    ];

    // Filter items based on user role (if no user role, show minimal or nothing?)
    // For MVP/Demo if role is missing, maybe default to ADMIN or hide all?
    // Let's hide if not authorized.
    const filteredNav = navItems.filter(item =>
        !user?.rol || item.roles.includes(user.rol)
    );

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-10">
            <div className="p-6 flex items-center gap-3 border-b border-slate-100">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <ChefHat className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-800 tracking-tight">Mesa Feliz</span>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {filteredNav.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => clsx(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                            isActive
                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        )}
                    >
                        <item.icon className={clsx("w-5 h-5", "transition-colors group-hover:text-indigo-600")} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-3 py-2 w-full text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}
