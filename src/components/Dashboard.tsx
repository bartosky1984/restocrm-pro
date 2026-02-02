
import React from 'react';
import { db } from '../services/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

const Dashboard: React.FC = () => {
  const stats = db.getStats();
  const topDishes = db.getTopDishes();

  const weeklyData = [
    { name: 'Lun', value: 420 }, { name: 'Mar', value: 380 }, { name: 'Mie', value: 510 },
    { name: 'Jue', value: 440 }, { name: 'Vie', value: 890 }, { name: 'Sab', value: 1200 }, { name: 'Dom', value: 950 },
  ];

  const metrics = [
    { title: 'Ventas de Hoy', value: `€${stats.ingresosHoy.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2', color: 'bg-emerald-500', trend: '+14.2%', text: 'text-emerald-500' },
    { title: 'Pedidos Activos', value: stats.pedidosHoy.toString(), icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'bg-indigo-500', trend: '+5.4%', text: 'text-indigo-500' },
    { title: 'Ticket Medio', value: `€${stats.ticketPromedio.toFixed(2)}`, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6', color: 'bg-amber-500', trend: '-2.1%', text: 'text-amber-500' },
    { title: 'Crecimiento', value: '24.5%', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: 'bg-rose-500', trend: 'Estable', text: 'text-rose-500' }
  ];

  return (
    <div className="space-y-10">
      {/* Alertas Críticas */}
      {stats.pedidosPendientes > 8 && (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-[2.5rem] flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-rose-500 text-white rounded-2xl">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             </div>
             <div>
               <h4 className="text-rose-900 font-extrabold text-lg tracking-tight">Sobrecarga en Cocina</h4>
               <p className="text-rose-600 font-medium text-sm">Hay {stats.pedidosPendientes} pedidos en cola. Tiempo de espera estimado +15 min.</p>
             </div>
          </div>
          <button className="px-6 py-3 bg-rose-900 text-white rounded-2xl font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-rose-900/20">Priorizar KDS</button>
        </div>
      )}

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 ${m.color} text-white rounded-2xl shadow-lg transition-transform group-hover:rotate-6`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={m.icon} />
                    </svg>
                </div>
                <div className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${m.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {m.trend}
                </div>
            </div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.15em] mb-1">{m.title}</p>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{m.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Gráfico Principal */}
        <div className="xl:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-10">
            <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Rendimiento Semanal</h3>
                <p className="text-slate-400 text-xs font-medium mt-1">Ingresos brutos comparados por día</p>
            </div>
            <div className="flex gap-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-colors">
                    Exportar Datos
                </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} />
                <Tooltip 
                  cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '4 4' }}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '16px' }}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ranking de Productos */}
        <div className="bg-[#0F172A] p-10 rounded-[3rem] shadow-xl text-white">
          <h3 className="text-xl font-extrabold mb-8 tracking-tight">Top Ventas Hoy</h3>
          <div className="space-y-8">
            {topDishes.map((dish, idx) => (
              <div key={idx} className="flex items-center gap-5 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-emerald-400 text-lg shadow-inner group-hover:scale-110 transition-transform">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-100 truncate tracking-wide">{dish.name}</p>
                  <div className="w-full bg-slate-800 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(dish.count / topDishes[0].count) * 100}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-white leading-none">{dish.count}</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase mt-1">UDS</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-12 py-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em] transition-all">Análisis Detallado</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
