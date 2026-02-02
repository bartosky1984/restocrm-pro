
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Order, OrderStatus } from '../types';
import { useAuth } from '../context/AuthContext';

const KDS: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user?.restaurant_id) return;
    try {
      const data = await db.getOrders(user.restaurant_id);
      setOrders(data.filter(o => ['NUEVO', 'EN_PREPARACION', 'LISTO'].includes(o.estado)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // 10s for Appwrite sync
    return () => clearInterval(interval);
  }, [user?.restaurant_id]);

  const advanceOrder = async (id: string, current: OrderStatus) => {
    let next: OrderStatus = 'EN_PREPARACION';
    if (current === 'EN_PREPARACION') next = 'LISTO';
    else if (current === 'LISTO') next = 'ENTREGADO';

    try {
      await db.updateOrderStatus(id, next);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, estado: next } : o).filter(o => ['NUEVO', 'EN_PREPARACION', 'LISTO'].includes(o.estado)));

      if (next === 'LISTO') {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => { });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns: { id: OrderStatus, label: string, color: string }[] = [
    { id: 'NUEVO', label: 'Cola de Entrada', color: 'border-indigo-500' },
    { id: 'EN_PREPARACION', label: 'En Fogones', color: 'border-amber-500' },
    { id: 'LISTO', label: 'Pase / Listos', color: 'border-emerald-500' }
  ];

  if (loading && orders.length === 0) {
    return <div className="p-8 text-center text-slate-500 font-bold">Cargando monitor de cocina...</div>;
  }

  return (
    <div className="h-full flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-extrabold tracking-tight">Monitor de Cocina</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">KDS Station #01</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-3">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
            <p className="text-xs font-bold text-slate-600 tracking-tight">Conectado a Comandero Web</p>
          </div>
        </div>
      </div>

      <div className="flex gap-8 flex-1 min-h-0 overflow-x-auto pb-4 hide-scrollbar">
        {columns.map(col => (
          <div key={col.id} className={`flex-1 flex flex-col min-w-[380px] bg-slate-100/40 rounded-[2.5rem] border-t-8 ${col.color} p-6`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">{col.label}</h3>
              <span className="bg-white px-4 py-1 rounded-xl text-xs font-black text-slate-600 shadow-sm border border-slate-200/50">
                {orders.filter(o => o.estado === col.id).length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 hide-scrollbar">
              {orders.filter(o => o.estado === col.id).map(order => {
                const mins = Math.floor((Date.now() - new Date(order.creado_en).getTime()) / 60000);
                const isDelayed = mins > 15 && col.id !== 'LISTO';

                return (
                  <div key={order.id} className={`bg-white rounded-3xl shadow-lg shadow-slate-200/50 border transition-all duration-300 ${isDelayed ? 'border-rose-300 bg-rose-50/20' : 'border-slate-100'}`}>
                    <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest ${order.tipo === 'SALA' ? 'bg-indigo-50 text-indigo-500' : 'bg-amber-50 text-amber-500'
                            }`}>
                            {order.tipo}
                          </span>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 mt-2 tracking-tighter">#{order.id.slice(0, 8)}</h4>
                      </div>
                      <div className={`text-right px-4 py-2 rounded-2xl ${isDelayed ? 'bg-rose-500 text-white' : 'bg-slate-50 text-slate-500'}`}>
                        <p className="text-[10px] font-black uppercase leading-none mb-1">Tiempo</p>
                        <p className="text-lg font-black leading-none">{mins}'</p>
                      </div>
                    </div>

                    <div className="p-6">
                      <ul className="space-y-4">
                        {order.items?.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-4 group">
                            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 group-hover:scale-110 transition-transform">
                              {item.cantidad}
                            </div>
                            <div className="flex-1">
                              <p className="text-base font-bold text-slate-900 leading-tight">{item.nombre_item_snapshot}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {order.nota_cocina && (
                        <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-slate-500">
                          "{order.nota_cocina}"
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <button
                        onClick={() => advanceOrder(order.id, order.estado)}
                        className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${col.id === 'NUEVO' ? 'bg-slate-900 text-white hover:bg-slate-800' :
                            col.id === 'EN_PREPARACION' ? 'bg-emerald-500 text-slate-900 hover:scale-[1.02]' :
                              'bg-indigo-500 text-white'
                          }`}
                      >
                        {col.id === 'NUEVO' ? 'Comenzar Marcha' : col.id === 'EN_PREPARACION' ? 'Marcar como Listo' : 'Entregar Pedido'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KDS;
