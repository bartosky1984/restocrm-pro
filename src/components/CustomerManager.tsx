
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Customer } from '../types';
import { useAuth } from '../context/AuthContext';

const CustomerManager: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user?.restaurant_id) return;

    setLoading(true);
    db.getCustomers(user.restaurant_id)
      .then(data => setCustomers(data))
      .catch(err => console.error('Error fetching customers:', err))
      .finally(() => setLoading(false));
  }, [user?.restaurant_id]);

  const filtered = customers.filter(c =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Base de Clientes</h1>
          <p className="text-gray-500 text-sm">Gestiona la relación y fidelidad de tus comensales.</p>
        </div>
        <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50/50 border-b border-gray-100">
          <div className="relative max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              className="w-full pl-9 pr-4 py-2 text-xs font-bold border-none bg-white rounded-lg shadow-sm focus:ring-emerald-500/20"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="py-20 text-center text-gray-400 font-bold animate-pulse">Cargando clientes de Appwrite...</div>
          ) : (
            <>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-gray-50/20">
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Contacto</th>
                    <th className="px-6 py-4">Frecuencia</th>
                    <th className="px-6 py-4">LTV (Ventas)</th>
                    <th className="px-6 py-4">Última Compra</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50 group transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">{c.nombre}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{c.direccion_principal || 'Sin dirección'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-600 font-medium">{c.email || 'Sin email'}</p>
                        <p className="text-[10px] text-gray-400">{c.telefono || 'Sin teléfono'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-500">Cada {c.frecuencia_promedio_dias || 0} días</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-emerald-600">€{(c.ltv || 0).toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-500">{c.ultima_compra || 'Sin actividad'}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-emerald-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-20 text-center text-gray-300 italic text-sm font-medium">No se encontraron clientes en tu base de datos</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerManager;
