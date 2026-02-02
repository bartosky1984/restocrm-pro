# 🗺️ Roadmap - Mesa Feliz CRM (RestoCRM Pro)

Este documento detalla el progreso actual del proyecto y los pasos necesarios para alcanzar el MVP y versiones futuras.

## 🎯 Objetivo
Desarrollar un CRM integral para restaurantes que gestione el flujo completo de pedidos, menú, cocina (KDS) y fidelización de clientes.

## 🏗️ Estado de la Tecnología
- **Frontend**: React 19 + Vite + Tailwind CSS v4 (Completado)
- **Base de Datos/Backend**: Appwrite (Configuración finalizada, migración completa)
- **Lógica de Datos**: `DatabaseService` conectado a Appwrite Cloud (Activo)

---

## ✅ Checklist de Progreso

### 1. 🏗️ Fundamentos (Completado)
- [x] Estructura del proyecto con Vite y TypeScript.
- [x] Instalación y configuración de Tailwind CSS v4.
- [x] Sistema de rutas con `react-router-dom`.
- [x] Definición de tipos globales en `types.ts`.
- [x] Estructura base de `AuthContext` con soporte para Supabase.

### 2. 🎨 Interfaz de Usuario (MVP Frontend)
- [x] **Layout**: Sidebar, DashboardLayout y navegación principal.
- [x] **Dashboard**: Vista con KPIs, gráficas de Recharts e IA Insights (simulados).
- [x] **Pedidos**: Panel de gestión (Kanban) y creación de pedidos.
- [x] **Cocina (KDS)**: Vista en tiempo real para preparación de comandas.
- [x] **Menú**: Gestión de categorías, platos y disponibilidad.
- [x] **Clientes**: CRM básico con historial y estadísticas.
- [x] **Cupones**: Generación y gestión de promociones.
- [x] **Configuración**: Ajustes básicos del establecimiento.

### 3. 🔌 Conectividad & Backend (Completado)
- [x] **Configuración Appwrite**: Base de datos `mesafelizcrm` creada y configurada.
- [x] **Colecciones & Permisos**: Tablas de restaurantes, pedidos, clientes y menú con permisos `read("any")`.
- [x] **Migración de Datos**: `src/services/db.ts` refactorizado para usar el SDK de Appwrite.
- [x] **Carga Masiva de Datos**: 33 pedidos históricos, 10 clientes y 50+ ítems de menú inyectados.
- [x] **Dashboard Real-Time**: Integración de analíticas basadas en datos reales de Appwrite.

### 4. 🚀 Funcionalidades Post-MVP
- [ ] **Panel de Repartidores**: Optimización móvil para delivery.
- [ ] **Integración WhatsApp**: IA ChatBot (Erika) para toma de pedidos automática.
- [ ] **Reportes Avanzados**: Exportación en PDF/Excel y comparativas mensuales.
- [ ] **Impresión de Tickets**: Conexión con impresoras térmicas ESC/POS.

---

## 📅 Próximos Pasos Inmediatos
1. **Panel de Reparto**: Implementar la lógica de asignación de motoristas y tracking básico.
2. **Reportes Avanzados**: Crear la sección de reportes con filtros por fecha y exportado.
3. **Optimización de IA**: Conectar los insights del Dashboard con un modelo de IA real para análisis predictivo.
