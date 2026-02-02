<div align="center">
  <img width="1200" height="auto" alt="Dashboard Preview" src="https://via.placeholder.com/1200x600?text=RestoCRM+Mesa+Feliz" />
</div>

# Mesa Feliz CRM

Aplicación CRM integral para la gestión de restaurantes, diseñada para optimizar el flujo de pedidos en sala, para llevar y delivery. Incluye gestión de menús, KDS (Kitchen Display System), clientes y reportes.

## 🚀 Objetivo

Proveer una solución "todo en uno" para restaurantes que permita:
- Administrar pedidos multicanal (Sala, Takeaway, Delivery).
- Controlar el menú, stock y precios en tiempo real.
- Gestionar clientes y fidelización (CRM).
- Visualizar métricas clave (KPIs) para la toma de decisiones.
- Optimizar la comunicación con cocina mediante KDS.

## ✨ Funcionalidades (MVP)

1.  **Dashboard**: KPIs en tiempo real, gráficas de ventas, top productos.
2.  **Gestión de Pedidos**: Flujo completo desde creación hasta entrega.
3.  **KDS (Cocina)**: Tablero Kanban para gestión de comandas.
4.  **Menú Digital**: Administración de categorías, ítems, fotos, stock y disponibilidad.
5.  **Clientes**: Base de datos de clientes y análisis de LTV.
6.  **Cupones**: Sistema de promociones y descuentos avanzados.
7.  **Delivery**: Gestión de zonas de reparto y asignación de repartidores.
8.  **Multi-rol**: Accesos diferenciados para Admin, Gerente, Cajero, Cocina y Reparto.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), TypeScript, Tailwind CSS.
-   **Backend/Database**: Supabase (PostgreSQL).
-   **Auth**: Supabase Auth (Email & Google).
-   **State/Data**: React Query + Supabase Client.

## 🏃‍♂️ Ejecutar Localmente

**Prerrequisitos:** Node.js v15+

1.  Clonar el repositorio.
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Configurar variables de entorno:
    Renombrar `.env.example` a `.env.local` y añadir tus credenciales de Supabase:
    ```
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```
4.  Iniciar el servidor de desarrollo:
    ```bash
    npm run dev
    ```

## 📦 Estructura de Datos

El proyecto sigue un esquema relacional estricto (ver `implementation_plan.md` para detalles del esquema) soportado por Supabase.

---

> Hecho con ❤️ para hostelería.
