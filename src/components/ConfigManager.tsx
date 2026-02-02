
import React from 'react';

const ConfigManager: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Configuración</h1>
        <p className="text-gray-500 text-sm">Ajustes del restaurante, usuarios y parámetros del sistema.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Datos del Restaurante</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nombre Comercial</label>
                <input type="text" defaultValue="Restaurante La Pizarra" className="w-full bg-gray-50 border-none rounded-xl text-sm font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email de Contacto</label>
                <input type="email" defaultValue="contacto@lapizarra.com" className="w-full bg-gray-50 border-none rounded-xl text-sm font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Teléfono</label>
                <input type="text" defaultValue="+34 912 345 678" className="w-full bg-gray-50 border-none rounded-xl text-sm font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Moneda</label>
                <select className="w-full bg-gray-50 border-none rounded-xl text-sm font-bold">
                  <option>EUR (€)</option>
                  <option>USD ($)</option>
                </select>
              </div>
            </div>
            <button className="mt-8 px-6 py-3 bg-emerald-500 text-slate-900 font-black rounded-xl text-sm shadow-lg shadow-emerald-500/10 hover:opacity-90 transition-all">
              Guardar Cambios
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Impuestos y Servicio</h3>
            <div className="space-y-6">
               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                 <div>
                   <p className="text-sm font-bold text-gray-900">IVA por defecto</p>
                   <p className="text-xs text-gray-500">Aplicado a todos los productos si no se especifica.</p>
                 </div>
                 <div className="flex items-center gap-2">
                   <input type="number" defaultValue="10" className="w-16 bg-white border-gray-200 rounded-lg text-sm font-bold text-center" />
                   <span className="text-sm font-bold text-gray-400">%</span>
                 </div>
               </div>
               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                 <div>
                   <p className="text-sm font-bold text-gray-900">Propina Sugerida</p>
                   <p className="text-xs text-gray-500">Valor mostrado por defecto en caja.</p>
                 </div>
                 <div className="flex items-center gap-2">
                   <input type="number" defaultValue="5" className="w-16 bg-white border-gray-200 rounded-lg text-sm font-bold text-center" />
                   <span className="text-sm font-bold text-gray-400">%</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold mb-6">Estado del Sistema</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Versión</span>
                <span className="font-mono">v1.2.4-stable</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Base de Datos</span>
                <span className="text-emerald-400 font-bold">Conectado (Mock)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Almacenamiento</span>
                <span className="font-bold">LocalStorage (84KB used)</span>
              </div>
              <hr className="border-slate-800" />
              <button className="w-full py-3 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition-all">
                Realizar Backup
              </button>
              <button className="w-full py-3 text-rose-400 text-xs font-bold hover:bg-rose-500/10 rounded-xl transition-all">
                Limpiar Caché
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigManager;
