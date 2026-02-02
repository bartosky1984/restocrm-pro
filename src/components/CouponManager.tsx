
import React, { useState } from 'react';
import { db } from '../services/db';
import { Coupon } from '../types';

const CouponManager: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(db.getCoupons());

  const toggleStatus = (id: string) => {
    // Simple mock update
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, activo: !c.activo } : c));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Cupones & Promos</h1>
          <p className="text-gray-500 text-sm">Gestiona ofertas y códigos de descuento activos.</p>
        </div>
        <button className="px-6 py-2 bg-emerald-500 text-slate-900 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nueva Promoción
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {coupons.map(coupon => (
          <div key={coupon.id} className={`bg-white p-6 rounded-2xl border transition-all ${coupon.activo ? 'border-emerald-100 shadow-sm' : 'border-gray-200 opacity-60'}`}>
            <div className="flex justify-between items-start mb-4">
               <div className="bg-slate-900 text-white px-3 py-1 rounded-lg font-black text-sm tracking-widest uppercase">
                 {coupon.codigo}
               </div>
               <button onClick={() => toggleStatus(coupon.id)} className={`w-10 h-6 rounded-full transition-colors relative ${coupon.activo ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${coupon.activo ? 'left-5' : 'left-1'}`} />
               </button>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black text-gray-900">
                {coupon.tipo === 'PORCENTAJE' ? `${coupon.valor}%` : `€${coupon.valor.toFixed(2)}`}
                <span className="text-sm font-bold text-gray-400 ml-2">de descuento</span>
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                </svg>
                Expira: {coupon.expira_en}
              </div>
              {coupon.minimo_subtotal && (
                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded uppercase">
                  Mínimo compra: €{coupon.minimo_subtotal}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouponManager;
