
import {
  Order, MenuItem, MenuCategory as Category, Customer, Coupon, DashboardStats
} from '../types';
import { databases, APPWRITE_DB_ID } from '../lib/appwrite';
import { ID, Query, Models } from 'appwrite';

class DatabaseService {
  // Orders
  async getOrders(restaurantId: string): Promise<Order[]> {
    const response = await databases.listDocuments(
      APPWRITE_DB_ID,
      'orders',
      [
        Query.equal('restaurant_id', restaurantId),
        Query.orderDesc('creado_en')
      ]
    );
    return response.documents.map(doc => this.mapOrder(doc));
  }

  async addOrder(order: Order): Promise<void> {
    const { id, items, customer, actualizado_en, ...orderData } = order;
    await databases.createDocument(
      APPWRITE_DB_ID,
      'orders',
      ID.unique(),
      {
        ...orderData,
        items_json: JSON.stringify(items || [])
      }
    );
  }

  async updateOrderStatus(id: string, estado: Order['estado']): Promise<void> {
    await databases.updateDocument(
      APPWRITE_DB_ID,
      'orders',
      id,
      { estado }
    );
  }

  // Menu
  async getMenu(restaurantId: string): Promise<MenuItem[]> {
    const response = await databases.listDocuments(
      APPWRITE_DB_ID,
      'menu_items',
      [Query.equal('restaurant_id', restaurantId)]
    );
    return response.documents.map(doc => this.mapMenuItem(doc));
  }

  async addMenuItem(item: MenuItem): Promise<void> {
    const { id, created_at, ...itemData } = item;
    await databases.createDocument(
      APPWRITE_DB_ID,
      'menu_items',
      ID.unique(),
      {
        ...itemData,
        etiquetas: JSON.stringify(item.etiquetas || [])
      }
    );
  }

  async getCategories(restaurantId: string): Promise<Category[]> {
    const response = await databases.listDocuments(
      APPWRITE_DB_ID,
      'menu_categories',
      [Query.equal('restaurant_id', restaurantId), Query.orderAsc('orden')]
    );
    return response.documents.map(doc => this.mapCategory(doc));
  }

  async toggleMenuItemAvailability(id: string, currentStatus: boolean): Promise<void> {
    await databases.updateDocument(
      APPWRITE_DB_ID,
      'menu_items',
      id,
      { disponible: !currentStatus }
    );
  }

  // Customers
  async getCustomers(restaurantId: string): Promise<Customer[]> {
    const response = await databases.listDocuments(
      APPWRITE_DB_ID,
      'customers',
      [Query.equal('restaurant_id', restaurantId)]
    );
    return response.documents.map(doc => this.mapCustomer(doc));
  }

  async addCustomer(customer: Customer): Promise<void> {
    const { id, created_at, addresses, ...customerData } = customer as any;
    await databases.createDocument(
      APPWRITE_DB_ID,
      'customers',
      ID.unique(),
      customerData
    );
  }

  // Coupons
  async getCoupons(restaurantId: string): Promise<Coupon[]> {
    const response = await databases.listDocuments(
      APPWRITE_DB_ID,
      'coupons',
      [Query.equal('restaurant_id', restaurantId)]
    );
    return response.documents.map(doc => this.mapCoupon(doc));
  }

  async addCoupon(coupon: Coupon): Promise<void> {
    const { id, ...couponData } = coupon;
    await databases.createDocument(
      APPWRITE_DB_ID,
      'coupons',
      ID.unique(),
      couponData
    );
  }

  // Helper Mappers
  private mapOrder(doc: any): Order {
    return {
      id: doc.$id,
      restaurant_id: doc.restaurant_id,
      customer_id: doc.customer_id,
      tipo: doc.tipo,
      estado: doc.estado,
      subtotal: doc.subtotal || 0,
      descuento: doc.descuento || 0,
      impuestos: doc.impuestos || 0,
      propina: doc.propina || 0,
      total: doc.total || 0,
      moneda: doc.moneda || 'EUR',
      metodo_pago: doc.metodo_pago,
      mesa: doc.mesa,
      cupon_id: doc.cupon_id,
      codigo_cupon_aplicado: doc.codigo_cupon_aplicado,
      nota_cliente: doc.nota_cliente,
      nota_cocina: doc.nota_cocina,
      tiempo_estimado_min: doc.tiempo_estimado_min,
      entregado_en: doc.entregado_en,
      creado_en: doc.creado_en,
      actualizado_en: doc.$updatedAt,
      items: doc.items_json ? JSON.parse(doc.items_json) : []
    };
  }

  private mapMenuItem(doc: any): MenuItem {
    return {
      id: doc.$id,
      restaurant_id: doc.restaurant_id,
      category_id: doc.category_id,
      nombre: doc.nombre,
      descripcion: doc.descripcion,
      precio_base: doc.precio_base,
      coste: doc.coste,
      img_url: doc.img_url,
      etiquetas: doc.etiquetas ? JSON.parse(doc.etiquetas) : [],
      impuesto: doc.impuesto,
      disponible: doc.disponible,
      tiempo_preparacion_min: doc.tiempo_preparacion_min,
      sku: doc.sku,
      stock_actual: doc.stock_actual,
      permite_venta_sin_stock: doc.permite_venta_sin_stock,
      created_at: doc.$createdAt
    };
  }

  private mapCategory(doc: any): Category {
    return {
      id: doc.$id,
      restaurant_id: doc.restaurant_id,
      nombre: doc.nombre,
      orden: doc.orden,
      activo: doc.activo
    };
  }

  private mapCustomer(doc: any): Customer {
    return {
      id: doc.$id,
      restaurant_id: doc.restaurant_id,
      nombre: doc.nombre,
      telefono: doc.telefono,
      email: doc.email,
      notas: doc.notas,
      alergias: doc.alergias,
      direccion_principal: doc.direccion_principal,
      direcciones: doc.direcciones_json ? JSON.parse(doc.direcciones_json) : [],
      ltv: doc.ltv || 0,
      ultima_compra: doc.ultima_compra,
      frecuencia_promedio_dias: doc.frecuencia_promedio_dias || 0,
      created_at: doc.$createdAt
    };
  }

  private mapCoupon(doc: any): Coupon {
    return {
      id: doc.$id,
      restaurant_id: doc.restaurant_id,
      codigo: doc.codigo,
      tipo: doc.tipo,
      valor: doc.valor,
      aplica_antes_impuestos: doc.aplica_antes_impuestos,
      minimo_subtotal: doc.minimo_subtotal,
      canales_validos: doc.canales_validos_json ? JSON.parse(doc.canales_validos_json) : [],
      categorias_incluidas: doc.categorias_incluidas_json ? JSON.parse(doc.categorias_incluidas_json) : [],
      categorias_excluidas: doc.categorias_excluidas_json ? JSON.parse(doc.categorias_excluidas_json) : [],
      uso_maximo_global: doc.uso_maximo_global,
      uso_maximo_por_cliente: doc.uso_maximo_por_cliente,
      activo: doc.activo,
      inicia_en: doc.inicia_en,
      expira_en: doc.expira_en
    };
  }
}

export const db = new DatabaseService();
