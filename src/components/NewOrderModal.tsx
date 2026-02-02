
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { MenuItem, OrderItem, OrderType, PaymentMethod, MenuCategory as Category } from '../types';
import { useAuth } from '../context/AuthContext';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('SALA');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('EFECTIVO');
  const [mesa, setMesa] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.restaurant_id || !isOpen) return;
      setLoading(true);
      try {
        const [cats, items] = await Promise.all([
          db.getCategories(user.restaurant_id),
          db.getMenu(user.restaurant_id)
        ]);
        setCategories(cats);
        setMenuItems(items);
      } catch (err) {
        console.error('Error fetching data for modal:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.restaurant_id, isOpen]);

  const filteredMenu = menuItems.filter(i => {
    const matchCat = activeCategory === 'all' || i.category_id === activeCategory;
    const matchSearch = i.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch && i.disponible;
  });

  const addToCart = (item: MenuItem) => {
    const existing = cart.find(i => i.menu_item_id === item.id);
    if (existing) {
      setCart(cart.map(i => i.menu_item_id === item.id ? { ...i, cantidad: i.cantidad + 1, total_item: (i.cantidad + 1) * i.precio_unitario } : i));
    } else {
      setCart([...cart, {
        id: Math.random().toString(36).substr(2, 9),
        order_id: '', // Will be set on server/after creation
        menu_item_id: item.id,
        nombre_item_snapshot: item.nombre,
        precio_unitario: item.precio_base,
        cantidad: 1,
        variantes_json: [],
        extras_json: [],
        impuestos_item: item.precio_base * (item.impuesto || 0 / 100),
        total_item: item.precio_base
      }]);
    }
  };

  const handleSave = async () => {
    if (cart.length === 0 || !user?.restaurant_id) return;
    const subtotal = cart.reduce((acc, i) => acc + i.total_item, 0);
    const taxes = cart.reduce((acc, i) => acc + i.impuestos_item * i.cantidad, 0);

    try {
      await db.addOrder({
        id: '', // Server will handle ID if using unique(), but db.ts expects it
        restaurant_id: user.restaurant_id,
        customer_id: null,
        tipo: orderType,
        estado: 'NUEVO',
        subtotal,
        descuento: 0,
        impuestos: taxes,
        propina: 0,
        total: subtotal + taxes,
        moneda: 'EUR',
        metodo_pago: paymentMethod,
        mesa: orderType === 'SALA' ? mesa : undefined,
        cupon_id: null,
        codigo_cupon_aplicado: null,
        nota_cliente: null,
        nota_cocina: null,
        tiempo_estimado_min: null,
        entregado_en: null,
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
        items: cart
      });
      onClose();
      setCart([]);
    } catch (err) {
      console.error('Error saving order:', err);
      alert('Error al guardar el pedido. Inténtelo de nuevo.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-[95%] h-[90vh] bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-fade-in">

        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Terminal de Ventas</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Nuevo Pedido • Punto de Venta #01</p>
          </div>
          <button onClick={onClose} className="p-4 bg-slate-100 text-slate-400 hover:bg-rose-500 hover:text-white rounded-[1.5rem] transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* Selector de Categorías Lateral */}
          <div className="w-24 border-r border-slate-100 flex flex-col items-center py-8 gap-4 overflow-y-auto hide-scrollbar shrink-0">
            <button onClick={() => setActiveCategory('all')} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeCategory === 'all' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
              <span className="text-[10px] font-black uppercase tracking-tighter">TODOS</span>
            </button>
            {categories.map(c => (
              <button key={c.id} onClick={() => setActiveCategory(c.id)} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeCategory === c.id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                <span className="text-[8px] font-black uppercase text-center leading-none px-1">{c.nombre}</span>
              </button>
            ))}
          </div>

          {/* Grid de Productos Principal */}
          <div className="flex-1 flex flex-col bg-slate-50/50 min-w-0">
            <div className="p-6 border-b border-slate-100 bg-white">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre, código o ingrediente..."
                  className="w-full pl-14 pr-6 py-4 bg-slate-100 border-none rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-emerald-500/10"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 hide-scrollbar">
              {loading ? (
                <div className="col-span-full text-center py-12 text-slate-400 font-bold italic">Cargando carta...</div>
              ) : filteredMenu.map(item => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left flex flex-col group"
                >
                  <div className="relative mb-4">
                    <img src={item.img_url} className="w-full h-32 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 px-3 py-1 bg-white/90 backdrop-blur rounded-xl text-xs font-black text-slate-900 shadow-sm border border-slate-100/50">
                      €{item.precio_base.toFixed(2)}
                    </div>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 line-clamp-1">{item.nombre}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{item.sku}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Checkout Panel Lateral */}
          <div className="w-[420px] bg-white border-l border-slate-100 flex flex-col shadow-2xl shrink-0">
            <div className="p-8 flex-1 overflow-y-auto hide-scrollbar">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Cesta Actual</h3>
                <button onClick={() => setCart([])} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">Vaciar</button>
              </div>

              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 italic text-center gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-sm">Selecciona productos de la carta para añadirlos al pedido</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map(i => (
                    <div key={i.id} className="flex justify-between items-center gap-4 animate-fade-in group">
                      <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shrink-0">
                        {i.cantidad}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-extrabold text-slate-900 truncate tracking-tight">{i.nombre_item_snapshot}</p>
                        <p className="text-[10px] text-slate-400 font-bold">€{i.precio_unitario.toFixed(2)} / ud</p>
                      </div>
                      <p className="text-sm font-black text-slate-900">€{i.total_item.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-900 text-white space-y-6 rounded-t-[3rem] shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Método</label>
                  <select className="w-full bg-slate-800 border-none rounded-2xl text-xs font-black text-white py-3" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)}>
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="TPV">Tarjeta</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Servicio</label>
                  <select className="w-full bg-slate-800 border-none rounded-2xl text-xs font-black text-white py-3" value={orderType} onChange={e => setOrderType(e.target.value as any)}>
                    <option value="SALA">Sala</option>
                    <option value="DELIVERY">Delivery</option>
                    <option value="PARA_LLEVAR">Takeaway</option>
                  </select>
                </div>
              </div>

              {orderType === 'SALA' && (
                <div className="animate-fade-in">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Asignar Mesa</label>
                  <input type="text" className="w-full bg-slate-800 border-none rounded-2xl text-xs font-black text-white py-3" placeholder="Ej: Terraza 04" value={mesa} onChange={e => setMesa(e.target.value)} />
                </div>
              )}

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>Subtotal</span>
                  <span>€{cart.reduce((acc, i) => acc + i.total_item, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-white pt-2 tracking-tighter">
                  <span>TOTAL</span>
                  <span className="text-emerald-400">€{(cart.reduce((acc, i) => acc + i.total_item, 0) * 1.1).toFixed(2)}</span>
                </div>
                <button
                  onClick={handleSave}
                  disabled={cart.length === 0}
                  className="w-full mt-6 py-5 bg-emerald-500 text-slate-950 font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  Confirmar e Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrderModal;
