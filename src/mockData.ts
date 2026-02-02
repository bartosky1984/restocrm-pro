
import { Category, MenuItem, Customer, Coupon, Order, User } from './types';

export const currentUser: User = {
  id: 'u1',
  restaurant_id: 'rest1',
  nombre: 'Carlos Ruiz',
  email: 'admin@lapizarra.com',
  rol: 'ADMIN',
  activo: true,
  avatar_url: 'https://picsum.photos/seed/user1/100/100'
};

export const categories: Category[] = [
  { id: 'cat1', nombre: 'Entrantes', orden: 1, activo: true },
  { id: 'cat2', nombre: 'Principales', orden: 2, activo: true },
  { id: 'cat3', nombre: 'Postres', orden: 3, activo: true },
  { id: 'cat4', nombre: 'Bebidas', orden: 4, activo: true },
  { id: 'cat5', nombre: 'Promos', orden: 5, activo: true },
  { id: 'cat6', nombre: 'Extras', orden: 6, activo: true }
];

export const menuItems: MenuItem[] = [
  {
    id: 'm1',
    category_id: 'cat1',
    nombre: 'Croquetas de Jamón',
    descripcion: '6 unidades de croquetas caseras tradicionales.',
    precio_base: 8.5,
    coste: 2.1,
    img_url: 'https://picsum.photos/seed/croq/400/300',
    etiquetas: [],
    impuesto: 10,
    disponible: true,
    tiempo_preparacion_min: 10,
    sku: 'ENT-001',
    stock_actual: 50,
    permite_venta_sin_stock: false
  },
  {
    id: 'm2',
    category_id: 'cat2',
    nombre: 'Burger La Pizarra',
    descripcion: '200g de ternera, queso brie, cebolla caramelizada y rúcula.',
    precio_base: 14.9,
    coste: 4.5,
    img_url: 'https://picsum.photos/seed/burger/400/300',
    etiquetas: ['picante'],
    impuesto: 10,
    disponible: true,
    tiempo_preparacion_min: 15,
    sku: 'PRI-001',
    stock_actual: 30,
    permite_venta_sin_stock: false
  },
  {
    id: 'm3',
    category_id: 'cat2',
    nombre: 'Pizza Margarita',
    descripcion: 'Mozzarella fresca, tomate San Marzano y albahaca.',
    precio_base: 12.0,
    coste: 3.0,
    img_url: 'https://picsum.photos/seed/pizza/400/300',
    etiquetas: ['vegano'],
    impuesto: 10,
    disponible: true,
    tiempo_preparacion_min: 12,
    sku: 'PRI-002',
    stock_actual: 100,
    permite_venta_sin_stock: true
  },
  {
    id: 'm4',
    category_id: 'cat3',
    nombre: 'Tarta de Queso',
    descripcion: 'Receta secreta horneada al estilo San Sebastián.',
    precio_base: 6.5,
    coste: 1.5,
    img_url: 'https://picsum.photos/seed/cake/400/300',
    etiquetas: ['sin_gluten'],
    impuesto: 10,
    disponible: true,
    tiempo_preparacion_min: 5,
    sku: 'POS-001',
    stock_actual: 15,
    permite_venta_sin_stock: false
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'c1',
    nombre: 'Juan Pérez',
    telefono: '600111222',
    email: 'juan@email.com',
    direccion_principal: 'Calle Mayor 10, Madrid',
    ltv: 450,
    ultima_compra: '2023-11-20',
    frecuencia: 5
  },
  {
    id: 'c2',
    nombre: 'Maria Garcia',
    telefono: '611222333',
    email: 'maria@email.com',
    direccion_principal: 'Av. Libertad 5, Madrid',
    ltv: 120,
    ultima_compra: '2023-10-05',
    frecuencia: 60
  }
];

export const initialCoupons: Coupon[] = [
  { id: 'cp1', codigo: 'BIENVENIDA10', tipo: 'PORCENTAJE', valor: 10, activo: true, expira_en: '2024-12-31' },
  { id: 'cp2', codigo: 'PROMO5', tipo: 'FIJO', valor: 5, activo: true, expira_en: '2024-12-31', minimo_subtotal: 30 }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-1024',
    tipo: 'SALA',
    mesa: '04',
    estado: 'NUEVO',
    subtotal: 42.5,
    descuento: 0,
    impuestos: 4.25,
    propina: 2.0,
    total: 48.75,
    metodo_pago: 'TPV',
    creado_en: new Date().toISOString(),
    items: [
      { id: 'oi1', menu_item_id: 'm2', nombre: 'Burger La Pizarra', precio_unitario: 14.9, cantidad: 2, impuestos_item: 2.98, total_item: 29.8 },
      { id: 'oi2', menu_item_id: 'm1', nombre: 'Croquetas de Jamón', precio_unitario: 8.5, cantidad: 1, impuestos_item: 0.85, total_item: 8.5 }
    ]
  },
  {
    id: 'ORD-1023',
    tipo: 'DELIVERY',
    estado: 'EN_PREPARACION',
    subtotal: 18.9,
    descuento: 0,
    impuestos: 1.89,
    propina: 0,
    total: 20.79,
    metodo_pago: 'ONLINE',
    creado_en: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    items: [
      { id: 'oi3', menu_item_id: 'm3', nombre: 'Pizza Margarita', precio_unitario: 12.0, cantidad: 1, impuestos_item: 1.2, total_item: 12.0 },
      { id: 'oi4', menu_item_id: 'm4', nombre: 'Tarta de Queso', precio_unitario: 6.9, cantidad: 1, impuestos_item: 0.69, total_item: 6.9 }
    ]
  }
];
