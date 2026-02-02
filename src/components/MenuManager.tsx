import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { MenuItem, MenuCategory as Category } from '../types';
import { useAuth } from '../context/AuthContext';

const MenuManager: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    if (!user?.restaurant_id) return;
    setLoading(true);
    try {
      const [cats, menuItems] = await Promise.all([
        db.getCategories(user.restaurant_id),
        db.getMenu(user.restaurant_id)
      ]);
      setCategories(cats);
      setItems(menuItems);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.restaurant_id]);

  const filteredItems = items.filter(item => {
    const matchesCat = activeCategory === 'all' || item.category_id === activeCategory;
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    await db.toggleMenuItemAvailability(id, currentStatus);
    // Local update for responsiveness
    setItems(items.map(item => item.id === id ? { ...item, disponible: !currentStatus } : item));
  };

  if (loading && items.length === 0) {
    return <div className="p-8 text-center text-slate-500 font-bold">Cargando menú...</div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Administración de Menú</h1>
          <p className="text-gray-500 text-sm">Gestiona tus productos y disponibilidad en tiempo real.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 bg-white text-gray-600 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Importar CSV
          </button>
          <button className="px-6 py-2 bg-emerald-500 text-slate-900 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:opacity-90">
            Nuevo Producto
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-48 shrink-0">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Categorías</h3>
            <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-bold text-left whitespace-nowrap ${activeCategory === 'all' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold text-left whitespace-nowrap ${activeCategory === cat.id ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar plato por nombre o SKU..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredItems.map(item => (
                <div key={item.id} className={`p-4 rounded-2xl border transition-all flex gap-4 ${item.disponible ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
                  <img src={item.img_url || ''} className="w-20 h-20 rounded-xl object-cover shrink-0" alt={item.nombre} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{item.nombre}</h4>
                      <p className="text-sm font-black text-emerald-600">€{item.precio_base.toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.descripcion}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex gap-1">
                        {item.etiquetas.map((tag, idx) => (
                          <span key={idx} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 uppercase tracking-tighter">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{item.sku}</span>
                        <button
                          onClick={() => toggleAvailability(item.id, item.disponible)}
                          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${item.disponible ? 'bg-emerald-500' : 'bg-gray-300'}`}
                        >
                          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.disponible ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && !loading && (
                <div className="col-span-full py-20 text-center text-gray-400">
                  <p className="text-sm font-bold italic">No hay platos que coincidan con la búsqueda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuManager;
