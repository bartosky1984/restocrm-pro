
export type UserRole = 'ADMIN' | 'GERENTE' | 'CAJERO' | 'COCINA' | 'REPARTO';
export type OrderStatus = 'NUEVO' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'CANCELADO';
export type OrderType = 'SALA' | 'PARA_LLEVAR' | 'DELIVERY';
export type PaymentMethod = 'EFECTIVO' | 'TPV' | 'ONLINE' | 'OTRO';
export type CouponType = 'PORCENTAJE' | 'FIJO';
export type ShipmentStatus = 'ASIGNADO' | 'EN_RUTA' | 'ENTREGADO';

export interface Restaurant {
  id: string;
  nombre: string;
  slug: string;
  logo_url: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  horario_json: any; // JSONB
  moneda: string;
  impuesto_por_defecto: number;
  propina_por_defecto: number;
  creado_en: string;
  actualizado_en: string;
}

export interface User {
  id: string;
  restaurant_id: string;
  nombre: string;
  email: string;
  avatar_url: string | null;
  rol: UserRole;
  activo: boolean;
  ultimo_login?: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  nombre: string;
  orden: number;
  activo: boolean;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  coste: number;
  img_url: string | null;
  etiquetas: string[]; // JSONB
  impuesto: number | null;
  disponible: boolean;
  tiempo_preparacion_min: number;
  sku: string | null;
  stock_actual: number | null;
  permite_venta_sin_stock: boolean;
  created_at?: string;
}

export interface MenuVariant {
  id: string;
  menu_item_id: string;
  nombre: string;
  precio_incremento: number;
  sku: string | null;
}

export interface Customer {
  id: string;
  restaurant_id: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  notas: string | null;
  alergias: string | null; // Text or JSON? Schema said TEXT but typically this is free text.
  direccion_principal: string | null;
  direcciones: any[]; // JSONB
  ltv: number;
  ultima_compra: string | null;
  frecuencia_promedio_dias: number;
  created_at?: string;
}

export interface Coupon {
  id: string;
  restaurant_id: string;
  codigo: string;
  tipo: CouponType;
  valor: number;
  aplica_antes_impuestos: boolean;
  minimo_subtotal: number | null;
  canales_validos: string[]; // JSONB
  categorias_incluidas: string[]; // JSONB
  categorias_excluidas: string[]; // JSONB
  uso_maximo_global: number | null;
  uso_maximo_por_cliente: number | null;
  activo: boolean;
  inicia_en: string;
  expira_en: string | null;
}

export interface Order {
  id: string;
  restaurant_id: string;
  customer_id: string | null;
  tipo: OrderType;
  estado: OrderStatus;
  subtotal: number;
  descuento: number;
  impuestos: number;
  propina: number;
  total: number;
  moneda: string;
  metodo_pago: PaymentMethod;
  mesa?: string;
  cupon_id: string | null;
  codigo_cupon_aplicado: string | null;
  nota_cliente: string | null;
  nota_cocina: string | null;
  tiempo_estimado_min: number | null;
  entregado_en: string | null;
  creado_en: string;
  actualizado_en: string;
  // Relations
  items?: OrderItem[];
  customer?: Customer;
}

export interface DashboardStats {
  totalVentas: number;
  pedidosHoy: number;
  clientesNuevos: number;
  promedioTicket: number;
  ventasPorHora: { hora: number; total: number }[];
  categoriasPopulares: { nombre: string; valor: number }[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  nombre_item_snapshot: string;
  precio_unitario: number;
  cantidad: number;
  variantes_json: any[]; // JSONB
  extras_json: any[]; // JSONB
  impuestos_item: number;
  total_item: number;
}

export interface DeliveryZone {
  id: string;
  restaurant_id: string;
  nombre: string;
  tipo: string;
  geometria_json: any;
  tarifa: number;
  tiempo_extra_min: number;
}

export interface Driver {
  id: string;
  restaurant_id: string;
  nombre: string;
  telefono: string | null;
  vehiculo: string | null;
  activo: boolean;
}

export interface Shipment {
  id: string;
  order_id: string;
  driver_id: string | null;
  estado_envio: ShipmentStatus;
  direccion_envio: string | null;
  zona_id: string | null;
  actualizado_en: string;
}
