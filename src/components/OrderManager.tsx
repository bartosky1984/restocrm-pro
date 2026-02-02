
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Order, OrderStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import NewOrderModal from './NewOrderModal';

const OrderManager: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    if (!user?.restaurant_id) return;
    setLoading(true);
    try {
      const data = await db.getOrders(user.restaurant_id);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.restaurant_id]);

  const filteredOrders = orders.filter(o => {
    const statusMatch = filterStatus === 'all' || o.estado === filterStatus;
    const typeMatch = filterType === 'all' || o.tipo === filterType;
    return statusMatch && typeMatch;
  });

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'NUEVO': return 'bg-blue-50 text-blue-600';
      case 'EN_PREPARACION': return 'bg-orange-50 text-orange-600';
      case 'LISTO': return 'bg-emerald-50 text-emerald-600';
      case 'ENTREGADO': return 'bg-gray-100 text-gray-500';
      default: return 'bg-rose-50 text-rose-600';
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchOrders();
  };

  if (loading && orders.length === 0) {
    return <div className="p-8 text-center text-slate-500 font-bold">Cargando pedidos...</div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Historial de Pedidos</h1>
          <p className="text-gray-500 text-sm">Gestiona y consulta todos los pedidos del restaurante.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-emerald-500 text-slate-900 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 hover:opacity-90 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Nuevo Pedido
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between bg-gray-50/50">
          <div className="flex gap-2">
            <select
              className="text-xs font-bold border-none bg-white rounded-lg shadow-sm focus:ring-emerald-500/20"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">TODOS LOS ESTADOS</option>
              <option value="NUEVO">NUEVO</option>
              <option value="EN_PREPARACION">EN PREPARACIÓN</option>
              <option value="LISTO">LISTO</option>
              <option value="ENTREGADO">ENTREGADO</option>
            </select>
            <select
              className="text-xs font-bold border-none bg-white rounded-lg shadow-sm focus:ring-emerald-500/20"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">TODOS LOS TIPOS</option>
              <option value="SALA">SALA</option>
              <option value="PARA_LLEVAR">PARA LLEVAR</option>
              <option value="DELIVERY">DELIVERY</option>
            </select>
          </div>
          <div className="text-xs font-bold text-gray-400">
            {filteredOrders.length} PEDIDOS ENCONTRADOS
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">TIPO</th>
                <th className="px-6 py-4">ESTADO</th>
                <th className="px-6 py-4">CREADO</th>
                <th className="px-6 py-4">TOTAL</th>
                <th className="px-6 py-4 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900">#{order.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-gray-500 flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={order.tipo === 'SALA' ? 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' : 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'} />
                      </svg>
                      {order.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-tight ${getStatusStyle(order.estado)}`}>
                      {order.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500">{new Date(order.creado_en).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-gray-900">€{order.total.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-emerald-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && !loading && (
            <div className="py-20 text-center text-gray-400">
              <p className="text-sm font-bold italic">No se encontraron pedidos con estos filtros.</p>
            </div>
          )}
        </div>
      </div>

      <NewOrderModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default OrderManager;
