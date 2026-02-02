
import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, Utensils } from 'lucide-react';
import { db } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';

export default function Dashboard() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.restaurant_id) return;
            try {
                const [ordersData, customersData] = await Promise.all([
                    db.getOrders(user.restaurant_id),
                    db.getCustomers(user.restaurant_id)
                ]);
                setOrders(ordersData);
                setCustomers(customersData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user?.restaurant_id]);

    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => o.creado_en.startsWith(today));

    // Calculate Top Products
    const productStats: Record<string, { count: number; total: number }> = {};
    orders.forEach(order => {
        order.items?.forEach(item => {
            const itemName = item.nombre_item_snapshot || (item as any).nombre || 'Producto Desconocido';
            if (!productStats[itemName]) {
                productStats[itemName] = { count: 0, total: 0 };
            }
            productStats[itemName].count += item.cantidad;
            productStats[itemName].total += item.total_item || (item.precio_unitario * item.cantidad);
        });
    });

    const topProducts = Object.entries(productStats)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Calculate Sales by Hour (Today)
    const salesByHour = Array(24).fill(0);
    todayOrders.forEach(o => {
        const hour = new Date(o.creado_en).getHours();
        salesByHour[hour] += o.total;
    });

    const maxSale = Math.max(...salesByHour, 1);

    const stats = [
        {
            title: 'Ventas de Hoy',
            value: `€${todayOrders.reduce((acc, o) => acc + o.total, 0).toFixed(2)}`,
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-100'
        },
        {
            title: 'Pedidos Hoy',
            value: todayOrders.length.toString(),
            icon: ShoppingBag,
            color: 'text-blue-600',
            bg: 'bg-blue-100'
        },
        {
            title: 'Clientes Totales',
            value: customers.length.toString(),
            icon: Users,
            color: 'text-indigo-600',
            bg: 'bg-indigo-100'
        },
        {
            title: 'Platos Vendidos',
            value: todayOrders.reduce((acc, o) => acc + (o.items?.reduce((iAcc, item) => iAcc + item.cantidad, 0) || 0), 0).toString(),
            icon: Utensils,
            color: 'text-orange-600',
            bg: 'bg-orange-100'
        },
    ];

    if (loading && orders.length === 0) {
        return (
            <div className="p-8 text-center text-slate-500 font-bold animate-pulse">
                Cargando métricas en tiempo real...
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Estado del Negocio</h2>
                <p className="text-slate-500">Métricas analíticas basadas en el volumen actual de datos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
                        <div className={`p-4 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Chart (CSS Based) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Ventas por Hora (Hoy)</h3>
                    <div className="h-48 flex items-end gap-1 px-2">
                        {salesByHour.map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                                <div
                                    className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all cursor-help"
                                    style={{ height: `${(val / maxSale) * 100}%`, minHeight: val > 0 ? '2px' : '0' }}
                                >
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                        {i}:00 - €{val.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-medium border-t pt-2">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>23:00</span>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Top 5 Productos (Histórico)</h3>
                    <div className="space-y-4">
                        {topProducts.length > 0 ? topProducts.map((prod, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                                    {i + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-bold text-slate-700">{prod.name}</span>
                                        <span className="text-xs font-semibold text-slate-500">{prod.count} uds.</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-indigo-500 h-full rounded-full"
                                            style={{ width: `${(prod.count / topProducts[0].count) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                                Sin datos suficientes para el ranking
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent activity */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">Actividad de Pedidos Reciente</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs text-slate-400 font-bold uppercase tracking-wider border-b">
                                <th className="pb-4">ID</th>
                                <th className="pb-4">Estado</th>
                                <th className="pb-4">Tipo</th>
                                <th className="pb-4">Total</th>
                                <th className="pb-4 text-right">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders.slice(0, 5).map((order) => (
                                <tr key={order.id} className="group hover:bg-slate-50 transition-colors">
                                    <td className="py-4 text-sm font-bold text-slate-700">#{order.id.slice(-6)}</td>
                                    <td className="py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${order.estado === 'ENTREGADO' ? 'bg-green-100 text-green-700' :
                                            order.estado === 'CANCELADO' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {order.estado}
                                        </span>
                                    </td>
                                    <td className="py-4 text-sm text-slate-500">{order.tipo}</td>
                                    <td className="py-4 text-sm font-bold text-slate-800">€{order.total.toFixed(2)}</td>
                                    <td className="py-4 text-sm text-slate-500 text-right">
                                        {new Date(order.creado_en).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
