/**
 * LÓGICA LÁCTEA - CLIENTE API v3.8 (VERSIÓN FUNCIONAL)
 * Usa no-cors y text/plain para evitar bloqueos CORS
 */

const DAIRY_API_URL = "https://script.google.com/macros/s/AKfycbxdHI4S_hIDh0J3TL4xIPCX0WlCud6xnTtymMUoyfHn7KPj2LsbkFfmHNZYwizou8fQnA/exec";

const DairyAPI = {
    // ========== 1. LECTURA DE DATOS (GET) ==========
    obtenerDatos: async (pestaña) => {
        try {
            const url = `${DAIRY_API_URL}?pestaña=${encodeURIComponent(pestaña)}&t=${Date.now()}`;
            console.log(`📡 Obteniendo: ${pestaña}`);
            
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                headers: { 'Accept': 'application/json' }
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error(`❌ Error en ${pestaña}:`, error);
            return [];
        }
    },

    // ========== 2. ENVÍO DE DATOS (POST con no-cors) ==========
    enviarDatos: async (datos) => {
        try {
            console.log(`📤 Enviando a: ${datos.pestaña}`, datos);
            
            // Usar no-cors y text/plain para evitar preflight request
            await fetch(DAIRY_API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(datos)
            });
            
            // Con no-cors asumimos éxito si no hay error de red
            console.log(`✅ Datos enviados`);
            return { success: true };
        } catch (error) {
            console.error(`❌ Error al enviar:`, error);
            throw error;
        }
    },

    // ========== 3. FUNCIONES ESPECÍFICAS ==========
    // Clientes
    crearCliente: async (cliente) => {
        return DairyAPI.enviarDatos({
            pestaña: "Clientes",
            ID: `C-${Date.now().toString().slice(-6)}`,
            Nombre: cliente.Nombre.toUpperCase(),
            CI_RUC: cliente.CI_RUC,
            Teléfono: cliente.Teléfono,
            Dirección: cliente.Dirección,
            Referencia: cliente.Referencia,
            Sector: cliente.Sector,
            "Fecha Registro": new Date().toLocaleDateString()
        });
    },

    actualizarCliente: async (id, datos) => {
        return DairyAPI.enviarDatos({
            pestaña: "Clientes",
            ID: id,
            ...datos
        });
    },

    eliminarCliente: async (id) => {
        return DairyAPI.enviarDatos({
            pestaña: "Clientes",
            ID: id,
            accion: "ELIMINAR"
        });
    },

    // Ventas
    crearVenta: async (venta) => {
        return DairyAPI.enviarDatos({
            pestaña: "Ventas",
            ID_Venta: venta.ID_Venta,
            Cliente: venta.Cliente,
            Producto: venta.Producto,
            Cantidad: venta.Cantidad,
            Precio_PVP: venta.Precio_PVP,
            Fecha_Entrega: venta.Fecha_Entrega,
            Estado_Entrega: venta.Estado_Entrega || "PENDIENTE"
        });
    },

    // Despachos
    marcarEntregado: async (idVenta, fechaEntrega) => {
        return DairyAPI.enviarDatos({
            pestaña: "Ventas",
            accion: "editar_estado",
            ID_Venta: idVenta,
            Estado: "ENTREGADO",
            Fecha_Entrega: fechaEntrega || new Date().toISOString().split('T')[0]
        });
    },

    eliminarItemVenta: async (idVenta, producto, cantidad) => {
        return DairyAPI.enviarDatos({
            pestaña: "Ventas",
            accion: "eliminar_item_y_devolver_stock",
            ID_Venta: idVenta,
            Producto: producto,
            Cantidad: cantidad
        });
    },

    // Productos / Inventario
    crearProducto: async (producto) => {
        return DairyAPI.enviarDatos({
            pestaña: "Inventario",
            Fecha: new Date().toISOString().split('T')[0],
            ID: `P-${Date.now().toString().slice(-6)}`,
            Producto: producto.Producto.toUpperCase(),
            Stock: producto.Stock || 0,
            Precio_Distribuidor: producto.Precio_Distribuidor || 0,
            Precio_Venta: producto.Precio_Venta,
            Ventas: 0,
            Proveedor: producto.Proveedor || "GENERAL"
        });
    },

    actualizarStock: async (idProducto, nuevoStock) => {
        return DairyAPI.enviarDatos({
            pestaña: "Inventario",
            ID: idProducto,
            Stock: nuevoStock
        });
    },

    eliminarProducto: async (id) => {
        return DairyAPI.enviarDatos({
            pestaña: "Inventario",
            ID: id,
            accion: "ELIMINAR"
        });
    },

    // Proveedores
    crearProveedor: async (proveedor) => {
        return DairyAPI.enviarDatos({
            pestaña: "Proveedores",
            "Nombre del Proveedor": proveedor.Nombre.toUpperCase(),
            RUC: proveedor.RUC,
            Provincia: proveedor.Provincia || "",
            Ciudad: proveedor.Ciudad || "",
            Dirección: proveedor.Dirección || "",
            "Contacto / Teléfono": proveedor.Contacto || "",
            Categoría: proveedor.Categoría || "",
            "Fecha Registro": new Date().toLocaleDateString()
        });
    },

    eliminarProveedor: async (ruc) => {
        return DairyAPI.enviarDatos({
            pestaña: "Proveedores",
            ID: ruc,
            accion: "ELIMINAR"
        });
    },

    // Compras
    crearCompra: async (compra) => {
        return DairyAPI.enviarDatos({
            pestaña: "Compras",
            Fecha: compra.Fecha || new Date().toISOString().split('T')[0],
            Proveedor: compra.Proveedor,
            Producto: compra.Producto,
            Cantidad: compra.Cantidad,
            Precio_Distribuidor: compra.Precio_Distribuidor,
            Estado_Entrega: compra.Estado_Entrega || "PENDIENTE",
            Observaciones: compra.Observaciones || ""
        });
    },

    // Dashboard
    obtenerDashboard: async () => {
        try {
            const [clientes, ventas, inventario, proveedores] = await Promise.all([
                DairyAPI.obtenerDatos("Clientes"),
                DairyAPI.obtenerDatos("Ventas"),
                DairyAPI.obtenerDatos("Inventario"),
                DairyAPI.obtenerDatos("Proveedores")
            ]);
            
            const totalVentas = Array.isArray(ventas) ? ventas.reduce((sum, v) => sum + (Number(v.Total) || 0), 0) : 0;
            const stockTotal = Array.isArray(inventario) ? inventario.reduce((sum, p) => sum + (Number(p.Stock) || 0), 0) : 0;
            const valorBodega = Array.isArray(inventario) ? inventario.reduce((sum, p) => sum + ((Number(p.Stock) || 0) * (Number(p.Precio_Venta) || 0)), 0) : 0;
            const productosCriticos = Array.isArray(inventario) ? inventario.filter(p => (Number(p.Stock) || 0) <= 5).length : 0;
            
            return {
                totalClientes: Array.isArray(clientes) ? clientes.length : 0,
                totalVentas: Array.isArray(ventas) ? ventas.length : 0,
                montoVentas: totalVentas,
                stockTotal: stockTotal,
                valorBodega: valorBodega,
                productosCriticos: productosCriticos,
                totalProveedores: Array.isArray(proveedores) ? proveedores.length : 0
            };
        } catch (error) {
            console.error("Error en dashboard:", error);
            return {
                totalClientes: 0,
                totalVentas: 0,
                montoVentas: 0,
                stockTotal: 0,
                valorBodega: 0,
                productosCriticos: 0,
                totalProveedores: 0
            };
        }
    }
};

window.DairyAPI = DairyAPI;
console.log("✅ API v3.8 cargada - Modo no-cors");
